from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.config import settings
from app.database import get_db
from app.auth_routes import get_current_user
from app import models
import openai

router = APIRouter()

# Configure OpenAI client
client = openai.OpenAI(api_key=settings.openai_api_key, timeout=10.0)

# Request schema
class EntryText(BaseModel):
    text: str

# AI Feedback – limited to 3 for free users, unlimited for premium
@router.post("/ai-feedback/{entry_id}")
def ai_feedback(
    entry_id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)
):
    # Always re-fetch the user to get the latest premium status and feedback count
    user = db.query(models.User).filter(models.User.id == current_user.id).first()
    print(f"User: {user.email}, Premium: {user.is_premium}, Feedback Count: {user.feedback_count}")

    # Enforce 3-feedback limit for non-premium users
    if not user.is_premium:
        if user.feedback_count >= 3:
            raise HTTPException(status_code=403, detail="Upgrade to Premium. Free AI feedback limit reached (3/3)")

    entry = (
        db.query(models.JournalEntry)
        .filter(
            models.JournalEntry.id == entry_id,
            models.JournalEntry.user_id == user.id,
        )
        .first()
    )

    if not entry:
        raise HTTPException(status_code=404, detail="Journal entry not found")

    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {
                    "role": "system",
                    "content": "You are a supportive, kind journaling coach.",
                },
                {
                    "role": "user",
                    "content": f"Give uplifting feedback on this entry titled '{entry.title}':\n\n{entry.content}",
                },
            ],
            max_tokens=150,
        )

        feedback = response.choices[0].message.content

        entry.feedback = feedback

        # Update feedback_count for non-premium users
        if not user.is_premium:
            print(f"Updating feedback_count for: {user.email}")
            user.feedback_count += 1
            db.add(user)
            print(f"Set feedback_count to: {user.feedback_count}")

        db.commit()
        print("Commit completed")

        db.refresh(entry)

        return {"feedback": feedback}

    except Exception as e:
        print(f"Error: {str(e)}")
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
