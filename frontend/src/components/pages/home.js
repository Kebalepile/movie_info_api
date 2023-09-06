import { Trending, Recommended } from "../cimaTube/api.js";
import { apiUrl, options } from "../cimaTube/url.js";
import { watch } from "./watch.js";
import { toggleVideoDialog } from "../../utils/features.js";
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
      const recommendedSlide = document.querySelector("#recommended")
      // recommendedSlide.classList.add("movies_slide");
      // recommendedSlide.setAttribute("id", "recommended");
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

