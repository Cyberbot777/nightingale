from fastapi import FastAPI
from app import models
from app.database import engine
from app.journal_routes import journal_router
from app.auth_routes import auth_router 

# Create database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# Include Routers
app.include_router(journal_router)
app.include_router(auth_router)  

# Root route
@app.get("/")
def read_root():
    return {"message": "Hello from Nightingale backend!"}
