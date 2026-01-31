const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");
const Category = require("../models/category.model");

// ✅ Create Category
router.post("/", auth, async (req, res, next) => {
  try {
    const cat = await Category.create({
      name: req.body.name,
      user: req.user.id
    });
    res.json(cat);
  } catch (err) {
    next(err);
  }
});

// ✅ Get User Categories
router.get("/", auth, async (req, res, next) => {
  try {
    const cats = await Category.find({ user: req.user.id });
    res.json(cats);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
