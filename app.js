const express = require("express");
const cors = require("cors");

const logger = require("./middleware/logger.middleware");
const errorHandler = require("./middleware/error.middleware");

const authRoutes = require("./routes/auth.routes");
const expenseRoutes = require("./routes/expense.routes");
const categoryRoutes = require("./routes/category.routes");

const app = express();

app.use(cors());
app.use(express.json());
app.use(logger);

app.get("/", (req, res) => {
  res.send("Smart Expense Manager API Running");
});

app.use("/api/auth", authRoutes);
app.use("/api/expenses", expenseRoutes);

app.use(errorHandler);
app.use("/api/categories", categoryRoutes);

module.exports = app;
