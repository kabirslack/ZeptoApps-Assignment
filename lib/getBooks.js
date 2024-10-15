const getBooks = async () => {
  const booksApi = "https://gutendex.com/books";
  console.log("fetch called")
  const response = await fetch(booksApi);
  const data = await response.json();
  const books = data.results;
  return books;
};

export default getBooks;
