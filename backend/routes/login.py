from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import sessionmaker
from backend.models.user import User
from backend.database import async_session
from pydantic import BaseModel
import hashlib
import jwt
import datetime

router = APIRouter()

SECRET_KEY = "yelo_super_secret_key"  # Change this in production
ALGORITHM = "HS256"

# Helper to hash passwords (simple, for demo)
def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

def create_access_token(data: dict, expires_delta: int = 3600):
    to_encode = data.copy()
    expire = datetime.datetime.utcnow() + datetime.timedelta(seconds=expires_delta)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

class RegisterRequest(BaseModel):
    phone: str
    password: str
    name: str = ""
    email: str = ""

class LoginRequest(BaseModel):
    phone: str
    password: str

@router.post("/register")
async def register(data: RegisterRequest):
    async with async_session() as session:
        # Check if user exists
        result = await session.execute(select(User).where(User.phone == data.phone))
        user = result.scalar_one_or_none()
        if user:
            raise HTTPException(status_code=400, detail="Phone already registered")
        # Create new user
        new_user = User(
            username=data.name or data.phone,
            email=data.email or f"{data.phone}@yelo.local",
            phone=data.phone,
            password_hash=hash_password(data.password),  # Use password_hash
            is_admin=False,
            is_blocked=False,
        )
        session.add(new_user)
        await session.commit()
        return {"status": "registered", "user_id": new_user.id}

@router.post("/login")
async def login(data: LoginRequest):
    async with async_session() as session:
        result = await session.execute(select(User).where(User.phone == data.phone))
        user = result.scalar_one_or_none()
        if not user:
            raise HTTPException(status_code=401, detail="Invalid phone or password")
        # Password check
        if user.password_hash != hash_password(data.password):
            raise HTTPException(status_code=401, detail="Invalid phone or password")
        # Generate JWT token
        token = create_access_token({"user_id": user.id, "phone": user.phone})
        return {"status": "success", "user_id": user.id, "token": token}
