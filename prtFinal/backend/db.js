const mysql = require("mysql");

// Configuration de la connexion à MySQL
const db = mysql.createConnection({
  host: "localhost", // Hôte MySQL (localhost ou adresse IP du serveur)
  user: "root", // Nom d'utilisateur MySQL
  password: "", // Mot de passe MySQL
  database: "JobPortal", // Nom de la base de données
});

// Connecter à MySQL
db.connect((err) => {
  if (err) {
    console.error("Erreur de connexion à la base de données :", err);
    return;
  }
  console.log("Connecté à la base de données MySQL.");
});

module.exports = db;
