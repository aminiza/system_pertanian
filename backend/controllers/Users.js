import User from "../models/UserModel.js";
import argon2 from "argon2";

export const getUsers = async (req, res) => {
  try {
    const response = await User.findAll({
      attributes: ["uuid", "name", "email", "role"],
    });
    res.status(200).json(response);
  } catch {
    res.status(500).json({ message: error.message });
  }
};

export const getUsersById = async (req, res) => {
  try {
    const response = await User.findOne({
      attributes: ["uuid", "name", "email", "role"],
      where: {
        uuid: req.params.id,
      },
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createUsers = async (req, res) => {
  const { name, email, password, confPassword, role } = req.body;
  if (password !== confPassword)
    return res
      .status(400)
      .json({ message: "Password and Confirm Password doesn't match" });

  const hash = await argon2.hash(password);
  try {
    await User.create({
      name: name,
      email: email,
      password: hash,
      role: role,
    });
    res.status(201).json({ message: "User created" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateUsers = async (req, res) => {
  const user = await User.findOne({
    where: {
      uuid: req.params.id,
    },
  });
  if (!user) return res.status(404).json({ message: "User not found" });
  const { name, email, password, confPassword, role } = req.body;
  let hashPassword;
  if (password === "" || password === null) {
    hashPassword = user.password;
  } else {
    hashPassword = await argon2.hash(password);
  }
  if (password !== confPassword)
    return res
      .status(400)
      .json({ message: "Password and Confirm Password doesn't match" });

  try {
    await User.update(
      {
        name: name,
        email: email,
        password: hashPassword,
        role: role,
      },
      {
        where: {
          id: user.id,
        },
      }
    );
    res.status(200).json({ message: "User updated" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteUsers = async (req, res) => {
  const user = await User.findOne({
    where: {
      uuid: req.params.id,
    },
  });
  if (!user) return res.status(404).json({ message: "User not found" });

  try {
    await User.destroy(
      {
        where: {
          id: user.id,
        },
      }
    );
    res.status(200).json({ message: "User deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
