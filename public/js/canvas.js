//window.onload = function () {
$(document).ready(function () {
  var myCanvas = document.getElementById("myCanvas");
  var ctx = myCanvas.getContext("2d");

  myCanvas.style.width = "100%";
  myCanvas.style.height = "200%";

  // Fill Window Width and Height
  myCanvas.width = myCanvas.offsetWidth;
  myCanvas.height = myCanvas.offsetHeight;

  //clear canvas
  function clearCanvas() {
    ctx.clearRect(0, 0, myCanvas.width, myCanvas.height);
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, myCanvas.width, myCanvas.height);
  }

  document.getElementById("clear").addEventListener("click", (event) => {
    event.preventDefault();
    clearCanvas();
  });
  // Set Background Color
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, myCanvas.width, myCanvas.height);

  // Mouse Event Handlers
  if (myCanvas) {
    var isDown = false;
    var canvasX, canvasY;
    ctx.lineWidth = 5;

    $(myCanvas)
      .mousedown(function (e) {
        isDown = true;
        ctx.beginPath();
        canvasX = e.pageX - myCanvas.offsetLeft;
        canvasY = e.pageY - myCanvas.offsetTop;
        ctx.moveTo(canvasX, canvasY);
      })
      .mousemove(function (e) {
        if (isDown !== false) {
          canvasX = e.pageX - myCanvas.offsetLeft;
          canvasY = e.pageY - myCanvas.offsetTop;
          ctx.lineTo(canvasX, canvasY);
          ctx.strokeStyle = "#000";
          ctx.stroke();
        }
      })
      .mouseup(function (e) {
        isDown = false;
        ctx.closePath();
      });
  }

  // Touch Events Handlers
  draw = {
    started: false,
    start: function (evt) {
      ctx.beginPath();
      ctx.moveTo(evt.touches[0].pageX, evt.touches[0].pageY);

      this.started = true;
    },
    move: function (evt) {
      if (this.started) {
        ctx.lineTo(evt.touches[0].pageX, evt.touches[0].pageY);

        ctx.strokeStyle = "#000";
        ctx.lineWidth = 5;
        ctx.stroke();
      }
    },
    end: function (evt) {
      this.started = false;
    },
  };

  // Touch Events
  myCanvas.addEventListener("touchstart", draw.start, false);
  myCanvas.addEventListener("touchend", draw.end, false);
  myCanvas.addEventListener("touchmove", draw.move, false);

  document.getElementById("download").addEventListener("click", () => {
    downloadCanvas();
  });
  function downloadCanvas() {
    var img = myCanvas.toDataURL("image/png");
    document.getElementById("canvasImage").value = img;
    document.getElementById("submit").click();
  }
  // Disable Page Move
  document.body.addEventListener(
    "touchmove",
    function (evt) {
      evt.preventDefault();
    },
    false
  );
});
$("#myForm").submit(function (e) {
  e.preventDefault();
  $.ajax({
    url: "/course",
    type: "post",
    data: $("#myForm").serialize(),
    success: function () {
      console.log("sub");
    },
  });
});
