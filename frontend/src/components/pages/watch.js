import {
  playPauseMedia,
  playBackRate,
  volume,
  toggleFullScreen,
  pictureInPicture,
  mediaTrackTime,
  mediaSession,
  videoTrackTime,
  videoSettings,
  screenChange,
  muteVolume,
  contextmenu,
  skipVideoBackward,
  skipVideoForward,
} from "../../utils/features.js";

/**
 * @description Set up video player and its respective features.
 */
export function watch(videoParams) {
  const wrapper = document.querySelector("#wrapper"),
    video = document.querySelector("#media-player"),
    skipBackward = document.querySelector("#backward"),
    skipForward = document.querySelector("#forward"),
    playPause = document.querySelector("#play-pause"),
    time = document.querySelector("#time"),
    fullscreen = document.querySelector("#fullscreen"),
    increasevolume = document.querySelector('[name="increase-volume"]'),
    decreasevolume = document.querySelector('[name="decrease-volume"]'),
    mutevolume = document.querySelector('[name="mute-volume"]'),
    picInPic = document.querySelector('[name="picture-in-picture"]'),
    increaseRate = document.querySelector('[name="increase-rate"]'),
    decreaseRate = document.querySelector('[name="decrease-rate"]'),
    defaultRate = document.querySelector('[name="default-rate"]'),
    durationTrack = document.querySelector("#duration"),
    skipTrack = document.querySelector("#track"),
    videoDialog = document.querySelector("#watch-video"),
    closeDialog = document.querySelector("#close-dialog");

  closeDialog.addEventListener("click", (e) => {
    try {
      container.style.display = "none";
      closeDialog.style.display = "none";
      if (Number.isNaN(video.duration)) {
        video.pause();
      } else {
        video.currentTime = video.duration;
      }
    } catch (err) {
      console.log(err);
    } finally {
      videoDialog.style.display = "none";
      videoDialog.style.width = "0";
      videoDialog.style.height = "0";
    }
  });

  // set video attributes.
  video.setAttribute("src", videoParams.get("s"));
  video.setAttribute("title", videoParams.get("t"));
  video.setAttribute("poster", videoParams.get("p"));
  video.setAttribute("autoplay", true);
  video.addEventListener("contextmenu", contextmenu);
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
    skipVideoForward(video);
  });
  /**@description backforward click event */
  skipBackward.addEventListener("click", () => {
    skipVideoBackward(video);
  });
  // document fullscreen change.
  const container = document.querySelector("#video-container");

  document.addEventListener("fullscreenchange", () => {
    screenChange(container);
  });

  const handletrackVideoTime = () => {
    videoTrackTime(video, durationTrack, time, stopInterval);
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
  videoSettings();

  // picture in picture
  picInPic.addEventListener("click", (e) => {
    pictureInPicture(video);
  });
  // volume settings
  increasevolume.addEventListener("click", () => {
    volume(video, 0.1);
  });
  decreasevolume.addEventListener("click", () => {
    volume(video, -0.1);
  });
  mutevolume.addEventListener("click", () => {
    muteVolume(video);
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
    toggleFullScreen(wrapper);
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
  mediaSession(video, videoParams.get("t"), videoParams.get("p"));
}
