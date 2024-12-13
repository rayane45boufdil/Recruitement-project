const express = require("express");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const mammoth = require("mammoth");
const pdfParse = require("pdf-parse");
const mysql = require("mysql");
const bcrypt = require("bcrypt"); // Pour le hachage des mots de passe
 
const app = express();
 
// Middleware
app.use(cors());
app.use(express.json());
 
// Multer configuration for file uploads
const upload = multer({ dest: "uploads/" });
 
// Connexion à la base de données
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "JobPortal",
});
 
db.connect((err) => {
  if (err) {
    console.error("Erreur de connexion à la base de données :", err);
    return;
  }
  console.log("Connecté à la base de données.");
});
 
// Route to get all job offers
app.get("/jobs", (req, res) => {
  const sql = "SELECT * FROM jobs";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Erreur lors de la récupération des données :", err);
      return res.status(500).json({ error: "Erreur serveur" });
    }
    res.json(results);
  });
});
 
// Route to get details of a specific job
app.get("/jobs/:id", (req, res) => {
  const jobId = req.params.id;
  const sql = "SELECT * FROM jobs WHERE id = ?";
  db.query(sql, [jobId], (err, results) => {
    if (err) {
      console.error("Erreur lors de la récupération des détails :", err);
      return res.status(500).json({ error: "Erreur serveur" });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: "Offre d'emploi non trouvée" });
    }
    res.json(results[0]);
  });
});
 
// Extraction de texte depuis un PDF
async function extractTextFromPDF(filePath) {
  const dataBuffer = fs.readFileSync(filePath);
  const data = await pdfParse(dataBuffer);
  return data.text;
}
 
// Extraction de texte depuis un fichier DOCX
async function extractTextFromDocx(filePath) {
  const result = await mammoth.extractRawText({ path: filePath });
  return result.value;
}
 
// Extraction de texte basé sur le type de fichier
async function extractTextFromFile(filePath, mimeType) {
  if (mimeType === "application/pdf") {
    return await extractTextFromPDF(filePath);
  } else if (
    mimeType ===
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    return await extractTextFromDocx(filePath);
  } else {
    throw new Error("Format de fichier non pris en charge.");
  }
}
 
// Suggestions d'emplois basées sur les compétences
const jobSuggestions = {
  developer: ["html", "css", "javascript", "react", "node.js"],
  "data scientist": [
    "python",
    "machine learning",
    "data analysis",
    "pandas",
    "sql",
  ],
  designer: ["photoshop", "illustrator", "ui/ux", "figma", "adobe xd"],
};
 
// Extraction du nom (prénom et nom)
function extractName(text) {
  const nameRegex = /^[A-Z][a-z]+\s[A-Z][a-z]+/;
  const lines = text.split("\n");
  for (const line of lines) {
    if (nameRegex.test(line.trim())) {
      return line.trim();
    }
  }
  return "Nom non détecté";
}
 
// Extraction de l'e-mail
function extractEmail(text) {
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;
  const match = text.match(emailRegex);
  return match ? match[0] : "E-mail non détecté";
}
 
function findJobsBySkills(skills) {
  const matches = [];
  for (const [job, requiredSkills] of Object.entries(jobSuggestions)) {
    const match = requiredSkills.filter((skill) =>
      skills.includes(skill.toLowerCase())
    );
    if (match.length > 0) {
      matches.push({ job, match });
    }
  }
  return matches;
}
// CONSTANTES ET UTILITAIRES
const VALID_SKILLS = [
  "html",
  "css",
  "javascript",
  "react",
  "node.js",
  "python",
  "sql",
  "machine learning",
  "ui/ux",
  "photoshop",
  "illustrator",
  "figma",
  "data analysis",
];
 
// Fonction utilitaire : Extraction de texte depuis des fichiers
async function extractTextFromPDF(filePath) {
  const dataBuffer = fs.readFileSync(filePath);
  const data = await pdfParse(dataBuffer);
  return data.text;
}
 
async function extractTextFromDocx(filePath) {
  const result = await mammoth.extractRawText({ path: filePath });
  return result.value;
}
 
async function extractTextFromFile(filePath, mimeType) {
  if (mimeType === "application/pdf") {
    return await extractTextFromPDF(filePath);
  } else if (
    mimeType ===
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    return await extractTextFromDocx(filePath);
  } else {
    throw new Error("Format de fichier non pris en charge.");
  }
}
 
// Fonction utilitaire : Extraction des compétences
function extractSkills(text) {
  const words = text.toLowerCase().split(/\W+/);
  return words.filter((word) => VALID_SKILLS.includes(word));
}
 
// Fonction utilitaire : Extraction du nom et de l'email
function extractName(text) {
  const nameRegex = /^[A-Z][a-z]+\s[A-Z][a-z]+/;
  const lines = text.split("\n");
  for (const line of lines) {
    if (nameRegex.test(line.trim())) {
      return line.trim();
    }
  }
  return "Nom non détecté";
}
 
