import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();

// Middlewares globaux
app.use(cors());
app.use(express.json());

// Routes d'authentification
app.use("/auth", authRoutes);

// Route de test
app.get("/", (req, res) => {
  res.send("Backend Projetweb opérationnel !");
});

// Port d'écoute
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);

});
