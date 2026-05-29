const express = require("express");

const router = express.Router();

// POST /register
router.post("/register", (req, res) => {
  res.json({ message: "Register endpoint hit" });
});

// POST /login
router.post("/login", (req, res) => {
  res.json({ message: "Login endpoint hit" });
});

// GET /me
router.get("/me", (req, res) => {
  res.json({ message: "Get user info endpoint hit" });
});

module.exports = router;
