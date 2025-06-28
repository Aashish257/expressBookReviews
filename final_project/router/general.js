const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');


function getAllBooks() {
  axios.get('http://localhost:3000/')
    .then(response => {
      console.log("Task 10: All books:");
      console.log(response.data);
    })
    .catch(error => {
      console.error("Error fetching all books:", error.message);
    });
}


async function getBookByISBN(isbn) {
  try {
    const response = await axios.get(`http://localhost:3000/isbn/${isbn}`);
    console.log(`Task 11: Book details for ISBN ${isbn}:`);
    console.log(response.data);
  } catch (error) {
    console.error(`Error fetching book by ISBN ${isbn}:`, error.message);
  }
}


function getBooksByAuthor(author) {
  axios.get(`http://localhost:3000/author/${author}`)
    .then(response => {
      console.log(`Task 12: Books by author ${author}:`);
      console.log(response.data);
    })
    .catch(error => {
      console.error(`Error fetching books by author ${author}:`, error.message);
    });
}

async function getBooksByTitle(title) {
  try {
    const response = await axios.get(`http://localhost:3000/title/${title}`);
    console.log(`Task 13: Books with title ${title}:`);
    console.log(response.data);
  } catch (error) {
    console.error(`Error fetching books by title ${title}:`, error.message);
  }
}




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
