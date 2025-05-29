from fastapi import FastAPI
from app import models
from app.database import engine

# Create database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Hello from Nightingale backend!"}
