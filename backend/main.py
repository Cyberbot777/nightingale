# backend/app/main.py
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordBearer
from app import models
from app.database import engine, SessionLocal
from app.journal_routes import journal_router
from app.auth_routes import auth_router, get_current_user
from app.ai_routes import router as ai_router
from pydantic import BaseModel
from app.models import User


# Create database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://nightingale-sigma.vercel.app",
        "https://www.nightingaleapp.ai",
        "https://nightingaleapp.ai",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(journal_router)
app.include_router(auth_router)
app.include_router(ai_router)

# Dependency for DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Pydantic model for journal input (still used in journal_routes)
class JournalCreate(BaseModel):
    content: str

@app.get("/")
def read_root():
    return {"message": "Hello from Nightingale backend!"}

@app.get("/me")
def get_current_user_data(current_user: User = Depends(get_current_user)):
    return {
        "email": current_user.email,
        "is_premium": current_user.is_premium,
        "feedback_count": current_user.feedback_count  
    }

