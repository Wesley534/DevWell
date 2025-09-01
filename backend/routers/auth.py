from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from backend.schemas import UserCreate, UserLogin, Token
from backend.crud import get_user_by_email, create_user, verify_password, get_user_profile
from backend.security import create_access_token
from backend.database import get_db
import logging

router = APIRouter(prefix="/api/auth", tags=["auth"])

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@router.post("/signup", response_model=Token)
def signup(user: UserCreate, db: Session = Depends(get_db)):
    try:
        db_user = get_user_by_email(db, user.email)
        if db_user:
            logger.error(f"Signup failed: Email already registered: {user.email}")
            raise HTTPException(status_code=400, detail="Email already registered")
        db_user = create_user(db, user.email, user.password)
        access_token = create_access_token(data={"sub": user.email}, remember_me=False)  # Default remember_me to False for signup
        logger.info(f"Signup successful for user: {user.email}, needs_onboarding: true")
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "needs_onboarding": True  # New users need onboarding
        }
    except Exception as e:
        logger.error(f"Unexpected error during signup for email {user.email}: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.post("/login", response_model=Token)
def login(user: UserLogin, db: Session = Depends(get_db)):
    try:
        db_user = get_user_by_email(db, user.email)
        if not db_user or not verify_password(user.password, db_user.hashed_password):
            logger.error(f"Login failed for email: {user.email}")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password",
                headers={"WWW-Authenticate": "Bearer"},
            )
        access_token = create_access_token(data={"sub": user.email}, remember_me=user.remember_me)
        try:
            profile = get_user_profile(db, db_user.id)
            needs_onboarding = profile is None
            logger.info(f"Login successful for user: {user.email}, needs_onboarding: {needs_onboarding}")
        except Exception as e:
            logger.error(f"Error fetching user profile for user_id {db_user.id}: {str(e)}")
            needs_onboarding = True  # Default to True if profile fetch fails
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "needs_onboarding": needs_onboarding
        }
    except Exception as e:
        logger.error(f"Unexpected error during login for email {user.email}: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")