import bookTemplate from "../lib/bookTemplate.js";
import loader from "../lib/loader.js";
import { BooksLocal } from "./lib/books.js";
import DisplayWishlist from "./lib/displayWishlist.js";
import getBooks from "./lib/getBooks.js";
import { RegisterPaginateEvent, RenderPaginate } from "./lib/RenderPaginate.js";
export const books = [];
const paginate = {
  nextPage: "https://gutendex.com/books",
  previousPage: null,
};
export const main = async (url) => {
  try {
    const input = document.getElementById("search-input");
    const bookList = document.getElementById("book-list");

    loader(bookList, true);
    // const booksAll = BooksLocal.results;
    console.log("get books now");
    // const booksAll = await getBooks;

    const response = await fetch(url);
    const data = await response.json();
    const booksAll = data.results;
    paginate.nextPage = data.next;
    paginate.previousPage = data.previous;

    loader(bookList, false);
    books.length=0;
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
    console.log(error.message);
  } finally {
    DisplayWishlist();
    RenderPaginate(paginate);
    RegisterPaginateEvent();
  }
};

main(paginate.nextPage);

export function render(location, books) {
  console.log("render called");
  location.innerHTML = "";
  books.forEach((book) => {
    let html = bookTemplate(book);
    location.innerHTML += html;
  });
}

export function handleNext() {
  console.log("handle next called");
  main(paginate.nextPage);
}

export function handlePrevious() {
  console.log("handle previous called");
  main(paginate.previousPage);
}
