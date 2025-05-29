from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import openai
from app.config import settings

router = APIRouter()

# Set OpenAI API key
openai.api_key = settings.openai_api_key

# Request schema
class EntryText(BaseModel):
    text: str

# POST: Generate AI feedback (no auth for now)
@router.post("/ai-feedback")
def ai_feedback(entry: EntryText):
    try:
        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are a supportive, kind journaling coach."},
                {"role": "user", "content": f"Give thoughtful, uplifting feedback on this journal entry:\n\n{entry.text}"}
            ],
            max_tokens=150
        )
        return {"feedback": response.choices[0].message["content"]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
