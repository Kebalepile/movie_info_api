/**
 * @description video features module
 */

/**
 * @param {Element} video
 * @descrpiton play pause video
 */
export function playPauseMedia(video) {
  try {
    video.paused ? video.play() : video.pause();
  } catch (err) {
    console.error(err.message);
  }
}
/**
 *
 * @param {Event} event
 * @description remove contextmenu of event target
 */
export function contextmenu(event) {
  try {
    event.preventDefault();
  } catch (err) {
    console.error(err.message);
  }
}
/**
 *
 * @param {Element} media
 * @param {Number} change
 * @description change volume of given video object element
 */
export function volume(media, change) {
  try {
    const currentVolume = Math.min(Math.max(media.volume + change, 0), 1);
    media.volume = currentVolume;
  } catch (err) {
    console.error(err.message);
  }
}
/**
 *
 * @param {Element} video
 * @description mute HTML video volume
 */
export function muteVolume(video) {
  try {
    video.volume = 0;
  } catch (err) {
    console.error(err.message);
  }
}

export function playBackRate(media, change) {
  try {
    const currentPlaybBackRate = Math.min(
      Math.max(media.playbackRate + change, 0.25),
      5.0
    );
    media.playbackRate = currentPlaybBackRate;
  } catch (err) {
    console.error(err.message);
  }
}
import { formatTime } from "./time.js";
/**
 *
 * @param {Number} mediaTime
 * @description wrapper of formatTime
 * @returns string
 */
export function mediaTrackTime(mediaTime) {
  try {
    return formatTime(Math.floor(mediaTime));
  } catch (err) {
    console.error(err.message);
  }
}
/**
 * @description toggle video between small and fullscreen
 */
export function toggleFullScreen(container) {
  container.addEventListener("fullscreenerror", (e) => {
    console.error("an error occurred changing into fullscreen");
    console.log(e);
  });
  const elem = document.querySelector("#video-container");
  try {
    if (document.fullscreenElement !== container) {
      container.requestFullscreen();
      elem.style.width = "95dvw";
      elem.style.height = "95dvh";
    } else if (document.exitFullscreen) {
      elem.style.width = "inherit";
      elem.style.height = "inherit";
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
  try {
    video.disablePictureInPicture = false;
    video.disableRemotePlayback = false;

    if (video.nodeName === "VIDEO") {
      if (video !== document.pictureInPictureElement) {
        video.requestPictureInPicture();
      } else {
        document.exitPictureInPicture();
      }
    }
  } catch (err) {
    console.error(err.message);
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
    console.error(err.message);
  }
}
/**@description toggle settings Controls */
export function videoSettings() {
  try {
    const settingsControls = document.querySelector("#settings-controls");
    const settingsIcon = settings.querySelector("img");
    let showModal = true;
    settingsIcon.addEventListener("click", () => {
      settingsControls.style.display = showModal ? "block" : "none";
      showModal = !showModal;
    });
  } catch (err) {
    console.error(err.message);
  }
}

/**
 *@param {Element} video
 *  @description skip video 10s forward
 */
export function skipVideoForward(video) {
  try {
    video.currentTime += 10;
  } catch (err) {
    console.error(err.message);
  }
}
/**
 *@param {Element} video
 *  @description skip video 10s backward
 */
export function skipVideoBackward(video) {
  try {
    video.currentTime -= 10;
  } catch (err) {
    console.error(err.message);
  }
}

/**
 *
 * @param {Element} video
 * @param {String} title
 * @param {String} imageUrl
 * @description Use Broswer  media session api
 */
export function mediaSession(video, title, imageUrl) {
  try {
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
    navigator.mediaSession.setActionHandler("play", () =>
      playPauseMedia(video)
    );
    navigator.mediaSession.setActionHandler("pause", () =>
      playPauseMedia(video)
    );
    navigator.mediaSession.setActionHandler(
      "seekbackward",
      () => (video.currentTime -= 10)
    );
    navigator.mediaSession.setActionHandler(
      "seekforward",
      () => (video.currentTime += 10)
    );
  } catch (err) {
    console.error(err.message);
  }
}
export function toggleVideoDialog() {
  try {
    const container = document.querySelector("#video-container"),
      closeDialog = document.querySelector("#close-dialog"),
      videoDialog = document.querySelector("#watch-video");
    videoDialog.style.display = "flex";
    videoDialog.style.width = "100dvw";
    videoDialog.style.height = "100dvh";
    container.style.display = "grid";
    closeDialog.style.display = "inline-block";
  } catch (err) {
    console.log(err.message);
  }
}