function extractEmail(text) {
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;
  const match = text.match(emailRegex);
  return match ? match[0] : "E-mail non détecté";
}
 
// ROUTES GÉNÉRALES
app.get("/jobs", (req, res) => {
  const sql = "SELECT * FROM jobs";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Erreur lors de la récupération des emplois :", err);
      return res.status(500).json({ error: "Erreur serveur" });
    }
    res.json(results);
  });
});
 
app.get("/jobs/:id", (req, res) => {
  const jobId = req.params.id;
  const sql = "SELECT * FROM jobs WHERE id = ?";
  db.query(sql, [jobId], (err, results) => {
    if (err) {
      console.error("Erreur lors de la récupération de l'emploi :", err);
      return res.status(500).json({ error: "Erreur serveur" });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: "Offre non trouvée" });
    }
    res.json(results[0]);
  });
});
app.post("/upload-cv", upload.single("cv"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "Aucun fichier téléchargé." });
  }
 
  const filePath = path.join(__dirname, req.file.path);
  const mimeType = req.file.mimetype;
 
  try {
    const text = await extractTextFromFile(filePath, mimeType); // Fonction pour extraire le texte
    const skills = extractSkills(text); // Fonction pour extraire les compétences
 
    // Simuler une liste de métiers et leurs descriptions
    const jobs = [
      {
        title: "Développeur Web",
        description: "Créer des sites web dynamiques.",
      },
      {
        title: "Analyste de Données",
        description: "Analyser les ensembles de données.",
      },
    ];
 
    fs.unlinkSync(filePath); // Supprime le fichier après l'analyse
 
    res.status(200).json({ success: true, skills, jobs });
  } catch (err) {
    console.error("Erreur lors de l'analyse du fichier :", err);
    fs.unlinkSync(filePath); // Supprime le fichier en cas d'erreur
    res.status(500).json({ error: "Erreur lors de l'analyse du fichier." });
  }
});
 
// ROUTES POUR LES CV ET COMPÉTENCES
app.post("/upload-cv", upload.single("cv"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "Aucun fichier téléchargé." });
  }
 
  const filePath = path.join(__dirname, req.file.path);
  const mimeType = req.file.mimetype;
 
  try {
    const text = await extractTextFromFile(filePath, mimeType);
    const skills = extractSkills(text);
 
    db.query("SELECT * FROM jobs", (err, jobs) => {
      if (err) {
        console.error("Erreur lors de la récupération des emplois :", err);
        return res.status(500).json({ error: "Erreur serveur" });
      }
 
      const relevantJobs = jobs.filter((job) => {
        const jobSkills = job.skills
          .split(",")
          .map((s) => s.trim().toLowerCase());
        return skills.some((skill) => jobSkills.includes(skill));
      });
 
      fs.unlinkSync(filePath);
 
      res.status(200).json({ success: true, skills, jobs: relevantJobs });
    });
  } catch (err) {
    console.error("Erreur lors de l'analyse du fichier :", err);
    fs.unlinkSync(filePath);
    res.status(500).json({ error: "Erreur lors de l'analyse du fichier." });
  }
});
function calculateRelevanceScore(candidateSkills, jobSkills) {
  const matchCount = candidateSkills.filter((skill) =>
    jobSkills.includes(skill)
  ).length;
  return (matchCount / jobSkills.length) * 100; // Score en pourcentage
}
 
app.post("/match-jobs", upload.single("cv"), async (req, res) => {
  const filePath = path.join(__dirname, req.file.path);
  const mimeType = req.file.mimetype;
 
  try {
    const text = await extractTextFromFile(filePath, mimeType);
    const candidateSkills = extractSkills(text);
 
    db.query("SELECT * FROM jobs", (err, jobs) => {
      if (err) {
        console.error("Erreur lors de la récupération des offres :", err);
        return res.status(500).json({ error: "Erreur serveur" });
      }
 
      const matchedJobs = jobs.map((job) => {
        const jobSkills = job.skills
          .split(",")
          .map((skill) => skill.trim().toLowerCase());
        const score = calculateRelevanceScore(candidateSkills, jobSkills);
        return { ...job, relevanceScore: score };
      });
 
      fs.unlinkSync(filePath);
 
      res.json(matchedJobs.sort((a, b) => b.relevanceScore - a.relevanceScore)); // Trier par pertinence
    });
  } catch (err) {
    console.error("Erreur lors de l'analyse du CV :", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});
 
app.get("/skills-trends", (req, res) => {
  const sql = `
    SELECT skill, COUNT(*) as frequency
    FROM extracted_skills
    GROUP BY skill
    ORDER BY frequency DESC
    LIMIT 10
  `;
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Erreur lors de l'analyse des tendances :", err);
      return res.status(500).json({ error: "Erreur serveur" });
    }
    res.json(results);
  });
});
const trainingSuggestions = {
  python: "https://www.coursera.org/specializations/python",
  sql: "https://www.datacamp.com/courses/sql",
  react: "https://reactjs.org/docs/getting-started.html",
};
 
