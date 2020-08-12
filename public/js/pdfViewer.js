const TRACKING_ID = "UA-171409849-3";
const CLIENT_ID = "c096c58dac3b430293d3871d7b1c72c0";

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
ga("send", "page view");
//==========================================================
let userName, userEmail, userRole, profile, courseName;
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

// custom flags for UI configurations
const customFlags = {
  downloadWithAnnotations: true /* Default value is false */,
  printWithAnnotations: true /* Default value is false */,
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
          fileName: `${courseName}_${courseTopic}`,
          /* file ID */
          id: fileId,
        },
      },
      viewerConfig
    );

    //user profile name UI config
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
        //set UI configurations
        annotationManager
          .setConfig(customFlags)
          .then(function () {})
          .catch(function (error) {});

        //array to store annotations
        var oldAnnos = [];
        //updating annotations
        setInterval(async () => {
          await fetch("/course/annotations/find", {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ fileId: fileId }),
          }).then((res) => {
            console.log(res.body);
            let updatedAnnos = [];
            res.forEach((r) => {
              updatedAnnos.push(r.data);
            });

            if (JSON.stringify(updatedAnnos) !== JSON.stringify(oldAnnos)) {
              let result = updatedAnnos.filter((ol) => {
                return !oldAnnos.some((o2) => {
                  return ol.id === o2.id;
                });
              });
              annotationManager
                .addAnnotations(result)
                .then(function () {})
                .catch(function (error) {});
              oldAnnos = oldAnnos.concat(result);
            }
          });
        }, 2000);

        /* API to register events listener */
        annotationManager.registerEventListener(
          function (event) {
            switch (event.type) {
              case "ANNOTATION_ADDED":
                (async () => {
                  await fetch("/course/annotations/add", {
                    method: "POST",
                    headers: {
                      Accept: "application/json",
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ data: event.data, fileId: fileId }),
                  });
                })();
                if (
                  event.data.bodyValue == "completed" ||
                  event.data.bodyValue == "Completed" ||
                  event.data.bodyValue == "Course completed." ||
                  event.data.bodyValue == "complete" ||
                  event.data.bodyValue == "Complete"
                ) {
                  ga("send", "event", "COURSE_COMPLETED", courseName, userName);
                }
                break;
              case "ANNOTATION_UPDATED":
                (async () => {
                  await fetch("/course/annotations/update", {
                    method: "POST",
                    headers: {
                      Accept: "application/json",
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ data: event.data, fileId: fileId }),
                  });
                })();
                break;
              case "ANNOTATION_DELETED":
                (async () => {
                  await fetch("/course/annotations/delete", {
                    method: "POST",
                    headers: {
                      Accept: "application/json",
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ data: event.data, fileId: fileId }),
                  });
                })();
                break;
            }
          },
          {
            /* Pass the list of events in listenOn. */
            /* If no event is passed in listenOn, then all the annotation events will be received. */
            listenOn: [],
          }
        );
      });
    });

    //pdf analytics code
    adobeDCView.registerCallback(
      AdobeDC.View.Enum.CallbackType.EVENT_LISTENER,
      function (event) {
        if (userRole == "student") {
          switch (event.type) {
            case "DOCUMENT_OPEN":
              ga("send", "event", "DOCUMENT_OPEN", courseName, userName);
              break;
            case "PAGE_VIEW":
              ga(
                "send",
                "event",
                "PAGE_VIEW",
                `Page ${event.data.pageNumber} of ${event.data.fileName}`,
                userName
              );
              break;
            case "DOCUMENT_DOWNLOAD":
              ga("send", "event", "DOCUMENT_DOWNLOAD", courseName, userName);
              break;
            case "DOCUMENT_PRINT":
              ga("send", "event", "DOCUMENT_PRINT", courseName, userName);
              break;
            case "TEXT_COPY":
              ga(
                "send",
                "event",
                "TEXT_COPY",
                `COPIED : ${event.data.copiedText} FROM ${event.data.fileName}`,
                userName
              );
              break;
            default:
          }
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
    document.querySelector(".course-name").innerText,
    "shared on facebook"
  );
});
$(".social-share.twitter").on("click", function () {
  ga(
    "send",
    "event",
    "COURSE_SHARED",
    document.querySelector(".course-name").innerText,
    "shared on twitter"
  );
});
$(".social-share.email").on("click", function () {
  ga(
    "send",
    "event",
    "COURSE_SHARED",
    document.querySelector(".course-name").innerText,
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
  courseName = document.querySelector(".course-name").innerText;
  userName = document.querySelector(".userName").innerText;
  userEmail = document.querySelector(".userEmail").innerText;
  userRole = document.querySelector(".userRole").innerText;
  if (userRole == "teacher") {
    userName = "(TEACHER) " + userName;
  }
  profile = {
    userProfile: {
      name: userName,
      email: userEmail,
    },
  };
});
