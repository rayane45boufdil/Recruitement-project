import React from "react";
import { useNavigate } from "react-router-dom";
import Chatbot from "../components/Chatbot"; // Importer le composant Chatbot
import "./Home.css";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home">
      {/* Hero Section */}
      <div className="hero">
        <div className="hero-content">
          <h1>Explorez Votre Avenir</h1>
          <p className="quote">
            "Le futur appartient à ceux qui croient en la beauté de leurs
            rêves."
            <br />- Eleanor Roosevelt
          </p>
          <div className="role-buttons">
            <button
              className="btn-recruiter"
              onClick={() => navigate("/recruiter/login")}
            >
              👔 Recruteur
            </button>
            <button
              className="btn-candidate"
              onClick={() => navigate("/login")}
            >
              💼 Candidat
            </button>
          </div>
        </div>
        <div className="hero-image-wrapper">
          <img
            src="/images/test.jpg"
            alt="Opportunités Futures"
            className="hero-image"
          />
        </div>
      </div>

      {/* Featured Roles Section */}
      <div className="characters-section">
        <h2>Nos Héros au Travail</h2>
        <p className="subtitle">
          Découvrez les professions les plus recherchées
        </p>
        <div className="characters">
          <div className="character-card">
            <img
              className="character"
              src="/images/oot.jpg"
              alt="Développeur"
            />
            <p>Développeur</p>
          </div>
          <div className="character-card">
            <img className="character" src="/images/pt.jpg" alt="Médecin" />
            <p>Médecin</p>
          </div>
          <div className="character-card">
            <img
              className="character"
              src="/images/br.jpg"
              alt="Chef cuisinier"
            />
            <p>Chef cuisinier</p>
          </div>
          <div className="character-card">
            <img className="character" src="/images/ptt.jpg" alt="Artiste" />
            <p>Artiste</p>
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <footer className="footer">
        <p>© 2024 JobS. Tous droits réservés.</p>
      </footer>

      {/* Chatbot Section */}
      <Chatbot /> {/* Affichez le chatbot ici */}
    </div>
  );
}

export default Home;
