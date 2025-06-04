# backend/app/main.py (Updated with feedback limit)
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

# Create database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://nightingale-sigma.vercel.app"
        "https://nightingaleapp.ai"
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

# Pydantic model for journal input
class JournalCreate(BaseModel):
    content: str

# Update journal route with auth
@app.post("/journal")
async def create_journal(
    journal: JournalCreate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    entry = models.JournalEntry(content=journal.content, user_id=current_user.id)
    db.add(entry)
    db.commit()
    db.refresh(entry)
    return {"entry_id": entry.id}

# Update AI feedback route with limit
@app.post("/ai-feedback")
async def get_ai_feedback(
    entry_id: int,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.email != "demo@nightingale.ai":
        if current_user.feedback_count >= 3:
            raise HTTPException(status_code=403, detail="Feedback limit reached")
        current_user.feedback_count += 1
        db.commit()
    entry = db.query(models.JournalEntry).filter(
        models.JournalEntry.id == entry_id,
        models.JournalEntry.user_id == current_user.id
    ).first()
    if not entry:
        raise HTTPException(status_code=404, detail="Entry not found")
    feedback = f"Great job: {entry.content[:50]}..."
    return {"feedback": feedback}

@app.get("/")
def read_root():
    return {"message": "Hello from Nightingale backend!"}