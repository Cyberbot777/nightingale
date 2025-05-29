from fastapi import FastAPI
from app.journal_routes import journal_router
from app import models
from app.database import engine

# Create database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# Include the journal entry routes
app.include_router(journal_router)

@app.get("/")
def read_root():
    return {"message": "Hello from Nightingale backend!"}
