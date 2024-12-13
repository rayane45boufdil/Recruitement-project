import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

function RecruiterLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.includes("@")) {
      setError("Veuillez entrer une adresse email valide.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/recruiter/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Données reçues du serveur :", data);

        if (data.user && data.user.role === "recruiter") {
          localStorage.setItem("user", JSON.stringify(data.user));
          alert(data.message);
          navigate("/recruiter/dashboard");
          window.location.reload(); // Recharge la page pour synchroniser l'utilisateur
        } else {
          setError("Vous n'avez pas les autorisations nécessaires pour accéder à cette page.");
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
        <h2>Connexion Recruteur</h2>
        {error && <div className="error-message">{error}</div>}
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
          Pas encore de compte recruteur ?{" "}
          <a href="/recruiter/signup">Inscrivez-vous ici</a>
        </p>
      </div>
    </div>
  );
}

export default RecruiterLogin;
