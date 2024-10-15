import { wishlist } from "./wishlist.js";
import { books } from "../index.js";

const DisplayWishlist = () => {
  try {
    let wishBooks = books
      .map((item) => (wishlist.includes(item.id) ? item : null))
      .filter((item) => item !== null);

    let wishlistDiv = document.querySelector("#wishlist");
    wishlistDiv.innerHTML = "";
    wishlistDiv.innerHTML = `
      <ul class="wishlist-container">
        ${wishBooks.map((item) => `<li>${item.title}</li>`).join("")}
      </ul>
    `;
  } catch (error) {
    console.error("Error displaying wishlist:", error);
  }
};

export default DisplayWishlist;
