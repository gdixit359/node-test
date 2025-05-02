// router/general.js
const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ message: "Username and password required" });

  if (!isValid(username)) return res.status(409).json({ message: "Username already exists" });

  users.push({ username, password });
  return res.status(200).json({ message: "User registered successfully" });
});

public_users.get('/', (req, res) => {
  return res.status(200).json(books);
});

public_users.get('/isbn/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) return res.status(200).json(book);
  else return res.status(404).json({ message: "Book not found" });
});

public_users.get('/author/:author', (req, res) => {
  const author = req.params.author.toLowerCase();
  const filtered = Object.values(books).filter(book => book.author.toLowerCase() === author);
  return res.status(200).json(filtered);
});

public_users.get('/title/:title', (req, res) => {
  const title = req.params.title.toLowerCase();
  const filtered = Object.values(books).filter(book => book.title.toLowerCase() === title);
  return res.status(200).json(filtered);
});

public_users.get('/review/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) return res.status(200).json(book.reviews);
  else return res.status(404).json({ message: "Book not found" });
});

module.exports.general = public_users;
