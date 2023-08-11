import { initElementComponent } from "../../utils/nana.js";

function Home() {
  document.body.appendChild(
    initElementComponent({
      type: "section",
      id: "home-page",
      content: "Home page",
    })
  );
}

Home();
