/**
 * @description video features module
 */

/**
 * @param {Element} video
 * @descrpiton play pause video
 */
export function playPauseMedia(video) {
  video.paused ? video.play() : video.pause();
}
/**
 *
 * @param {Event} event
 * @description remove contextmenu of event target
 */
export function contextmenu(event) {
  event.preventDefault();
}
/**
 *
 * @param {Element} media
 * @param {Number} change
 * @description change volume of given video object element
 */
export function volume(media, change) {
  const currentVolume = Math.min(Math.max(media.volume + change, 0), 1);
  media.volume = currentVolume;
}
/**
 *
 * @param {Element} video
 * @description mute HTML video volume
 */
export function muteVolume(video) {
  video.volume = 0;
}

export function playBackRate(media, change) {
  const currentPlaybBackRate = Math.min(
    Math.max(media.playbackRate + change, 0.25),
    5.0
  );
  media.playbackRate = currentPlaybBackRate;
}
import { formatTime } from "./time.js";
/**
 *
 * @param {Number} mediaTime
 * @description wrapper of formatTime
 * @returns string
 */
export function mediaTrackTime(mediaTime) {
  return formatTime(Math.floor(mediaTime));
}
/**
 * @description toggle video between small and fullscreen
 */
export function toggleFullScreen(container) {
  try {
    if (document.fullscreenElement !== container) {
      container.requestFullscreen();
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  } catch (err) {
    console.log(err.message);
  }
}


/**
 *
 * @param {Element} video
 * @description toggle video picture in picture mode
 */
export function pictureInPicture(video) {
  video.disablePictureInPicture = false;
  video.disableRemotePlayback = false;

  if (video.nodeName === "VIDEO") {
    if (video !== document.pictureInPictureElement) {
      video.requestPictureInPicture();
    } else {
      document.exitPictureInPicture();
    }
  }
}
/**
 *
 * @param {Element} video
 * @param {Element} durationTrack
 * @param {Element} time
 * @param {Function} stopInterval
 * @description updates UI video current time & displays video duration
 */
export function videoTrackTime(video, durationTrack, time, stopInterval) {
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
}
/**@description toggle settings Controls */
export function videoSettings() {
  const settingsControls = document.querySelector("#settings-controls");
  const settingsIcon = settings.querySelector("img");
  let showModal = true;
  settingsIcon.addEventListener("click", () => {
    settingsControls.style.display = showModal ? "block" : "none";
    showModal = !showModal;
  });
}
/**
 * @param {Elment} container
 * @param {Object} defaultStyles
 * @description detect document fullscreen change and toggle video container to full screen
 */
export function screenChange(container, defaultStyles) {
  if (document.fullscreenElement) {
    container.style.width = "99.5dvw";
    container.style.height = "99.5dvh";
  } else {
    container.style.width = defaultStyles["width"] + "px";
    container.style.height = defaultStyles["height"] + "px";
  }
}
/**
 *@param {Element} video
 *  @description skip video 10s forward
 */
export function skipVideoForward(video) {
  video.currentTime += 10;
}
/**
 *@param {Element} video
 *  @description skip video 10s backward
 */
export function skipVideoBackward(video) {
  video.currentTime -= 10;
}

/**
 * 
 * @param {Element} video 
 * @param {String} title 
 * @param {String} imageUrl 
 * @description Use Broswer  media session api
 */
export function mediaSession(video, title, imageUrl) {

  
  let imageType = "image/png"; // default type

  if (imageUrl.endsWith(".jpg")) {
    imageType = "image/jpg";
  } else if (imageUrl.endsWith(".jpeg")) {
    imageType = "image/jpeg";
  }

  navigator.mediaSession.metadata = new MediaMetadata({
    title,
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
