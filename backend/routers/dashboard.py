# backend/routers/dashboard.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend import schemas, crud
from backend.database import get_db
from backend.security import get_current_user

router = APIRouter(prefix="/api/dashboard", tags=["dashboard"])

@router.get("/stats", response_model=schemas.DashboardResponse)
async def get_dashboard_stats(
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    user = db.query(crud.User).filter(crud.User.email == current_user).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    stats_data = crud.get_dashboard_stats(db, user.id)
    return stats_data

# Other endpoints (unchanged)
@router.post("/mood-logs", response_model=schemas.MoodLogOut)
async def create_mood_log(
    mood_log: schemas.MoodLogCreate,
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    user = db.query(crud.User).filter(crud.User.email == current_user).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return crud.create_mood_log(db, user.id, mood_log)

@router.post("/hydration-logs", response_model=schemas.HydrationLogOut)
async def create_hydration_log(
    hydration_log: schemas.HydrationLogCreate,
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    user = db.query(crud.User).filter(crud.User.email == current_user).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return crud.create_hydration_log(db, user.id, hydration_log)

@router.post("/coding-sessions", response_model=schemas.CodingSessionOut)
async def create_coding_session(
    session: schemas.CodingSessionCreate,
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    user = db.query(crud.User).filter(crud.User.email == current_user).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return crud.create_coding_session(db, user.id, session)

@router.post("/focus-sessions", response_model=schemas.FocusSessionOut)
async def create_focus_session(
    session: schemas.FocusSessionCreate,
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    user = db.query(crud.User).filter(crud.User.email == current_user).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return crud.create_focus_session(db, user.id, session)