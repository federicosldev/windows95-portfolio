// VENTANAS DRAGGABLES
function makeDraggable(windowElement, headerElement) {
  var pos1 = 0,
    pos2 = 0,
    pos3 = 0,
    pos4 = 0;

  headerElement.onmousedown = function (e) {
    e.preventDefault();

    // Obtener el valor máximo actual de Z-index
    var maxZIndex = Math.max(
      ...Array.from(document.querySelectorAll('.ventana')).map(
        ventana => parseFloat(window.getComputedStyle(ventana).zIndex) || 0
      )
    );

    // Establecer el Z-index de la ventana seleccionada por encima de las demás
    windowElement.style.zIndex = maxZIndex + 1;

    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = function () {
      document.onmouseup = null;
      document.onmousemove = null;
    };
    document.onmousemove = function (e) {
      e.preventDefault();
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;

      // Calcular las nuevas posiciones
      var newTop = windowElement.offsetTop - pos2;
      var newLeft = windowElement.offsetLeft - pos1;

      // Verificar que la ventana no se salga de la pantalla
      var maxX = window.innerWidth - windowElement.offsetWidth;
      var maxY = window.innerHeight - windowElement.offsetHeight;

      newTop = Math.max(0, Math.min(newTop, maxY));
      newLeft = Math.max(0, Math.min(newLeft, maxX));

      // Aplicar las nuevas posiciones
      windowElement.style.top = newTop + 'px';
      windowElement.style.left = newLeft + 'px';
    };
  };
}

const ventanas = document.querySelectorAll('.ventana');
ventanas.forEach(ventana => {
  const headerElement = ventana.querySelector('.js-winheader');
  makeDraggable(ventana, headerElement);
});

//PAINT
const colorPicker = document.getElementById('colorPicker');
const clearButton = document.getElementById('clearButton');
const downloadButton = document.getElementById('downloadButton');

document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('paintCanvas');
  const ctx = canvas.getContext('2d');
  let painting = false;
  let color = '#000000';

  function startPosition(e) {
    painting = true;
    draw(e);
  }

  function endPosition() {
    painting = false;
    ctx.beginPath();
  }

  function draw(e) {
    if (!painting) return;

    const rect = canvas.getBoundingClientRect();

    const mouseX = e.clientX - rect.left - window.scrollX;
    const mouseY = e.clientY - rect.top - window.scrollY;

    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.strokeStyle = color;

    ctx.lineTo(mouseX, mouseY);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(mouseX, mouseY);
  }

  function changeColor(e) {
    color = e.target.value;
  }

  function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  function downloadCanvas() {
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = 'drawing.png';
    link.click();
  }

  canvas.addEventListener('mousedown', startPosition);
  canvas.addEventListener('mouseup', endPosition);
  canvas.addEventListener('mousemove', draw);
  colorPicker.addEventListener('input', changeColor);
  clearButton.addEventListener('click', clearCanvas);
  downloadButton.addEventListener('click', downloadCanvas);
});

// SETTIINGS
const colorsElements = document.querySelectorAll('.color');
const windowsHeader = document.getElementById('windowHeaderDragable');

const changeBgColor = event => {
  const color = window
    .getComputedStyle(event.target)
    .getPropertyValue('background-color');
  document.body.style.backgroundColor = color;
};

// const changeBgAccColor = event => {
//   const color = window
//     .getComputedStyle(event.target)
//     .getPropertyValue('background-color');
//   windowsHeader.style.backgroundColor = color;
// };

colorsElements.forEach(picker => {
  picker.addEventListener('click', changeBgColor);
});

// colorsAccentElements.forEach(picker => {
//   picker.addEventListener('click', changeBgAccColor);
// });

// HEADER CLOSE BUTTON
const btnCloseWindowElements = document.querySelectorAll('.closeBtn');

closeWindow = event => {
  const ventanaElement = event.target.closest('.ventana');
  if (ventanaElement) {
    ventanaElement.classList.add('offWindow');
  }
};
btnCloseWindowElements.forEach(btnCloseWindowElement => {
  btnCloseWindowElement.addEventListener('click', closeWindow);
});

