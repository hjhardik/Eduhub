const TRACKING_ID = "UA-171409849-1";
const CLIENT_ID = "5236c1439e15412a9ce423f4a606d16a";

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
const viewerConfig = {
  defaultViewMode: "FIT_PAGE", //default mode fit_page
  embedMode: "FULL_WINDOW",
  enableFormFilling: true,
  showPageControls: true, //controls
  showAnnotationTools: true, //annotation tools
  showDownloadPDF: true, //download option
  showPrintPDF: true, //print option
  showLeftHandPanel: false, //remove other options
  dockPageControls: true, //dock
  /* Enable commenting APIs */
  enableAnnotationAPIs: true /* Default value is false */,
  /* Include existing PDF annotations and save new annotations to PDF buffer */
  includePDFAnnotations: true /* Default value is false */,
};

/// main view function
function viewPdf(id, courseTopic, pdfFileLocation, fileId) {
  document.addEventListener("adobe_dc_view_sdk.ready", function () {
    var adobeDCView = new AdobeDC.View({
      /* Pass your registered client id */
      clientId: CLIENT_ID,
      /* Pass the div id in which PDF should be rendered */
      divId: `adobe-dc-view${id}`,
    });
    var previewFilePromise = adobeDCView.previewFile(
      {
        /* Pass information on how to access the file */
        content: {
          //Location of PDF
          location: {
            url: `./../uploads/${pdfFileLocation}`,
          },
        },
        /* Pass meta data of file */
        metaData: {
          /* file name */
          fileName: `${courseTopic}`,
          /* file ID */
          id: fileId,
        },
      },
      viewerConfig
    );

    //user profile name change UI config
    adobeDCView.registerCallback(
      AdobeDC.View.Enum.CallbackType.GET_USER_PROFILE_API,
      function () {
        return new Promise((resolve, reject) => {
          resolve({
            code: AdobeDC.View.Enum.ApiResponseCode.SUCCESS,
            data: profile,
          });
        });
      }
    );

    //annotations apis manager
    previewFilePromise.then(function (adobeViewer) {
      adobeViewer.getAnnotationManager().then(function (annotationManager) {
        /* API to add annotations */
        annotationManager
          .addAnnotations(annotations)
          .then(function () {
            console.log("Annotations added through API successfully");
          })
          .catch(function (error) {
            console.log(error);
          });
        /* API to register events listener */
        annotationManager.registerEventListener(
          function (event) {
            if ((event.type = "ANNOTATION_ADDED")) {
              console.log(event);
            }
          },
          {
            /* Pass the list of events in listenOn. */
            /* If no event is passed in listenOn, then all the annotation events will be received. */
            listenOn: [
              /* "ANNOTATION_ADDED", "ANNOTATION_CLICKED" */
            ],
          }
        );
      });
    });

    //pdf analytics code
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
          case "DOCUMENT_PRINT":
            ga(
              "send",
              "event",
              "DOCUMENT_PRINT",
              event.data.fileName,
              "print document"
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

$(".social-share.facebook").on("click", function () {
  ga(
    "send",
    "event",
    "COURSE_SHARED",
    document.querySelector(".coursename").innerText,
    "shared on facebook"
  );
});
$(".social-share.twitter").on("click", function () {
  ga(
    "send",
    "event",
    "COURSE_SHARED",
    document.querySelector(".coursename").innerText,
    "shared on twitter"
  );
});
$(".social-share.email").on("click", function () {
  ga(
    "send",
    "event",
    "COURSE_SHARED",
    document.querySelector(".coursename").innerText,
    "shared on email"
  );
});
$(document).ready(() => {
  for (let i = 1; i <= 5; i++) {
    if (document.getElementById(`adobe-dc-view${i}`) != null) {
      let ele = document.getElementById(`adobe-dc-view${i}`);
      let pdfFile = ele.classList[0];
      let fileId = ele.getAttribute("fileId");
      let topic = ele.parentElement.parentElement.id;
      viewPdf(i, topic, pdfFile, fileId);
    } else {
      break;
    }
  }
  let userName = document.querySelector(".userName").innerText;
  let userEmail = document.querySelector(".userEmail").innerText;
  let userRole = document.querySelector(".userRole").innerText;
  if (userRole == "teacher") {
    userName = "(TEACHER) " + userName;
  }
  const profile = {
    userProfile: {
      name: userName,
      email: userEmail,
    },
  };
});
function sendData(e) {
  console.log(e);
}
