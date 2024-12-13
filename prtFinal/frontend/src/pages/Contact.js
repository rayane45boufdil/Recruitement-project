import React, { useState } from "react";
import "./Contact.css";

function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Merci ${name}, nous avons reçu votre message !`);
    // Réinitialiser les champs après soumission
    setName("");
    setEmail("");
    setMessage("");
  };

  return (
    <div className="contact-page">
      <h1>Contactez-nous</h1>
      <p>
        Vous avez des questions ou souhaitez en savoir plus ? Remplissez le
        formulaire ci-dessous et nous vous répondrons rapidement.
      </p>
      <form onSubmit={handleSubmit} className="contact-form">
        <label>Nom</label>
        <input
          type="text"
          placeholder="Entrez votre nom"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <label>Email</label>
        <input
          type="email"
          placeholder="Entrez votre email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label>Message</label>
        <textarea
          placeholder="Votre message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
        ></textarea>
        <button type="submit">Envoyer</button>
      </form>
    </div>
  );
}

export default Contact;
