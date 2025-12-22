"""
LOGOS API - Authentication Router
User registration, login, and JWT management
"""

from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, EmailStr, Field
from typing import Optional
import os
import hashlib
import secrets
from datetime import datetime, timedelta

router = APIRouter()
security = HTTPBearer(auto_error=False)

class UserRegister(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=6)
    name: Optional[str] = None
    institution: Optional[str] = None
    role: str = "user"

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_in: int = 3600
    user: dict

class UserResponse(BaseModel):
    id: int
    email: str
    name: Optional[str]
    role: str
    institution: Optional[str]
    created_at: str

# Simple in-memory user store for demo
USERS = {}
ADMIN_EMAIL = os.getenv("ADMIN_EMAIL", "admin@logosclassics.com")
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD", "raizada2")

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

def generate_token() -> str:
    return secrets.token_urlsafe(32)

@router.post("/register", response_model=TokenResponse)
async def register(user: UserRegister):
    """Register a new user."""
    if user.email in USERS:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    user_id = len(USERS) + 1
    USERS[user.email] = {
        "id": user_id,
        "email": user.email,
        "password_hash": hash_password(user.password),
        "name": user.name,
        "role": user.role,
        "institution": user.institution,
        "created_at": datetime.now().isoformat()
    }
    
    token = generate_token()
    
    return TokenResponse(
        access_token=token,
        user={
            "id": user_id,
            "email": user.email,
            "name": user.name,
            "role": user.role
        }
    )

@router.post("/login", response_model=TokenResponse)
async def login(credentials: UserLogin):
    """Login and get access token."""
    
    # Check for admin
    if credentials.email == ADMIN_EMAIL and credentials.password == ADMIN_PASSWORD:
        return TokenResponse(
            access_token=generate_token(),
            user={
                "id": 0,
                "email": ADMIN_EMAIL,
                "name": "Admin",
                "role": "admin"
            }
        )
    
    # Check regular users
    if credentials.email not in USERS:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    user = USERS[credentials.email]
    if user["password_hash"] != hash_password(credentials.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    return TokenResponse(
        access_token=generate_token(),
        user={
            "id": user["id"],
            "email": user["email"],
            "name": user["name"],
            "role": user["role"]
        }
    )

@router.post("/refresh")
async def refresh_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Refresh access token."""
    if not credentials:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    return TokenResponse(
        access_token=generate_token(),
        user={"note": "Token refreshed"}
    )

@router.get("/me", response_model=UserResponse)
async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Get current user information."""
    if not credentials:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    # Demo response
    return UserResponse(
        id=1,
        email="user@example.com",
        name="Demo User",
        role="user",
        institution=None,
        created_at=datetime.now().isoformat()
    )
