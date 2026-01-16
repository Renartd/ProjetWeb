// Importation de bcrypt : sert à hasher les mots de passe
// → On ne stocke jamais un mot de passe en clair dans la base
import bcrypt from "bcryptjs";

// Importation de jsonwebtoken : sert à créer et vérifier les tokens JWT
// → Le token permet d'identifier un utilisateur connecté
import jwt from "jsonwebtoken";

// Importation du pool PostgreSQL (connexion à la base)
// → pool.query() permet d'exécuter des requêtes SQL
import pool from "./db.js";

// Importation de dotenv : permet de lire les variables du fichier .env
import dotenv from "dotenv";

// Charge les variables du fichier .env dans process.env
dotenv.config();

// Récupération de la clé secrète utilisée pour signer les tokens JWT
// → Cette clé doit rester secrète et ne jamais être dans le code
const JWT_SECRET = process.env.JWT_SECRET;



// ======================================================
//   INSCRIPTION (signup)
// ======================================================

// Fonction appelée quand un utilisateur veut créer un compte
export const signup = async (req, res) => {
  // Récupération des données envoyées par le frontend
  const { username, password } = req.body;

  try {
    // Vérifie que les deux champs sont bien fournis
    if (!username || !password) {
      return res.status(400).json({ error: "Missing username or password" });
    }

    // Vérifie si un utilisateur avec ce username existe déjà
    // $1 = premier paramètre du tableau [username]
    const existingUser = await pool.query(
      "SELECT * FROM users WHERE username = $1",
      [username]
    );

    // Si un utilisateur existe déjà, on bloque l'inscription
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Hashage du mot de passe
    // 10 = nombre de "rounds" de sécurité
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insertion du nouvel utilisateur dans la base
    // RETURNING permet de récupérer l'id et le username créés
    const newUser = await pool.query(
      "INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id, username",
      [username, hashedPassword]
    );

    // Création d'un token JWT contenant l'id et le username
    // expiresIn: "7d" → le token expire dans 7 jours
    const token = jwt.sign(
      { id: newUser.rows[0].id, username: newUser.rows[0].username },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Réponse envoyée au frontend
    res.json({
      message: "User created successfully",
      token,
      user: newUser.rows[0],
    });

  } catch (err) {
    // Si une erreur survient, on l'affiche dans la console
    console.error("Signup error:", err);

    // Et on renvoie une erreur générique au frontend
    res.status(500).json({ error: "Internal server error" });
  }
};



// ======================================================
//   CONNEXION (login)
// ======================================================

// Fonction appelée quand un utilisateur veut se connecter
export const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Vérifie que les champs sont fournis
    if (!username || !password) {
      return res.status(400).json({ error: "Missing username or password" });
    }

    // Recherche de l'utilisateur dans la base
    const user = await pool.query(
      "SELECT * FROM users WHERE username = $1",
      [username]
    );

    // Si aucun utilisateur trouvé → identifiants invalides
    if (user.rows.length === 0) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // On récupère l'utilisateur trouvé
    const storedUser = user.rows[0];

    // Vérifie si le mot de passe fourni correspond au hash stocké
    const isMatch = await bcrypt.compare(password, storedUser.password);

    // Si le mot de passe ne correspond pas → erreur
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // Génération d'un token JWT pour cet utilisateur
    const token = jwt.sign(
      { id: storedUser.id, username: storedUser.username },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Réponse envoyée au frontend
    res.json({
      message: "Login successful",
      token,
      user: { id: storedUser.id, username: storedUser.username },
    });

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};



// ======================================================
//   PROFIL UTILISATEUR (protégé par requireAuth)
// ======================================================

// Cette route renvoie les infos de l'utilisateur connecté
// requireAuth ajoute req.user automatiquement
export const getProfile = async (req, res) => {
  try {
    res.json({
      message: "Authenticated user",
      user: req.user, // Contient { id, username }
    });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
};
