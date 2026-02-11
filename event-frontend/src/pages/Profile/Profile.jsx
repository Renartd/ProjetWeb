import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getProfile, updateProfile, uploadAvatar } from "../../api/users";

export default function Profile() {
  const { token, user, setUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    getProfile(token)
      .then((data) => {
        setProfile(data);
        setUsername(data.username);
      })
      .catch((err) => setError(err.message));
  }, [token]);

  const handleSave = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const updated = await updateProfile({ username, password }, token);
      setUser(updated);
      setProfile(updated);
      setPassword("");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleAvatar = async () => {
    if (!avatarFile) return;
    try {
      const updated = await uploadAvatar(avatarFile, token);
      setUser(updated);
      setProfile(updated);
    } catch (err) {
      setError(err.message);
    }
  };

  if (!profile) return <p>Chargement...</p>;

  const avatarUrl = profile.avatar_url
    ? `http://localhost:3000${profile.avatar_url}`
    : "/default-avatar.png";

  return (
    <div className="profile-page">
      <h2>Mon profil</h2>

      {error && <p className="error">{error}</p>}

      <img src={avatarUrl} alt="avatar" className="avatar-large" />

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setAvatarFile(e.target.files[0])}
      />
      <button onClick={handleAvatar}>Changer l’avatar</button>

      <form onSubmit={handleSave}>
        <label>
          Nom d’utilisateur
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </label>

        <label>
          Nouveau mot de passe (optionnel)
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>

        <button type="submit">Enregistrer</button>
      </form>
    </div>
  );
}
