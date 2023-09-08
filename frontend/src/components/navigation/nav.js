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
          classes: "menu",
          children: [
            {
              type: "img",
              id: "logo",
              attributes: {
                src: "./src/image/icons/favicon.png",
                alt: "logo image",
              },
            },
            {
              type: "input",
              id: "toggle",
              attributes: { type: "checkbox" },
            },
            {
              type: "label",
              attributes: { for: "toggle" },
              children: [
                {
                  type: "span",
                  content: String.fromCharCode(9776),
                },
              ],
            },
            {
              type: "ul",
              id: "nav_links",
              children: new Array(2).fill().map((_, i) => ({
                type: "li",
                class: "page_link",
                id: "install",
                children: [
                  i === 0
                    ? {
                        type: "div",

                        children: [
                          {
                            type: "img",
                            attributes: {
                              src: "./src/image/icons/download.png",
                              alt: "download icon",
                            },
                          },
                          {
                            type: "p",
                            content: "install",
                          },
                        ],
                      }
                    : {
                        type: "a",
                        content: "About",
                        attributes: { href: "#about" },
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
