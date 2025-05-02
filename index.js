const express = require('express');
const session = require('express-session');

const customer_routes = require('./router/auth_users.js').authenticated;
const general_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

// ✅ Apply session globally, before routers
app.use(session({
  secret: "fingerprint_customer",
  resave: true,
  saveUninitialized: true
}));

// Optional middleware to protect certain routes
app.use("/customer/auth/*", function auth(req, res, next) {
  if (req.session.authorization) {
    next();
  } else {
    return res.status(403).json({ message: "User not logged in" });
  }
});

app.use("/", general_routes);
app.use("/", customer_routes);

const PORT = 5001;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
