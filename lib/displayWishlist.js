import { wishlist } from "./wishlist.js";
import { books } from "../index.js";

const DisplayWishlist = () => {
  try {
    let wishBooks = books
      .map((item) => (wishlist.includes(item.id) ? item : null))
      .filter((item) => item !== null);
    let wishlistDiv = document.querySelector("#wishlist");
    wishlistDiv.innerHTML = "";
    let html = wishBooks.map((book) => {
      return `<div>${book.title}</div>`;
    });
    wishlistDiv.innerHTML = html;
  } catch (error) {}
};

export default DisplayWishlist;
