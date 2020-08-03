$(document).ready(function () {
  $("#inputPdf").change(function () {
    var value = +$(this).val();
    value *= 1;
    var nr = 0;
    var elem = $("#pdfElement").empty();
    while (nr < value) {
      var fileName = "pdfFile" + (nr + 1).toString();
      var topicName = "topic" + (nr + 1).toString();
      elem.append(
        $("<input type='file' class='fileButton'>", { name: fileName })
      );
      elem.append(
        $(
          "<input type='text' placeholder='Enter name of topic' class='topicBox form-control'>",
          {
            name: topicName,
          }
        )
      );
      nr++;
    }
  });
});
