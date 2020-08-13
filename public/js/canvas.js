//CANVAS DRAWING FUNCTIONALITY
$(document).ready(function () {
  var myCanvas = document.getElementById("myCanvas");
  var ctx = myCanvas.getContext("2d");

  // set canvas width and height
  myCanvas.width = myCanvas.offsetWidth;
  myCanvas.height = myCanvas.offsetHeight;

  //clear canvas
  function clearCanvas() {
    ctx.clearRect(0, 0, myCanvas.width, myCanvas.height);
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, myCanvas.width, myCanvas.height);
  }
  //calling clear when clear is clicked
  document.getElementById("clear").addEventListener("click", (event) => {
    event.preventDefault();
    clearCanvas();
  });

  // Set Background Color
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, myCanvas.width, myCanvas.height);

  // Mouse Event Handlers for PC
  if (myCanvas) {
    var isDown = false;
    var canvasX, canvasY;
    ctx.lineWidth = 3;

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

  // Touch Events Handlers for MOBILE VIEWS
  draw = {
    started: false,
    start: function (evt) {
      ctx.beginPath();
      ctx.moveTo(
        evt.touches[0].pageX - myCanvas.offsetLeft,
        evt.touches[0].pageY - myCanvas.offsetTop
      );
      this.started = true;
    },
    move: function (evt) {
      if (this.started) {
        ctx.lineTo(
          evt.touches[0].pageX - myCanvas.offsetLeft,
          evt.touches[0].pageY - myCanvas.offsetTop
        );

        ctx.strokeStyle = "#000";
        ctx.lineWidth = 3;
        ctx.stroke();
      }
    },
    end: function (evt) {
      this.started = false;
    },
  };

  // Touch Events HANDLER
  myCanvas.addEventListener("touchstart", draw.start, false);
  myCanvas.addEventListener("touchend", draw.end, false);
  myCanvas.addEventListener("touchmove", draw.move, false);

  // Disable Page Move
  document.body.addEventListener(
    "touchmove",
    function (evt) {
      //DEFAULT CAN'T BE PREVENTED DUE TO NEW CHROME FEATURES
      //evt.preventDefault();
    },
    false
  );
  //DOWNLOAD BOARD CALL
  document.getElementById("download").addEventListener("click", () => {
    downloadCanvas();
  });
  //CONVERT CANVAS TO PNG IMAGE THEN SEND THE base64 encoded string to server
  function downloadCanvas() {
    var img = myCanvas.toDataURL("image/png"); //converted to base 64
    document.getElementById("canvasImage").value = img;
    document.getElementById("submit").click();
  }
});
//ajax call to server sending encoded image data
$("#myForm").submit(function (e) {
  e.preventDefault();
  $.ajax({
    url: "/course",
    type: "post",
    data: $("#myForm").serialize(),
    success: function () {},
  });
});
