//update your own tracking id and adobe embed api client id
const TRACKING_ID = "UA-171409849-3";
const CLIENT_ID = "c096c58dac3b430293d3871d7b1c72c0";

// GOOGLE ANALYTICS ga function
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
//==========================================================end of ga function
//initialize user vars
let userName, userEmail, userRole, profile, courseName;
//viewerConfig for PDf viewer
const viewerConfig = {
  defaultViewMode: "FIT_PAGE", //default mode fit_page
  embedMode: "FULL_WINDOW", //full window display
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
        /* Passed meta data of file */
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
            //set user name instead of guest
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
        //updating annotations automatically
        setInterval(async () => {
          await fetch("/course/annotations/find", {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ fileId: fileId }),
          })
            .then((response) => {
              return response.json();
            })
            .then((res) => {
              let updatedAnnos = [];
              res.forEach((r) => {
                updatedAnnos.push(r.data);
              });
              //updated annos contains the updated version of annotations
              //if the present annos are different than updated ones, then updates it otherwise not
              if (JSON.stringify(updatedAnnos) !== JSON.stringify(oldAnnos)) {
                let result = updatedAnnos.filter((ol) => {
                  return !oldAnnos.some((o2) => {
                    return ol.id === o2.id;
                  });
                });
                //add annotations through annotationManager API
                annotationManager
                  .addAnnotations(result)
                  .then(function () {})
                  .catch(function (error) {});
                //updates the present annos
                oldAnnos = oldAnnos.concat(result);
              }
            });
        }, 2000);

        /* API to register events listener */
        annotationManager.registerEventListener(
          function (event) {
            switch (event.type) {
              // if annotations are added
              case "ANNOTATION_ADDED":
                if (event.data.bodyValue !== "") {
                  try {
                    if (
                      //if the user doesn't give any position to annotation, it will default go to this boundingBox location
                      //therefore checking if the two obejcts are same and then updating the position to right,lower position of the PDF page.
                      JSON.stringify(event.data.target.selector.boundingBox) ==
                      JSON.stringify([
                        594.4658823529412,
                        774.1270588235294,
                        611.2376470588235,
                        792.7623529411765,
                      ])
                    ) {
                      event.data.target.selector.boundingBox = [0, 0, 0, 0];
                    }
                  } catch (error) {}
                  //update added annotation to database storage by sending event data with POST request
                  (async () => {
                    await fetch("/course/annotations/add", {
                      method: "POST",
                      headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        data: event.data,
                        fileId: fileId,
                      }),
                    });
                  })();
                  //if the student comments any of the following on anyone of the PDF of the course, then
                  //the respective course is marked as completed for the student
                  if (
                    event.data.bodyValue == "completed" ||
                    event.data.bodyValue == "Completed" ||
                    event.data.bodyValue == "Course completed." ||
                    event.data.bodyValue == "complete" ||
                    event.data.bodyValue == "Complete"
                  ) {
                    //sends GA event as course completed
                    ga(
                      "send",
                      "event",
                      "COURSE_COMPLETED",
                      courseName,
                      userName
                    );
                  }
                }
                break;
              case "ANNOTATION_UPDATED":
                //update updated annotation to database storage by sending event data with POST request
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
              //delete annotation from the database storage by sending event data with POST request
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
        //only track student's events
        if (userRole == "student") {
          switch (event.type) {
            //if PDF file is opened
            case "DOCUMENT_OPEN":
              ga("send", "event", "DOCUMENT_OPEN", courseName, userName);
              break;
            //if page is viewed
            case "PAGE_VIEW":
              ga(
                "send",
                "event",
                "PAGE_VIEW",
                `Page ${event.data.pageNumber} of ${event.data.fileName}`,
                userName
              );
              break;
            //if file is downloaded
            case "DOCUMENT_DOWNLOAD":
              ga("send", "event", "DOCUMENT_DOWNLOAD", courseName, userName);
              break;
            //if file is printed
            case "DOCUMENT_PRINT":
              ga("send", "event", "DOCUMENT_PRINT", courseName, userName);
              break;
            // if text is copied
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
$(document).ready(() => {
  //attaches respective PDF file to respective adobe-dc-views(1,2,..)
  for (let i = 1; i <= 5; i++) {
    if (document.getElementById(`adobe-dc-view${i}`) != null) {
      let ele = document.getElementById(`adobe-dc-view${i}`);
      let pdfFile = ele.classList[0];
      let fileId = ele.getAttribute("fileId");
      let topic = ele.parentElement.parentElement.id;
      //call viewPDF function now
      viewPdf(i, topic, pdfFile, fileId);
    } else {
      break;
    }
  }
  //find user and course related data
  courseName = document.querySelector(".course-name").innerText;
  userName = document.querySelector(".userName").innerText;
  userEmail = document.querySelector(".userEmail").innerText;
  userRole = document.querySelector(".userRole").innerText;
  //comments will show as "(TEACHER) teacherName" so tat users can easiy see it as an important comment
  if (userRole == "teacher") {
    userName = "(TEACHER) " + userName;
  }
  //sets profile data to userData which later will be passed as userConfig to Annotations API
  profile = {
    userProfile: {
      name: userName,
      email: userEmail,
    },
  };
  //handles the sharing of course links thorough social media
  function socialWindow(url) {
    var left = (screen.width - 570) / 2;
    var top = (screen.height - 570) / 2;
    var params =
      "menubar=no,toolbar=no,status=no,width=570,height=570,top=" +
      top +
      ",left=" +
      left;
    window.open(url, "NewWindow", params);
  }
  function setShareLinks() {
    var pageUrl = encodeURIComponent(document.URL);
    var tweet = encodeURIComponent(
      $("meta[property='og:description']").attr("content")
    );
    //handles the sharing of course links thorough facebook
    $(".social-share.facebook").on("click", function () {
      url = "https://www.facebook.com/sharer.php?u=" + pageUrl;
      socialWindow(url);
      ga(
        "send",
        "event",
        "COURSE_SHARED",
        document.querySelector(".course-name").innerText,
        "shared on facebook"
      );
    });
    //handles the sharing of course links thorough twitter
    $(".social-share.twitter").on("click", function () {
      url =
        "https://twitter.com/intent/tweet?url=" + pageUrl + "&text=" + tweet;
      socialWindow(url);
      ga(
        "send",
        "event",
        "COURSE_SHARED",
        document.querySelector(".course-name").innerText,
        "shared on twitter"
      );
    });
    //handles the sharing of course links thorough email
    $(".social-share.email").on("click", function () {
      url =
        "mailto:?subject=Course%20from%20Education%20Hub&body=Hi,%20I%20found%20this%20course%20from%20the%20Education%20Hub.%20%20" +
        pageUrl;
      socialWindow(url);
      ga(
        "send",
        "event",
        "COURSE_SHARED",
        document.querySelector(".course-name").innerText,
        "shared on email"
      );
    });
  }
  //call setShareLinks()
  setShareLinks();
});
