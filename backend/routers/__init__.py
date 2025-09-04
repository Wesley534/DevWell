# backend/routers/__init__.py
from .auth import router as auth_router
from .users import router as users_router
from .wellness import router as wellness_router
from .dashboard import router as dashboard_router
from .mood import router as mood_router  # Add this
from .hydration import router as hydration_router  # Add this
from .coding import router as coding_router  # Add this
from .profile import router as profile_router  # Add this
from .coffee import router as coffee_router  # Add this


