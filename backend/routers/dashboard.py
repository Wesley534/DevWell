# backend/routers/dashboard.py
from fastapi import APIRouter, Depends
from backend.security import get_current_user

router = APIRouter(prefix="/api/dashboard", tags=["dashboard"])

@router.get("/")
async def get_dashboard(current_user: str = Depends(get_current_user)):
    return {"message": f"Welcome {current_user}"}