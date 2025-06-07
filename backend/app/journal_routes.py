from fastapi import APIRouter, HTTPException, Depends, Query, Body
from sqlalchemy.orm import Session
from app.database import get_db
from app import models
from app.auth_routes import get_current_user
from app.schemas import EntryCreate
from datetime import datetime
from typing import List
import openai
from app.config import settings

journal_router = APIRouter()

client = openai.OpenAI(api_key=settings.openai_api_key)

# CREATE
@journal_router.post("/journal")
def create_journal_entry(
    entry: EntryCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    db_entry = models.JournalEntry(
        title=entry.title,
        content=entry.content,
        feedback=entry.feedback,
        user_id=current_user.id,
        created_at=datetime.utcnow()
    )
    db.add(db_entry)
    db.commit()
    db.refresh(db_entry)
    return {
        "id": db_entry.id,
        "title": db_entry.title,
        "content": db_entry.content,
        "feedback": db_entry.feedback,
        "created_at": db_entry.created_at
    }

# LIST ALL (Paginated)
@journal_router.get("/journal")
def get_journals(
    skip: int = 0,
    limit: int = 10,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    entries = db.query(models.JournalEntry).filter(
        models.JournalEntry.user_id == current_user.id
    ).offset(skip).limit(limit).all()

    return [
        {
            "id": entry.id,
            "title": entry.title,
            "content": entry.content,
            "feedback": entry.feedback,
            "created_at": entry.created_at
        }
        for entry in entries
    ]

# DELETE Journal Entry
@journal_router.delete("/journal/{entry_id}")
def delete_journal_entry(
    entry_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    db_entry = db.query(models.JournalEntry).filter(
        models.JournalEntry.id == entry_id,
        models.JournalEntry.user_id == current_user.id
    ).first()

    if not db_entry:
        raise HTTPException(status_code=404, detail="Journal entry not found")

    db.delete(db_entry)
    db.commit()
    return {"message": "Deleted"}

# AI FEEDBACK
@journal_router.post("/ai-feedback/{entry_id}")
def ai_feedback(
    entry_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):

    is_demo = current_user.email == "demo@nightingale.ai"
    has_reached_limit = current_user.feedback_count >= 3
    if not is_demo and has_reached_limit:
        raise HTTPException(status_code=403, detail="AI feedback limit reached (3/3)")

    entry = db.query(models.JournalEntry).filter(
        models.JournalEntry.id == entry_id,
        models.JournalEntry.user_id == current_user.id
    ).first()

    if not entry:
        raise HTTPException(status_code=404, detail="Journal entry not found")

    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a supportive, kind journaling coach."},
                {"role": "user", "content": f"Give uplifting feedback on this entry titled '{entry.title}':\n\n{entry.content}"}
            ],
            max_tokens=150
        )

        feedback = response.choices[0].message.content
        entry.feedback = feedback

        if not is_demo:
            current_user.feedback_count += 1

        db.commit()
        db.refresh(entry)

        return {"feedback": feedback}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# SEARCH Journal
@journal_router.get("/journal/search")
def search_journals(
    q: str = Query(default=None),
    title: str = Query(default=None),
    date: str = Query(default=None),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    query = db.query(models.JournalEntry).filter(models.JournalEntry.user_id == current_user.id)

    if q:
        query = query.filter(models.JournalEntry.content.ilike(f"%{q}%"))
    if title:
        query = query.filter(models.JournalEntry.title.ilike(f"%{title}%"))
    if date:
        query = query.filter(models.JournalEntry.created_at.startswith(date))

    results = query.all()

    return [
        {
            "id": entry.id,
            "title": entry.title,
            "content": entry.content,
            "feedback": entry.feedback,
            "created_at": entry.created_at
        }
        for entry in results
    ]

# GET Journal by ID
@journal_router.get("/journal/{entry_id}")
def get_journal_by_id(
    entry_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    entry = db.query(models.JournalEntry).filter(
        models.JournalEntry.id == entry_id,
        models.JournalEntry.user_id == current_user.id
    ).first()

    if not entry:
        raise HTTPException(status_code=404, detail="Journal entry not found")

    return {
        "id": entry.id,
        "title": entry.title,
        "content": entry.content,
        "feedback": entry.feedback,
        "created_at": entry.created_at
    }

# UPDATE Journal by ID
@journal_router.put("/journal/{entry_id}")
def update_journal_entry(
    entry_id: int,
    updated_entry: EntryCreate = Body(...),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    entry = db.query(models.JournalEntry).filter(
        models.JournalEntry.id == entry_id,
        models.JournalEntry.user_id == current_user.id
    ).first()

    if not entry:
        raise HTTPException(status_code=404, detail="Journal entry not found")

    entry.title = updated_entry.title
    entry.content = updated_entry.content
    entry.feedback = updated_entry.feedback

    db.commit()
    db.refresh(entry)

    return {
        "id": entry.id,
        "title": entry.title,
        "content": entry.content,
        "feedback": entry.feedback,
        "created_at": entry.created_at
    }
