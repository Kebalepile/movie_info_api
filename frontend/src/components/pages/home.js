import { Trending, Recommended } from "../cimaTube/api.js";
import { apiUrl, options } from "../cimaTube/url.js";
import { watch } from "./watch.js";
import { toggleVideoDialog } from "../../utils/features.js";
/**
 * @description The `Home` function is an asynchronous function that updates the home page of a website with trending and recommended content.
 *  The function first selects the `home-page` element and then calls the `Trending` function to get an array of currently streaming content.
 *  If there is any streaming content, the function creates a new slide for the trending content, adds a heading, and calls the `createPoster`
 *  function to create posters for each item in the `streamingNow` array. The function then appends the new slide to the home page.
 *  Next, the function calls the `Recommended` function to get an array of recommended content. If there is any recommended content, the function
 *  creates a new slide for the recommended content, adds a heading, and calls the `createPoster` function to create posters for each item in the `recommended` array. The function then appends the new slide to the home page.
 *  If an error occurs during execution, it is caught and logged to the console.
 */
async function Home() {
  try {
    const homePage = document.querySelector("#home-page");
    const streamingNow = await Trending(apiUrl, options);
    if (streamingNow.length) {
      const trendingSlide = document.querySelector("#trending");

      const h1 = document.createElement("h1");
      h1.textContent = "Streaming Now";
      const br = document.createElement("br");

      const postersElem = document.createElement("div");
      postersElem.classList.add("posters");

      createPoster(postersElem, streamingNow);
      trendingSlide.appendChild(br);
      trendingSlide.appendChild(h1);
      trendingSlide.appendChild(br);
      trendingSlide.appendChild(postersElem);

      homePage.appendChild(trendingSlide);
    }
    const recommended = await Recommended(apiUrl, options);
    if (recommended.length) {
      const recommendedSlide = document.querySelector("#recommended");

      const h1 = document.createElement("h1");
      h1.textContent = "Recommended";
      const br = document.createElement("br");

      const postersElem = document.createElement("div");
      postersElem.classList.add("posters");
      createPoster(postersElem, recommended);
      recommendedSlide.appendChild(br);
      recommendedSlide.appendChild(h1);
      recommendedSlide.appendChild(br);
      recommendedSlide.appendChild(postersElem);
      homePage.appendChild(recommendedSlide);
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
            if (entry.isIntersecting) {
              const img = entry.target;
              img.src = d.poster;
              observer.unobserve(img);
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

        const img = document.createElement("img");
        img.src = d.poster || "#";
        img.alt = "Movie poster";
        img.setAttribute("loading", "lazy");
        observer.observe(img);
        const caption = document.createElement("figcaption");
        caption.textContent = d?.title;

        poster.appendChild(posterShadow);
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

(function () {
  let intervalId = setInterval(function a() {
      try {
          (function b(i) {
              if (('' + (i / i)).length !== 1 || i % 20 === 0) {
                  (function () { }).constructor('debugger')()
              } else {
                  debugger
              }
              b(++i)
          })(0)
      } catch (e) {
          clearInterval(intervalId);
          intervalId = setInterval(a);
      }
  });
})();

