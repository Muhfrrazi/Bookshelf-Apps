document.addEventListener("DOMContentLoaded", () => {
  const submitForm = document.getElementById("inputBook");

  submitForm.addEventListener("submit", (btn) => {
    btn.preventDefault();
    addBook();
  });
  if (isStorage()) {
    loadBooksFromStorage();
  }
  const submitSearch = document.getElementById("searchBook");

  submitSearch.addEventListener("submit", (btn) => {
    btn.preventDefault();
    searchBooks();
  });
});
document.addEventListener("ondatasaved", () => {
  console.log("Data berhasil disimpan.");
});

document.addEventListener("ondataloaded", () => {
  refreshBookFromBooks();
});
