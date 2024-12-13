import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
 
const EditJob = () => {
  const { id } = useParams(); // ID de l'offre à modifier
  const navigate = useNavigate();
 
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    salary: "",
  });
 
  // Récupérer les détails de l'offre
  useEffect(() => {
    axios
      .get(`http://localhost:5000/jobs/${id}`)
      .then((response) => {
        setFormData(response.data);
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des détails :", error);
      });
  }, [id]);
 
  // Gestion des changements dans les champs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
 
  // Soumettre les modifications
  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .put(`http://localhost:5000/recruiter/update-job/${id}`, formData)
      .then((response) => {
        alert("Offre modifiée avec succès !");
        navigate("/recruiter/dashboard"); // Redirection après la modification
      })
      .catch((error) => {
        console.error("Erreur lors de la mise à jour :", error);
      });
  };
 
  return (
    <div className="edit-job">
      <h2>Modifier l'offre</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Titre :</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Description :</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Localisation :</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Salaire :</label>
          <input
            type="number"
            name="salary"
            value={formData.salary}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Enregistrer les modifications</button>
      </form>
    </div>
  );
};
 
export default EditJob;
 
 