app.post("/suggest-trainings", upload.single("cv"), async (req, res) => {
  const filePath = path.join(__dirname, req.file.path);
  const mimeType = req.file.mimetype;
 
  try {
    const text = await extractTextFromFile(filePath, mimeType);
    const candidateSkills = extractSkills(text);
 
    db.query("SELECT * FROM jobs", (err, jobs) => {
      if (err) {
        console.error("Erreur lors de la récupération des emplois :", err);
        return res.status(500).json({ error: "Erreur serveur" });
      }
 
      const missingSkills = [];
      jobs.forEach((job) => {
        const jobSkills = job.skills
          .split(",")
          .map((skill) => skill.trim().toLowerCase());
        jobSkills.forEach((skill) => {
          if (
            !candidateSkills.includes(skill) &&
            !missingSkills.includes(skill)
          ) {
            missingSkills.push(skill);
          }
        });
      });
      function calculateRelevanceScore(candidateSkills, jobSkills) {
        const matchCount = candidateSkills.filter((skill) =>
          jobSkills.includes(skill)
        ).length;
        return (matchCount / jobSkills.length) * 100; // Score en pourcentage
      }
 
      app.post("/match-jobs", upload.single("cv"), async (req, res) => {
        const filePath = path.join(__dirname, req.file.path);
        const mimeType = req.file.mimetype;
 
        try {
          const text = await extractTextFromFile(filePath, mimeType);
          const candidateSkills = extractSkills(text);
 
          db.query("SELECT * FROM jobs", (err, jobs) => {
            if (err) {
              console.error("Erreur lors de la récupération des offres :", err);
              return res.status(500).json({ error: "Erreur serveur" });
            }
 
            const matchedJobs = jobs.map((job) => {
              const jobSkills = job.skills
                .split(",")
                .map((skill) => skill.trim().toLowerCase());
              const score = calculateRelevanceScore(candidateSkills, jobSkills);
              return { ...job, relevanceScore: score };
            });
 
            fs.unlinkSync(filePath);
 
            res.json(
              matchedJobs.sort((a, b) => b.relevanceScore - a.relevanceScore)
            ); // Trier par pertinence
          });
        } catch (err) {
          console.error("Erreur lors de l'analyse du CV :", err);
          res.status(500).json({ error: "Erreur serveur" });
        }
      });
 
      const suggestions = missingSkills.map((skill) => ({
        skill,
        training: trainingSuggestions[skill] || "Formation non disponible",
      }));
 
      fs.unlinkSync(filePath);
 
      res.json(suggestions);
    });
  } catch (err) {
    console.error("Erreur lors de l'analyse du fichier :", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});
 
// Nouvelle route pour extraire nom, email et compétences
app.post("/extract-cv", upload.single("cv"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "Aucun fichier téléchargé." });
  }
 
  const filePath = path.join(__dirname, req.file.path);
  const mimeType = req.file.mimetype;
 
  try {
    const extractedText = await extractTextFromFile(filePath, mimeType);
 
    const name = extractName(extractedText);
    const email = extractEmail(extractedText);
    const skills = extractedText.toLowerCase().split(/\W+/);
    const matchedJobs = findJobsBySkills(skills);
 
    fs.unlinkSync(filePath);
 
    res.json({ name, email, skills, matchedJobs });
  } catch (err) {
    console.error("Erreur lors de l'extraction du CV :", err);
    res.status(500).json({ error: "Erreur lors de l'extraction du CV." });
  }
});
 
