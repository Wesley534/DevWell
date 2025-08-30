# backend/main.py
from fastapi import FastAPI
from .database import engine, Base
from .routers import auth, users, wellness # We'll create these

# Create all database tables (for development, use Alembic for production)
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="DevWell API",
    description="API for the DevWell wellness application for developers.",
    version="0.1.0",
)

app.include_router(auth.router, prefix="/api/v1/auth", tags=["Authentication"])
app.include_router(users.router, prefix="/api/v1/users", tags=["Users"])
app.include_router(wellness.router, prefix="/api/v1/wellness", tags=["Wellness"])

@app.get("/")
async def read_root():
    return {"message": "Welcome to DevWell API"}