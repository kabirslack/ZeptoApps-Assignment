export const getWishlist = () => {
  const localwish = localStorage.getItem("wishlist") || [];
  return localwish;
};
export const toggleWishlist = (id) => {
  const wishlist = getWishlist();
  console.log(wishlist);
  if (wishlist && wishlist.includes(id)) {
    console.log("wish");
  } else {
    wishlist.push(id);
    localStorage.setItem("wishlist", wishlist);
  }
};