app.post("/generate-letter", async (req, res) => {
  const { name, jobTitle, skills } = req.body;
 
  if (!name || !jobTitle || !skills || skills.length === 0) {
    return res.status(400).json({
      error: "Les champs nom, titre du poste et compétences sont obligatoires.",
    });
  }
 
  try {
    // Filter and validate skills
    const relevantSkills = skills.filter((skill) =>
      VALID_SKILLS.includes(skill.toLowerCase())
    );
 
    // Use up to 5 skills or fallback to a generic placeholder
    const skillsList = relevantSkills.length
      ? relevantSkills.slice(0, 5).join(", ")
      : "des domaines clés de votre secteur";
 
    // Generate the motivation letter
    const motivationLetter = `
      Cher/Chère Responsable du recrutement,
 
      Je m'appelle ${name}, et je suis ravi(e) de postuler pour le poste de ${jobTitle}.
      Grâce à mes compétences en ${skillsList}, je suis convaincu(e) que mon expertise apportera une valeur ajoutée à votre équipe.
 
      Avec une grande motivation et une passion pour ce domaine, je suis sûr(e) que mes connaissances et mon expérience me permettront de contribuer activement à la réussite de votre organisation.
 
      Cordialement,
      ${name}
    `;
 
    res.json({ motivationLetter });
  } catch (err) {
    console.error(
      "Erreur lors de la génération de la lettre de motivation :",
      err
    );
    res.status(500).json({ error: "Erreur serveur." });
  }
});
app.post("/extract-cv", upload.single("cv"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "Aucun fichier téléchargé." });
  }
 
  const filePath = path.join(__dirname, req.file.path);
  const mimeType = req.file.mimetype;
  const insertApplicationQuery = `
  INSERT INTO applications (name, email, motivation_letter, cv_link, job_id, user_id, status, created_at)
  VALUES (?, ?, ?, ?, ?, ?, 'pending', NOW())
`;
 
  try {
    const extractedText = await extractTextFromFile(filePath, mimeType);
 
    const name = extractName(extractedText);
    const email = extractEmail(extractedText);
 
    // Extract raw skills and filter valid ones
    const rawSkills = extractedText.toLowerCase().split(/\W+/);
    const validSkills = rawSkills.filter((skill) =>
      VALID_SKILLS.includes(skill)
    );
 
    fs.unlinkSync(filePath);
 
    res.json({ name, email, skills: validSkills });
  } catch (err) {
    console.error("Erreur lors de l'extraction du CV :", err);
    res.status(500).json({ error: "Erreur lors de l'extraction du CV." });
  }
});
 
app.post("/apply", upload.single("cv"), (req, res) => {
  const { name, email, motivationLetter, jobId } = req.body;
  const cvFile = req.file; // Fichier CV envoyé par l'utilisateur
 
  if (!name || !email || !motivationLetter || !jobId || !cvFile) {
    return res
      .status(400)
      .json({ error: "Tous les champs sont obligatoires, y compris le CV." });
  }
 
  const checkUserQuery = "SELECT id FROM users WHERE email = ?";
  db.query(checkUserQuery, [email], (err, userResults) => {
    if (err) {
      console.error("Erreur lors de la vérification de l'utilisateur :", err);
      return res.status(500).json({ error: "Erreur serveur." });
    }
 
    let userId;
 
    if (userResults.length > 0) {
      userId = userResults[0].id; // L'utilisateur existe déjà
      insertApplication(userId);
    } else {
      // Insérer un nouvel utilisateur
      const insertUserQuery = "INSERT INTO users (name, email) VALUES (?, ?)";
      db.query(insertUserQuery, [name, email], (err, userInsertResults) => {
        if (err) {
          console.error("Erreur lors de l'insertion de l'utilisateur :", err);
          return res.status(500).json({ error: "Erreur serveur." });
        }
        userId = userInsertResults.insertId; // Récupérer l'ID utilisateur créé
        insertApplication(userId);
      });
    }
 
    // Fonction pour insérer la candidature
    function insertApplication(userId) {
      const cvLink = cvFile.path.replace(/\\/g, "/"); // Format du lien du fichier
      const insertApplicationQuery = `
        INSERT INTO applications (name, email, motivation_letter, cv_link, job_id, user_id, status, created_at)
        VALUES (?, ?, ?, ?, ?, ?, 'pending', NOW())
      `;
      db.query(
        insertApplicationQuery,
        [name, email, motivationLetter, cvLink, jobId, userId],
        (err) => {
          if (err) {
            console.error(
              "Erreur lors de l'insertion de la candidature :",
              err
            );
            return res.status(500).json({
              error: "Erreur lors de l'envoi de la candidature.",
            });
          }
          res.status(201).json({
            success: true,
            message: "Candidature soumise avec succès !",
          });
        }
      );
    }
  });
});
const insertApplicationQuery = `
  INSERT INTO applications (name, email, motivation_letter, cv_link, job_id, user_id, status, created_at)
  VALUES (?, ?, ?, ?, ?, ?, 'pending', NOW())
`;
 
// Route pour l'inscription utilisateur
app.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;
 
  // Validation des champs obligatoires
  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ error: "Tous les champs sont obligatoires." });
  }
 
  try {
    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);
 
    // Insérer l'utilisateur dans la table `users` avec le rôle de 'client'
    const insertUserQuery =
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, 'condidat')";
    db.query(insertUserQuery, [name, email, hashedPassword], (err) => {
      if (err) {
        console.error("Erreur lors de l'insertion de l'utilisateur :", err);
        return res.status(500).json({ error: "Erreur lors de l'inscription." });
      }
 
      res.status(201).json({ message: "Candidat inscrit avec succès !" });
    });
  } catch (err) {
    console.error("Erreur lors du traitement :", err);
    res.status(500).json({ error: "Erreur serveur." });
  }
});
 
