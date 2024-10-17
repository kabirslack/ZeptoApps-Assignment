import loader from "../lib/loader.js";
import { BooksLocal } from "./lib/books.js";
import BookDesign from "./lib/bookTemplate.js";
import { RegisterPaginateEvent, RenderPaginate } from "./lib/RenderPaginate.js";
// import { BooksLocal } from "./lib/books.js";
// import DisplayWishlist from "./lib/displayWishlist.js";
// import getBooks from "./lib/getBooks.js";
// import { RegisterPaginateEvent, RenderPaginate } from "./lib/RenderPaginate.js";
// export const books = [];
// const paginate = {
//   nextPage: "https://gutendex.com/books",
//   previousPage: null,
// };
// export const main = async (url) => {
//   try {
//     const input = document.getElementById("search-input");
//     const bookList = document.getElementById("book-list");

//     loader(bookList, true);
//     // const booksAll = BooksLocal.results;
//     console.log("get books now");
//     // const booksAll = await getBooks;

//     const response = await fetch(url);
//     const data = await response.json();
//     const booksAll = data.results;
//     paginate.nextPage = data.next;
//     paginate.previousPage = data.previous;

//     loader(bookList, false);
//     books.length=0;
//     books.push(...booksAll);

//     input.addEventListener("keyup", (e) => {
//       let filteredBooks = books.filter((book) => {
//         return book.title.toLowerCase().includes(e.target.value.toLowerCase());
//       });
//       console.log(filteredBooks);
//       render(bookList, filteredBooks);
//     });

//     render(bookList, books);
//   } catch (error) {
//     console.log(error.message);
//   } finally {
//     DisplayWishlist();
//     RenderPaginate(paginate);
//     RegisterPaginateEvent();
//   }
// };

// main(paginate.nextPage);

// export function render(location, books) {
//   console.log("render called");
//   location.innerHTML = "";
//   books.forEach((book) => {
//     let html = bookTemplate(book);
//     location.innerHTML += html;
//   });
// }

let page;
let result;
let booksdata = result?.results;
let filteredBooks;
let isloading = false;
let url = "https://gutendex.com/books";

export async function handleNext() {
  console.log("handle next called");
  loader(document.getElementById("book-list"), true);
  result = await Getdata(result.next);
  booksdata = result.results;
  filteredBooks = booksdata;
  RenderBooks(result?.results);
  RenderPaginate(result);
  RegisterPaginateEvent();
}

export async function handlePrevious() {
  console.log("handle previous called");
  loader(document.getElementById("book-list"), true);
  result = await Getdata(result.previous);
  booksdata = result.results;
  filteredBooks = booksdata;
  RenderBooks(result?.results);
  RenderPaginate(result);
  RegisterPaginateEvent();
}

/** Main */

const main = async () => {
  const hash = window.location.hash;
  route(hash);
  Render(page);
};
window.addEventListener("load", main);
window.addEventListener("hashchange", () => {
  const hash = window.location.hash;
  route(hash);
  Render(page);
});

function route(hash) {
  switch (true) {
    case hash === "" || hash === "#":
      page = homepage();
      break;
    case hash === "#wishlist":
      page = wishlist();
      break;
    case hash.startsWith("#book/"):
      const bookId = hash.split("/")[1];
      page = book(bookId);
      break;
    default:
      page = notFound();
      break;
  }
}

/** Pages */

async function book(bookId) {
  let content = document.getElementById("content");
  let book;
  book = result?.results?.find((item) => item.id == bookId);
  if (!book) {
    book = JSON.parse(localStorage.getItem("wishlist")).find(
      (item) => item.id == Number(bookId)
    );
    if (!book) {
      let hash = document.location.hash;
      let first = hash.split("/")[1];
      // location.href = `/#book/${first}`;
      // console.log(first)
      let response = await Getdata(`https://gutendex.com/books/${first}`);
      book = response;
    }
    // if (!books) {
    //   location.href = "/";
    //   return;
    // }
    // books = books[0];
    // console.log({book})
  }
  // console.log({ book });
  // let loop = [];
  // books?.forEach((book) => {
  //   loop.push(BookDesign(book));
  // });
  // console.log({ book });
  content.innerHTML = `<div class="book-details-single">
  <header>
        <nav>
          <a href="#">Home</a>
          <a href="#wishlist">Wishlist</a>
        </nav>
        <div class="wishcounter">
          <span class="mdi--heart"></span>
          <span class="count">0</span>
        </div>
      </header>
      <div>Welcome to Book Details Page</div>
    <h1>Book Details</h1>
    ${book ? BookDesign(book) : ""}
  </div>`;

  toggleCount();
}

