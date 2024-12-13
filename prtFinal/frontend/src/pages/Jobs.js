import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Jobs.css";
import Chatbot from "../components/Chatbot";


function Jobs() {
  const [jobs, setJobs] = useState([]); // State pour les offres d'emploi
  const [searchTerm, setSearchTerm] = useState(""); // State pour la recherche
  const navigate = useNavigate(); // Pour rediriger l'utilisateur

  // Fetch les données des jobs depuis l'API backend
  useEffect(() => {
    fetch("http://localhost:5000/jobs")
      .then((response) => response.json())
      .then((data) => setJobs(data))
      .catch((err) =>
        console.error("Erreur lors du chargement des jobs :", err)
      );
  }, []);

  // Filtrer les jobs en fonction du terme de recherche
  const filteredJobs = jobs.filter((job) =>
    job.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="jobs-page">
      <h1>Liste des Offres d'Emploi</h1>

      {/* Barre de recherche */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Rechercher un poste..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Liste des offres d'emploi */}
      <div className="jobs-list">
        {filteredJobs.map((job) => (
          <div className="job-card" key={job.id}>
            <h3>{job.title}</h3>
            <p>
              <strong>Entreprise :</strong> {job.company}
            </p>
            <p>
              <strong>Lieu :</strong> {job.location}
            </p>
            <p>
              <strong>Salaire :</strong> {job.salary} $
            </p>
            <button
              onClick={() => navigate(`/jobs/${job.id}`)} // Redirige vers la page des détails
            >
              Plus de détails
            </button>
          </div>
        ))}
      </div>

      {/* Intégration du chatbot */}
      <Chatbot />
    </div>
  );
}

export default Jobs;
