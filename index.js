import loader from "../lib/loader.js";
import { BooksLocal } from "./lib/books.js";

import BookDesign from "./lib/bookTemplate.js";
import { RegisterPaginateEvent, RenderPaginate } from "./lib/RenderPaginate.js";

let page;
let result;
let booksdata = result?.results;
let filteredBooks;
let isloading = false;
let url = "https://gutendex.com/books";

let filter = localStorage.getItem("filter");
let topic = localStorage.getItem("topic");

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
    book =
      JSON.parse(localStorage.getItem("wishlist")) &&
      JSON.parse(localStorage.getItem("wishlist")).find(
        (item) => item.id == Number(bookId)
      );
    if (!book) {
      let hash = document.location.hash;
      let first = hash.split("/")[1];

      loader(document.getElementById("content"), true);
      let response = await Getdata(`https://gutendex.com/books/${first}`);
      book = response;
    }

  }

  console.log({ book });
  content.innerHTML = `<div>
  
   <header>
    <navbar>
     <nav>
        <a href="#">Home</a>
        <a href="#wishlist">Wishlist</a>
      </nav>
      <div class="wishcounter">
        <span class="mdi--heart"></span>
        <span class="count">0</span>
      </div>
      
    </navbar>
    <div>Book Details</div>
  </header>
  <div class="section-book-details">
      <div class="book-image">
          <img src="${book.formats["image/jpeg"]}" alt="book cover" />
      </div>
        <div class="book-details-area"> 
            <div class="space-y-16"></div>
            <div class="book-description">
                <div class="book-title book-title-font">${book.title}</div>
                <div class="book-author">By, ${book.authors[0].name}</div>
                <div class="book-description-text">
                   <div>Bookshelves</div>
                   <div>${book.bookshelves.join(", ")}</div>
                   <div>Languages</div>
                   <div>${book.languages.join(", ")}</div>
                   <div>Subjects</div>
                   <div>${book.subjects.join(", ")}</div>
                   <div>Copyright</div>
                   <div>${book.copyright ? "Yes" : "No"}</div>
                   <div>Media Type</div>
                   <div>${book.media_type}</div>
                   <div>Download Count</div>
                   <div>${book.download_count}</div>
                </div>
            </div>
        </div>
  </div>

  </div>
  `;

  toggleCount();
}

async function homepage() {
  let content = document.getElementById("content");
  let html = `<div>
      <header>
       <navbar>
        <nav>
          <a href="#">Home</a>
          <a href="#wishlist">Wishlist</a>
        </nav>
        <div class="wishcounter">
          <span class="mdi--heart"></span>
          <span class="count">0</span>
        </div>
       </navbar>
        <div>Book List</div>


      </header>
      
        
        <div class="filterArea">
        <div>
                <select name="topic" id="topic">
                    <option value="all">All</option>
                    <option value="History">History</option>
                    <option value="Drama">Drama</option>
                    <option value="Culture">Culture</option>
                    <option value="Biographies">Biographies</option>
                    <option value="Literature">Literature</option>
                  </select>
                    <input id="filter" placeholder="Book Title" />
        </div>
        <div class="paginate-area">
           
              <div id="paginate"></div>
        </div>
    </div>

    
      
    
      <div id="book-list"></div>
  </div>`;
  content.innerHTML = html;

  document.getElementById("filter").addEventListener("keyup", (event) => {
    let title = event.target.value;
    localStorage.setItem("filter", title);
    filter = title;
    doFilter();
    // RenderBooks(filteredBooks);
  });
  document.getElementById("topic").addEventListener("change", async (event) => {
    let title = event.target.value;
    localStorage.setItem("topic", title);
    topic = title;

    doFilter();

    // RenderBooks(filteredBooks);
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

  if (topic) {
    document.getElementById("topic").value = topic;
    if (topic === "all" || topic === null) {
      filteredBooks = booksdata;
      // RenderBooks(booksdata);
      // return;
    } else {
      filteredBooks = booksdata.filter((item) => {
        return item.bookshelves.join(",").includes(topic);
      });
    }
  }
  if (filter) {
    document.getElementById("filter").value = filter;
    filteredBooks = booksdata.filter((item) =>
      item.title.toLowerCase().includes(filter.toLowerCase())
    );
    console.log("filtered books", filteredBooks);

    // RenderBooks(filteredBooks);
  }

  RenderBooks(filteredBooks);
  toggleCount();

  RenderPaginate(result);
  RegisterPaginateEvent();
}

async function wishlist() {
  let content = document.getElementById("content");
  content.innerHTML = `<div>
 
   <header>
    <navbar>
     <nav>
        <a href="#">Home</a>
        <a href="#wishlist">Wishlist</a>
      </nav>
      <div class="wishcounter">
        <span class="mdi--heart"></span>
        <span class="count">0</span>
      </div>
      
    </navbar>
    <div>Wish List</div>
  </header>
  

  <div id="book-list"></div>
  </div>`;

  let books = JSON.parse(localStorage.getItem("wishlist"));

  if (!books || books.length === 0) {
    document.getElementById(
      "book-list"
    ).innerHTML = `<div>No books in wishlist</div>`;
    return;
  }

  toggleCount();
  console.log({ books });
  RenderBooks(books, true);
  // if (!result) {
  //   loader(document.getElementById("book-list"), true);
  //   result = await Getdata("https://gutendex.com/books");
  // }
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
  // isloading = false;
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

async function doFilter() {
  try {
    // console.log("filter called", topic, filter);
    filter = document.getElementById("filter").value;
    topic = document.getElementById("topic").value;

    // check by topic
    let filteredByTopic;
    if (topic === "all") {
      filteredBooks = booksdata;
      filteredByTopic = booksdata;
    } else {
      filteredBooks = booksdata.filter((item) => {
        return item.bookshelves.join(",").includes(topic);
      });
      filteredByTopic = filteredBooks;
      filteredBooks = filteredBooks;
    }
    console.log("filtered by topic", filteredByTopic);

    // check by filter

    if (filter == "") {
      filteredBooks = filteredByTopic;
    } else {
      filteredBooks = filteredBooks.filter((item) =>
        item.title.toLowerCase().includes(filter.toLowerCase())
      );
    }

    console.log("filtered books", filteredBooks);

    RenderBooks(filteredBooks);
  } catch (error) {
    console.log(error.message);
  }
}
