import re
from typing import List, Dict

# Base de données simulée
JOB_DATABASE = [
    {"id": 1, "title": "Développeur Python", "description": "Python, FastAPI, REST"},
    {"id": 2, "title": "Data Scientist", "description": "Machine Learning, NLP, Python"},
    {"id": 3, "title": "Développeur Web", "description": "HTML, CSS, JavaScript, React"},
]

def process_cv(content: bytes) -> Dict:
    """
    Analyse le contenu du CV pour extraire les mots-clés.
    """
    text = content.decode("utf-8", errors="ignore")  # Convertir bytes en texte
    words = re.findall(r'\b\w+\b', text.lower())  # Extraction des mots
    return {"text": text, "keywords": list(set(words))}

def match_jobs(cv_keywords: List[str], search_keywords: List[str]) -> Dict:
    """
    Rechercher des offres d'emploi basées sur les mots-clés.
    """
    matched_jobs = []
    missing_keywords = set(search_keywords)  # Suivi des mots-clés non trouvés
    for job in JOB_DATABASE:
        job_keywords = set(re.findall(r'\b\w+\b', job["description"].lower()))
        overlap = job_keywords.intersection(set(search_keywords))
        missing_keywords -= overlap  # Supprimer les mots-clés trouvés
        if overlap:
            matched_jobs.append({
                "id": job["id"],
                "title": job["title"],
                "match_score": round(len(overlap) / len(search_keywords) * 100, 2),
            })
    
    if not matched_jobs:
        return {
            "matched_jobs": [],
            "message": "Aucune correspondance trouvée. Ces compétences sont manquantes :",
            "missing_keywords": list(missing_keywords),
        }
    
    return {
        "matched_jobs": matched_jobs,
        "message": "Correspondances trouvées.",
        "missing_keywords": list(missing_keywords),
    }
