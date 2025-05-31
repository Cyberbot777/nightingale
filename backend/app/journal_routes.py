from fastapi import APIRouter, HTTPException, Depends, Query
from pydantic import BaseModel
import openai
from sqlalchemy.orm import Session
from app.config import settings
from app.database import get_db
from app.auth_routes import get_current_user
from app import models
from datetime import datetime
from typing import List

journal_router = APIRouter()

# Configure OpenAI client using the new v1 interface
client = openai.OpenAI(api_key=settings.openai_api_key)

# Response schema for GET /journal (includes feedback field)
class JournalEntryResponse(BaseModel):
    id: int
    title: str
    content: str
    created_at: datetime
    feedback: str | None  # Add feedback field to the response schema

# Response schema for POST /ai-feedback
class AIFeedbackResponse(BaseModel):
    feedback: str

# Define Journal Entry schema for Create/Read/Update/Delete
class JournalEntryCreate(BaseModel):
    title: str
    content: str

class JournalEntryUpdate(BaseModel):
    title: str
    content: str

# POST: Create a new journal entry
@journal_router.post("/journal", response_model=JournalEntryCreate)
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

# GET: Read journal entries with pagination
@journal_router.get("/journal", response_model=List[JournalEntryResponse])
async def get_journal(
    skip: int = Query(0, ge=0),  # Default to 0, must be >= 0
    limit: int = Query(10, ge=1, le=100),  # Default to 10, must be between 1 and 100
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    entries = db.query(models.JournalEntry).filter(models.JournalEntry.user_id == current_user.id).offset(skip).limit(limit).all()
    if not entries:
        raise HTTPException(status_code=404, detail="No journal entries found")
    return entries

# PUT: Update a journal entry
@journal_router.put("/journal/{entry_id}", response_model=JournalEntryUpdate)
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
@journal_router.delete("/journal/{entry_id}")
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

# POST: Generate AI feedback using GPT-3.5-turbo and save it to the database
@journal_router.post("/ai-feedback/{entry_id}", response_model=AIFeedbackResponse)
def ai_feedback(
    entry_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    # Check if feedback limit is reached
    if current_user.email != "demo@nightingale.ai" and current_user.feedback_count >= 3:
        raise HTTPException(status_code=403, detail="AI feedback limit reached (3/3)")

    # Retrieve the journal entry
    db_entry = db.query(models.JournalEntry).filter(
        models.JournalEntry.id == entry_id,
        models.JournalEntry.user_id == current_user.id
    ).first()
    if db_entry is None:
        raise HTTPException(status_code=404, detail="Journal entry not found")

    try:
        # Call OpenAI API with the journal entry content
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a supportive, kind journaling coach."},
                {"role": "user", "content": f"Give thoughtful, uplifting feedback on this journal entry titled '{db_entry.title}':\n\n{db_entry.content}"}
            ],
            max_tokens=150
        )

        feedback = response.choices[0].message.content

        # Save the feedback to the journal entry
        db_entry.feedback = feedback

        # Update feedback usage count for non-demo users
        if current_user.email != "demo@nightingale.ai":
            current_user.feedback_count += 1

        db.commit()
        db.refresh(db_entry)

        return {"feedback": feedback}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))