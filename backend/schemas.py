# backend/schemas.py
from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional, List

class UserBase(BaseModel):
    email: EmailStr

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    is_active: bool
    created_at: datetime
    github_id: Optional[str] = None
    google_id: Optional[str] = None

    class Config:
        orm_mode = True # Enable ORM mode for SQLAlchemy models

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

class MoodEntryBase(BaseModel):
    mood_emoji: str
    notes: Optional[str] = None

class MoodEntryCreate(MoodEntryBase):
    pass

class MoodEntry(MoodEntryBase):
    id: int
    timestamp: datetime
    user_id: int
    session_id: Optional[int] = None

    class Config:
        orm_mode = True

class HydrationLogBase(BaseModel):
    amount_ml: int

class HydrationLogCreate(HydrationLogBase):
    pass

class HydrationLog(HydrationLogBase):
    id: int
    timestamp: datetime
    user_id: int

    class Config:
        orm_mode = True

class MealLogBase(BaseModel):
    meal_type: str
    description: str
    calories: Optional[int] = None
    macros: Optional[str] = None # Or use a Pydantic dict/object

class MealLogCreate(MealLogBase):
    pass

class MealLog(MealLogBase):
    id: int
    timestamp: datetime
    user_id: int

    class Config:
        orm_mode = True

class CodingSessionBase(BaseModel):
    start_time: datetime
    end_time: Optional[datetime] = None
    duration_minutes: Optional[int] = None
    breaks_taken: int = 0

class CodingSessionCreate(CodingSessionBase):
    pass

class CodingSession(CodingSessionBase):
    id: int
    user_id: int
    mood_entries: List[MoodEntry] = [] # Include related moods

    class Config:
        orm_mode = True

class UserSettingsBase(BaseModel):
    work_hours_start: Optional[str] = None
    work_hours_end: Optional[str] = None
    coding_style: str = "long_sessions"
    wellness_goals: str = "mental_health,hydration,nutrition,balance"
    diet_preferences: Optional[str] = None
    reminder_frequency: str = "balanced"
    nickname: Optional[str] = None
    timezone: Optional[str] = None
    age: Optional[int] = None
    weight_kg: Optional[float] = None
    storage_mode: str = "cloud_sync"
    theme: str = "light"
    accent_color: str = "soft_blue"

class UserSettingsCreate(UserSettingsBase):
    pass

class UserSettings(UserSettingsBase):
    id: int
    user_id: int

    class Config:
        orm_mode = True

# For AI Suggestions Panel
class AISuggestion(BaseModel):
    type: str # e.g., "hydration", "break", "nutrition", "posture"
    message: str
    action_required: Optional[bool] = False # e.g., for "Time to drink water!"

# Onboarding Flow Schemas
class OnboardingData(BaseModel):
    work_hours_start: Optional[str] = None
    work_hours_end: Optional[str] = None
    coding_style: str
    wellness_goals: List[str]
    diet_preferences: Optional[str] = None
    reminder_frequency: str
    nickname: Optional[str] = None
    timezone: Optional[str] = None
    age: Optional[int] = None
    weight_kg: Optional[float] = None
    storage_mode: str