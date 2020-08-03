$("#inputPdf").change(function () {
  var value = +$(this).val();
  value *= 1;
  var nr = 0;
  var elem = $("#pdfElement").empty();
  while (nr < value) {
    elem.append($("<input>", { name: "whateverNameYouWant" }));
    nr++;
  }
});
