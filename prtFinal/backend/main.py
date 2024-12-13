from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.routers import upload 
import sys
import os

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

app = FastAPI()

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Replace with your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include the upload router
app.include_router(upload.router, prefix="/api", tags=["Upload"])

@app.get("/")
async def root():
    return {"message": "Bienvenue dans notre API de recrutement"}
