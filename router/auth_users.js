// router/auth_users.js
const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  return !users.find(user => user.username === username);
};

const authenticatedUser = (username, password) => {
  return users.find(user => user.username === username && user.password === password);
};

regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ message: "Username and password required" });

  const user = authenticatedUser(username, password);
  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  const accessToken = jwt.sign({ username }, 'access', { expiresIn: '1h' });
  req.session.authorization = { accessToken, username };
  return res.status(200).json({ message: "Login successful" });
});

regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.body.review;
  const username = req.session.authorization?.username;

  if (!username) return res.status(403).json({ message: "User not logged in" });
  if (!review) return res.status(400).json({ message: "Review content required" });

  if (!books[isbn]) return res.status(404).json({ message: "Book not found" });

  books[isbn].reviews[username] = review;
  return res.status(200).json({ message: "Review added/updated successfully" });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization?.username;

  if (!username) return res.status(403).json({ message: "User not logged in" });

  if (!books[isbn] || !books[isbn].reviews[username]) {
    return res.status(404).json({ message: "Review not found for deletion" });
  }

  delete books[isbn].reviews[username];
  return res.status(200).json({ message: "Review deleted successfully" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
