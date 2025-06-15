from fastapi import APIRouter, Body, HTTPException
from backend.models.address import Address
from backend.database import async_session
from sqlalchemy.future import select

router = APIRouter()

@router.post("/payment")
async def process_payment(
    data: dict = Body(...)
):
    address_id = data.get("address_id")
    if not address_id:
        raise HTTPException(status_code=400, detail="Address ID required")
    async with async_session() as session:
        result = await session.execute(select(Address).where(Address.id == address_id))
        address = result.scalar_one_or_none()
        if not address:
            raise HTTPException(status_code=404, detail="Address not found")
        # Here you would create the order, charge payment, etc.
        # For now, just return the address used for delivery
        return {
            "status": "success",
            "delivery_address": {
                "label": address.label,
                "address": address.address,
                "city": address.city,
                "state": address.state,
                "zip_code": address.zip_code,
                "is_default": address.is_default,
            }
        }
