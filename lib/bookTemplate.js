import { wishlist } from "./wishlist.js";

const authors = (authors) => {
  let names = authors.map((author) => author.name);
  return names;
};

const icon = `<svg
      xmlns="http://www.w3.org/2000/svg"
      width="2em"
      height="2em"
      viewBox="0 0 24 24"
    >
      <path
        fill="black"
        d="m12 19.654l-.758-.685q-2.448-2.236-4.05-3.828q-1.601-1.593-2.528-2.81t-1.296-2.2T3 8.15q0-1.908 1.296-3.204T7.5 3.65q1.32 0 2.475.675T12 6.289Q12.87 5 14.025 4.325T16.5 3.65q1.908 0 3.204 1.296T21 8.15q0 .996-.368 1.98q-.369.986-1.296 2.202t-2.519 2.809q-1.592 1.592-4.06 3.828z"
      />
    </svg>`;
const icon1 = `<svg
      xmlns="http://www.w3.org/2000/svg"
      width="2em"
      height="2em"
      viewBox="0 0 24 24"
    >
      <path
        fill="red"
        d="m12 19.654l-.758-.685q-2.448-2.236-4.05-3.828q-1.601-1.593-2.528-2.81t-1.296-2.2T3 8.15q0-1.908 1.296-3.204T7.5 3.65q1.32 0 2.475.675T12 6.289Q12.87 5 14.025 4.325T16.5 3.65q1.908 0 3.204 1.296T21 8.15q0 .996-.368 1.98q-.369.986-1.296 2.202t-2.519 2.809q-1.592 1.592-4.06 3.828z"
      />
    </svg>`;

const BookDesign = (book) => `<Card>
    <button class="favorite-btn" id="wishlist-btn" bookid="${book.id}">${
  wishlist.filter((item) => item.id == book.id).length > 0 ? icon1 : icon
}</button>
     <div class="book-cover">
     <a href="/#book/${book.id}"><img src="${
  book?.formats["image/jpeg"]
}" alt="book cover"/></a>
     </div>
    <div class="book-details">
       <div>${book?.title}</div>
       <div>${authors(book?.authors)}</div>
       <div>Gener</div>
       <div>Id</div>
    </div>
   </Card>`;

export default BookDesign;
