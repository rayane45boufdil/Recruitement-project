from fastapi import APIRouter

router = APIRouter()

@router.get("/jobs")
async def get_jobs(query: str = None):
    # Simulez des résultats d'emplois
    jobs = [
        {"id": 1, "title": "Développeur Web", "location": "Montréal"},
        {"id": 2, "title": "Analyste de données", "location": "Québec"},
        {"id": 3, "title": "Chef de projet", "location": "Toronto"}
    ]

    # Filtrez par mot-clé si une requête est fournie
    if query:
        jobs = [job for job in jobs if query.lower() in job["title"].lower()]
    
    return {"results": jobs}
