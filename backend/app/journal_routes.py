
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

# DELETE: Remove a journal entry
@journal_router.delete("/entries/{entry_id}")
def delete_entry(entry_id: int, db: Session = Depends(get_db)):
    entry = db.query(JournalEntry).get(entry_id)
    if not entry:
        return {"error": "Entry not found"}
    db.delete(entry)
    db.commit()
    return {"message": "Entry deleted"}

# PUT: Update a journal entry
@journal_router.put("/entries/{entry_id}")
def update_entry(entry_id: int, title: str, content: str, db: Session = Depends(get_db)):
    entry = db.query(JournalEntry).get(entry_id)
    if not entry:
        return {"error": "Entry not found"}
    entry.title = title
    entry.content = content
    db.commit()
    db.refresh(entry)
    return entry


