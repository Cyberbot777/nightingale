from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
import openai
from sqlalchemy.orm import Session
from app.config import settings
from app.database import get_db
from app.auth_utils import get_current_user  # Dependency to get current user
from app import models

router = APIRouter()

# Configure OpenAI client using the new v1 interface
client = openai.OpenAI(api_key=settings.openai_api_key)

# Request schema
class EntryText(BaseModel):
    text: str

# POST: Generate AI feedback using GPT-3.5-turbo
@router.post("/ai-feedback")
def ai_feedback(
    entry: EntryText,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    # Check if feedback limit is reached
    if current_user.email != "demo@nightingale.ai" and current_user.feedback_count >= 3:
        raise HTTPException(status_code=403, detail="AI feedback limit reached (3/3)")

    try:
        # Call OpenAI API
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a supportive, kind journaling coach."},
                {"role": "user", "content": f"Give thoughtful, uplifting feedback on this journal entry:\n\n{entry.text}"}
            ],
            max_tokens=150
        )

        # Update feedback usage count for non-demo users
        if current_user.email != "demo@nightingale.ai":
            current_user.feedback_count += 1
            db.commit()

        return {"feedback": response.choices[0].message.content}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Define Journal Entry schema for Create/Read/Update/Delete
class JournalEntryCreate(BaseModel):
    title: str
    content: str

class JournalEntryUpdate(BaseModel):
    title: str
    content: str

# POST: Create a new journal entry
@router.post("/journal", response_model=JournalEntryCreate)
def create_journal_entry(
    entry: JournalEntryCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    db_entry = models.JournalEntry(
        title=entry.title,
        content=entry.content,
        user_id=current_user.id,
        created_at=datetime.utcnow(),
    )
    db.add(db_entry)
    db.commit()
    db.refresh(db_entry)
    return db_entry

# GET: Read journal entries
@router.get("/journal", response_model=list[JournalEntryCreate])
def read_journal_entries(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    entries = db.query(models.JournalEntry).filter(models.JournalEntry.user_id == current_user.id).all()
    return entries

# PUT: Update a journal entry
@router.put("/journal/{entry_id}", response_model=JournalEntryUpdate)
def update_journal_entry(
    entry_id: int,
    entry: JournalEntryUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    db_entry = db.query(models.JournalEntry).filter(models.JournalEntry.id == entry_id, models.JournalEntry.user_id == current_user.id).first()
    if db_entry is None:
        raise HTTPException(status_code=404, detail="Journal entry not found")

    db_entry.title = entry.title
    db_entry.content = entry.content
    db.commit()
    db.refresh(db_entry)
    return db_entry

# DELETE: Delete a journal entry
@router.delete("/journal/{entry_id}")
def delete_journal_entry(
    entry_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    db_entry = db.query(models.JournalEntry).filter(models.JournalEntry.id == entry_id, models.JournalEntry.user_id == current_user.id).first()
    if db_entry is None:
        raise HTTPException(status_code=404, detail="Journal entry not found")
    
    db.delete(db_entry)
    db.commit()
    return {"message": "Journal entry deleted successfully"}
