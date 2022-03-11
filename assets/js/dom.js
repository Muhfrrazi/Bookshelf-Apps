const BOOK_ITEMID = "itemId";
const INCOMPLETE_BOOKS_LIST = "incompleteBookshelfList";
const COMPLETE_BOOKS_LIST = "completeBookshelfList";

const makeBook = (judulBuku, penulisBuku, tahunBuku, isBookComplete) => {
  const teksJudul = document.createElement("h3");
  teksJudul.innerText = judulBuku;

  const teksPenulis = document.createElement("p");
  teksPenulis.innerText = "Penulis: " + penulisBuku;

  const teksTahun = document.createElement("p");
  teksTahun.innerText = "Tahun: " + tahunBuku;

  const textContainer = document.createElement("ARTICLE");
  textContainer.classList.add("book_item");
  textContainer.append(teksJudul, teksPenulis, teksTahun);

  const buttonContainer = document.createElement("div");
  buttonContainer.classList.add("action");

  if (isBookComplete) {
    buttonContainer.append(createNotFinishedButton("Belum Selesai Dibaca"), createDeleteButton("Hapus Buku"));
  } else {
    buttonContainer.append(createFinishedButton("Selesai Dibaca"), createDeleteButton("Hapus Buku"));
  }

  textContainer.append(buttonContainer);

  return textContainer;
};
const addBook = () => {
  const incompleteBooksList = document.getElementById(INCOMPLETE_BOOKS_LIST);
  const completeBooksList = document.getElementById(COMPLETE_BOOKS_LIST);

  const judulBuku = document.getElementById("inputBookTitle").value;
  const penulisBuku = document.getElementById("inputBookAuthor").value;
  const tahunBuku = document.getElementById("inputBookYear").value;
  const checkboxValue = document.querySelector("#inputBookIsComplete").checked;

  const bookCreated = makeBook(judulBuku, penulisBuku, tahunBuku, checkboxValue);
  const bookObject = composeBookObject(judulBuku, penulisBuku, tahunBuku, checkboxValue);
  bookCreated[BOOK_ITEMID] = bookObject.id;
  books.push(bookObject);

  Swal.fire({
    title: "Yeaay!",
    text: "Buku berhasil ditambahkan",
    icon: "success",
    confirmButtonText: "Cool",
  });
  if (checkboxValue) {
    completeBooksList.append(bookCreated);
    updateBooksToStorage();
  } else {
    incompleteBooksList.append(bookCreated);
    updateBooksToStorage();
  }
};
const addBookToFinished = (book) => {
  const title = book.querySelector(".book_item > h3").innerText;
  const author = book.querySelectorAll(".book_item > p")[0].innerText.slice(8);
  const year = book.querySelectorAll(".book_item > p")[1].innerText.slice(7);

  const newBook = makeBook(title, author, year, true);
  const bookFound = findBook(book[BOOK_ITEMID]);
  bookFound.isBookComplete = true;
  newBook[BOOK_ITEMID] = bookFound.id;

  const completeBooksList = document.getElementById(COMPLETE_BOOKS_LIST);
  completeBooksList.append(newBook);
  book.remove();

  updateBooksToStorage();
};
const addBookToUnfinished = (book) => {
  const title = book.querySelector(".book_item > h3").innerText;
  const author = book.querySelectorAll(".book_item > p")[0].innerText.slice(8);
  const year = book.querySelectorAll(".book_item > p")[1].innerText.slice(7);

  const newBook = makeBook(title, author, year, false);
  const bookFound = findBook(book[BOOK_ITEMID]);
  bookFound.isBookComplete = false;
  newBook[BOOK_ITEMID] = bookFound.id;

  const incompleteBooksList = document.getElementById(INCOMPLETE_BOOKS_LIST);
  incompleteBooksList.append(newBook);
  book.remove();
  updateBooksToStorage();
};
const removeBook = (book) => {
  const bookPosition = findBookIndex(book[BOOK_ITEMID]);
  books.splice(bookPosition, 1);
  book.remove();
  updateBooksToStorage();
};
const createButton = (buttonTypeClass, eventListener, text) => {
  const button = document.createElement("button");
  button.innerText = text;
  button.classList.add(buttonTypeClass);

  button.addEventListener("click", (btn) => {
    eventListener(btn);
  });

  return button;
};
const createNotFinishedButton = (text) => {
  return createButton(
    "green",
    (btn) => {
      addBookToUnfinished(btn.target.parentElement.parentElement);
    },
    text
  );
};
const createFinishedButton = (text) => {
  return createButton(
    "green",
    (btn) => {
      addBookToFinished(btn.target.parentElement.parentElement);
    },
    text
  );
};
const createDeleteButton = (text) => {
  return createButton(
    "red",
    (btn) => {
      const message = Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire("Deleted!", "Your file has been deleted.", "success");
          removeBook(btn.target.parentElement.parentElement);
        }
      });
    },
    text
  );
};
const searchBooks = () => {
  const searchValue = document.getElementById("searchBookTitle").value;
  const incompleteBooksList = document.getElementById(INCOMPLETE_BOOKS_LIST);
  const completeBooksList = document.getElementById(COMPLETE_BOOKS_LIST);
  const previousBooks = document.querySelectorAll(".book_item");

  if (searchValue) {
    for (previousBook of previousBooks) {
      previousBook.remove();
    }

    const filteredBooks = books.filter((book) => book.title.toLowerCase().includes(searchValue.toLowerCase()));

    for (book of filteredBooks) {
      const newBook = makeBook(book.title, book.author, book.year, book.isBookComplete);
      newBook[BOOK_ITEMID] = book.id;

      if (book.isBookComplete) {
        completeBooksList.append(newBook);
      } else {
        incompleteBooksList.append(newBook);
      }
    }
  } else {
    for (previousBook of previousBooks) {
      previousBook.remove();
    }
    loadBooksFromStorage();
  }

  return books;
};
