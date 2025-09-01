# backend/schemas.py (partial update)
from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

# Existing schemas (unchanged)
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

class HydrationLogCreate(BaseModel):
    glasses_drunk: int
    daily_goal: Optional[int] = 8

class CodingSessionCreate(BaseModel):
    duration_minutes: int
    notes: Optional[str] = None

class FocusSessionCreate(BaseModel):
    duration_minutes: int

class DashboardStat(BaseModel):
    title: str
    value: str
    description: str
    trend: int
    color: str

class DashboardResponse(BaseModel):
    stats: List[DashboardStat]
    insights: List[str]

# Updated Mood schemas
class MoodLogCreate(BaseModel):
    mood_score: float
    notes: Optional[str] = None
    tiredness_level: Optional[int] = None  # 0 to 10

class MoodLogOut(MoodLogCreate):
    id: int
    created_at: datetime
    class Config:
        from_attributes = True

# Other output schemas (unchanged)
class HydrationLogOut(HydrationLogCreate):
    id: int
    created_at: datetime
    class Config:
        from_attributes = True

class CodingSessionOut(CodingSessionCreate):
    id: int
    created_at: datetime
    class Config:
        from_attributes = True

class FocusSessionOut(FocusSessionCreate):
    id: int
    created_at: datetime
    class Config:
        from_attributes = True