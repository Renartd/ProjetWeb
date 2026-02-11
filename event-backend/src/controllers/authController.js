const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { registerUser, authenticateUser } = require("../services/userService");

// =========================
//   INSCRIPTION
// =========================
const signup = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username) {
      return res.status(400).json({ error: "L'identifiant est obligatoire." });
    }

    if (!password) {
      return res.status(400).json({ error: "Le mot de passe est obligatoire." });
    }

    if (password.length < 8) {
      return res.status(400).json({ error: "Le mot de passe doit contenir au moins 8 caractères." });
    }

    const user = await registerUser(username, password);

    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.status(201).json({ user, token });
  } catch (err) {
    console.error("Signup error:", err);

    if (err.message.includes("exists")) {
      return res.status(400).json({ error: "Cet identifiant est déjà pris." });
    }

    res.status(500).json({ error: "Erreur interne du serveur." });
  }
};

// =========================
//   CONNEXION
// =========================
const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "Identifiant ou mot de passe manquant." });
    }

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
    res.status(401).json({ error: "Identifiant ou mot de passe incorrect." });
  }
};

// =========================
//   PROFIL UTILISATEUR
// =========================
const getProfile = async (req, res) => {
  res.json({
    message: "Utilisateur authentifié",
    user: req.user
  });
};

module.exports = {
  signup,
  login,
  getProfile
};
