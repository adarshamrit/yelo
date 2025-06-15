from fastapi import APIRouter, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from backend.database import async_session
from backend.models.user import User
from pydantic import BaseModel
from typing import List, Optional
import datetime

router = APIRouter(prefix="/admin/users", tags=["admin-users"])

class UserCreate(BaseModel):
    username: str
    email: str
    is_admin: Optional[bool] = False

class UserUpdate(BaseModel):
    is_admin: Optional[bool] = None
    is_blocked: Optional[bool] = None

@router.get("/")
async def list_users():
    async with async_session() as session:
        result = await session.execute(select(User))
        users = result.scalars().all()
        return [
            {
                "id": u.id,
                "username": u.username,
                "email": u.email,
                "is_admin": u.is_admin,
                "is_blocked": u.is_blocked,
                "created_at": u.created_at,
            }
            for u in users
        ]

@router.post("/")
async def create_user(user: UserCreate):
    async with async_session() as session:
        db_user = User(
            username=user.username,
            email=user.email,
            is_admin=user.is_admin,
        )
        session.add(db_user)
        await session.commit()
        await session.refresh(db_user)
        return {"id": db_user.id}

@router.put("/{user_id}")
async def update_user(user_id: int, user: UserUpdate):
    async with async_session() as session:
        db_user = await session.get(User, user_id)
        if not db_user:
            raise HTTPException(status_code=404, detail="User not found")
        if user.is_admin is not None:
            db_user.is_admin = user.is_admin
        if user.is_blocked is not None:
            db_user.is_blocked = user.is_blocked
        await session.commit()
        await session.refresh(db_user)
        return {"id": db_user.id}

@router.delete("/{user_id}")
async def delete_user(user_id: int):
    async with async_session() as session:
        db_user = await session.get(User, user_id)
        if not db_user:
            raise HTTPException(status_code=404, detail="User not found")
        await session.delete(db_user)
        await session.commit()
        return {"detail": "User deleted"}
