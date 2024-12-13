import React from "react";
import "./RecruiterNavBar.css";
import { Link, useNavigate } from "react-router-dom";
 
function RecruiterNavBar({ user }) {
  const navigate = useNavigate();
 
  const handleLogout = () => {
    localStorage.removeItem("user"); // Supprime les infos utilisateur
    alert("Vous avez été déconnecté avec succès !");
    navigate("/"); // Redirige vers la page d'accueil
    window.location.reload(); // Recharge pour actualiser l'état
  };
 
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/recruiter/dashboard">JobPortal</Link>
      </div>
      <ul className="navbar-links">
        <li>
          <Link to="/recruiter/dashboard">📊 Tableau de bord</Link>
        </li>
        <li>
          <Link to="/recruiter/add-job">➕ Ajouter une offre</Link>
        </li>
        <li>
          <Link to="/recruiter/applications">📂 Candidatures</Link>
        </li>
      </ul>
      <div className="navbar-actions">
        <span>Bienvenue, {user.name}</span>
        <button onClick={handleLogout}>🚪 Déconnexion</button>
      </div>
    </nav>
  );
}
 
export default RecruiterNavBar;
 