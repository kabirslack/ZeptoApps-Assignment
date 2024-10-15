import getBooks from "../lib/getBooks.js";
import bookTemplate from "../lib/bookTemplate.js";
import loader from "../lib/loader.js";
import { BooksLocal } from "./lib/books.js";
const books = [];
const main = async () => {
  const input = document.getElementById("search-input");
  const bookList = document.getElementById("book-list");


  loader(bookList, true);
  //   const booksAll = await getBooks();
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
