# backend/routers/auth.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from backend.schemas import UserCreate, UserLogin, Token
from backend.crud import get_user_by_email, create_user, verify_password
from backend.security import create_access_token
from backend.database import get_db

router = APIRouter(prefix="/api/auth", tags=["auth"])

@router.post("/signup", response_model=Token)
def signup(user: UserCreate, db: Session = Depends(get_db)):
    db_user = get_user_by_email(db, user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    db_user = create_user(db, user.email, user.password)
    access_token = create_access_token(data={"sub": user.email}, remember_me=user.remember_me)
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/login", response_model=Token)
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = get_user_by_email(db, user.email)
    if not db_user or not verify_password(user.password, db_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = create_access_token(data={"sub": user.email}, remember_me=user.remember_me)
    return {"access_token": access_token, "token_type": "bearer"}