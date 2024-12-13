import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./JobApplication.css";
 
function JobApplication() {
  const { state } = useLocation();
  const job = state?.job || {}; // Job details
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [motivationLetter, setMotivationLetter] = useState("");
  const [cv, setCv] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false); // Unified processing state
  const navigate = useNavigate(); // For navigation
 
  useEffect(() => {
    // Prefill name and email from localStorage if user is logged in
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, []);
 
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    setCv(file);
 
    if (file) {
      setIsProcessing(true);
      try {
        const formData = new FormData();
        formData.append("cv", file);
 
        // Extract CV data
        const extractResponse = await fetch(
          "http://localhost:5000/extract-cv",
          {
            method: "POST",
            body: formData,
          }
        );
 
        if (!extractResponse.ok) {
          throw new Error("Erreur lors de l'extraction du CV.");
        }
 
        const extractedData = await extractResponse.json();
 
        // Clean and validate skills
        const cleanedSkills = extractedData.skills.filter(
          (skill) =>
            /^[a-zA-Z]+$/.test(skill) &&
            skill.length > 2 &&
            !["www", "copyright", "2017", "les"].includes(skill.toLowerCase())
        );
 
        // Generate the motivation letter using cleaned skills
        const letterResponse = await fetch(
          "http://localhost:5000/generate-letter",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: extractedData.name,
              jobTitle: job.title,
              skills: cleanedSkills,
            }),
          }
        );
 
        if (!letterResponse.ok) {
          throw new Error(
            "Erreur lors de la génération de la lettre de motivation."
          );
        }
 
        const letterData = await letterResponse.json();
        setMotivationLetter(letterData.motivationLetter || "");
        alert("Lettre de motivation générée avec succès !");
      } catch (err) {
        console.error("Erreur :", err);
        alert("Erreur lors du traitement du CV. Veuillez réessayer.");
      } finally {
        setIsProcessing(false);
      }
    }
  };
 
  const handleSubmit = async (e) => {
    e.preventDefault();
 
    if (!cv) {
      alert("Veuillez télécharger votre CV.");
      return;
    }
 
    setIsProcessing(true);
 
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("motivationLetter", motivationLetter);
    formData.append("jobId", job.id);
    formData.append("cv", cv);
 
    try {
      const response = await fetch("http://localhost:5000/apply", {
        method: "POST",
        body: formData,
      });
 
      if (!response.ok) {
        throw new Error("Erreur lors de l'envoi de la candidature.");
      }
 
      const data = await response.json();
      alert("Votre candidature a été envoyée avec succès !");
      console.log(data);
 
      // Redirect to Jobs page after successful submission
      navigate("/jobs");
    } catch (err) {
      console.error("Erreur lors de l'envoi de la candidature :", err);
      alert("Erreur lors de l'envoi de la candidature. Veuillez réessayer.");
    } finally {
      setIsProcessing(false);
    }
  };
 
  return (
    <div className="application-page">
      <h1>Postuler pour : {job.title || "Un poste"}</h1>
      <form onSubmit={handleSubmit} className="application-form">
        <div className="form-group">
          <label>Nom</label>
          <input
            type="text"
            placeholder="Entrez votre nom"
            value={name}
            readOnly
          />
        </div>
 
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            placeholder="Entrez votre email"
            value={email}
            readOnly
          />
        </div>
 
        <div className="form-group">
          <label>Lettre de motivation</label>
          <textarea
            placeholder="Votre lettre de motivation sera générée automatiquement."
            value={motivationLetter}
            onChange={(e) => setMotivationLetter(e.target.value)}
            required
          />
        </div>
 
        <div className="form-group">
          <label>CV (PDF)</label>
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            disabled={isProcessing}
            required
          />
        </div>
 
        <button type="submit" disabled={isProcessing} className="submit-btn">
          {isProcessing ? "Traitement en cours..." : "Envoyer"}
        </button>
      </form>
  
    </div>
  );
}
 
export default JobApplication;
 
 