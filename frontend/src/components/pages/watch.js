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
    increasevolume = document.querySelector('[name="increase-volume"]'),
    decreasevolume = document.querySelector('[name="decrease-volume"]'),
    pictureInPicture = document.querySelector('[name="picture-in-picture"]'),
    increaseRate = document.querySelector('[name="increase-rate"]'),
    decreaseRate = document.querySelector('[name="decrease-rate"]'),
    durationTrack = document.querySelector("#duration"),
    skipTrack = document.querySelector("#track");

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
      const duration = isNaN(video.duration)
          ? "0:00"
          : mediaTrackTime(video.duration),
        currentTime = isNaN(video.currentTime)
          ? "0:00"
          : mediaTrackTime(video.currentTime);
      const percent = (
        (Math.floor(video.currentTime) / Math.floor(video.duration)) *
        100
      ).toFixed(0);
      if (!isNaN(percent)) {
        durationTrack.style.width = `${percent}%`;
      }

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
  /**@description toggle settings Controls */
  const settingsControls = document.querySelector("#settings-controls");
  const settingsIcon = settings.querySelector("img");
  let showModal = true;
  settingsIcon.addEventListener("click", () => {
    settingsControls.style.display = showModal ? "block" : "none";
    showModal = !showModal;
  });

  // picture in picture
  pictureInPicture.addEventListener("click", (e) => {
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
  // volume settings
  increasevolume.addEventListener("click", () => {
    volume(video, 0.1);
  });
  decreasevolume.addEventListener("click", () => {
    volume(video, -0.1);
  });
  //  playbackRate settings
  increaseRate.addEventListener("click", () => {
    playBackRate(video, 0.1);
  });
  decreaseRate.addEventListener("click", () => {
    playBackRate(video, -0.1);
  });
  // fullscreen settings
  fullscreen.addEventListener("click", () => {
    console.log("fullscreen enabled");
  });
  // vidoe track duration
  skipTrack.addEventListener("click", (event) => {
    const clickX = event.clientX - skipTrack.getBoundingClientRect().left;
    const skipWidth = skipTrack.offsetWidth;
    const percentClicked = ((clickX / skipWidth) * 100).toFixed(0);
    durationTrack.style.width = `${percentClicked}%`;
    video.currentTime = (percentClicked / 100) * video.duration;
  });
}

watch();

/**
 *
 * @param {Element} media
 * @param {Number} change
 * @description change volume of given video object element
 */
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

import { formatTime } from "../../utils/time.js";
function mediaTrackTime(mediaTime) {
  return formatTime(Math.floor(mediaTime));
}

// function mediaEnded(element, media, autoPlayFiles, ms = 3000) {
//   setTimeout(() => {
//     autoPlayFiles(JSON.parse(localStorage.getItem("auto_play")));
//     element.removeEventListener("ended", mediaEnded);
//   }, ms);
// }
// function fullScreenChange(event) {
//   let video = event.target;

//   video.disablePictureInPicture = true;
//   video.disableRemotePlayback = true;
// }
// function fullScreen(media) {
//   try {
//     if (media.nodeName == "VIDEO") {
//       if (media.requestFullscreen) {
//         media.requestFullscreen();
//       } else if (media.webkitRequestFullscreen) {
//         media.webkitRequestFullscreen(); //Safari
//       } else if (media.msRequestFullscreen) {
//         media.msRequestFullscreen(); //IE11
//       }
//     }
//   } catch (error) {
//     console.error(error);
//   }
// }
