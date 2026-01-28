const express = require("express");
const { signup, login, getProfile } = require("../controllers/authController");
const { requireAuth } = require("../middleware/authMiddleware");

const router = express.Router();

// Inscription
router.post("/signup", signup);

// Connexion
router.post("/login", login);

// Profil utilisateur (protégé)
router.get("/me", requireAuth, getProfile);

module.exports = router;
