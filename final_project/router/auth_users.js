const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
}

regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;

    // Check for missing fields
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required." });
    }

    // Check if user exists and password matches
    const user = users.find(u => u.username === username && u.password === password);
    if (!user) {
        return res.status(401).json({ message: "Invalid username or password." });
    }

    // For demonstration, set a simple session flag
    req.session = { loggedIn: true, username };

    return res.status(200).json({ message: `Login successful. Welcome ${username}!` });
});


// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const { review } = req.body;

    // Assuming we have req.session.username or similar to know who's logged in
    const username = req.session?.username;
    if (!username) {
        return res.status(401).json({ message: "Unauthorized: Please log in first." });
    }

    // Check if book exists
    const book = books[isbn];
    if (!book) {
        return res.status(404).json({ message: "Book not found for this ISBN." });
    }

    if (!review) {
        return res.status(400).json({ message: "Review text is required." });
    }

    // Add or update review for this user
    book.reviews[username] = review;

    // Delete the user's review
    delete book.reviews[username];

    return res.status(200).json({
        message: "Review added/updated successfully.",
        reviews: book.reviews
    });
});




module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
