//create course functionality for teachers
//displays specific number of file &text input boxes based on number of topics selected
$(document).ready(function () {
  $("#inputPdf").change(function () {
    var value = +$(this).val();
    value *= 1;
    var nr = 0;
    var elem = $("#pdfElement").empty();
    while (nr < value) {
      var fileName = "pdfFile" + (nr + 1).toString();
      var topicName = "topic" + (nr + 1).toString();
      //append file input
      elem.append(
        $(
          "<input type='file' class='fileButton' accept='application/pdf'>"
        ).attr("name", fileName)
      );
      //append topic text input
      elem.append(
        $(
          "<input type='text' placeholder='Enter name of topic' class='topicBox form-control'>"
        ).attr("name", topicName)
      );
      nr++;
    }
  });
});
