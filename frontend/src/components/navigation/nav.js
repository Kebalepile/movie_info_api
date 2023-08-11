import { initElementComponent } from "../../utils/nana.js";

export default () => {
  document.body.appendChild(
    initElementComponent({
      type: "section",
      id: "main",
      children: [
        {
          type: "nav",
          id: "navigation",
          children: [
            {
              type: "ul",
              id: "nav_links",
              children: new Array(3).fill().map((_, i) => ({
                type: "li",
                class: "page_link",
                children: [
                  i === 0
                    ? {
                        type: "a",
                        content: "home",
                        attributes: { href: "./index.html" },
                      }
                    : i === 1
                    ? {
                        type: "a",
                        content: "movies",
                        attributes: { href: "./movies.html" },
                      }
                    : {
                        type: "a",
                        content: "about",
                        attributes: { href: "./about.html" },
                      },
                ],
              })),
            },
          ],
        },
      ],
    })
  );
};
