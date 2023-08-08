/**
 *
 * @param {object} param -object to create element component the object contains the following:
 * @argument - {
  type: "button",
  content: "Department of Cooc.",
  classes: "dep container",
  id: "main",
  attributes: { title: "parent of h1 governer", name:"governer" },

  eventListeners: [
    {
      type: "click",
      callBack: function (e) {
        console.log(e.target.name, " clicked.");
      },
    },
  ],
   children: [
    {
      type: "h1",
      content: "Hello Govener",
      id: "message",
      attributes: { "data-id": 10 , title:"governs greet"},
    },
  ],
};
 * @description Creates element componenets
 * @returns Element Component
 */
export function initElementComponent({
  type = "div",
  content = "",
  classes = "",
  id = "",
  attributes = {},
  children = [],
  eventListeners = [],
} = {}) {
  const element = document.createElement(type);

  if (content) {
    element.textContent = content;
  }

  if (classes) {
    for (const className of classes.split(" ")) {
      element.classList.add(className);
    }
  }

  if (id) {
    element.id = id;
  }

  if (attributes) {
    for (const [key, value] of Object.entries(attributes)) {
      element.setAttribute(key, value);
    }
  }

  if (eventListeners.length) {
    for (const { type, callBack } of eventListeners) {
      element.addEventListener(type, callBack);
    }
  }

  if (children.length) {
    for (const child of children) {
      const childElement = initElementComponent(child);
      element.appendChild(childElement);
    }
  }

  return element;
}
