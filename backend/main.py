from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app import models
from app.database import engine
from app.journal_routes import journal_router
from app.auth_routes import auth_router
from app.ai_routes import router as ai_router

# Create database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# CORS setup - allow frontend (both dev and production)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",                     # Local React dev
        "https://nightingale-sigma.vercel.app"      # Deployed Vercel frontend
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include all route modules
app.include_router(journal_router)
app.include_router(auth_router)
app.include_router(ai_router)

# Basic test route
@app.get("/")
def read_root():
    return {"message": "Hello from Nightingale backend!"}
