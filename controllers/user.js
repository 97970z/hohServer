import { genSalt, hash } from "bcryptjs";
import User from "../models/user";

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json({ users });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Server error" });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    res.json({ user });
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "User not found" });
    }
    res.status(500).json({ msg: "Server error" });
  }
};

export const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    // Check if the logged-in user has permission to update
    if (user.id !== req.user.id) {
      return res.status(403).json({ msg: "Unauthorized" });
    }

    // Update the user
    const { name, email, password } = req.body;
    user.name = name || user.name;
    user.email = email || user.email;
    if (password) {
      const salt = await genSalt(10);
      user.password = await hash(password, salt);
    }
    await user.save();

    res.json({ user });
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "User not found" });
    }
    res.status(500).json({ msg: "Server error" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    // Check if the logged-in user has permission to delete
    if (user.id !== req.user.id) {
      return res.status(403).json({ msg: "Unauthorized" });
    }

    // Delete the user
    await user.remove();

    res.json({ msg: "User deleted" });
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "User not found" });
    }
    res.status(500).json({ msg: "Server error" });
  }
};

export const checkDuplicateName = async (req, res) => {
  try {
    const { name } = req.params;

    const user = await User.findOne({ name });
    if (!user) {
      return res.status(200).json({ message: "Username is available" });
    } else {
      return res.status(200).json({ message: "Username is already taken" });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Server error" });
  }
};
