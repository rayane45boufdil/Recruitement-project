import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./NavBar.css";

function NavBar({ setUser }) {
  const navigate = useNavigate();

  // Récupération sécurisée de l'utilisateur connecté
  const user = (() => {
    try {
      const storedUser = localStorage.getItem("user");
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error("Erreur lors de l'analyse de l'utilisateur :", error);
      return null;
    }
  })();

  // Fonction pour gérer la déconnexion
  const handleLogout = () => {
    localStorage.removeItem("user"); // Supprime les infos utilisateur
    setUser(null); // Réinitialise l'utilisateur dans l'état global
    alert("Vous avez été déconnecté avec succès !");
    navigate("/"); // Redirige vers la page d'accueil
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">
          🌟 <span className="brand">JobS</span>
        </Link>
      </div>
      <ul className="navbar-links">
        <li>
          <Link to="/upload-cv">📄 Télécharger CV</Link>
        </li>
        <li>
          <Link to="/jobs">💼 Emplois</Link>
        </li>
        <li>
          <Link to="/contact">📞 Contact</Link>
        </li>
        <li>
          <Link to="/about">ℹ️ À propos</Link>
        </li>
      </ul>
      <div className="navbar-actions">
        {user && (
          <>
            <span className="welcome-message">Bienvenue, {user.name}</span>
            <button className="btn-logout" onClick={handleLogout}>
              🚪 Déconnexion
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

export default NavBar;
