
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.models import JournalEntry
from app.database import get_db


journal_router = APIRouter()


# POST: Create a journal entry
@journal_router.post("/entries")
def create_entry(title: str, content: str, db: Session = Depends(get_db)):
    entry = JournalEntry(title=title, content=content)
    db.add(entry)
    db.commit()
    db.refresh(entry)
    return entry


# GET: Fetch all journal entries
@journal_router.get("/entries")
def get_entries(db: Session = Depends(get_db)):
    return db.query(JournalEntry).all()
