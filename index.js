// import bookTemplate from "../lib/bookTemplate.js";
import loader from "../lib/loader.js";
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

// export function handleNext() {
//   console.log("handle next called");
//   main(paginate.nextPage);
// }

// export function handlePrevious() {
//   console.log("handle previous called");
//   main(paginate.previousPage);
// }
let page;
let result;
const main = async () => {
  const hash = window.location.hash;
  console.log(hash);
  route(hash);
  Render(page);
};
window.addEventListener("load", main);
window.addEventListener("hashchange", () => {
  const hash = window.location.hash;
  console.log(hash);
  route(hash);
  Render(page);
});

function route(hash) {
  switch (hash) {
    case "":
      page = homepage();
      break;
    case "#":
      page = homepage();
      break;
    case "#wishlist":
      page = wishlist();
      break;
    default:
      page = notFound();
      break;
  }
}

/** Pages */

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
      
      <div id="book-list"></div>
  </div>`;
  content.innerHTML = html;
  // filter
  let booksdata;
  let filteredBooks;
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
  result = await Getdata("https://gutendex.com/books");
  loader(document.getElementById("book-list"), false);

  booksdata = result.results;
  filteredBooks = booksdata;
  let hash = window.location.hash;
  if (hash === "") {
    RenderBooks(booksdata);
  }
  toggleCount();
}

function wishlist() {
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
  toggleCount();

  let books = JSON.parse(localStorage.getItem("wishlist"));
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
  const response = await fetch(url);
  const data = await response.json();
  return data;
}

function toggleCount() {
  document.querySelector(".count").textContent = JSON.parse(
    localStorage.getItem("wishlist")
  ).length;
}

function RenderBooks(booksdata, remove = false) {
  const books = booksdata
    .map(
      (item) =>
        `<div>${item.title} 
      <button type="button" bookid= ${item.id} id="wishlist-btn${
          remove ? "-remove" : ""
        }">${remove? "Remove": "Add to Wishlist"}</button>
        </div>`
    )
    .join("");
  document.getElementById("book-list").innerHTML = books;
}

function toggleWishlist(book) {
  let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
  let isExist = wishlist.find((item) => {
    console.log({ item });
    console.log({ book: book[0].id });
    return item.id == book[0].id;
  });

  if (isExist) {
    wishlist = wishlist.filter((item) => item.id != book[0].id);
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
    toggleCount();
    return;
  } else {
    localStorage.setItem("wishlist", JSON.stringify([...wishlist, ...book]));
    toggleCount();
  }
}

/** Events */
window.addEventListener("click", (event) => {
  if (event.target.id == "wishlist-btn") {
    let btnBookId = event.target.getAttribute("bookid");
    let books = result.results;
    let book = books.filter((item) => Number(item.id) == Number(btnBookId));
    toggleWishlist(book);
  } else if (event.target.id == "wishlist-btn-remove") {
    let btnBookId = event.target.getAttribute("bookid");
    let books = JSON.parse(localStorage.getItem("wishlist")).filter(
      (item) => item.id != btnBookId
    );
    localStorage.setItem("wishlist", JSON.stringify(books));
    toggleCount();
    RenderBooks(books, true);
  }
});
