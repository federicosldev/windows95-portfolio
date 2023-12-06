// VENTANAS DRAGGABLES
function makeDraggable(windowElement, headerElement) {
  var pos1 = 0,
    pos2 = 0,
    pos3 = 0,
    pos4 = 0;

  headerElement.onmousedown = function (e) {
    e.preventDefault();
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

  const colorPicker = document.getElementById('colorPicker');
  colorPicker.addEventListener('input', changeColor);

  const clearButton = document.getElementById('clearButton');
  clearButton.addEventListener('click', clearCanvas);

  const downloadButton = document.getElementById('downloadButton');
  downloadButton.addEventListener('click', downloadCanvas);
});
