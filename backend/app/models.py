# app/models.py
# SQLAlchemy models for the Nightingale backend application
# Includes: User, JournalEntry, PasswordResetToken

from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime, timedelta
from app.database import Base  


# User model
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(Text, nullable=False)  
    feedback_count = Column(Integer, default=0, nullable=False)

    # Relationship to journal entries
    entries = relationship("JournalEntry", back_populates="owner")


# JournalEntry model
class JournalEntry(Base):
    __tablename__ = "journal_entries"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    content = Column(Text, nullable=False)
    feedback = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    # Back reference to user
    owner = relationship("User", back_populates="entries")


# PasswordResetToken model
class PasswordResetToken(Base):
    __tablename__ = "password_reset_tokens"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    token = Column(String, unique=True, nullable=False)
    expires_at = Column(DateTime, nullable=False)

    # Link to user
    user = relationship("User")
