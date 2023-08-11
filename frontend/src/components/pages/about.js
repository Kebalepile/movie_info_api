import { initElementComponent } from "../../utils/nana.js";

function About() {
  document.body.appendChild(
    initElementComponent({
      type: "section",
      id: "about-page",
      content: "About page",
    })
  );
}

About();
