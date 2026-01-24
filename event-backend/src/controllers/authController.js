import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import {
  registerUser,
  authenticateUser
} from "../services/userService.js";

// =========================
//   INSCRIPTION
// =========================
export const signup = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await registerUser(username, password);

    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.status(201).json({ user, token });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// =========================
//   CONNEXION
// =========================
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await authenticateUser(username, password);

    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({
      user: { id: user.id, username: user.username },
      token
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(401).json({ error: "Invalid credentials" });
  }
};

// =========================
//   PROFIL UTILISATEUR
// =========================
export const getProfile = async (req, res) => {
  res.json({
    message: "Authenticated user",
    user: req.user
  });
};
