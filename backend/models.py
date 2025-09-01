from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from backend.database import Base

class User(Base):
    __tablename__ = "users"
    __table_args__ = {'extend_existing': True}  # Prevent redefinition errors
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    mood_logs = relationship("MoodLog", order_by="MoodLog.created_at.desc()", back_populates="user")
    hydration_logs = relationship("HydrationLog", order_by="HydrationLog.created_at.desc()", back_populates="user")
    coding_sessions = relationship("CodingSession", order_by="CodingSession.created_at.desc()", back_populates="user")
    focus_sessions = relationship("FocusSession", order_by="FocusSession.created_at.desc()", back_populates="user")
    profile = relationship("UserProfile", back_populates="user", uselist=False, lazy="joined")

class MoodLog(Base):
    __tablename__ = "mood_logs"
    __table_args__ = {'extend_existing': True}  # Prevent redefinition errors
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    mood_score = Column(Float, nullable=False)
    notes = Column(String, nullable=True)
    tiredness_level = Column(Integer, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    user = relationship("User", back_populates="mood_logs")

class HydrationLog(Base):
    __tablename__ = "hydration_logs"
    __table_args__ = {'extend_existing': True}  # Prevent redefinition errors
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    water_glasses = Column(Integer, nullable=False)
    coffee_cups = Column(Integer, nullable=False, default=0)
    daily_goal = Column(Integer, nullable=False, default=8)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    user = relationship("User", back_populates="hydration_logs")

class CodingSession(Base):
    __tablename__ = "coding_sessions"
    __table_args__ = {'extend_existing': True}  # Prevent redefinition errors
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    duration_minutes = Column(Integer, nullable=False)
    notes = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    user = relationship("User", back_populates="coding_sessions")

class FocusSession(Base):
    __tablename__ = "focus_sessions"
    __table_args__ = {'extend_existing': True}  # Prevent redefinition errors
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    duration_minutes = Column(Integer, nullable=False)
    notes = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    user = relationship("User", back_populates="focus_sessions")

class UserProfile(Base):
    __tablename__ = "user_profiles"
    __table_args__ = {'extend_existing': True}  # Prevent redefinition errors
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    nickname = Column(String, nullable=False)
    timezone = Column(String, nullable=False)
    work_hours_start = Column(String, nullable=False)  # e.g., "09:00"
    work_hours_end = Column(String, nullable=False)   # e.g., "17:00"
    coding_style = Column(String, nullable=False)     # "pomodoro" or "long"
    wellness_goals = Column(String, nullable=False)   # Comma-separated, e.g., "hydration,mental_health"
    diet_preference = Column(String, nullable=False)  # "vegetarian", "vegan", etc.
    reminder_frequency = Column(String, nullable=False)  # "minimal", "balanced", "frequent"
    age = Column(Integer, nullable=True)
    weight = Column(Float, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    user = relationship("User", back_populates="profile")