// Route pour la connexion utilisateur
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
 
  if (!email || !password) {
    return res
      .status(400)
      .json({ error: "Tous les champs sont obligatoires." });
  }
 
  const checkUserQuery =
    "SELECT * FROM users WHERE email = ? AND role = 'condidat'"; // Filtrer par rôle
 
  db.query(checkUserQuery, [email], async (err, results) => {
    if (err) {
      console.error("Erreur lors de la vérification de l'utilisateur :", err);
      return res.status(500).json({ error: "Erreur serveur." });
    }
 
    if (results.length === 0) {
      return res.status(404).json({ error: "Utilisateur non trouvé." });
    }
 
    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);
 
    if (!isMatch) {
      return res.status(400).json({ error: "Mot de passe incorrect." });
    }
 
    // Retournez les informations utilisateur avec le message
    res.status(200).json({
      message: "Connexion réussie !",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role, // Cela doit être "condidat" dans ce cas
      },
    });
  });
});
 
app.post("/recruiter/signup", async (req, res) => {
  const { name, email, password, company_name } = req.body;
 
  // Validation des champs obligatoires
  if (!name || !email || !password || !company_name) {
    return res
      .status(400)
      .json({ error: "Tous les champs sont obligatoires." });
  }
 
  try {
    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);
 
    // Insérer l'utilisateur dans la table users avec le rôle de 'recruiter'
    const insertUserQuery =
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, 'recruiter')";
    db.query(
      insertUserQuery,
      [name, email, hashedPassword],
      (err, userResult) => {
        if (err) {
          console.error("Erreur lors de l'insertion de l'utilisateur :", err);
          return res
            .status(500)
            .json({ error: "Erreur lors de l'inscription." });
        }
 
        const userId = userResult.insertId; // ID généré pour l'utilisateur
 
        // Insérer le recruteur dans la table recruiters
        const insertRecruiterQuery =
          "INSERT INTO recruiters (user_id, company_name) VALUES (?, ?)";
        console.log("Exécution de la requête :", insertRecruiterQuery);
        db.query(insertRecruiterQuery, [userId, company_name], (err) => {
          if (err) {
            console.error("Erreur lors de l'insertion du recruteur :", err);
            return res.status(500).json({ error: "Erreur serveur." });
          }
          res.status(201).json({ message: "Recruteur inscrit avec succès !" });
        });
      }
    );
  } catch (err) {
    console.error("Erreur lors du traitement :", err);
    res.status(500).json({ error: "Erreur serveur." });
  }
});
 
