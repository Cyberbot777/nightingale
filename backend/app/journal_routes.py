from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.models import JournalEntry, User
from app.database import get_db
from app.schemas import EntryCreate
from app.auth_utils import get_current_user

journal_router = APIRouter()

# POST: Create a journal entry
@journal_router.post("/entries")
def create_entry(entry: EntryCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    new_entry = JournalEntry(
        title=entry.title,
        content=entry.content,
        user_id=current_user.id
    )
    db.add(new_entry)
    db.commit()
    db.refresh(new_entry)
    return new_entry

# GET: Fetch entries for the logged-in user
@journal_router.get("/entries")
def get_entries(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(JournalEntry).filter(JournalEntry.user_id == current_user.id).all()

# DELETE: Remove a journal entry (only if owned by user)
@journal_router.delete("/entries/{entry_id}")
def delete_entry(entry_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    entry = db.query(JournalEntry).filter(JournalEntry.id == entry_id, JournalEntry.user_id == current_user.id).first()
    if not entry:
        raise HTTPException(status_code=404, detail="Entry not found or not authorized to delete")
    db.delete(entry)
    db.commit()
    return {"message": "Entry deleted"}

# PUT: Update a journal entry (only if owned by user)
@journal_router.put("/entries/{entry_id}")
def update_entry(entry_id: int, title: str, content: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    entry = db.query(JournalEntry).filter(JournalEntry.id == entry_id, JournalEntry.user_id == current_user.id).first()
    if not entry:
        raise HTTPException(status_code=404, detail="Entry not found or not authorized to update")
    entry.title = title
    entry.content = content
    db.commit()
    db.refresh(entry)
    return entry
