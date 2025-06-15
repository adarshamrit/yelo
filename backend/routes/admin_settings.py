from fastapi import APIRouter, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from backend.database import async_session
from pydantic import BaseModel

router = APIRouter(prefix="/admin/settings", tags=["admin-settings"])

# In-memory settings for demo
SETTINGS = {
    "payment_gateway": "Stripe",
    "delivery_radius_km": 5,
    "service_open": True,
}

class SettingsUpdate(BaseModel):
    payment_gateway: str = None
    delivery_radius_km: int = None
    service_open: bool = None

@router.get("")
def get_settings():
    return SETTINGS

@router.put("")
def update_settings(update: SettingsUpdate):
    for k, v in update.dict(exclude_unset=True).items():
        SETTINGS[k] = v
    return SETTINGS
