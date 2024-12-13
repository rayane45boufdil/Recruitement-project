import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./JobDetails.css";

function JobDetails() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://localhost:5000/jobs/${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erreur lors du chargement des données.");
        }
        return response.json();
      })
      .then((data) => setJob(data))
      .catch((error) =>
        console.error("Erreur lors du chargement des détails :", error)
      );
  }, [id]);

  if (!job) {
    return <p>Chargement des détails du poste...</p>;
  }

  return (
    <div className="job-details">
      <h2>{job.title}</h2>
      <p>
        <strong>Entreprise :</strong> {job.company}
      </p>
      <p>
        <strong>Lieu :</strong> {job.location}
      </p>
      <p>
        <strong>Salaire :</strong> {job.salary} $
      </p>
      <p>
        <strong>Description :</strong> {job.description}
      </p>
      <button
        onClick={() =>
          navigate("/apply", {
            state: { job },
          })
        }
        className="apply-button"
      >
        Postuler
      </button>
    </div>
  );
}

export default JobDetails;
