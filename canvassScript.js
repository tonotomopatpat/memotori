window.onload = function () {
  var canvas = document.getElementById("drawingCanvas");
  var ctx = canvas.getContext("2d");
  var textarea = document.getElementById("textarea");
  var toggleDrawingModeButton = document.getElementById("toggleDrawingMode");

  var drawing = false;
  var drawingMode = false;
  var lastPos = { x: 0, y: 0 };

  var eraser = document.getElementById('eraser');
  var erasing = false;

  var dpr = window.devicePixelRatio || 1;


  var rect = canvas.getBoundingClientRect();

  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;

  ctx.scale(dpr, dpr);

  eraser.addEventListener('click', function() {
    erasing = !erasing; // toggle erasing mode
    if (erasing) {
      ctx.strokeStyle = '#FFFFFF'; // assuming the background is white
      ctx.lineWidth = 10; // adjust the size of the eraser as needed
    } else {
      ctx.strokeStyle = '#000000'; // change this to your default color
      ctx.lineWidth = 1; // change this to your default line width
    }
  });

  toggleDrawingModeButton.onclick = function () {
    drawingMode = !drawingMode;
    textarea.style.pointerEvents = drawingMode ? "none" : "auto";
  };

  

  canvas.onmousedown = function (e) {
    if (drawingMode) {
      drawing = true;
      lastPos = getMousePos(canvas, e);
    }
  };

  canvas.onmouseup = function () {
    drawing = false;
  };

  canvas.onmousemove = function (e) {
    if (drawingMode && drawing) {
      var currentPos = getMousePos(canvas, e);
      drawLine(ctx, lastPos, currentPos);
      lastPos = currentPos;
    }
  };

  function resizeCanvasToDisplaySize(canvas) {
    const displayWidth = canvas.clientWidth;
    const displayHeight = canvas.clientHeight;
    const needResize =
      canvas.width !== displayWidth || canvas.height !== displayHeight;
    if (needResize) {
      canvas.width = displayWidth;
      canvas.height = displayHeight;
    }
    return needResize;
  }

  canvas.onmouseup = function () {
    drawing = false;
  };

  canvas.onmousemove = function (e) {
    if (drawingMode && drawing) {
      if (resizeCanvasToDisplaySize(canvas)) {
        ctx = canvas.getContext("2d"); // re-assign the context after resizing
      }
      var currentPos = getMousePos(canvas, e);
      drawLine(ctx, lastPos, currentPos);
      lastPos = currentPos;
    }
  };

  function getMousePos(canvas, e) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) / (rect.right - rect.left)) * canvas.width,
      y: ((e.clientY - rect.top) / (rect.bottom - rect.top)) * canvas.height,
    };
  }

  function drawLine(ctx, from, to) {
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();
  }
};
