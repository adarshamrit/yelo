from fastapi import APIRouter, HTTPException, Body
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from backend.database import async_session
from backend.models.order import Order
from pydantic import BaseModel
from typing import List, Optional
import datetime

router = APIRouter(prefix="/admin/orders", tags=["admin-orders"])

class OrderCreate(BaseModel):
    user_id: int
    items: list
    total: float
    address: str
    status: Optional[str] = "pending"
    delivery_person: Optional[str] = None
    tracking_info: Optional[list] = None

class OrderUpdate(BaseModel):
    status: Optional[str] = None
    delivery_person: Optional[str] = None
    tracking_info: Optional[list] = None

@router.get("/")
async def list_orders():
    async with async_session() as session:
        result = await session.execute(select(Order))
        orders = result.scalars().all()
        return [
            {
                "id": o.id,
                "user_id": o.user_id,
                "items": o.items,
                "total": o.total,
                "status": o.status,
                "address": o.address,
                "created_at": o.created_at,
                "updated_at": o.updated_at,
                "delivery_person": o.delivery_person,
                "tracking_info": o.tracking_info,
            }
            for o in orders
        ]

@router.post("/")
async def create_order(order: OrderCreate):
    async with async_session() as session:
        db_order = Order(
            user_id=order.user_id,
            items=order.items,
            total=order.total,
            address=order.address,
            status=order.status,
            delivery_person=order.delivery_person,
            tracking_info=order.tracking_info or [],
        )
        session.add(db_order)
        await session.commit()
        await session.refresh(db_order)
        return {"id": db_order.id}

@router.put("/{order_id}")
async def update_order(order_id: int, order: OrderUpdate):
    async with async_session() as session:
        db_order = await session.get(Order, order_id)
        if not db_order:
            raise HTTPException(status_code=404, detail="Order not found")
        if order.status is not None:
            db_order.status = order.status
        if order.delivery_person is not None:
            db_order.delivery_person = order.delivery_person
        if order.tracking_info is not None:
            db_order.tracking_info = order.tracking_info
        db_order.updated_at = datetime.datetime.utcnow()
        await session.commit()
        await session.refresh(db_order)
        return {"id": db_order.id}

@router.delete("/{order_id}")
async def delete_order(order_id: int):
    async with async_session() as session:
        db_order = await session.get(Order, order_id)
        if not db_order:
            raise HTTPException(status_code=404, detail="Order not found")
        await session.delete(db_order)
        await session.commit()
        return {"detail": "Order deleted"}
