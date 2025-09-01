# backend/routers/hydration.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from typing import List
from backend.schemas import HydrationLogCreate, HydrationLogOut
from backend.crud import create_hydration_log, get_user_by_email
from backend.database import get_db
from backend.security import get_current_user
from backend.models import HydrationLog

router = APIRouter(prefix="/api/hydration", tags=["hydration"])

@router.post("/log", response_model=HydrationLogOut)
async def log_hydration(
    hydration_log: HydrationLogCreate,
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    user = get_user_by_email(db, current_user)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    db_hydration = create_hydration_log(db, user.id, hydration_log)
    print("Created hydration log:", db_hydration.__dict__)  # Debug
    return db_hydration

@router.get("/weekly-trends", response_model=List[HydrationLogOut])
async def get_weekly_hydration_trends(
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    user = get_user_by_email(db, current_user)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    cutoff = datetime.utcnow() - timedelta(days=7)
    trends = db.query(HydrationLog).filter(
        HydrationLog.user_id == user.id,
        HydrationLog.created_at >= cutoff
    ).order_by(HydrationLog.created_at.asc()).all()
    print("Hydration trends:", [t.__dict__ for t in trends])  # Debug
    return trends