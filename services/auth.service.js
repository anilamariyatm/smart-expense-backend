const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const registerUser = async (data) => {
  const existing = await User.findOne({ email: data.email });
  if (existing) {
    const err = new Error("User already exists");
    err.statusCode = 400;
    throw err;
  }

  // ✅ optional: check username also if unique
  if (data.username) {
    const existingUsername = await User.findOne({ username: data.username });
    if (existingUsername) {
      const err = new Error("Username already taken");
      err.statusCode = 400;
      throw err;
    }
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);

  const user = await User.create({
    name: data.name,
    username: data.username,   // ✅ CONNECTED TO MONGODB
    email: data.email,
    password: hashedPassword,
    role: data.role || "user"   // optional safety
  });

  return user;
};

const loginUser = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    const err = new Error("Invalid email or password");
    err.statusCode = 400;
    throw err;
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    const err = new Error("Invalid email or password");
    err.statusCode = 400;
    throw err;
  }

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  return { token, user };
};

module.exports = { registerUser, loginUser };
