import { loadContent } from "./utils/utils.js";

export const UX = {
  loadContent,
  init: (type) => {
    const global = "UI";
    if (!window[global]) {
      window[global] = {};
    }
    const Global = window[global];
    const krdsHeader = document.querySelector("#krds-header");
    const krdsFooter = document.querySelector("#krds-footer");

    if (krdsHeader) {
      loadContent({
        area: krdsHeader,
        src: "../inc/header.html",
        insert: true,
      })
        .then(() => {
          console.log("header load");
        })
        .catch((err) => console.error("Error loading header content:", err));
    }
    if (krdsFooter) {
      loadContent({
        area: krdsFooter,
        src: "../inc/footer.html",
        insert: true,
      })
        .then(() => {
          console.log("footer load");
        })
        .catch((err) => console.error("Error loading footer content:", err));
    }
  },
};
