const booksApi = "https://gutendex.com/books/";
const getBooks = async () => {
  const response = await fetch(booksApi);
  const data = await response.json();
  const books = data.results;
  return books;
};

export default getBooks;
