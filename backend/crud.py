from sqlalchemy.orm import Session
from sqlalchemy import func, and_
from datetime import datetime, timedelta
from backend.models import User, MoodLog, HydrationLog, CodingSession, FocusSession, UserProfile
from passlib.context import CryptContext
from backend.schemas import MoodLogCreate, HydrationLogCreate, CodingSessionCreate, FocusSessionCreate, DashboardResponse, DashboardStat, UserProfileCreate
from typing import Optional, List

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()

def create_user(db: Session, email: str, password: str):
    hashed_password = pwd_context.hash(password)
    db_user = User(email=email, hashed_password=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def verify_password(plain_password: str, hashed_password: str):
    return pwd_context.verify(plain_password, hashed_password)

def create_hydration_log(db: Session, user_id: int, hydration_log: HydrationLogCreate):
    db_hydration = HydrationLog(**hydration_log.dict(), user_id=user_id)
    db.add(db_hydration)
    db.commit()
    db.refresh(db_hydration)
    return db_hydration

def get_recent_hydration_logs(db: Session, user_id: int, days: int = 7):
    cutoff = datetime.utcnow() - timedelta(days=days)
    return db.query(HydrationLog).filter(and_(HydrationLog.user_id == user_id, HydrationLog.created_at >= cutoff)).all()

def create_coding_session(db: Session, user_id: int, session: CodingSessionCreate):
    db_session = CodingSession(**session.dict(), user_id=user_id)
    db.add(db_session)
    db.commit()
    db.refresh(db_session)
    return db_session

def get_recent_coding_sessions(db: Session, user_id: int, days: int = 7):
    cutoff = datetime.utcnow() - timedelta(days=days)
    return db.query(CodingSession).filter(and_(CodingSession.user_id == user_id, CodingSession.created_at >= cutoff)).all()

def create_focus_session(db: Session, user_id: int, session: FocusSessionCreate):
    db_session = FocusSession(**session.dict(), user_id=user_id)
    db.add(db_session)
    db.commit()
    db.refresh(db_session)
    return db_session

def get_recent_focus_sessions(db: Session, user_id: int, days: int = 7):
    cutoff = datetime.utcnow() - timedelta(days=days)
    return db.query(FocusSession).filter(and_(FocusSession.user_id == user_id, FocusSession.created_at >= cutoff)).all()

def create_mood_log(db: Session, user_id: int, mood_log: MoodLogCreate):
    db_mood = MoodLog(**mood_log.dict(), user_id=user_id)
    db.add(db_mood)
    db.commit()
    db.refresh(db_mood)
    return db_mood

def get_recent_mood_logs(db: Session, user_id: int, days: int = 7):
    cutoff = datetime.utcnow() - timedelta(days=days)
    return db.query(MoodLog).filter(and_(MoodLog.user_id == user_id, MoodLog.created_at >= cutoff)).order_by(MoodLog.created_at.asc()).all()

def create_user_profile(db: Session, user_id: int, profile: UserProfileCreate):
    db_profile = UserProfile(**profile.dict(), user_id=user_id)
    db.add(db_profile)
    db.commit()
    db.refresh(db_profile)
    return db_profile

def get_user_profile(db: Session, user_id: int) -> Optional[UserProfile]:
    return db.query(UserProfile).filter(UserProfile.user_id == user_id).first()

def get_dashboard_stats(db: Session, user_id: int, days: int = 7) -> DashboardResponse:
    cutoff = datetime.utcnow() - timedelta(days=days)

    # Mood stats
    mood_logs = get_recent_mood_logs(db, user_id, days)
    avg_mood = sum(log.mood_score for log in mood_logs) / len(mood_logs) if mood_logs else 0
    avg_tiredness = sum(log.tiredness_level for log in mood_logs if log.tiredness_level is not None) / len([log for log in mood_logs if log.tiredness_level is not None]) if any(log.tiredness_level is not None for log in mood_logs) else 0
    mood_stat = DashboardStat(
        title="Avg. Mood Score",
        value=f"{avg_mood:.1f}/5",
        description=f"Average tiredness: {avg_tiredness:.1f}/10" if avg_tiredness > 0 else "No tiredness data",
        trend=12,
        color="mood-excellent"
    )

    # Hydration stats
    hydration_logs = get_recent_hydration_logs(db, user_id, days)
    total_glasses = sum(log.water_glasses for log in hydration_logs)
    total_coffee = sum(log.coffee_cups for log in hydration_logs)
    total_goal = sum(log.daily_goal for log in hydration_logs)
    hydration_pct = (total_glasses / total_goal * 100) if total_goal > 0 else 0
    hydration_stat = DashboardStat(
        title="Hydration Goal",
        value=f"{hydration_pct:.0f}%",
        description=f"{total_glasses} glasses, {total_coffee} coffee cups, goal {total_goal} glasses",
        trend=8,
        color="hydration-excellent"
    )

    # Coding sessions stats
    coding_sessions = get_recent_coding_sessions(db, user_id, days)
    total_sessions = len(coding_sessions)
    total_coding_minutes = sum(session.duration_minutes for session in coding_sessions)
    coding_stat = DashboardStat(
        title="Coding Sessions",
        value=str(total_sessions),
        description=f"Total {total_coding_minutes} minutes this week",
        trend=-5,
        color="emerald-500"
    )

    # Focus time stats
    focus_sessions = get_recent_focus_sessions(db, user_id, days)
    total_focus_hours = sum(session.duration_minutes for session in focus_sessions) / 60
    avg_focus_hours = total_focus_hours / days if days > 0 else 0
    focus_stat = DashboardStat(
        title="Focus Time",
        value=f"{avg_focus_hours:.1f}h",
        description="Daily average focus time",
        trend=15,
        color="productivity-high"
    )

    # Get diet preference for snack suggestion
    profile = get_user_profile(db, user_id)
    snack = {
        "vegetarian": "Dark Chocolate Almonds",
        "vegan": "Roasted Chickpeas",
        "protein-focused": "Beef Jerky",
        "balanced": "Trail Mix",
        "other": "Granola Bar"
    }.get(profile.diet_preference if profile else "balanced", "Trail Mix")

    stats = [mood_stat, hydration_stat, coding_stat, focus_stat]

    insights = []
    if avg_mood >= 4:
        insights.append("Great work this week! Maintain excellent hydration and consistent coding sessions.")
    if avg_tiredness > 7:
        insights.append(f"You seem quite tired. Consider taking short breaks or trying some {snack}.")
    if hydration_pct >= 80:
        insights.append("Your hydration levels are strong. Keep it up!")
    if total_sessions > 20:
        insights.append("Impressive coding consistency. Consider adding short breaks for sustained productivity.")

    return DashboardResponse(stats=stats, insights=insights)