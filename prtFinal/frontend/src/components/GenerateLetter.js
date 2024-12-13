import axios from "axios";
import { useState } from "react";
import API_URL from "../config";

function GenerateLetter() {
  const [letter, setLetter] = useState("");
  const [message, setMessage] = useState("");

  const handleGenerate = async () => {
    try {
      const response = await axios.post(`${API_URL}/api/generate_letter/`, {
        cv_id: 1, // Replace with actual CV ID
        job_id: 1, // Replace with actual Job ID
      });
      setLetter(response.data.letter);
      setMessage("");
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      setMessage("Erreur lors de la génération de la lettre");
    }
  };

  return (
    <div>
      <h2>Générer une Lettre de Motivation</h2>
      <button onClick={handleGenerate}>Générer</button>
      {message && <p>{message}</p>}
      <p>{letter}</p>
    </div>
  );
}

export default GenerateLetter;
