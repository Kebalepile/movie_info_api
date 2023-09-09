import { Trending, Recommended } from "../cimaTube/api.js";
import { apiUrl, options } from "../cimaTube/url.js";
import { watch } from "./watch.js";
import { toggleVideoDialog } from "../../utils/features.js";
import download from "../../utils/download.js";
/**
 * @description The `Home` function is an asynchronous function that updates the home page of a website with trending and recommended content.
 *  The function first selects the `trending` & `recommended` element and then calls the `Trending` function to get an array of currently streaming content.
 *  If there is any streaming content, the function creates a new slide for the trending content, adds a heading, and calls the `createPoster`
 *  function to create posters for each item in the `streamingNow` array. The function then appends the new slide to the home page.
 *  Next, the function calls the `Recommended` function to get an array of recommended content. If there is any recommended content, the function
 *  creates a new slide for the recommended content, adds a heading, and calls the `createPoster` function to create posters for each item in the `recommended` array. The function then appends the new slide to the home page.
 *  If an error occurs during execution, it is caught and logged to the console.
 */
async function Home() {
  try {
    const installBtn = document.querySelector("#install");
    installBtn.addEventListener("click", () => {
      console.log("install web app");
    });
    const tempTrendingPosters = document.querySelector(".trending"),
      tempRecommendedPosters = document.querySelector(".recommended");

    const streamingNow = await Trending(apiUrl, options);

    if (streamingNow?.length) {
      tempTrendingPosters.style.display = "none";
      const trendingSlide = document.querySelector("#trending");

      const postersElem = document.createElement("div");
      postersElem.classList.add("posters");

      createPoster(postersElem, streamingNow);

      trendingSlide.appendChild(postersElem);
    }
    const recommended = await Recommended(apiUrl, options);
    if (recommended?.length) {
      tempRecommendedPosters.style.display = "none";
      const recommendedSlide = document.querySelector("#recommended");

      const postersElem = document.createElement("div");
      postersElem.classList.add("posters");
      createPoster(postersElem, recommended);

      recommendedSlide.appendChild(postersElem);
    }
  } catch (err) {
    console.log(err);
  }
}

/**
 * @description This function creates a poster element for each item in the data array and appends it to the parent element.
 * @param {HTMLElement} parent - The parent element to which the posters will be appended.
 * @param {Object[]} data - An array of objects representing the data for each poster.
 */
function createPoster(parent, data) {
  data
    .reduce((acc, cur) => {
      let found = acc.find((val) => val?.src == cur?.src);
      if (!found) {
        acc.push(cur);
      }
      return acc;
    }, [])
    .forEach((d) => {
      try {
        const observer = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            try {
              if (entry.isIntersecting) {
                const img = entry.target;
                img.src = d.poster;
                observer.unobserve(img);
              }
            } catch (err) {
              console.error(err.message);
            }
          });
        });
        const poster = document.createElement("figure");
        poster.classList.add("poster");

        const posterShadow = document.createElement("div");
        posterShadow.classList.add("poster_shadow");

        const playButton = document.createElement("span");
        playButton.classList.add("play_button");
        playButton.textContent = "▶";
        posterShadow.appendChild(playButton);

        const downloadWrapper = document.createElement("div");
        downloadWrapper.setAttribute("id", "download-wrapper");

        const downloadButton = document.createElement("button");
        downloadButton.textContent = "download";
        downloadButton.setAttribute("id", "download");
        downloadButton.addEventListener("click", () => {
          download(d?.src, d?.title);
        });
        downloadWrapper.appendChild(downloadButton);

        const img = document.createElement("img");
        img.src = d.poster || "#";
        img.alt = "Movie poster";
        img.setAttribute("loading", "lazy");
        observer.observe(img);

        const caption = document.createElement("figcaption");
        caption.textContent = d?.title;

        poster.appendChild(posterShadow);
        poster.appendChild(downloadWrapper);
        poster.appendChild(img);
        poster.appendChild(caption);
        poster.setAttribute("title", d?.title);
        poster.addEventListener("click", () => {
          const videoParams = new Map();
          videoParams.set("p", d?.poster || "#");
          videoParams.set("t", d?.title || "No video found");
          videoParams.set("s", d?.src || "#");
          watch(videoParams);
          toggleVideoDialog();
        });
        poster.addEventListener("contextmenu", (e) => {
          e.preventDefault();
        });
        parent.appendChild(poster);
      } catch (err) {
        console.log(err.message);
      }
    });
}

Home();
