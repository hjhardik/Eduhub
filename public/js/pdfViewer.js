//DETAILS
const TRACKING_ID = require("./../../config/keys").TRACKING_ID; // GOOGLE ANALYTICS TRACKING ID
const CLIENT_ID = require("./../../config/keys").API_CLIENT_ID; //ADOBE EMBED API CLIENT ID

// GOOGLE ANALYTICS
(function (i, s, o, g, r, a, m) {
  i["GoogleAnalyticsObject"] = r;
  (i[r] =
    i[r] ||
    function () {
      (i[r].q = i[r].q || []).push(arguments);
    }),
    (i[r].l = 1 * new Date());
  (a = s.createElement(o)), (m = s.getElementsByTagName(o)[0]);
  a.async = 1;
  a.src = g;
  m.parentNode.insertBefore(a, m);
})(
  window,
  document,
  "script",
  "https://www.google-analytics.com/analytics.js",
  "ga"
);

ga("create", TRACKING_ID, "auto");
ga("send", "pageview");
//==========================================================

/// main view function
function viewPdf(viewerConfig, name_pdf) {
  document.addEventListener("adobe_dc_view_sdk.ready", function () {
    var adobeDCView = new AdobeDC.View({
      /* Pass your registered client id */
      clientId: CLIENT_ID,
      /* Pass the div id in which PDF should be rendered */
      divId: "adobe-dc-view",
    });
    adobeDCView.previewFile(
      {
        /* Pass information on how to access the file */
        content: {
          //enter the Location of PDF which needs to be displayed
          location: {
            url: "./pdfFiles/website.pdf",
          },
        },
        /* Pass meta data of file */
        metaData: {
          /* file name */
          fileName: name_pdf + ".pdf",
        },
      },
      viewerConfig
    );

    adobeDCView.registerCallback(
      AdobeDC.View.Enum.CallbackType.EVENT_LISTENER,
      function (event) {
        switch (event.type) {
          case "DOCUMENT_OPEN":
            ga(
              "send",
              "event",
              "DOCUMENT_OPEN",
              event.data.fileName,
              "open document"
            );
            break;
          case "PAGE_VIEW":
            ga(
              "send",
              "event",
              "PAGE_VIEW",
              `Page ${event.data.pageNumber} of ${event.data.fileName}`,
              "view page"
            );
            break;
          case "DOCUMENT_DOWNLOAD":
            ga(
              "send",
              "event",
              "DOCUMENT_DOWNLOAD",
              event.data.fileName,
              "download document"
            );
            break;
          case "TEXT_COPY":
            ga(
              "send",
              "event",
              "TEXT_COPY",
              `COPIED - ${event.data.copiedText} -FROM ${event.data.fileName}`,
              "copy text"
            );
            break;
          default:
        }
      },
      {
        enablePDFAnalytics: true, //turn on pdf analytics
      }
    );
  });
}
