const authService = require("../services/auth.service");
const User = require("../models/user.model"); // ✅ REQUIRED
const bcrypt = require('bcryptjs');
exports.register = async (req, res, next) => {
  try {
    const user = await authService.registerUser(req.body);
    res.status(201).json({ message: "User registered", user });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await authService.loginUser(email, password);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

/* ✅ GET PROFILE */
exports.me = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    next(err);
  }
};

/* ✅ UPDATE PROFILE */
exports.updateProfile = async (req, res, next) => {
  try {
    const { name, username, email } = req.body;

    // 🔒 Check if email already used by another user
    if (email) {
      const existingUser = await User.findOne({ email });

      if (existingUser && existingUser._id.toString() !== req.user.id) {
        return res.status(400).json({ message: "Email already in use" });
      }
    }

    // 🔒 Check if username already used by another user (if unique)
    if (username) {
      const existingUsername = await User.findOne({ username });

      if (existingUsername && existingUsername._id.toString() !== req.user.id) {
        return res.status(400).json({ message: "Username already taken" });
      }
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, username, email },
      { new: true, runValidators: true }
    ).select('-password');

    res.json(user);

  } catch (err) {
    next(err);
  }
};


/* ✅ CHANGE PASSWORD */
exports.changePassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Old password is incorrect" });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    await user.save();

    res.json({ message: "Password changed successfully" });

  } catch (err) {
    next(err);
  }
};