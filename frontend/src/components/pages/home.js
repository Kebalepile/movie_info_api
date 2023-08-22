import { initElementComponent } from "../../utils/nana.js";
import { Trending, Recommended } from "../cimaTube/api.js";
import { apiUrl, options } from "../cimaTube/url.js";
async function Home() {
  /***
   * @description add banner in home page
   */
  document.body.appendChild(
    initElementComponent({
      type: "section",
      id: "home-page",

      children: [
        {
          type: "article",
          id: "welcome_banner",
          children: [
            {
              type: "h1",
              classes: "banner_msg",
              content: "Stream Movies, Series & TV Shows ",
            },
          ],
        },
        {
          type: "br",
        },
      ],
    })
  );
  try {
    const homePage = document.querySelector("#home-page");
    const streamingNow = await Trending(apiUrl, options);
    if (streamingNow.length) {
      const trendingSlide = document.createElement("section");
      trendingSlide.classList.add("movies_slide");
      trendingSlide.setAttribute("id", "trending");
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
      const recommendedSlide = document.createElement("section");
      recommendedSlide.classList.add("movies_slide");
      recommendedSlide.setAttribute("id", "recommended");
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
  data.forEach((d) => {
    const poster = document.createElement("figure");
    poster.classList.add("poster");

    const posterShadow = document.createElement("div");
    posterShadow.classList.add("poster_shadow");

    const playButton = document.createElement("span");
    playButton.classList.add("play_button");
    playButton.textContent = "▶";
    posterShadow.appendChild(playButton);

    const img = document.createElement("img");
    img.src = d.poster;
    img.alt = "Movie poster";
    img.setAttribute("loading", "lazy");

    const caption = document.createElement("figcaption");
    caption.textContent = d.title;

    poster.appendChild(posterShadow);
    poster.appendChild(img);
    poster.appendChild(caption);
    poster.addEventListener("click", () => {
      console.log(d);
    });
    poster.addEventListener("contextmenu", (e) => {
      console.log("context");
      e.preventDefault();
    });
    parent.appendChild(poster);
  });
}

Home();
