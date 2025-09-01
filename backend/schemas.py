# backend/schemas.py
from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime

# User schemas
class UserBase(BaseModel):
    email: EmailStr

class UserCreate(UserBase):
    password: str
    remember_me: bool = False

class UserLogin(UserBase):
    password: str
    remember_me: bool = False

class UserOut(UserBase):
    id: int
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

# Hydration schemas (updated to match frontend and model)
class HydrationLogCreate(BaseModel):
    water_glasses: int = Field(..., ge=0)
    coffee_cups: int = Field(..., ge=0)
    daily_goal: int = Field(..., ge=0)

class HydrationLogOut(HydrationLogCreate):
    id: int
    created_at: datetime
    class Config:
        from_attributes = True

# Mood schemas
class MoodLogCreate(BaseModel):
    mood_score: float = Field(..., ge=1.0, le=5.0)
    notes: Optional[str] = None
    tiredness_level: Optional[int] = Field(None, ge=0, le=10)

class MoodLogOut(MoodLogCreate):
    id: int
    created_at: datetime
    class Config:
        from_attributes = True

# Coding and Focus schemas
class CodingSessionCreate(BaseModel):
    duration_minutes: int
    notes: Optional[str] = None

class CodingSessionOut(CodingSessionCreate):
    id: int
    created_at: datetime
    class Config:
        from_attributes = True

class FocusSessionCreate(BaseModel):
    duration_minutes: int

class FocusSessionOut(FocusSessionCreate):
    id: int
    created_at: datetime
    class Config:
        from_attributes = True

# Dashboard schemas
class DashboardStat(BaseModel):
    title: str
    value: str
    description: str
    trend: int
    color: str

class DashboardResponse(BaseModel):
    stats: List[DashboardStat]
    insights: List[str]