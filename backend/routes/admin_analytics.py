from fastapi import APIRouter
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from backend.database import async_session
from backend.models.order import Order
from backend.models.user import User
from backend.models.item import Item
import datetime

router = APIRouter(prefix="/admin/analytics", tags=["admin-analytics"])

@router.get("/")
async def analytics():
    async with async_session() as session:
        order_count = await session.execute(select(Order))
        orders = order_count.scalars().all()
        user_count = await session.execute(select(User))
        users = user_count.scalars().all()
        item_count = await session.execute(select(Item))
        items = item_count.scalars().all()
        # Example analytics data
        return {
            "order_count": len(orders),
            "user_count": len(users),
            "item_count": len(items),
            "revenue": sum([o.total_price for o in orders if hasattr(o, 'total_price')]),
            "active_users": len([u for u in users if getattr(u, 'is_active', True)]),
        }