app.post("/recruiter/login", async (req, res) => {
  const { email, password } = req.body;
 
  if (!email || !password) {
    return res
      .status(400)
      .json({ error: "Tous les champs sont obligatoires." });
  }
 
  const checkUserQuery =
    "SELECT * FROM users WHERE email = ? AND role = 'recruiter'";
  db.query(checkUserQuery, [email], async (err, results) => {
    if (err) {
      console.error("Erreur lors de la vérification de l'utilisateur :", err);
      return res.status(500).json({ error: "Erreur serveur." });
    }
 
    if (results.length === 0) {
      return res.status(404).json({ error: "Utilisateur non trouvé." });
    }
 
    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);
 
    if (!isMatch) {
      return res.status(400).json({ error: "Mot de passe incorrect." });
    }
 
    // Si tout est correct, retournez une réponse réussie
    res.status(200).json({
      message: "Connexion réussie !",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  });
});
 
app.post("/recruiter/add-job", (req, res) => {
  const { title, description, location, salary } = req.body;
  const userId = req.headers["user-id"]; // Récupérer l'user_id depuis les headers
 
  if (!userId) {
    return res.status(401).json({ error: "Utilisateur non authentifié." });
  }
 
  // Trouver le recruiter_id à partir de l'user_id
  const getRecruiterIdQuery = "SELECT id FROM recruiters WHERE user_id = ?";
  db.query(getRecruiterIdQuery, [userId], (err, recruiterResults) => {
    if (err) {
      console.error("Erreur lors de la récupération du recruiter_id :", err);
      return res.status(500).json({ error: "Erreur serveur." });
    }
 
    if (recruiterResults.length === 0) {
      return res
        .status(404)
        .json({ error: "Recruteur non trouvé pour cet utilisateur." });
    }
 
    const recruiterId = recruiterResults[0].id;
 
    // Insérer une nouvelle offre d'emploi
    const insertJobQuery = `
      INSERT INTO jobs (recruiter_id, title, description, location, salary, created_by)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    db.query(
      insertJobQuery,
      [recruiterId, title, description, location, salary, userId],
      (err, results) => {
        if (err) {
          console.error("Erreur lors de l'ajout de l'offre :", err);
          return res
            .status(500)
            .json({ error: "Erreur lors de l'ajout de l'offre." });
        }
        res.status(201).json({ message: "Offre ajoutée avec succès !" });
      }
    );
  });
});
 
function findJobsBySkills(skills) {
  const matches = [];
  for (const [job, requiredSkills] of Object.entries(jobSuggestions)) {
    const match = requiredSkills.filter((skill) =>
      skills.includes(skill.toLowerCase())
    );
    if (match.length > 0) {
      matches.push({ job, match });
    }
  }
  return matches;
}
app.post("/apply", upload.single("cv"), (req, res) => {
  const { name, email, motivationLetter, jobId } = req.body;
  const cvFile = req.file;
 
  console.log("Données reçues :", {
    name,
    email,
    motivationLetter,
    jobId,
    cvFile,
  });
 
  if (!name || !email || !motivationLetter || !jobId || !cvFile) {
    return res
      .status(400)
      .json({ error: "Tous les champs sont obligatoires, y compris le CV." });
  }
  // Route pour ajouter une offre
  app.post("/recruiter/add-job", (req, res) => {
    const { title, description, location, salary } = req.body;
    const userId = req.headers["user-id"]; // Récupérer l'user_id depuis les headers
 
    if (!userId) {
      return res.status(401).json({ error: "Utilisateur non authentifié." });
    }
 
    // Trouver le recruiter_id à partir de l'user_id
    const getRecruiterIdQuery = "SELECT id FROM recruiters WHERE user_id = ?";
    db.query(getRecruiterIdQuery, [userId], (err, recruiterResults) => {
      if (err) {
        console.error("Erreur lors de la récupération du recruiter_id :", err);
        return res.status(500).json({ error: "Erreur serveur." });
      }
 
      if (recruiterResults.length === 0) {
        return res
          .status(404)
          .json({ error: "Recruteur non trouvé pour cet utilisateur." });
      }
 
      const recruiterId = recruiterResults[0].id;
 
      // Insérer une nouvelle offre d'emploi
      const insertJobQuery = `
      INSERT INTO jobs (recruiter_id, title, description, location, salary, created_by)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
      db.query(
        insertJobQuery,
        [recruiterId, title, description, location, salary, userId],
        (err, results) => {
          if (err) {
            console.error("Erreur lors de l'ajout de l'offre :", err);
            return res
              .status(500)
              .json({ error: "Erreur lors de l'ajout de l'offre." });
          }
          res.status(201).json({ message: "Offre ajoutée avec succès !" });
        }
      );
    });
  });
  // Route pour récupérer les candidatures des offres du recruteur
  app.get("/recruiter/applications", (req, res) => {
    const userId = req.headers["user-id"];
 
    if (!userId) {
      return res.status(401).json({ error: "Utilisateur non authentifié." });
    }
 
    // Trouver le recruiter_id à partir de l'user_id
    const getRecruiterIdQuery = "SELECT id FROM recruiters WHERE user_id = ?";
    db.query(getRecruiterIdQuery, [userId], (err, recruiterResults) => {
      if (err) {
        console.error("Erreur lors de la récupération du recruiter_id :", err);
        return res.status(500).json({ error: "Erreur serveur." });
      }
 
      if (recruiterResults.length === 0) {
        return res
          .status(404)
          .json({ error: "Recruteur non trouvé pour cet utilisateur." });
      }
 
      const recruiterId = recruiterResults[0].id;
 
      // Requête pour récupérer les candidatures liées aux offres du recruteur
      const getApplicationsQuery = `
      SELECT
        applications.id,
        applications.name,
        applications.email,
        applications.motivation_letter,
        applications.cv_link,
        applications.status,
        jobs.title AS job_title
      FROM applications
      INNER JOIN jobs ON applications.job_id = jobs.id
      WHERE jobs.recruiter_id = ?
    `;
      db.query(getApplicationsQuery, [recruiterId], (err, results) => {
        if (err) {
          console.error(
            "Erreur lors de la récupération des candidatures :",
            err
          );
          return res.status(500).json({ error: "Erreur serveur." });
        }
        res.json(results);
      });
    });
  });
  app.get("/recruiter/applications", (req, res) => {
    const userId = req.headers["user-id"]; // ID du recruteur connecté
 
    if (!userId) {
      return res.status(401).json({ error: "Utilisateur non authentifié." });
    }
 
    // Récupérer les jobs créés par ce recruteur
    const getJobsQuery = `SELECT id AS job_id, title FROM jobs WHERE created_by = ?`;
 
    db.query(getJobsQuery, [userId], (err, jobs) => {
      if (err) {
        console.error("Erreur lors de la récupération des jobs :", err);
        return res.status(500).json({ error: "Erreur serveur." });
      }
 
      if (jobs.length === 0) {
        return res.json({ applications: [] }); // Aucun job créé par ce recruteur
      }
 
      const jobIds = jobs.map((job) => job.job_id);
 
      // Récupérer les candidatures associées aux jobs du recruteur
      const getApplicationsQuery = `
        SELECT applications.*, jobs.title AS job_title
        FROM applications
        INNER JOIN jobs ON applications.job_id = jobs.id
        WHERE applications.job_id IN (?)
      `;
 
      db.query(getApplicationsQuery, [jobIds], (err, applications) => {
        if (err) {
          console.error(
            "Erreur lors de la récupération des candidatures :",
            err
          );
          return res.status(500).json({ error: "Erreur serveur." });
        }
 
        res.json({ applications });
      });
    });
  });
 
  // Check if the user already exists
  const checkUserQuery = "SELECT id FROM users WHERE email = ?";
  db.query(checkUserQuery, [email], (err, userResults) => {
    if (err) {
      console.error("Erreur lors de la vérification de l'utilisateur :", err);
      return res.status(500).json({ error: "Erreur serveur." });
    }
 
    let userId;
 
    if (userResults.length > 0) {
      // User exists, retrieve their ID
      userId = userResults[0].id;
      insertApplication(userId);
    } else {
      // User does not exist, insert them
      const insertUserQuery = "INSERT INTO users (name, email) VALUES (?, ?)";
      db.query(insertUserQuery, [name, email], (err, userInsertResults) => {
        if (err) {
          console.error("Erreur lors de l'insertion de l'utilisateur :", err);
          return res.status(500).json({ error: "Erreur serveur." });
        }
        userId = userInsertResults.insertId; // Get the newly created user's ID
        insertApplication(userId);
      });
    }
 
    // Function to insert the application
    function insertApplication(userId) {
      const cvLink = cvFile.path.replace(/\\/g, "/");
      const insertApplicationQuery = `
        INSERT INTO applications (name, email, motivation_letter, cv_link, job_id, user_id)
        VALUES (?, ?, ?, ?, ?, ?)
      `;
      db.query(
        insertApplicationQuery,
        [name, email, motivationLetter, cvLink, jobId, userId],
        (err, results) => {
          if (err) {
            console.error(
              "Erreur lors de l'insertion de la candidature :",
              err
            );
            return res.status(500).json({
              error: "Erreur lors de l'envoi de la candidature.",
            });
          }
          res
            .status(201)
            .json({ message: "Candidature soumise avec succès !" });
        }
      );
    }
  });
});
// *** 4. Modifier une offre ***
app.put("/recruiter/update-job/:id", (req, res) => {
  const { title, description, location, salary } = req.body;
  const jobId = req.params.id;
 
  const updateJobQuery = `
    UPDATE jobs SET title = ?, description = ?, location = ?, salary = ?
    WHERE id = ?
  `;
  db.query(
    updateJobQuery,
    [title, description, location, salary, jobId],
    (err) => {
      if (err) {
        console.error("Erreur lors de la mise à jour de l'offre :", err);
        return res.status(500).json({ error: "Erreur serveur." });
      }
      res.json({ message: "Offre mise à jour avec succès !" });
    }
  );
});
 
