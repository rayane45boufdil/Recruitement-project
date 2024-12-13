import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function RecruiterSignup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    company_name: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/recruiter/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Inscription réussie !");
        navigate("/recruiter/login");
      } else {
        const errorData = await response.json();
        alert(errorData.error);
      }
    } catch (err) {
      alert("Erreur serveur. Veuillez réessayer plus tard.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Inscription Recruteur</h2>
      <input name="name" placeholder="Nom" onChange={handleChange} required />
      <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
      <input name="password" type="password" placeholder="Mot de passe" onChange={handleChange} required />
      <input name="company_name" placeholder="Nom de l'entreprise" onChange={handleChange} required />
      <button type="submit">S'inscrire</button>
    </form>
  );
}

export default RecruiterSignup;
