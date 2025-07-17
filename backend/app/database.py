from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from app.config import settings  

# Log the DB URL (optional for debugging)
print("DATABASE_URL loaded:", settings.database_url)

# Use the value directly from settings
DATABASE_URL = settings.database_url

# Set up SQLAlchemy engine and session
engine = create_engine(DATABASE_URL)
print("REAL DB CONNECTED TO:", engine.url)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for models
Base = declarative_base()

# Dependency to get a DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
