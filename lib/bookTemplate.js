const authors = (authors) => {
  let names = authors.map((author) => author.name);
  return names;
};

const CheckWishlist = (book) => {
  let isExist = wishlist?.find((item) => {
    return Number(item.id) == Number(book.id);
  });
  return true;
};

const BookDesign = (book, details = false) => {
  let wishlist = JSON.parse(localStorage.getItem("wishlist"));
  let hash = window.location.hash;
  let exist = wishlist?.find((item) => Number(item.id) == Number(book.id))
    ? true
    : false;
  return `<Card id="book${book.id}">
    <button class="favorite-btn ${exist ? "green" : ""}" id="wishlist-btn${
    hash == "#wishlist" ? "-remove" : ""
  }" bookid="${book.id}"><span class="mdi--heart"></span></button>
     <div class="book-cover">
      <div class="book-title-mobile">
           <div class="book-title-font">${book?.title}</div>
           <div>Authors:By ${authors(book?.authors)}</div>
      </div>
     <a href="/#book/${book.id}"><img src="${
    book?.formats["image/jpeg"]
  }" alt="book cover"/></a>
     </div>
    <div class="book-details">
       <div>${book?.title}</div>
      ${
        details
          ? ` <div>Authors: ${authors(book?.authors)}</div>
       <div>Gener</div>
       <div>Id: ${book?.id}</div>`
          : ``
      }
    </div>
   </Card>`;
};

export default BookDesign;
