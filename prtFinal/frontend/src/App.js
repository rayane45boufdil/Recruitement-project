import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  useNavigate,
} from "react-router-dom";
import NavBar from "./components/NavBar"; // NavBar pour les candidats
import RecruiterNavBar from "./components/RecruiterNavBar"; // NavBar pour les recruteurs
import Home from "./pages/Home";
import Login from "./pages/Login";
import RecruiterLogin from "./pages/RecruiterLogin";
import Signup from "./pages/Signup";
import RecruiterSignup from "./pages/RecruiterSignup";
import RecruiterDashboard from "./pages/RecruiterDashboard";
import Jobs from "./pages/Jobs";
import JobDetails from "./pages/JobDetails";
import JobApplication from "./pages/JobApplication";
import CVUploader from "./pages/CVUpload";
import AddJob from "./pages/AddJob";
import EditJob from "./pages/EditJob";
import Contact from "./pages/Contact";
import About from "./pages/About";
import Chatbot from "./components/Chatbot";

function AppContent() {
  const [user, setUser] = useState(null); // Stocke les infos utilisateur
  const [loading, setLoading] = useState(true); // État de chargement
  const location = useLocation();
  const navigate = useNavigate();

  // Synchroniser l'utilisateur avec localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    console.log("Utilisateur récupéré depuis localStorage :", storedUser);

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Erreur lors de l'analyse de l'utilisateur :", error);
      }
    }
    setLoading(false);
  }, []);

  // Rediriger seulement après une connexion réussie
  useEffect(() => {
    if (user && location.pathname === "/login") {
      if (user.role === "recruiter") {
        navigate("/recruiter/dashboard");
      } else if (user.role === "condidat") {
        navigate("/jobs");
      }
    }
  }, [user, navigate, location.pathname]);

  if (loading) {
    return <div>Chargement...</div>; // Affiche un message pendant le chargement
  }

  // Afficher une NavBar différente selon le rôle de l'utilisateur
  const getNavBar = () => {
    if (!user) return null; // Pas de NavBar si `user` est null
    switch (user.role) {
      case "recruiter":
        return <RecruiterNavBar user={user} setUser={setUser} />;
      case "condidat":
        return <NavBar user={user} setUser={setUser} />;
      default:
        return null; // Aucun NavBar pour les autres rôles
    }
  };

  return (
    <>
      {user &&
        location.pathname !== "/login" &&
        location.pathname !== "/signup" &&
        getNavBar()}
      <Routes>
        {/* Routes accessibles à tous */}
        <Route path="/" element={<Home />} />
        <Route path="/chatbot" element={<Chatbot />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/jobs/:id" element={<JobDetails />} />
        <Route path="/apply" element={<JobApplication />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
        <Route path="/upload-cv" element={<CVUploader />} />

        {/* Routes spécifiques aux recruteurs */}
        <Route path="/recruiter/signup" element={<RecruiterSignup />} />
        <Route
          path="/recruiter/login"
          element={<RecruiterLogin setUser={setUser} />}
        />
        <Route path="/recruiter/dashboard" element={<RecruiterDashboard />} />
        <Route path="/recruiter/add-job" element={<AddJob />} />
        <Route path="/recruiter/edit-job/:id" element={<EditJob />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
