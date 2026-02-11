const jwt = require("jsonwebtoken");

function requireAuth(req, res, next) {
  try {
    const authHeader = req.header("Authorization");

    if (!authHeader) {
      return res.status(401).json({ error: "Authentification requise." });
    }

    const token = authHeader.replace("Bearer ", "").trim();

    if (!token) {
      return res.status(401).json({ error: "Token manquant." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;
    next();
  } catch (err) {
    console.error("Auth error:", err);

    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Session expirée, veuillez vous reconnecter." });
    }

    return res.status(401).json({ error: "Token invalide." });
  }
}

module.exports = { requireAuth };
