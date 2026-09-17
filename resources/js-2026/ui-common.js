import { loadContent } from "./utils/utils.js";

export const UX = {
  loadContent,
  init: (type) => {
    const global = "UI";
    if (!window[global]) {
      window[global] = {};
    }
    const Global = window[global];

    console.log(1111);

    if (document.querySelector("#krds-header")) {
      loadContent({
        area: document.querySelector("#krds-header"),
        src: "../inc/header.html",
        insert: true,
      })
        .then(() => {
          console.log("header load");
        })
        .catch((err) => console.error("Error loading header content:", err));
    }
  },
};