async function homepage() {
  let content = document.getElementById("content");
  let html = `<div>
      <header>
        <nav>
          <a href="#">Home</a>
          <a href="#wishlist">Wishlist</a>
        </nav>
        <div class="wishcounter">
          <span class="mdi--heart"></span>
          <span class="count">0</span>
        </div>
      </header>
      <div>Welcome to Home Page</div>
      <div>
        <label for="topic">Filter by topic:</label>
        <select name="topic" id="topic">
          <option value="all">All</option>
          <option value="History">History</option>
          <option value="Drama">Drama</option>
          <option value="Culture">Culture</option>
          <option value="Biographies">Biographies</option>
          <option value="Literature">Literature</option>
        </select>
      </div>
      <input id="filter" placeholder="Book Title" />
        <div>Paginate<div>
        <div id="paginate"></div>
      <div id="book-list"></div>
  </div>`;
  content.innerHTML = html;
  // filter

  document.getElementById("filter").addEventListener("keyup", (event) => {
    let title = event.target.value;
    if (filteredBooks) {
      let book = filteredBooks.filter((item) =>
        item.title.toLowerCase().includes(title.toLowerCase())
      );
      RenderBooks(book);
    }
  });
  document.getElementById("topic").addEventListener("change", async (event) => {
    let topic = event.target.value;
    if (topic === "all") {
      RenderBooks(booksdata);
      return;
    }
    filteredBooks = booksdata.filter((item) => {
      return item.bookshelves.join(",").includes(topic);
    });

    RenderBooks(filteredBooks);
  });

  loader(document.getElementById("book-list"), true);
  if (result?.results?.length > 0) {
  } else {
    result = await Getdata(url || "https://gutendex.com/books");
  }
  loader(document.getElementById("book-list"), false);

  booksdata = result.results;
  filteredBooks = booksdata;
  let hash = window.location.hash;
  if (hash === "") {
    RenderBooks(result?.results);
  }
  toggleCount();

  RenderPaginate(result);
  RegisterPaginateEvent();
}

async function wishlist() {
  let content = document.getElementById("content");
  content.innerHTML = `<div>
   <header>
    <nav>
      <a href="#">Home</a>
      <a href="#wishlist">Wishlist</a>

    </nav>
    <div class="wishcounter">
      <span class="mdi--heart"></span>
      <span class="count">0</span>
    </div>
  </header>
  <div>Welcome to Wishlist Page</div>

  <div id="book-list"></div>
  </div>`;

  let books = JSON.parse(localStorage.getItem("wishlist"));

  if (!books || books.length === 0) {
    loader(document.getElementById("book-list"), false);
    location.href = "/";
    return;
  }
  if (!result) {
    loader(document.getElementById("book-list"), true);
    result = await Getdata("https://gutendex.com/books");
  }
  toggleCount();

  RenderBooks(books, true);
}

function notFound() {
  return `<div>Page Not Found</div>`;
}

/** Controllers */

async function Render(page) {
  // let content = document.getElementById("content");
  // content.insertAdjacentHTML = await page;
}

/** Utilz */

async function Getdata(url) {
  isloading = true;

  let next = document.querySelector("#next");
  let previous = document.querySelector("#previous");
  if (next) {
    next.disabled = true;
    previous.disabled = true;
  }

  const response = await fetch(url);
  const data = await response.json();
  isloading = false;
  // document.querySelector("#next").disabled=false;
  // document.querySelector("#previous").disabled=false;
  return data;
  // return BooksLocal;
}

function toggleCount() {
  document.querySelector(".count").textContent = JSON.parse(
    localStorage.getItem("wishlist")
  )?.length;
}

function RenderBooks(booksdata, remove = false) {
  const books = booksdata?.map((item) => BookDesign(item)).join("");
  let area = document.getElementById("book-list");
  if (area) {
    area.innerHTML = books;
  }

  let wishBtn = document.querySelectorAll("#wishlist-btn");
  let wishBtnremove = document.querySelectorAll("#wishlist-btn-remove");
  wishBtn.forEach((item) => {
    item.addEventListener("click", (event) => {
      // console.log(event.currentTarget);
      if (event.currentTarget.id == "wishlist-btn") {
        let mydiv = event.currentTarget;
        let btnBookId = event.currentTarget.getAttribute("bookid");
        let books = result.results;
        let book = books.filter((item) => Number(item.id) == Number(btnBookId));
        toggleWishlist(book, mydiv);
      }
    });
  });

  wishBtnremove.forEach((item) => {
    item.addEventListener("click", (event) => {
      if (event.currentTarget.id == "wishlist-btn-remove") {
        let btnBookId = event.currentTarget.getAttribute("bookid");
        let books = JSON.parse(localStorage.getItem("wishlist")).filter(
          (item) => item.id != btnBookId
        );
        localStorage.setItem("wishlist", JSON.stringify(books));

        toggleCount();
        // RenderBooks(books, true);
        let mydiv = document.getElementById(`book${btnBookId}`);
        mydiv.classList.add("fade-out");
        mydiv.addEventListener("transitionend", function () {
          mydiv.remove();
        });
      }
    });
  });
}

export function toggleWishlist(book, mydiv) {
  console.log({ book });
  let hash = window.location.hash;

  let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
  let isExist = wishlist.find((item) => {
    return item.id == book[0].id;
  });
  console.log({ isExist });
  if (isExist) {
    wishlist = wishlist.filter((item) => item.id != book[0].id);
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
    toggleCount();
    if (hash == "#wishlist") {
      let elem = document.querySelector(`#book${book[0].id}`);
      elem.classList.add("fade-out");
      elem.addEventListener("transitionend", function () {
        elem.remove();
      });
    }

    mydiv.classList.remove("green");
    return;
  } else {
    mydiv.classList.add("green");
    localStorage.setItem("wishlist", JSON.stringify([...wishlist, ...book]));
    toggleCount();
  }
}

/** Events */
