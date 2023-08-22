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
              children: new Array(2).fill().map((_, i) => ({
                type: "li",
                class: "page_link",
                children: [
                  i === 0
                    ? {
                        type: "a",
                        content: "Home",
                        attributes: { href: "./index.html" },
                      }
                    
                    : {
                        type: "a",
                        content: "About",
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
