const Expense = require('../models/expense.model');

/* CREATE */
exports.add = async (req, res, next) => {
  try {
    const expense = await Expense.create({
      ...req.body,
      userId: req.user.id   // ✅ FIX
    });
    res.status(201).json(expense);
  } catch (err) {
    console.log(err);
    next(err);
  }
};


/* READ ALL */
exports.getAll = async (req, res, next) => {
  try {
    const expenses = await Expense.find({ userId: req.user.id }).sort({ date: -1 }); // ✅ FIX
    res.json(expenses);
  } catch (err) {
    next(err);
  }
};


/* READ ONE */
exports.getById = async (req, res, next) => {
  try {
    const expense = await Expense.findOne({
      _id: req.params.id,
      userId: req.user.id   // ✅ FIX
    });

    if (!expense) return res.status(404).json({ message: 'Not found' });
    res.json(expense);
  } catch (err) {
    next(err);
  }
};


/* UPDATE */
exports.update = async (req, res, next) => {
  try {
    const expense = await Expense.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },  // ✅ FIX
      req.body,
      { new: true }
    );

    if (!expense) return res.status(404).json({ message: 'Not found' });
    res.json(expense);
  } catch (err) {
    next(err);
  }
};


/* DELETE */
exports.remove = async (req, res, next) => {
  try {
    const expense = await Expense.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id   // ✅ FIX
    });

    if (!expense) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    next(err);
  }
};


/* STATS */
exports.stats = async (req, res, next) => {
  try {
    const expenses = await Expense.find({ userId: req.user.id }); // ✅ FIX

    const totalAmount = expenses.reduce((sum, e) => sum + e.amount, 0);

    res.json({
      count: expenses.length,
      totalAmount
    });
  } catch (err) {
    next(err);
  }
};
