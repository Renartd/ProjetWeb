const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const authRoutes = require("./routes/authRoutes");
const eventRoutes = require("./routes/eventRoutes");
const registrationRoutes = require("./routes/registrationRoutes");

dotenv.config();

const app = express();

// Middlewares globaux
app.use(cors());
app.use(express.json());

// Routes
app.use("/auth", authRoutes);
app.use("/events", eventRoutes);
app.use("/api", registrationRoutes);

// Route de test
app.get("/", (req, res) => {
  res.send("Backend Projetweb opérationnel !");
});

// Port d'écoute
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
