import React, { useState, useContext } from "react";
import axios from "axios";
import API_URL from "../config";
import { CvContext } from "../CvContext"; // Import du contexte pour partager les données du CV

function UploadCv() {
  const [file, setFile] = useState(null); // État pour stocker le fichier sélectionné
  const [message, setMessage] = useState(""); // État pour afficher les messages d'erreur ou de succès
  const { setUploadedCv } = useContext(CvContext); // Récupérer le setter du contexte pour partager le CV

  const handleUpload = async () => {
    // Vérifiez si un fichier est sélectionné
    if (!file) {
      setMessage("Veuillez sélectionner un fichier.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file); // Ajoutez le fichier au FormData pour l'envoi

    try {
      // Envoyer le fichier au backend
      const response = await axios.post(`${API_URL}/api/upload_cv/`, formData);
      setMessage("Le CV a été téléchargé avec succès !");
      setUploadedCv(file); // Mettre à jour le contexte avec le fichier téléchargé
      console.log("Réponse du backend :", response.data); // (Optionnel) Pour déboguer ou vérifier la réponse
    } catch (error) {
      // Gérer les erreurs
      setMessage(
        error.response?.data?.message || "Erreur lors du téléchargement."
      );
    }
  };

  return (
    <div className="upload-cv-container">
      <h2 className="text-2xl font-bold mb-4">Télécharger votre CV</h2>
      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])} // Met à jour l'état avec le fichier sélectionné
        className="block w-full text-gray-700 border border-gray-300 rounded-md bg-white focus:ring focus:ring-blue-500 p-2 mb-4"
      />
      <button
        onClick={handleUpload}
        className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300"
      >
        Upload
      </button>
      {message && <p className="mt-4 text-center text-red-500">{message}</p>}
    </div>
  );
}

export default UploadCv;