// *** 5. Supprimer une offre ***
app.delete("/recruiter/delete-job/:id", (req, res) => {
  const jobId = req.params.id;
 
  const deleteJobQuery = `DELETE FROM jobs WHERE id = ?`;
  db.query(deleteJobQuery, [jobId], (err) => {
    if (err) {
      console.error("Erreur lors de la suppression de l'offre :", err);
      return res.status(500).json({ error: "Erreur serveur." });
    }
    res.json({ message: "Offre supprimée avec succès !" });
  });
});
 
// Route pour récupérer les offres d'emploi créées par un recruteur
app.get("/recruiter/jobs", (req, res) => {
  const userId = req.headers["user-id"]; // ID du recruteur connecté
  if (!userId) {
    return res.status(401).json({ error: "Utilisateur non authentifié." });
  }
 
  const sql = "SELECT * FROM jobs WHERE created_by = ?";
  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error("Erreur lors de la récupération des offres :", err);
      return res.status(500).json({ error: "Erreur serveur" });
    }
    res.json(results);
  });
});
 
// Route pour ajouter une nouvelle offre
app.post("/recruiter/add-job", (req, res) => {
  const { title, description, location, salary } = req.body;
  const userId = req.headers["user-id"]; // ID du recruteur
 
  if (!userId) {
    return res.status(401).json({ error: "Utilisateur non authentifié." });
  }
 
  const sql = `
    INSERT INTO jobs (title, description, location, salary, created_by)
    VALUES (?, ?, ?, ?, ?)
  `;
  db.query(
    sql,
    [title, description, location, salary, userId],
    (err, result) => {
      if (err) {
        console.error("Erreur lors de l'ajout de l'offre :", err);
        return res.status(500).json({ error: "Erreur serveur" });
      }
      res.status(201).json({ message: "Offre ajoutée avec succès !" });
    }
  );
});
 
