from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

class UserCreate(BaseModel):
    email: str = Field(..., min_length=1)
    password: str = Field(..., min_length=6)

class UserLogin(BaseModel):
    email: str = Field(..., min_length=1)
    password: str = Field(..., min_length=6)
    remember_me: bool = False

class Token(BaseModel):
    access_token: str
    token_type: str
    needs_onboarding: bool

class HydrationLogCreate(BaseModel):
    water_glasses: int = Field(..., ge=0)
    coffee_cups: int = Field(..., ge=0)
    daily_goal: int = Field(..., ge=0)

class HydrationLogOut(HydrationLogCreate):
    id: int
    created_at: datetime
    class Config:
        from_attributes = True

class MoodLogCreate(BaseModel):
    mood_score: float = Field(..., ge=0, le=5)
    notes: Optional[str] = None
    tiredness_level: Optional[int] = Field(None, ge=0, le=10)

class MoodLogOut(MoodLogCreate):
    id: int
    created_at: datetime
    class Config:
        from_attributes = True

class CodingSessionCreate(BaseModel):
    duration_minutes: int = Field(..., ge=0)  # Allow 0 for testing
    notes: Optional[str] = None

class CodingSessionOut(CodingSessionCreate):
    id: int
    created_at: datetime
    class Config:
        from_attributes = True

class FocusSessionCreate(BaseModel):
    duration_minutes: int = Field(..., ge=0)
    notes: Optional[str] = None

class FocusSessionOut(FocusSessionCreate):
    id: int
    created_at: datetime
    class Config:
        from_attributes = True

class UserProfileCreate(BaseModel):
    nickname: str = Field(..., min_length=1)
    timezone: str = Field(..., min_length=1)  # e.g., "Africa/Nairobi"
    work_hours_start: str = Field(..., pattern=r"^\d{2}:\d{2}$")  # e.g., "09:00"
    work_hours_end: str = Field(..., pattern=r"^\d{2}:\d{2}$")    # e.g., "17:00"
    coding_style: str = Field(..., pattern=r"^(pomodoro|long)$")
    wellness_goals: str = Field(..., pattern=r"^(hydration|mental_health|nutrition|balance)(,(hydration|mental_health|nutrition|balance))*$")  # e.g., "hydration,mental_health"
    diet_preference: str = Field(..., pattern=r"^(vegetarian|vegan|protein-focused|balanced|other)$")
    reminder_frequency: str = Field(..., pattern=r"^(minimal|balanced|frequent)$")
    age: Optional[int] = Field(None, ge=1)
    weight: Optional[float] = Field(None, ge=0)

class UserProfileOut(UserProfileCreate):
    id: int
    user_id: int
    created_at: datetime
    class Config:
        from_attributes = True

class DashboardStat(BaseModel):
    title: str
    value: str
    description: str
    trend: float
    color: str

class DashboardResponse(BaseModel):
    stats: List[DashboardStat]
    insights: List[str]