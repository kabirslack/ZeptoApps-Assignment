import { handleNext, handlePrevious } from "../index.js";

export const RenderPaginate = (paginate) => {

  let pagi = document.querySelector("#paginate");
  let html = `
    <button ${paginate.next ? "" : "disabled"} id="next">Next</button>
    <button ${
      paginate.previous ? "" : "disabled"
    } id="previous">Previus </button>
    `;
  pagi.innerHTML = html;
};

export const RegisterPaginateEvent = () => {
  const next = document.querySelector("#next");
  const previous = document.querySelector("#previous");
  next.addEventListener("click", handleNext);
  previous.addEventListener("click", handlePrevious);
};
