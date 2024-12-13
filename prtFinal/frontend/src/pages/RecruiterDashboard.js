import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./RecruiterDashboard.css"; // CSS spécifique au Dashboard
 
function RecruiterDashboard() {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
 
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
 
    if (!user || !user.id) {
      navigate("/recruiter/login");
      return;
    }
 
    // Récupérer les offres d'emploi
    fetch("http://localhost:5000/recruiter/jobs", {
      headers: { "user-id": user.id },
    })
      .then((res) => res.json())
      .then((data) => setJobs(data))
      .catch((err) => console.error(err));
 
    // Récupérer les candidatures
    fetch("http://localhost:5000/recruiter/applications", {
      headers: { "user-id": user.id },
    })
      .then((res) => res.json())
      .then((data) => setApplications(data))
      .catch((err) => console.error(err));
  }, [navigate]);
 
  const handleAddJob = () => {
    navigate("/recruiter/add-job");
  };
 
  const handleEditJob = (id) => {
    navigate(`/recruiter/edit-job/${id}`);
  };
 
  const handleDeleteJob = (id) => {
    if (window.confirm("Voulez-vous vraiment supprimer cette offre ?")) {
      fetch(`http://localhost:5000/recruiter/delete-job/${id}`, {
        method: "DELETE",
      })
        .then((res) => {
          if (res.ok) {
            setJobs((prev) => prev.filter((job) => job.id !== id));
            setMessage("Offre supprimée avec succès !");
          } else {
            throw new Error("Erreur lors de la suppression.");
          }
        })
        .catch((err) => {
          console.error(err);
          setMessage("Erreur lors de la suppression de l'offre.");
        });
    }
  };
 
  const handleUpdateApplicationStatus = (id, status) => {
    fetch(`http://localhost:5000/recruiter/update-application-status/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    })
      .then((res) => {
        if (res.ok) {
          setApplications((prev) =>
            prev.map((app) => (app.id === id ? { ...app, status } : app))
          );
          setMessage("Statut mis à jour avec succès !");
        } else {
          throw new Error("Erreur lors de la mise à jour.");
        }
      })
      .catch((err) => {
        console.error(err);
        setMessage("Erreur lors de la mise à jour du statut.");
      });
  };
 
  return (
    <>
      <div className="dashboard-container">
        <header className="dashboard-header">
          <h1>Tableau de bord Recruteur</h1>
          {message && <p className="message">{message}</p>}
        </header>
 
        <section className="jobs-section">
          <div className="section-header">
            <h2>Vos offres d'emploi</h2>
            <button className="btn-add-job" onClick={handleAddJob}>
              Ajouter une offre
            </button>
          </div>
          {jobs.length > 0 ? (
            <table className="jobs-table">
              <thead>
                <tr>
                  <th>Titre</th>
                  <th>Description</th>
                  <th>Localisation</th>
                  <th>Salaire</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job) => (
                  <tr key={job.id}>
                    <td>{job.title}</td>
                    <td>{job.description}</td>
                    <td>{job.location}</td>
                    <td>{job.salary || "Non spécifié"}</td>
                    <td>
                      <button
                        className="btn-edit"
                        onClick={() => handleEditJob(job.id)}
                      >
                        Modifier
                      </button>
                      <button
                        className="btn-delete"
                        onClick={() => handleDeleteJob(job.id)}
                      >
                        Supprimer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>Aucune offre disponible.</p>
          )}
        </section>
 
        <section className="candidates-section">
          <h2>Candidatures reçues</h2>
          {applications.length > 0 ? (
            <table className="applications-table">
              <thead>
                <tr>
                  <th>Nom</th>
                  <th>Email</th>
                  <th>Lettre de motivation</th>
                  <th>CV</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr key={app.id}>
                    <td>{app.name}</td>
                    <td>{app.email}</td>
                    <td>{app.motivation_letter}</td>
                    <td>
                      <a
                        href={app.cv_link}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Voir le CV
                      </a>
                    </td>
                    <td>
                      <span
                        className={`status ${
                          app.status === "accepted"
                            ? "status-accepted"
                            : "status-rejected"
                        }`}
                      >
                        {app.status}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn-accept"
                        onClick={() =>
                          handleUpdateApplicationStatus(app.id, "accepted")
                        }
                      >
                        Accepter
                      </button>
                      <button
                        className="btn-reject"
                        onClick={() =>
                          handleUpdateApplicationStatus(app.id, "rejected")
                        }
                      >
                        Refuser
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>Aucune candidature reçue.</p>
          )}
        </section>
      </div>
    </>
  );
}
 
export default RecruiterDashboard;
 
 