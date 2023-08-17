import { initElementComponent } from "../../utils/nana.js";

function Home() {
  document.body.appendChild(
    initElementComponent({
      type: "section",
      id: "home-page",
      
      children: [
        {
          type: "article",
          id: "welcome_banner",
          children: [
            { type: "h1", content: "Stream Free Movies & TV Shows " },
            {
              type: "br",
            },
            {
              type: "h2",
              content:
                "Browse and Watch all your favorite online movies & series for free!",
            },
          ],
        },
      ],
    })
  );
}

Home();
