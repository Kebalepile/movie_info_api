function watch() {
  //  Get URL params
  const urlParams = new URLSearchParams(location.search);

  const settings = document.querySelector("#settings"),
    video = document.querySelector("#media-player"),
    skipBackward = document.querySelector("#backward"),
    skipForward = document.querySelector("#forward"),
    playPause = document.querySelector("#play-pause"),
    time = document.querySelector("#time"),
    fullscreen = document.querySelector("#fullscreen"),
    track = document.querySelector("#track"),
    durationTrack = document.querySelector("#duration");

  // set video attributes.
  video.setAttribute("src", urlParams.get("s"));
  video.setAttribute("title", urlParams.get("t"));
  video.setAttribute("poster", urlParams.get("p"));
  video.addEventListener("contextmenu", (e) => {
    e.preventDefault();
  });
  video.addEventListener("ended", (e) => {
    console.log(video.title, " ended");
  });
  // set control buttons events
  /**@description play pause click event */
  playPause.addEventListener("click", (e) => {
    video.paused ? video.play() : video.pause();
  });
  /**@description skipforward click event */
  skipForward.addEventListener("click", (e) => {
    video.currentTime += 10;
  });
  /**@description backforward click event */
  skipBackward.addEventListener("click", (e) => {
    video.currentTime -= 10;
  });

  const handletrackVideoTime = () => {
    try {
      /**@description handle track video time */
      const duration = mediaTrackTime(video.duration),
        currentTime = mediaTrackTime(video.currentTime);

      durationTrack.style.width = `${(
        (Math.floor(currentTime) / Math.floor(duration)) *
        100
      ).toFixed(0)}%`;
      time.textContent = `${currentTime} / ${duration}`;
    } catch (err) {
      stopInterval();
    }
  };
  let intervalId;
  const startInterval = () => {
    clearInterval(intervalId);
    intervalId = setInterval(handletrackVideoTime, 1000);
  };
  const stopInterval = () => {
    clearInterval(intervalId);
  };
  startInterval();
  /**@description toggle settings dialog */
  const settingsDialog = document.querySelector("#settings-dialog");
  const settingsIcon = settings.querySelector("img");
  let showModal = true;
  settingsIcon.addEventListener("click", () => {
    settingsDialog.style.display = showModal ? "block" : "none";
    showModal = !showModal;
  });

  // pictuire in picture
  // addEventListener("click", (e) => {
  //         video.disablePictureInPicture = false;
  //         video.disableRemotePlayback = false;

  //         if (video.nodeName === "VIDEO") {
  //           if (video !== document.pictureInPictureElement) {
  //             video.requestPictureInPicture();
  //           } else {
  //             document.exitPictureInPicture();
  //           }
  //         }
  //       });
}

watch();

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
