from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime
from app.database import get_db
from app import models
from app.auth_utils import get_current_user
from pydantic import BaseModel

journal_router = APIRouter()

# Request schema
class JournalCreate(BaseModel):
    content: str

@journal_router.post("/journal")
def create_journal(
    journal: JournalCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    entry = models.JournalEntry(
        content=journal.content,
        user_id=current_user.id,
        created_at=datetime.utcnow()
    )
    db.add(entry)
    db.commit()
    db.refresh(entry)
    return {"entry_id": entry.id}

@journal_router.post("/ai-feedback")
def get_ai_feedback(
    entry_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    entry = db.query(models.JournalEntry).filter(
        models.JournalEntry.id == entry_id,
        models.JournalEntry.user_id == current_user.id
    ).first()
    if not entry:
        raise HTTPException(status_code=404, detail="Entry not found")

    feedback = f"Nightingale's feedback: You wrote — {entry.content[:50]}..."
    return {"feedback": feedback}
