require("dotenv").config();
console.log("MONGO URI:", process.env.MONGO_URI);
const app = require("./app");
const connectDB = require("./config/database");

connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
