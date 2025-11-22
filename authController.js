import { User } from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const signup = (req, res) => {
  const { name, email, password } = req.body;

  bcrypt.hash(password, 10, (err, hash) => {
    if (err) return res.json({ error: "Error hashing password" });
    User.create(name, email, hash, (err) => {
      if (err) return res.json({ error: "User exists" });
      res.json({ message: "Signup successful" });
    });
  });
};

export const login = (req, res) => {
  const { email, password } = req.body;

  User.findByEmail(email, (err, users) => {
    if (err || users.length === 0)
      return res.json({ error: "User not found" });

    const user = users[0];
    bcrypt.compare(password, user.password, (err, match) => {
      if (!match) return res.json({ error: "Invalid password" });

      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1d" });
      res.json({ message: "Login successful", token });
    });
  });
};
