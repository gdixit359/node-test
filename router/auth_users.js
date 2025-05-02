const express = require('express');
const jwt = require('jsonwebtoken');
const regd_users = express.Router();

let books = require("./booksdb.js");
let users = [];

const isValid = (username) => {
  // Returns false if username already exists
  return !users.find(user => user.username === username);
};

const authenticatedUser = (username, password) => {
  // Check if user with given username and password exists
  return users.find(user => user.username === username && user.password === password);
};

// Login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password required" });
  }

  const user = authenticatedUser(username, password);

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign({ username: username }, 'access', { expiresIn: '1h' });

  req.session.authorization = { token, username };

  return res.status(200).json({ message: "User logged in successfully" });
});

// Add or modify a review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.body.review;
  const username = req.session.authorization?.username;

  if (!review) return res.status(400).json({ message: "Review text is required" });

  if (books[isbn]) {
    books[isbn].reviews[username] = review;
    return res.status(200).json({ message: "Review added/updated successfully" });
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

// Delete review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization?.username;

  if (books[isbn] && books[isbn].reviews[username]) {
    delete books[isbn].reviews[username];
    return res.status(200).json({ message: "Review deleted successfully" });
  } else {
    return res.status(404).json({ message: "Review not found for user" });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
