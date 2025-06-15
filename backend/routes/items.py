from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from backend.database import async_session
from backend.models.item import Item
from sqlalchemy.future import select

router = APIRouter()

@router.get("/items")
async def get_items():
    async with async_session() as session:
        result = await session.execute(select(Item))
        items = result.scalars().all()
        return [
            {
                "id": item.id,
                "name": item.name,
                "price": item.price,
                "image_url": item.image_url,
                "category": item.category,
                "in_stock": item.in_stock,
            }
            for item in items
        ]

@router.get("/items-db")
async def get_items_db():
    async with async_session() as session:
        result = await session.execute(select(Item))
        items = result.scalars().all()
        return [
            {"id": item.id, "name": item.name, "price": item.price}
            for item in items
        ]