//SHOW WINDOWS
const btnShowPaint = document.getElementById('displayPaint');
const paintWindow = document.getElementById('ventana2');
const btnShowSettings = document.getElementById('displaySettings');
const settingsWindow = document.getElementById('ventana3');
const btnShowDocuments = document.getElementById('displayDocuments');
const documentsWindow = document.getElementById('ventana4');
const btnShowTasks = document.getElementById('displayTask');
const tasksWindow = document.getElementById('ventana5');

toggleWindow = windowElement => {
  if (windowElement.classList.contains('offWindow')) {
    windowElement.classList.replace('offWindow', 'onWindow');
  } else {
    windowElement.classList.add('onWindow');
  }
};

btnShowPaint.addEventListener('click', () => toggleWindow(paintWindow));
btnShowSettings.addEventListener('click', () => toggleWindow(settingsWindow));
btnShowDocuments.addEventListener('click', () => toggleWindow(documentsWindow));
btnShowTasks.addEventListener('click', () => toggleWindow(tasksWindow));

// TASK WINDOW
const taksContainerElement = document.getElementById('taksContainer');
const inputCreateElement = document.getElementById('createTask');
const formTaskElement = document.getElementById('task-form');
const inputCheckTaskElement = document.getElementById('checkTask');
const buttonFilterCompleteElement = document.getElementById('completeTask');
const buttonFilterActiveTaskElement = document.getElementById('activeTask');
const buttonFilterAllTaskElement = document.getElementById('showAllTask');
const buttonDeleteTaskElement = document.getElementById('deleteTask');
const remainTasksElement = document.getElementById('remainTasks');

let tasks = [];

addTask = () => {
  const newTask = inputCreateElement.value;
  if (newTask !== '') {
    const objNewTask = {
      id: Date.now(),
      task: newTask,
      completed: false,
    };
    tasks.push(objNewTask);
    createNewTask(objNewTask);
  }
  updateRemainTask();
};
createNewTask = task => {
  const newItemTask = document.createElement('li');
  const newInputCheck = document.createElement('input');
  const newTextTask = document.createElement('span');
  newItemTask.id = task.id;
  newInputCheck.type = 'checkbox';
  newInputCheck.id = task.id;
  newTextTask.textContent = task.task;

  if (task.completed) {
    newInputCheck.checked = true;
    newTextTask.classList.add('taskChecked');
  }

  newItemTask.append(newInputCheck);
  newItemTask.append(newTextTask);

  taksContainerElement.append(newItemTask);

  newInputCheck.addEventListener('change', () => {
    checkTask(task, newTextTask, newInputCheck);
  });
};
checkTask = (task, spanElement, checkbox) => {
  if (checkbox.checked) {
    task.completed = true;
    spanElement.classList.add('taskChecked');
  } else {
    task.completed = false;
    spanElement.classList.remove('taskChecked');
  }
  updateRemainTask();
};
filterCompletTask = () => {
  const completedTasks = tasks.filter(task => task.completed);
  clearTaskList();
  completedTasks.forEach(task => createNewTask(task));
};
filterIncompleteTask = () => {
  const incompleteTasks = tasks.filter(task => !task.completed);
  clearTaskList();
  incompleteTasks.forEach(task => createNewTask(task));
};
showAllTasks = () => {
  clearTaskList();
  tasks.forEach(task => createNewTask(task));
  updateRemainTask();
};
clearTaskList = () => {
  taksContainerElement.innerHTML = '';
};
deleteCompleteTask = () => {
  const completedTasks = tasks.filter(task => task.completed);

  completedTasks.forEach(completedTask => {
    const taskElement = document.getElementById(completedTask.id);
    taskElement.remove();
  });

  tasks = tasks.filter(task => !task.completed);
  updateRemainTask();
};
updateRemainTask = () => {
  const incompleteTasksCount = tasks.filter(task => !task.completed).length;
  remainTasksElement.textContent = `${incompleteTasksCount} tasks left`;
};

formTaskElement.addEventListener('keyup', event => {
  if (event.key === 'Enter') {
    addTask();
    inputCreateElement.value = '';
  }
});
formTaskElement.addEventListener('submit', function (event) {
  event.preventDefault();
});
buttonFilterCompleteElement.addEventListener('click', filterCompletTask);
buttonFilterActiveTaskElement.addEventListener('click', filterIncompleteTask);
buttonFilterAllTaskElement.addEventListener('click', showAllTasks);
buttonDeleteTaskElement.addEventListener('click', deleteCompleteTask);
