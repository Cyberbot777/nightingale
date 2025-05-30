from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import openai
from app.config import settings

router = APIRouter()

# Configure OpenAI client using the new v1 interface
client = openai.OpenAI(api_key=settings.openai_api_key)

# Request schema
class EntryText(BaseModel):
    text: str

# POST: Generate AI feedback using GPT-3.5-turbo
@router.post("/ai-feedback")
def ai_feedback(entry: EntryText):
    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a supportive, kind journaling coach."},
                {"role": "user", "content": f"Give thoughtful, uplifting feedback on this journal entry:\n\n{entry.text}"}
            ],
            max_tokens=150
        )
        return {"feedback": response.choices[0].message.content}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
