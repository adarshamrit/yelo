from fastapi import APIRouter, Body, HTTPException, Header
from backend.models.address import Address
from backend.models.order import Order
from backend.database import async_session
from sqlalchemy.future import select
import jwt
import datetime

router = APIRouter()

SECRET_KEY = "yelo_super_secret_key"
ALGORITHM = "HS256"

@router.post("/payment")
async def process_payment(
    data: dict = Body(...),
    Authorization: str = Header(None)
):
    address_id = data.get("address_id")
    items = data.get("items")
    total = data.get("total")
    if not address_id or not items or not total:
        raise HTTPException(status_code=400, detail="Missing order data")
    if not Authorization or not Authorization.startswith("Bearer "):
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
        result = await session.execute(select(Address).where(Address.id == address_id))
        address = result.scalar_one_or_none()
        if not address:
            raise HTTPException(status_code=404, detail="Address not found")
        # Create order
        order = Order(
            user_id=user_id,
            items=items,
            total=total,
            status="pending",
            address=f"{address.label or ''}: {address.address}, {address.city}, {address.state} {address.zip_code}",
            created_at=datetime.datetime.utcnow(),
            updated_at=datetime.datetime.utcnow(),
        )
        session.add(order)
        await session.commit()
        return {
            "status": "success",
            "order_id": order.id,
            "order_status": order.status,
            "delivery_address": order.address,
        }
