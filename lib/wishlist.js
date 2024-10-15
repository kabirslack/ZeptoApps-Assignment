import DisplayWishlist from "./displayWishlist.js";

export const getWishlist = () => {
  const localwish = JSON.parse(localStorage.getItem("wishlist")) || [];
  return localwish;
};

export const wishlist = getWishlist() || [];

export const toggleWishlist = (book) => {
  try {
    console.log({ wishlist });
    const index = wishlist.indexOf(book);
    if (index > -1) {
      wishlist.splice(index, 1);
      console.log(`${book} has been removed from your wishlist.`);
    } else {
      wishlist.push(book);
      console.log(`${book} has been added to your wishlist.`);
    }
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  } catch (error) {
    console.log(error.message);
  } finally {
    console.log("finally");
    DisplayWishlist();
  }
};
