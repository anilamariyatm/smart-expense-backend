const express = require("express");
const router = express.Router();
const Expense = require('../models/expense.model');

const auth = require("../middleware/auth.middleware");
const expenseController = require("../controllers/expense.controller");

router.use(auth); // protect all below routes

router.post("/", expenseController.add);
router.get("/", expenseController.getAll);
router.get("/stats", expenseController.stats);
router.put("/:id", expenseController.update);
router.delete("/:id", expenseController.remove);
router.get('/:id', expenseController.getById);


// ✅ IMPORT EXPENSES FROM CSV
router.post('/import', async (req, res, next) => {
  try {

    console.log('USER:', req.user);

    const expenses = req.body.map(e => ({
      amount: Number(e.amount),
      category: e.category,
      note: e.note || '',
      date: new Date(e.date),
      userId: req.user.id   // ✅ MUST MATCH SCHEMA
    }));

    await Expense.insertMany(expenses);

    res.json({ message: 'Expenses imported successfully' });

  } catch (err) {
    console.error('IMPORT ERROR:', err);
    next(err);
  }
});




module.exports = router;
