import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signup as signupAPI } from "../../api/auth";
import "./Signup.scss";

export default function Signup() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!username.trim() || !password.trim() || !confirm.trim()) {
      setError("Tous les champs sont obligatoires.");
      return;
    }

    if (password !== confirm) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    setLoading(true);

    try {
      await signupAPI(username, password);
      setSuccess("Compte créé avec succès !");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError(err.message || "Erreur serveur. Réessayez plus tard.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="signup-page">
      <form className="signup-form" onSubmit={handleSubmit}>
        <h2>Inscription</h2>

        {error && <div className="error-box">{error}</div>}
        {success && <div className="success-box">{success}</div>}

        <label>
          Nom d'utilisateur
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Votre identifiant"
          />
        </label>

        <label>
          Mot de passe
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mot de passe"
          />
        </label>

        <label>
          Confirmer le mot de passe
          <input
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="Confirmez le mot de passe"
          />
        </label>

        <button type="submit" disabled={loading}>
          {loading ? "Création..." : "Créer le compte"}
        </button>

        <p className="login-link">
          Déjà inscrit ? <a href="/login">Se connecter</a>
        </p>
      </form>
    </div>
  );
}
