# backend/crud.py
from sqlalchemy.orm import Session
from . import models, schemas
from backend.security import get_password_hash # Import from your security module
from typing import Optional

def get_user(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = get_password_hash(user.password)
    db_user = models.User(email=user.email, hashed_password=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def authenticate_user(db: Session, email: str, password: str):
    user = get_user_by_email(db, email)
    if not user:
        return None
    if not get_password_hash(password) == user.hashed_password: # Use verify_password
         return None
    return user

# TODO: Add CRUD for MoodEntry, HydrationLog, MealLog, CodingSession, UserSettings
# Example for mood entry:
def create_mood_entry(db: Session, mood_entry: schemas.MoodEntryCreate, user_id: int, session_id: Optional[int] = None):
    db_mood = models.MoodEntry(**mood_entry.dict(), user_id=user_id, session_id=session_id)
    db.add(db_mood)
    db.commit()
    db.refresh(db_mood)
    return db_mood

def get_mood_entries_by_user(db: Session, user_id: int, skip: int = 0, limit: int = 100):
    return db.query(models.MoodEntry).filter(models.MoodEntry.user_id == user_id).offset(skip).limit(limit).all()

# ... and so on for other models