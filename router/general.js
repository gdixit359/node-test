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

public_users.get('/', async (req, res) => {
  try {
    const getBooks = async () => {
      return new Promise((resolve) => {
        setTimeout(() => resolve(books), 100); // simulate async delay
      });
    };
    const allBooks = await getBooks();
    return res.status(200).json(allBooks);
  } catch (err) {
    return res.status(500).json({ message: "Error fetching books" });
  }
});


public_users.get('/isbn/:isbn', (req, res) => {
  const isbn = req.params.isbn;

  const getBookByISBN = new Promise((resolve, reject) => {
    const book = books[isbn];
    if (book) {
      resolve(book);
    } else {
      reject("Book not found");
    }
  });

  getBookByISBN
    .then(book => res.status(200).json(book))
    .catch(err => res.status(404).json({ message: err }));
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