// Route pour récupérer les candidatures liées aux offres d'un recruteur
app.get("/recruiter/applications", (req, res) => {
  const userId = req.headers["user-id"]; // ID du recruteur connecté
  if (!userId) {
    return res.status(401).json({ error: "Utilisateur non authentifié." });
  }
 
  const sql = `
    SELECT applications.*, jobs.title AS job_title
    FROM applications
    INNER JOIN jobs ON applications.job_id = jobs.id
    WHERE jobs.created_by = ?
  `;
  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error("Erreur lors de la récupération des candidatures :", err);
      return res.status(500).json({ error: "Erreur serveur" });
    }
    res.json(results);
  });
});
 
// Route pour mettre à jour le statut d'une candidature
app.put("/recruiter/update-application-status/:id", (req, res) => {
  const { status } = req.body;
  const applicationId = req.params.id;
 
  const sql = "UPDATE applications SET status = ? WHERE id = ?";
  db.query(sql, [status, applicationId], (err) => {
    if (err) {
      console.error("Erreur lors de la mise à jour du statut :", err);
      return res.status(500).json({ error: "Erreur serveur" });
    }
    res.json({ message: "Statut de candidature mis à jour !" });
  });
});
 
// Route pour supprimer une offre
app.delete("/recruiter/delete-job/:id", (req, res) => {
  const jobId = req.params.id;
 
  const sql = "DELETE FROM jobs WHERE id = ?";
  db.query(sql, [jobId], (err) => {
    if (err) {
      console.error("Erreur lors de la suppression de l'offre :", err);
      return res.status(500).json({ error: "Erreur serveur" });
    }
    res.json({ message: "Offre supprimée avec succès !" });
  });
});
 
// Route pour modifier une offre
app.put("/recruiter/update-job/:id", (req, res) => {
  const { title, description, location, salary } = req.body;
  const jobId = req.params.id;
 
  const sql = `
    UPDATE jobs SET title = ?, description = ?, location = ?, salary = ?
    WHERE id = ?
  `;
  db.query(sql, [title, description, location, salary, jobId], (err) => {
    if (err) {
      console.error("Erreur lors de la mise à jour de l'offre :", err);
      return res.status(500).json({ error: "Erreur serveur" });
    }
    res.json({ message: "Offre mise à jour avec succès !" });
  });
}); 

app.get("/candidate/application-status", (req, res) => {
  const { email, jobName } = req.query;

  if (!email || !jobName) {
    return res.status(400).json({
      error: "Email et nom de l'offre sont obligatoires.",
    });
  }

  const sql = `
    SELECT status FROM applications 
    WHERE email = ? AND job_id = (
      SELECT id FROM jobs WHERE title = ?
    )
  `;
  db.query(sql, [email, jobName], (err, results) => {
    if (err) {
      console.error("Erreur lors de la récupération du statut :", err);
      return res.status(500).json({ error: "Erreur serveur" });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "Candidature non trouvée." });
    }

    res.json({ status: results[0].status });
  });
});


const axios = require("axios");

async function generateMotivationLetter(name, jobTitle, skills) {
  const OPENAI_API_KEY = "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"; // Remplacez par votre clé API

  const prompt = `
    Cher/Chère Responsable du recrutement,

    Mon nom est ${name}, et je suis très intéressé(e) par le poste de ${jobTitle}.
    Avec mes compétences en ${skills.join(", ")}, je suis convaincu(e) de pouvoir contribuer significativement à votre entreprise.

    Je suis très motivé(e) à intégrer votre équipe et à apporter une valeur ajoutée grâce à mes compétences et mon expérience.

    Cordialement,
    ${name}
  `;

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/completions",
      {
        model: "text-davinci-003",
        prompt,
        max_tokens: 200,
        temperature: 0.7,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
      }
    );
    return response.data.choices[0].text.trim();
  } catch (error) {
    console.error("Erreur lors de la génération de la lettre :", error);
    throw new Error("Erreur lors de la génération de la lettre.");
  }
}

app.post("/generate-letter", async (req, res) => {
  const { name, jobTitle, skills } = req.body;

  if (!name || !jobTitle || !skills || skills.length === 0) {
    return res.status(400).json({
      error: "Les champs nom, titre du poste et compétences sont obligatoires.",
    });
  }

  try {
    const motivationLetter = await generateMotivationLetter(
      name,
      jobTitle,
      skills
    );
    res.json({ motivationLetter });
  } catch (err) {
    console.error("Erreur lors de la génération de la lettre :", err);
    res.status(500).json({ error: "Erreur serveur." });
  }
});



 
// Démarrer le serveur
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
 
 