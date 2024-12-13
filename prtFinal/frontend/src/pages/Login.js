import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Auth.css";
 
function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // Error state
  const navigate = useNavigate();
 
  const handleSubmit = async (e) => {
    e.preventDefault();
 
    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
 
      if (response.ok) {
        const data = await response.json();
        console.log("Données reçues du serveur :", data);
 
        if (data.user) {
          if (data.user.role === "condidat") {
            localStorage.setItem("user", JSON.stringify(data.user)); // Save user info
            alert(data.message); // Success message
            navigate("/jobs"); // Redirect to jobs page
            window.location.reload(); // Sync state
          } else {
            setError(
              "Vous n'avez pas les autorisations nécessaires pour accéder à cette page."
            );
          }
        } else {
          setError("Les données utilisateur sont manquantes dans la réponse.");
        }
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Erreur lors de la connexion.");
      }
    } catch (error) {
      console.error("Erreur serveur :", error);
      setError("Erreur serveur. Veuillez réessayer plus tard.");
    }
  };
 
  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Connexion</h2>
        {error && <div className="error-message">{error}</div>}{" "}
        {/* Display error */}
        <form onSubmit={handleSubmit}>
          <label>Email</label>
          <input
            type="email"
            placeholder="Entrez votre email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label>Mot de passe</label>
          <input
            type="password"
            placeholder="Entrez votre mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Se connecter</button>
        </form>
        <p>
          Pas encore de compte ? <a href="/signup">Inscrivez-vous ici</a>
        </p>
      </div>
    </div>
  );
}
 
export default Login;
 
 