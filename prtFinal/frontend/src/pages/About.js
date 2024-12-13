import React from "react";
import "./About.css";

function About() {
  return (
    <div className="about-page">
      <h1>À propos de nous</h1>
      <p className="about-intro">
        Chez <span className="highlight">JobS</span>, nous croyons que chaque
        individu mérite de trouver un travail qui le passionne. Notre mission
        est de connecter les talents aux opportunités, en simplifiant la
        recherche d'emploi tout en valorisant les parcours uniques.
      </p>
      <div className="about-mission">
        <h2>Notre Mission</h2>
        <p>
          Créer un pont entre les recruteurs et les chercheurs d'emploi, basé
          sur la transparence, l'accessibilité et la confiance. Chaque jour,
          nous nous efforçons de rendre le marché de l'emploi plus inclusif et
          accessible à tous.
        </p>
      </div>
      <div className="about-values">
        <h2>Nos Valeurs</h2>
        <ul>
          <li>
            <strong>Écoute :</strong> Nous plaçons les besoins des candidats et
            des entreprises au cœur de notre service.
          </li>
          <li>
            <strong>Innovation :</strong> Nous utilisons la technologie pour
            simplifier et enrichir votre expérience.
          </li>
          <li>
            <strong>Impact :</strong> Nous mesurons notre succès à travers la
            satisfaction de nos utilisateurs.
          </li>
        </ul>
      </div>
      <div className="about-cta">
        <p>
          Rejoignez-nous dans cette aventure et découvrez comment JobS peut
          transformer votre carrière. Ensemble, ouvrons les portes de votre
          avenir !
        </p>
        <button onClick={() => (window.location.href = "/contact")}>
          Contactez-nous
        </button>
      </div>
    </div>
  );
}

export default About;
