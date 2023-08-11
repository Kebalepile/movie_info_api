import { initElementComponent } from "../../utils/nana.js";

function Movies() {
  document.body.appendChild(
    initElementComponent({
      type: "section",
      id: "movie-page",
      content:"Movie page"
      
    })
  );
};

Movies()
