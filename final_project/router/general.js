const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

// Task 10
public_users.get('/books', function (req, res) {
    const get_books = new Promise((resolve, reject) => {
        resolve(res.send(JSON.stringify(books, null, 4)));
    });

    get_books.then(() => console.log("Promise for Task 10 resolved"));
});


// Task 11
public_users.get('/books/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const get_book_by_isbn = new Promise((resolve, reject) => {
        const book = books[isbn];
        if (book) {
            resolve(res.send(JSON.stringify(book, null, 4)));
        } else {
            reject(res.status(404).json({ message: "Book not found for this ISBN." }));
        }
    });

    get_book_by_isbn.then(() => 
        console.log(`Promise for Task 11 resolved for ISBN ${isbn}`)
    );
});


// Task 12
public_users.get('/books/author/:author', function (req, res) {
    const author = req.params.author;
    const get_books_by_author = new Promise((resolve, reject) => {
        const matchingBooks = Object.values(books).filter(book => 
            book.author.toLowerCase() === author.toLowerCase()
        );

        if (matchingBooks.length > 0) {
            resolve(res.send(JSON.stringify(matchingBooks, null, 4)));
        } else {
            reject(res.status(404).json({ message: "No books found for this author." }));
        }
    });

    get_books_by_author.then(() =>
        console.log(`Promise for Task 12 resolved for author ${author}`)
    );
});


// Task 13
public_users.get('/books/title/:title', function (req, res) {
    const title = req.params.title;
    const get_books_by_title = new Promise((resolve, reject) => {
        const matchingBooks = Object.values(books).filter(book =>
            book.title.toLowerCase() === title.toLowerCase()
        );

        if (matchingBooks.length > 0) {
            resolve(res.send(JSON.stringify(matchingBooks, null, 4)));
        } else {
            reject(res.status(404).json({ message: "No books found with this title." }));
        }
    });

    get_books_by_title.then(() =>
        console.log(`Promise for Task 13 resolved for title ${title}`)
    );
});





public_users.post("/register", (req, res) => {
    const { username, password } = req.body;

    // Check if username or password is missing
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required." });
    }

    // Check if user already exists
    const userExists = users.find(user => user.username === username);
    if (userExists) {
        return res.status(409).json({ message: "Username already exists. Please choose another." });
    }

    // Register user
    users.push({ username, password });

    return res.status(201).json({ message: "User registered successfully!" });
});


// Get the book list available in the shop
public_users.get('/', function (req, res) {
    return res.status(200).json(Object.values(books));
});






// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;

  // Check if book exists
  const book = books[isbn];
  if (!book) {
    return res.status(404).json({ message: "Book not found for this ISBN." });
  }

  // Return the book details
  return res.status(200).json(book);
});

  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;

  // Find all books by this author
  const matchingBooks = Object.values(books).filter(book => 
    book.author.toLowerCase() === author.toLowerCase()
  );

  if (matchingBooks.length === 0) {
    return res.status(404).json({ message: "No books found for this author." });
  }

  return res.status(200).json(matchingBooks);
});


// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;

  // Find all books matching this title (case-insensitive)
  const matchingBooks = Object.values(books).filter(book =>
    book.title.toLowerCase() === title.toLowerCase()
  );

  if (matchingBooks.length === 0) {
    return res.status(404).json({ message: "No books found with this title." });
  }

  return res.status(200).json(matchingBooks);
});


// Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;

  // Check if the book exists
  const book = books[isbn];
  if (!book) {
    return res.status(404).json({ message: "Book not found for this ISBN." });
  }

  // Return the reviews
  return res.status(200).json(book.reviews);
});


module.exports.general = public_users;
