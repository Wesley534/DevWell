# backend/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.routers import auth_router, users_router, wellness_router, dashboard_router
from backend.database import Base, engine
from backend.config import settings

app = FastAPI(title="DevWell API")

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create database tables
Base.metadata.create_all(bind=engine)

# Include routers
app.include_router(auth_router)
app.include_router(users_router)
app.include_router(wellness_router)
app.include_router(dashboard_router)