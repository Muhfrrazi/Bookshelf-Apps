let books = [];
const STORAGE_KEY = "BOOK_APPS";

const isStorage = () => {
  if (typeof Storage === undefined) {
    alert("Browser kamu tidak mendukung local storage");
    return false;
  }
  return true;
};
const findBook = (bookId) => {
  for (book of books) {
    if (book.id === bookId) return book;
  }
  return null;
};
function findBookIndex(bookId) {
  let index = 0;
  for (book of books) {
    if (book.id === bookId) return index;
    index++;
  }
  return -1;
}
const saveBooks = () => {
  const parsed = JSON.stringify(books);
  localStorage.setItem(STORAGE_KEY, parsed);
  document.dispatchEvent(new Event("ondatasaved"));
};
const loadBooksFromStorage = () => {
  const getBooks = localStorage.getItem(STORAGE_KEY);

  let data = JSON.parse(getBooks);

  if (data !== null) {
    books = data;
  }
  document.dispatchEvent(new Event("ondataloaded"));
};
const updateBooksToStorage = () => {
  if (isStorage()) {
    saveBooks();
  }
};
const composeBookObject = (title, author, year, isBookComplete) => {
  return {
    id: +new Date(),
    title,
    author,
    year,
    isBookComplete,
  };
};
const refreshBookFromBooks = () => {
  const incompleteBooksList = document.getElementById(INCOMPLETE_BOOKS_LIST);
  const completeBooksList = document.getElementById(COMPLETE_BOOKS_LIST);

  for (book of books) {
    const newBook = makeBook(book.title, book.author, book.year, book.isBookComplete);
    newBook[BOOK_ITEMID] = book.id;

    if (book.isBookComplete) {
      completeBooksList.append(newBook);
    } else {
      incompleteBooksList.append(newBook);
    }
  }
};
