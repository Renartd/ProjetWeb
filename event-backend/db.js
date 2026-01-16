import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pkg;

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT || 5432,
});

// Test immédiat de la connexion
pool.connect()
  .then(() => console.log("Connexion PostgreSQL réussie"))
  .catch((err) => console.error("Erreur de connexion PostgreSQL :", err));

export default pool;
