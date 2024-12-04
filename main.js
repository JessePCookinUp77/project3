// Do your work here...
const books = [];
const RENDER_EVENT = "render-book";
const SAVED_EVENT = "saved-book";
const STORAGE_KEY = "BOOKSHELF_APPS";

// Generate unique ID for each book
function generateId() {
  return +new Date();
}

// Create book object
function generateBookObject(id, title, author, year, isComplete) {
  return { id, title, author, year, isComplete };
}

// Save to local storage
function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

// Load books from local storage
function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  if (serializedData) {
    const data = JSON.parse(serializedData);
    for (const book of data) {
      books.push(book);
    }
  }
}

// Check if local storage is available
function isStorageExist() {
  if (typeof Storage === "undefined") {
    alert("Browser kamu tidak mendukung local storage!");
    return false;
  }
  return true;
}

// Create book element in DOM
function createBookElement(bookObject) {
  const { id, title, author, year, isComplete } = bookObject;

  const bookContainer = document.createElement("div");
  bookContainer.classList.add("book-item");
  bookContainer.setAttribute("data-bookid", id);
  bookContainer.setAttribute("data-testid", "bookItem");

  const bookTitle = document.createElement("h3");
  bookTitle.textContent = title;
  bookTitle.setAttribute("data-testid", "bookItemTitle");

  const bookAuthor = document.createElement("p");
  bookAuthor.textContent = `Penulis: ${author}`;
  bookAuthor.setAttribute("data-testid", "bookItemAuthor");

  const bookYear = document.createElement("p");
  bookYear.textContent = `Tahun: ${year}`;
  bookYear.setAttribute("data-testid", "bookItemYear");

  const buttonContainer = document.createElement("div");

  const toggleButton = document.createElement("button");
  toggleButton.textContent = isComplete
    ? "Belum selesai dibaca"
    : "Selesai dibaca";
  toggleButton.setAttribute("data-testid", "bookItemIsCompleteButton");
  toggleButton.addEventListener("click", () => toggleBookStatus(id));

  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Hapus Buku";
  deleteButton.setAttribute("data-testid", "bookItemDeleteButton");
  deleteButton.addEventListener("click", () => removeBook(id));

  const editButton = document.createElement("button");
  editButton.textContent = "Edit Buku";
  editButton.setAttribute("data-testid", "bookItemEditButton");
  editButton.addEventListener("click", () => editBook(id));

  buttonContainer.append(toggleButton, deleteButton, editButton);

  bookContainer.append(bookTitle, bookAuthor, bookYear, buttonContainer);

  return bookContainer;
}

// Add a new book
function addBook() {
  const title = document.getElementById("bookFormTitle").value;
  const author = document.getElementById("bookFormAuthor").value;
  const year = Number(document.getElementById("bookFormYear").value);
  // Validasi tahun
  if (isNaN(year)) {
    alert("Tahun yang dimasukkan harus berupa angka.");
    return; // Menghentikan fungsi jika input bukan angka
  }

  const isComplete = document.getElementById("bookFormIsComplete").checked;

  const bookId = generateId();
  const bookObject = generateBookObject(
    bookId,
    title,
    author,
    year,
    isComplete
  );
  books.push(bookObject);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

// Remove book by ID
function removeBook(bookId) {
  const bookIndex = books.findIndex((book) => book.id === bookId);
  if (bookIndex !== -1) {
    books.splice(bookIndex, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  }
}

// Toggle book status
function toggleBookStatus(bookId) {
  const book = books.find((book) => book.id === bookId);
  if (book) {
    book.isComplete = !book.isComplete;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  }
}

// Edit book
function editBook(bookId) {
  const book = books.find((book) => book.id === bookId);
  if (book) {
    const title = prompt("Masukkan judul baru:", book.title) || book.title;
    const author = prompt("Masukkan penulis baru:", book.author) || book.author;
    const year = Number(prompt("Masukkan tahun baru:", book.year) || book.year);

    if (isNaN(year)) {
      alert("Tahun yang dimasukkan harus berupa angka.");
      return; // Menghentikan fungsi jika input bukan angka
    }

    book.title = title;
    book.author = author;
    book.year = year;

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  }
}
// search book
function filterBooks(searchTitle) {
  const incompleteBooks = document.querySelectorAll(
    '#incompleteBookList [data-testid="bookItem"]'
  );
  const completeBooks = document.querySelectorAll(
    '#completeBookList [data-testid="bookItem"]'
  );

  // Fungsi untuk mencocokkan judul buku
  const filterBooksByTitle = (books) => {
    books.forEach((book) => {
      const title = book
        .querySelector('[data-testid="bookItemTitle"]')
        .textContent.toLowerCase();
      if (title.includes(searchTitle.toLowerCase())) {
        book.style.display = "block"; // Tampilkan jika cocok
      } else {
        book.style.display = "none"; // Sembunyikan jika tidak cocok
      }
    });
  };

  // Terapkan filter ke kedua daftar buku
  filterBooksByTitle(incompleteBooks);
  filterBooksByTitle(completeBooks);
}

// Event listener untuk pencarian
const searchForm = document.getElementById("searchBook");
searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const searchInput = document.getElementById("searchBookTitle").value.trim();
  filterBooks(searchInput);
});
// Render books to DOM
document.addEventListener(RENDER_EVENT, () => {
  const incompleteBookList = document.getElementById("incompleteBookList");
  const completeBookList = document.getElementById("completeBookList");

  incompleteBookList.innerHTML = "";
  completeBookList.innerHTML = "";

  for (const book of books) {
    const bookElement = createBookElement(book);
    if (book.isComplete) {
      completeBookList.append(bookElement);
    } else {
      incompleteBookList.append(bookElement);
    }
  }
});

// Initialize app
document.addEventListener("DOMContentLoaded", () => {
  const bookForm = document.getElementById("bookForm");
  bookForm.addEventListener("submit", (event) => {
    event.preventDefault();
    addBook();
    bookForm.reset();
  });

  if (isStorageExist()) {
    loadDataFromStorage();
  }
  document.dispatchEvent(new Event(RENDER_EVENT));
});
