import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import "./Navbar.scss";

export default function Navbar() {
  const { token, user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const avatarUrl = user?.avatar_url
    ? `http://localhost:3000${user.avatar_url}`
    : "/default-avatar.png";

  return (
    <nav className="navbar">
      <div className="nav-left">
        <Link to="/events" className="logo">
          Events
        </Link>
      </div>

      <div className="nav-right">
        {token && <Link to="/events/new">Créer un événement</Link>}
        {token && <Link to="/my-events">Mes événements</Link>}
        {token && <Link to="/profile">Profil</Link>}

        {!token && <Link to="/login">Connexion</Link>}
        {!token && <Link to="/signup">Inscription</Link>}

        {token && (
          <>
            <img src={avatarUrl} alt="avatar" className="avatar-small" />
            <span className="username">{user?.username}</span>
            <button onClick={handleLogout}>Déconnexion</button>
          </>
        )}
      </div>
    </nav>
  );
}
