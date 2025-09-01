# backend/routers/mood.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from typing import List
from backend.schemas import MoodLogCreate, MoodLogOut
from backend.crud import create_mood_log, get_user_by_email
from backend.database import get_db
from backend.security import get_current_user
from backend.models import MoodLog

router = APIRouter(prefix="/api/mood", tags=["mood"])

@router.post("/log", response_model=MoodLogOut)
async def log_mood(
    mood_log: MoodLogCreate,
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    user = get_user_by_email(db, current_user)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    db_mood = create_mood_log(db, user.id, mood_log)
    print("Created mood log:", db_mood.__dict__)  # Debug
    return db_mood

@router.get("/weekly-trends", response_model=List[MoodLogOut])
async def get_weekly_mood_trends(
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    user = get_user_by_email(db, current_user)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    cutoff = datetime.utcnow() - timedelta(days=7)
    trends = db.query(MoodLog).filter(
        MoodLog.user_id == user.id,
        MoodLog.created_at >= cutoff
    ).order_by(MoodLog.created_at.asc()).all()
    print("Trends:", [t.__dict__ for t in trends])  # Debug
    return trends