from fastapi import APIRouter, HTTPException, Depends, Header
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
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
    phone: str = None
    email: str = None
    password: str
    name: str = ""

class LoginRequest(BaseModel):
    phone: str = None
    email: str = None
    password: str

@router.post("/register")
async def register(data: RegisterRequest):
    async with async_session() as session:
        if not data.phone and not data.email:
            raise HTTPException(status_code=400, detail="Phone or email required")
        # Check if user exists
        if data.phone:
            result = await session.execute(select(User).where(User.phone == data.phone))
            if result.scalar_one_or_none():
                raise HTTPException(status_code=400, detail="Phone already registered")
        if data.email:
            result = await session.execute(select(User).where(User.email == data.email))
            if result.scalar_one_or_none():
                raise HTTPException(status_code=400, detail="Email already registered")
        # Create new user
        new_user = User(
            username=data.name or data.phone or data.email,
            email=data.email or f"{data.phone}@yelo.local",
            phone=data.phone,
            password_hash=hash_password(data.password),
            is_admin=False,
            is_blocked=False,
        )
        session.add(new_user)
        await session.commit()
        return {"status": "registered", "user_id": new_user.id}

@router.post("/login")
async def login(data: LoginRequest):
    async with async_session() as session:
        if data.phone:
            result = await session.execute(select(User).where(User.phone == data.phone))
        elif data.email:
            result = await session.execute(select(User).where(User.email == data.email))
        else:
            raise HTTPException(status_code=400, detail="Phone or email required")
        user = result.scalar_one_or_none()
        if not user:
            raise HTTPException(status_code=401, detail="Invalid credentials")
        if user.password_hash != hash_password(data.password):
            raise HTTPException(status_code=401, detail="Invalid credentials")
        token = create_access_token({"user_id": user.id, "phone": user.phone, "email": user.email})
        return {"status": "success", "user_id": user.id, "token": token}

@router.get("/me")
async def get_me(Authorization: str = Header(...)):
    if not Authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid token")
    token = Authorization.split(" ", 1)[1]
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("user_id")
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid token payload")
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")
    async with async_session() as session:
        result = await session.execute(select(User).where(User.id == user_id))
        user = result.scalar_one_or_none()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        return {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "phone": user.phone,
            "is_admin": user.is_admin,
        }
