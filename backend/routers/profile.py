from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from backend.schemas import UserProfileCreate, UserProfileOut
from backend.crud import create_user_profile, get_user_profile, get_user_by_email
from backend.database import get_db
from backend.security import get_current_user
from typing import Optional

router = APIRouter(prefix="/api/profile", tags=["profile"])

@router.post("/onboarding", response_model=UserProfileOut)
async def submit_onboarding(
    profile: UserProfileCreate,
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    print("Received onboarding payload:", profile.dict())
    user = get_user_by_email(db, current_user)
    if not user:
        print("User not found for email:", current_user)
        raise HTTPException(status_code=404, detail="User not found")
    existing_profile = get_user_profile(db, user.id)
    if existing_profile:
        print("Profile already exists for user_id:", user.id)
        raise HTTPException(status_code=400, detail="Profile already exists")
    db_profile = create_user_profile(db, user.id, profile)
    print("Created user profile:", db_profile.__dict__)
    return db_profile

@router.get("/me", response_model=Optional[UserProfileOut])
async def get_profile(
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    print("Fetching profile for user:", current_user)
    user = get_user_by_email(db, current_user)
    if not user:
        print("User not found for email:", current_user)
        raise HTTPException(status_code=404, detail="User not found")
    profile = get_user_profile(db, user.id)
    if not profile:
        print("No profile found for user_id:", user.id)
        return None
    print("Profile retrieved for user_id:", user.id)
    return profile