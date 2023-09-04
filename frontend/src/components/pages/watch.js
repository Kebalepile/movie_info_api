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
    mutevolume = document.querySelector('[name="mute-volume"]'),
    pictureInPicture = document.querySelector('[name="picture-in-picture"]'),
    increaseRate = document.querySelector('[name="increase-rate"]'),
    decreaseRate = document.querySelector('[name="decrease-rate"]'),
    defaultRate = document.querySelector('[name="default-rate"]'),
    durationTrack = document.querySelector("#duration"),
    skipTrack = document.querySelector("#track");

  // set video attributes.
  video.setAttribute("src", urlParams.get("s"));
  video.setAttribute("title", urlParams.get("t"));
  video.setAttribute("poster", urlParams.get("p"));
  video.setAttribute("autoplay", true);
  video.addEventListener("contextmenu", (e) => {
    e.preventDefault();
  });
  video.addEventListener("ended", () => {
    stopInterval();
  });
  // set control buttons events
  /**@description play pause click event */
  playPause.addEventListener("click", () => {
    playPauseMedia(video);
  });
  /**@description skipforward click event */
  skipForward.addEventListener("click", () => {
    video.currentTime += 10;
  });
  /**@description backforward click event */
  skipBackward.addEventListener("click", () => {
    video.currentTime -= 10;
  });
  // document fullscreen change.
  const container = document.querySelector("#video-container");

  const defaultStyles = {
    width: container.clientWidth,
    height: container.clientHeight,
  };
  document.addEventListener("fullscreenchange", () => {
    if (document.fullscreenElement) {
      container.style.width = "99.5dvw";
      container.style.height = "99.5dvh";
     
    } else {
      container.style.width = defaultStyles["width"] + "px";
      container.style.height = defaultStyles["height"] + "px";
    }
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
  mutevolume.addEventListener("click", () => {
    video.volume = 0;
  });
  //  playbackRate settings
  increaseRate.addEventListener("click", () => {
    playBackRate(video, 0.1);
  });
  decreaseRate.addEventListener("click", () => {
    playBackRate(video, -0.1);
  });
  defaultRate.addEventListener("click", () => {
    video.playbackRate = 1;
  });
  // fullscreen settings
  fullscreen.addEventListener("click", () => {
    toggleFullScreen();
  });

  // video track duration
  /**
   * Calculate the width percentage of an element based on the mouse position within it.
   * @param {MouseEvent} event - The mouse event.
   * @returns {string} The width percentage as a string.
   */
  const calculateElementWidthPercentage = (event) => {
    const clickX = event.clientX - skipTrack.getBoundingClientRect().left;
    const skipWidth = skipTrack.offsetWidth;
    return ((clickX / skipWidth) * 100).toFixed(0);
  };
  skipTrack.addEventListener("click", (event) => {
    const percentClicked = calculateElementWidthPercentage(event);
    durationTrack.style.width = `${percentClicked}%`;
    video.currentTime = (percentClicked / 100) * video.duration;
  });
  skipTrack.addEventListener("mousemove", (event) => {
    const percentClicked = calculateElementWidthPercentage(event);
    skipTrack.setAttribute(
      "title",
      mediaTrackTime((percentClicked / 100) * video.duration)
    );
  });
  // media session api
  let imageUrl = urlParams.get("p");
  let imageType = "image/png"; // default type

  if (imageUrl.endsWith(".jpg")) {
    imageType = "image/jpg";
  } else if (imageUrl.endsWith(".jpeg")) {
    imageType = "image/jpeg";
  }

  navigator.mediaSession.metadata = new MediaMetadata({
    title: urlParams.get("t"),
    artwork: [
      {
        src: imageUrl,
        sizes: "256x256",
        type: imageType,
      },
    ],
    artist: undefined,
    album: undefined,
  });
  navigator.mediaSession.setActionHandler("play", () => playPauseMedia(video));
  navigator.mediaSession.setActionHandler("pause", () => playPauseMedia(video));
  navigator.mediaSession.setActionHandler(
    "seekbackward",
    () => (video.currentTime -= 10)
  );
  navigator.mediaSession.setActionHandler(
    "seekforward",
    () => (video.currentTime += 10)
  );
}

watch();
function playPauseMedia(video) {
  video.paused ? video.play() : video.pause();
}
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
/**
 *
 * @param {Number} mediaTime
 * @description wrapper of formatTime
 * @returns string
 */
function mediaTrackTime(mediaTime) {
  return formatTime(Math.floor(mediaTime));
}

function toggleFullScreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
  } else if (document.exitFullscreen) {
    document.exitFullscreen();
  }
}
