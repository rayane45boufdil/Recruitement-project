import "./Auth.css";

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Les mots de passe ne correspondent pas.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      if (response.ok) {
        alert("Inscription réussie !");
        navigate("/login");
      } else {
        const message = await response.text();
        alert(message);
      }
    } catch (err) {
      console.error(err);
      alert("Une erreur est survenue.");
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>Rejoignez-nous</h1>
      <form onSubmit={handleSignup}>
        <div>
          <label>Nom :</label>
          <input
            type="text"
            placeholder="Entrez votre nom"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Email :</label>
          <input
            type="email"
            placeholder="Entrez votre email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Mot de passe :</label>
          <input
            type="password"
            placeholder="Entrez votre mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Confirmez le mot de passe :</label>
          <input
            type="password"
            placeholder="Confirmez le mot de passe"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" style={{ marginTop: "20px" }}>
          S'inscrire
        </button>
      </form>
      <p>
        Déjà un compte ? <a href="/login">Connectez-vous ici</a>
      </p>
    </div>
  );
}

export default Signup;
