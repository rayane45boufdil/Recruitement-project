import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function AddJob() {
  const [jobDetails, setJobDetails] = useState({
    title: "",
    description: "",
    location: "",
    salary: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setJobDetails({ ...jobDetails, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const user = JSON.parse(localStorage.getItem("user")); // Récupérer l'utilisateur connecté
    if (!user || !user.id) {
      alert("Vous devez être connecté pour effectuer cette action.");
      navigate("/recruiter/login");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/recruiter/add-job", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "user-id": user.id, // Passer userId dans les headers
        },
        body: JSON.stringify(jobDetails),
      });

      if (!response.ok) throw new Error("Erreur lors de l'ajout de l'offre.");
      alert("Offre ajoutée avec succès !");
      navigate("/recruiter/dashboard");
    } catch (err) {
      console.error("Erreur :", err);
      alert("Erreur lors de l'ajout de l'offre. Veuillez réessayer.");
    }
  };

  return (
    <div className="add-job-page">
      <h1>Ajouter une Offre d'Emploi</h1>
      <form onSubmit={handleSubmit} className="add-job-form">
        <div className="form-group">
          <label>Titre de l'offre</label>
          <input
            type="text"
            name="title"
            placeholder="Titre de l'offre"
            value={jobDetails.title}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            placeholder="Description de l'offre"
            value={jobDetails.description}
            onChange={handleChange}
            required
          ></textarea>
        </div>
        <div className="form-group">
          <label>Localisation</label>
          <input
            type="text"
            name="location"
            placeholder="Localisation"
            value={jobDetails.location}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Salaire</label>
          <input
            type="text"
            name="salary"
            placeholder="Salaire (facultatif)"
            value={jobDetails.salary}
            onChange={handleChange}
          />
        </div>
        <button type="submit" className="submit-btn">
          Ajouter l'offre
        </button>
      </form>
    </div>
  );
}

export default AddJob;
