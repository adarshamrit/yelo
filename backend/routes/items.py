from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from backend.database import async_session
from backend.models.item import Item
from sqlalchemy.future import select

router = APIRouter()

@router.get("/items")
def get_items():
    return [
        {"id": 1, "name": "Pizza", "price": 10},
        {"id": 2, "name": "Burger", "price": 8},
        {"id": 3, "name": "Sushi", "price": 15},
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
