import dotenv from "dotenv"; dotenv.config();
import jwt from "jsonwebtoken";

// Récupération de la clé secrète depuis le .env
const JWT_SECRET = process.env.JWT_SECRET;

export const requireAuth = (req, res, next) => {
  // Récupère l'en-tête Authorization
  const authHeader = req.header("Authorization");

  // Si aucun token n'est fourni
  if (!authHeader) {
    return res.status(401).json({ error: "No token provided" });
  }

  // Retire le préfixe "Bearer "
  const token = authHeader.replace("Bearer ", "").trim();

  try {
    // Vérifie et décode le token
    const decoded = jwt.verify(token, JWT_SECRET);

    // Ajoute les infos utilisateur à la requête
    req.user = decoded;

    // Passe au middleware suivant
    next();
  } catch (err) {
    return res.status(401).json({ error: "Token invalid" });
  }
};
