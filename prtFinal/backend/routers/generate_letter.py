from fastapi import APIRouter
from services import letter_service

router = APIRouter()

@router.post("/generate_letter/")
async def generate_letter(cv_id: int, job_id: int):
    try:
        # Call the service to generate a letter
        letter = letter_service.generate(cv_id, job_id)
        return {"status": "success", "letter": letter}
    except Exception as e:
        return {"status": "error", "message": str(e)}
