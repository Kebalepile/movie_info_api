function Movies() {
  //  Get URL params
  const urlParams = new URLSearchParams(location.search);

  const video = document.createElement("video");
  video.setAttribute("id", "watch");
  video.setAttribute("src", urlParams.get("s"));
  video.setAttribute("title", urlParams.get("t"));
  video.setAttribute("poster", urlParams.get("p"));

  video.setAttribute("controls", true);
  video.addEventListener("contextmenu", (e) => {
    e.preventDefault();
  });

  const videoContainer = document.createElement("section");
  videoContainer.setAttribute("id", "video_container");
  videoContainer.appendChild(video);
  document.body.appendChild(videoContainer);
}

Movies();
