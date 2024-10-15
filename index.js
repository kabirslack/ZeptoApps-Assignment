import getBooks from "../lib/getBooks.js";
import bookTemplate from "../lib/bookTemplate.js";
import loader from "../lib/loader.js";
import { BooksLocal } from "./lib/books.js";
import DisplayWishlist from "./lib/displayWishlist.js";
export const books = [];
const main = async () => {
  try {
    const input = document.getElementById("search-input");
    const bookList = document.getElementById("book-list");

    loader(bookList, true);
    const booksAll = BooksLocal.results;
    loader(bookList, false);
    books.push(...booksAll);

    input.addEventListener("keyup", (e) => {
      let filteredBooks = books.filter((book) => {
        return book.title.toLowerCase().includes(e.target.value.toLowerCase());
      });
      console.log(filteredBooks);
      render(bookList, filteredBooks);
    });

    render(bookList, books);
  } catch (error) {
  } finally {
    DisplayWishlist();
  }
};

main();

function render(location, books) {
  console.log("render called");
  location.innerHTML = "";
  books.forEach((book) => {
    let html = bookTemplate(book);
    location.innerHTML += html;
  });
}
