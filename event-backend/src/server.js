// Importation du framework Express (syntaxe ES Modules)
import express from "express";

// Importation de CORS pour autoriser les requêtes du frontend
import cors from "cors";

// Création de l'application Express
const app = express();

// Active CORS pour permettre au frontend (React) d'accéder à l'API
app.use(cors());

// Permet à Express de comprendre les données JSON envoyées dans les requêtes
app.use(express.json());

// Route GET de test accessible via http://localhost:5000/
// Permet de vérifier que le backend fonctionne correctement
app.get("/", (req, res) => {
  res.send("Backend Projetweb opérationnel !");
});

// Définition du port d'écoute du serveur
const PORT = 5000;

// Démarrage du serveur Express
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
