$(document).ready(function () {
  setShareLinks();
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
    $(".social-share.facebook").on("click", function () {
      url = "https://www.facebook.com/sharer.php?u=" + pageUrl;
      socialWindow(url);
    });
    $(".social-share.twitter").on("click", function () {
      url =
        "https://twitter.com/intent/tweet?url=" + pageUrl + "&text=" + tweet;
      socialWindow(url);
    });
    $(".social-share.email").on("click", function () {
      url =
        "mailto:?subject=Course%20from%20Education%20Hub&body=Hi,%20I%20found%20this%20course%20from%20the%20Education%20Hub.%20%20" +
        pageUrl;
      socialWindow(url);
    });
  }
});
