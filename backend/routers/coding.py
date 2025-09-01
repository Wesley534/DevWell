# backend/routers/coding.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from typing import List
from backend.schemas import CodingSessionCreate, CodingSessionOut
from backend.crud import create_coding_session, get_user_by_email
from backend.database import get_db
from backend.security import get_current_user
from backend.models import CodingSession

router = APIRouter(prefix="/api/coding", tags=["coding"])

@router.post("/log", response_model=CodingSessionOut)
async def log_coding_session(
    coding_session: CodingSessionCreate,
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    print("Received coding session payload:", coding_session.dict())
    user = get_user_by_email(db, current_user)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if coding_session.duration_minutes < 1:
        raise HTTPException(status_code=422, detail="Duration must be at least 1 minute")
    db_session = create_coding_session(db, user.id, coding_session)
    print("Created coding session:", db_session.__dict__)
    return db_session

@router.get("/weekly-trends", response_model=List[CodingSessionOut])
async def get_weekly_coding_trends(
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    user = get_user_by_email(db, current_user)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    cutoff = datetime.utcnow() - timedelta(days=7)
    trends = db.query(CodingSession).filter(
        CodingSession.user_id == user.id,
        CodingSession.created_at >= cutoff
    ).order_by(CodingSession.created_at.asc()).all()
    print("Coding trends:", [t.__dict__ for t in trends])
    return trends