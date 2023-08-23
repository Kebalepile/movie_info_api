function Movies() {
  //  Get URL params
  const urlParams = new URLSearchParams(location.search);

  const video = document.createElement("video");
  video.setAttribute("id", "watch");
  video.setAttribute("src", urlParams.get("s"));
  video.setAttribute("title", urlParams.get("t"));
  video.setAttribute("poster", urlParams.get("p"));

  video.addEventListener("contextmenu", (e) => {
    e.preventDefault();
  });

  const videoContainer = document.createElement("section");
  videoContainer.setAttribute("id", "video_container");
  videoContainer.appendChild(video);
  document.body.appendChild(videoContainer);
  videoControls(video);
}

Movies();

function videoControls(video) {
  const buttonElements = [
    "full-screen",
    "backward",
    "play/pause",
    "forward",
    "settings",
  ].forEach((n) => {
    const elem = document.createElement("button");
    elem.textContent = n;
    switch (n) {
      case "full-screen":
        elem.addEventListener("click", (e) => {
          console.log(n);
          console.dir(video);
        });
        break;
      case "backward":
        /**@description backforward click event */
        elem.addEventListener("click", (e) => {
          video.currentTime -= 10;
        });
        break;
      case "play/pause":
        /**@description play pause click event */
        elem.addEventListener("click", (e) => {
          video.paused ? video.play() : video.pause();
        });
        break;
      case "forward":
        /**@description skipforward click event */
        elem.addEventListener("click", (e) => {
          video.currentTime += 10;
        });
        break;
      case "settings":
        elem.addEventListener("click", (e) => {
          console.log(n);
          console.dir(video);
        });
        break;
      case "pictureInPicture":
        elem.addEventListener("click", (e) => {
          video.disablePictureInPicture = false;
          video.disableRemotePlayback = false;

          if (video.nodeName === "VIDEO") {
            if (video !== document.pictureInPictureElement) {
              video.requestPictureInPicture();
            } else {
              document.exitPictureInPicture();
            }
          }
        });
        break;
      default:
        break;
    }
    document.body.appendChild(elem);
  });
  // const volume = "volume";
  // const settings = "s"
}
import { formatTime } from "../../utils/time.js";
function volume(media, change) {
  const currentVolume = Math.min(Math.max(media.volume + change, 0), 1);
  media.volume = currentVolume;
}

function playBackRate(media, change) {
  const currentPlaybBackRate = Math.min(
    Math.max(media.playbackRate + change, 0.25),
    5.0
  );
  media.playbackRate = currentPlaybBackRate;
}

function mediaEnded(element, media, autoPlayFiles, ms = 3000) {
  setTimeout(() => {
    autoPlayFiles(JSON.parse(localStorage.getItem("auto_play")));
    element.removeEventListener("ended", mediaEnded);
  }, ms);
}

function fullScreenChange(event) {
  let video = event.target;

  video.disablePictureInPicture = true;
  video.disableRemotePlayback = true;
}
function fullScreen(media) {
  try {
    if (media.nodeName == "VIDEO") {
      if (media.requestFullscreen) {
        media.requestFullscreen();
      } else if (media.webkitRequestFullscreen) {
        media.webkitRequestFullscreen(); //Safari
      } else if (media.msRequestFullscreen) {
        media.msRequestFullscreen(); //IE11
      }
    }
  } catch (error) {
    console.error(error);
  }
}

function mediaTrackTime(mediaTime) {
  return formatTime(Math.floor(mediaTime));
}

// const video = document.getElementById('my-video');
// const customControls = document.getElementById('custom-controls');

// // Handle fullscreen button click
// const fullscreenButton = document.createElement('button');
// fullscreenButton.textContent = 'Fullscreen';
// fullscreenButton.addEventListener('click', toggleFullscreen);
// customControls.appendChild(fullscreenButton);

// function toggleFullscreen() {
//   if (video.requestFullscreen) {
//     video.requestFullscreen();
//   } else if (video.mozRequestFullScreen) {
//     video.mozRequestFullScreen();
//   } else if (video.webkitRequestFullscreen) {
//     video.webkitRequestFullscreen();
//   } else if (video.msRequestFullscreen) {
//     video.msRequestFullscreen();
//   }
// }