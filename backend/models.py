# backend/models.py
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from backend.database import Base  # Changed from backend.database

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    mood_logs = relationship("MoodLog", order_by="MoodLog.created_at.desc()", back_populates="user")
    hydration_logs = relationship("HydrationLog", order_by="HydrationLog.created_at.desc()", back_populates="user")
    coding_sessions = relationship("CodingSession", order_by="CodingSession.created_at.desc()", back_populates="user")
    focus_sessions = relationship("FocusSession", order_by="FocusSession.created_at.desc()", back_populates="user")

class MoodLog(Base):
    __tablename__ = "mood_logs"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    mood_score = Column(Float, nullable=False)
    notes = Column(String, nullable=True)
    tiredness_level = Column(Integer, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    user = relationship("User", back_populates="mood_logs")

class HydrationLog(Base):
    __tablename__ = "hydration_logs"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    glasses_drunk = Column(Integer, nullable=False)
    daily_goal = Column(Integer, nullable=False, default=8)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    user = relationship("User", back_populates="hydration_logs")

class CodingSession(Base):
    __tablename__ = "coding_sessions"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    duration_minutes = Column(Integer, nullable=False)
    notes = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    user = relationship("User", back_populates="coding_sessions")

class FocusSession(Base):
    __tablename__ = "focus_sessions"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    duration_minutes = Column(Integer, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    user = relationship("User", back_populates="focus_sessions")