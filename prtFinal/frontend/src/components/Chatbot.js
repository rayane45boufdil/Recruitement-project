import React, { useState } from "react";
import "./Chatbot.css";
const apiKey = "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";

function Chatbot() {
  const [messages, setMessages] = useState([]); // Pour stocker les messages
  const [input, setInput] = useState(""); // Pour stocker l'entrée utilisateur
  const [isOpen, setIsOpen] = useState(false); // Pour ouvrir/fermer le chatbot

  // Récupérer l'email de l'utilisateur connecté
  const user = JSON.parse(localStorage.getItem("user"));
  const userEmail = user?.email;

  // Détecter si le message demande le statut d'une candidature
  const isStatusRequest = (message) => {
    return message.toLowerCase().includes("statut de ma candidature");
  };

  // Détecter si le message demande les offres d'emploi disponibles
  const isJobsRequest = (message) => {
    return (
      message.toLowerCase().includes("offres disponibles") ||
      message.toLowerCase().includes("emplois disponibles")
    );
  };

  // Extraire le nom de l'offre du message
  const extractJobName = (message) => {
    const match = message.match(/pour (.+)$/i); // Extrait le nom de l'offre après "pour"
    return match ? match[1] : null;
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    // Ajouter le message utilisateur
    setMessages([...messages, { role: "user", content: input }]);
    const userInput = input.toLowerCase();
    setInput("");

    // Vérification : demande de statut de candidature
    if (isStatusRequest(userInput)) {
      const jobName = extractJobName(userInput);

      if (!jobName) {
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            role: "assistant",
            content:
              "Je n'ai pas pu identifier l'offre d'emploi dans votre question. Pouvez-vous préciser le nom de l'offre ?",
          },
        ]);
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:5000/candidate/application-status?email=${userEmail}&jobName=${jobName}`
        );

        if (!response.ok) {
          throw new Error("Erreur lors de la récupération du statut.");
        }

        const data = await response.json();
        const statusMessage =
          data.status === "accepted"
            ? `Félicitations ! Votre candidature pour l'offre "${jobName}" a été acceptée.`
            : data.status === "rejected"
            ? `Malheureusement, votre candidature pour l'offre "${jobName}" a été refusée.`
            : `Votre candidature pour l'offre "${jobName}" est en cours de traitement.`;

        setMessages((prevMessages) => [
          ...prevMessages,
          { role: "assistant", content: statusMessage },
        ]);
      } catch (err) {
        console.error("Erreur lors de la vérification du statut :", err);
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            role: "assistant",
            content:
              "Désolé, une erreur s'est produite lors de la vérification de votre statut.",
          },
        ]);
      }
      return;
    }

    // Vérification : demande des offres d'emploi disponibles
    if (isJobsRequest(userInput)) {
      try {
        const response = await fetch("http://localhost:5000/jobs");

        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des offres d'emploi.");
        }

        const jobs = await response.json();

        if (jobs.length === 0) {
          setMessages((prevMessages) => [
            ...prevMessages,
            {
              role: "assistant",
              content: "Aucune offre d'emploi n'est disponible pour le moment.",
            },
          ]);
          return;
        }

        const jobsList = jobs
          .map((job) => `- ${job.title} chez ${job.company} (${job.location})`)
          .join("\n");

        setMessages((prevMessages) => [
          ...prevMessages,
          {
            role: "assistant",
            content: `Voici les offres d'emploi disponibles actuellement :\n${jobsList}`,
          },
        ]);
      } catch (err) {
        console.error("Erreur lors de la récupération des offres :", err);
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            role: "assistant",
            content:
              "Désolé, une erreur s'est produite lors de la récupération des offres d'emploi.",
          },
        ]);
      }
      return;
    }

    // Réponse par défaut ou autre logique
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        role: "assistant",
        content:
          "Je suis là pour répondre à vos questions liées aux offres d'emploi, candidatures et recrutements.",
      },
    ]);
  };

  return (
    <>
      <button className="chatbot-toggle" onClick={() => setIsOpen(!isOpen)}>
        💬
      </button>
      <div className={`chatbot-container ${isOpen ? "open" : ""}`}>
        <div className="chatbot-header">
          <span>Assistant Recrutement</span>
          <button onClick={() => setIsOpen(false)}>✖</button>
        </div>
        <div className="chatbot-messages">
          {messages.map((msg, index) => (
            <div key={index} className={`chatbot-message ${msg.role}`}>
              <span>{msg.content}</span>
            </div>
          ))}
        </div>
        <div className="chatbot-footer">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Écrivez un message..."
          />
          <button onClick={sendMessage}>Envoyer</button>
        </div>
      </div>
    </>
  );
}

export default Chatbot;
