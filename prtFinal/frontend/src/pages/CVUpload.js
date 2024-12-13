import React, { useState } from "react";
import "./CVUpload.css";
 
function CVUploader() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [result, setResult] = useState(null);
 
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };
 
  const handleUpload = async (e) => {
    e.preventDefault();
 
    if (!selectedFile) {
      alert("Veuillez sélectionner un fichier.");
      return;
    }
 
    const formData = new FormData();
    formData.append("cv", selectedFile);
 
    try {
      const response = await fetch("http://localhost:5000/upload-cv", {
        method: "POST",
        body: formData,
      });
 
      const data = await response.json();
 
      if (data.success) {
        setResult(data);
      } else {
        alert("Erreur lors de l'analyse du fichier.");
      }
    } catch (err) {
      console.error("Erreur serveur :", err);
      alert("Erreur serveur. Veuillez réessayer plus tard.");
    }
  };
 
  return (
    <div className="cv-uploader">
      <h1>
        🤖 Analysez votre CV avec <span style={{ color: "#007bff" }}>IA</span>
      </h1>
      <div className="content-container">
        {/* Section gauche : Téléchargement */}
        <div className="left-column">
          <div className="robot-container">
            <span role="img" aria-label="robot" className="robot-icon">
              🤖
            </span>
          </div>
          <form onSubmit={handleUpload}>
            <input type="file" onChange={handleFileChange} accept=".pdf" />
            <button type="submit">Analyser</button>
          </form>
        </div>
 
        {/* Section droite : Résultats */}
        {result && (
          <div className="right-column">
            <div className="result-section">
              <h2>Compétences détectées :</h2>
              <ul>
                {result.skills.map((skill, index) => (
                  <li key={index}>{skill}</li>
                ))}
              </ul>
              <h2>Métiers suggérés :</h2>
              <ul>
                {result.jobs.map((job, index) => (
                  <li key={index}>
                    <strong>{job.title}</strong>: {job.description}
                  </li>
                ))}
              </ul>
              <h2>Statistiques :</h2>
              <div className="histogram">
                {result.skills.map((skill, index) => (
                  <div key={index} className="bar-container">
                    <div
                      className="bar"
                      style={{
                        height: `${Math.random() * 100 + 20}px`,
                      }}
                    ></div>
                    <span className="bar-label">{skill}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
 
export default CVUploader;
 
 