const Expense = require("../models/expense.model");

const addExpense = async (data, userId) => {
  return await Expense.create({ ...data, userId });
};

const getExpenses = async (userId) => {
  return await Expense.find({ userId }).sort({ date: -1 });
};

const updateExpense = async (id, userId, data) => {
  const expense = await Expense.findOneAndUpdate(
    { _id: id, userId },
    data,
    { new: true }
  );

  if (!expense) {
    const err = new Error("Expense not found");
    err.statusCode = 404;
    throw err;
  }

  return expense;
};

const deleteExpense = async (id, userId) => {
  const expense = await Expense.findOneAndDelete({ _id: id, userId });

  if (!expense) {
    const err = new Error("Expense not found");
    err.statusCode = 404;
    throw err;
  }

  return expense;
};

const getStats = async (userId) => {
  const expenses = await Expense.find({ userId });

  const total = expenses.reduce((sum, e) => sum + e.amount, 0);

  return {
    count: expenses.length,
    totalAmount: total
  };
};

module.exports = {
  addExpense,
  getExpenses,
  updateExpense,
  deleteExpense,
  getStats
};
