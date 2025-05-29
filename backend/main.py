from fastapi import FastAPI
from app import models
from app.database import engine
from app.journal_routes import journal_router
from app.auth_routes import auth_router 
from app.ai_routes import router as ai_router

# Initialize FastAPI app
app = FastAPI()

# Include routers after app is defined
app.include_router(journal_router)
app.include_router(auth_router)
app.include_router(ai_router)

# Create database tables
models.Base.metadata.create_all(bind=engine)

# Root route
@app.get("/")
def read_root():
    return {"message": "Hello from Nightingale backend!"}
