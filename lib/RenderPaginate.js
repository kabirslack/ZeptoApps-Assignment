import { handleNext, handlePrevious } from "../index.js";

export const RenderPaginate = (paginate) => {
  console.log({ paginate });
  let pagi = document.querySelector("#paginate");
  let html = `<div>
    <button ${paginate.nextPage ? "" : "disabled"} id="next">Next Page</button>
    <button ${
      paginate.previousPage ? "" : "disabled"
    } id="previous">Previus Page </button>
    </div>`;
  pagi.innerHTML = html;
};

export const RegisterPaginateEvent = () => {
  const next = document.querySelector("#next");
  const previous = document.querySelector("#previous");
  next.addEventListener("click", handleNext);
  previous.addEventListener("click", handlePrevious);
};
