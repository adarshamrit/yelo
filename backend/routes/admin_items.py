from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from backend.database import async_session
from backend.models.item import Item, Base
from pydantic import BaseModel
from typing import List, Optional
import os

router = APIRouter(prefix="/admin/items", tags=["admin-items"])

UPLOAD_DIR = "uploaded_images"
os.makedirs(UPLOAD_DIR, exist_ok=True)

class ItemCreate(BaseModel):
    name: str
    price: float
    category: Optional[str] = None
    in_stock: Optional[bool] = True
    image_url: Optional[str] = None

class ItemUpdate(BaseModel):
    name: Optional[str] = None
    price: Optional[float] = None
    category: Optional[str] = None
    in_stock: Optional[bool] = None
    image_url: Optional[str] = None

@router.get("/")
async def list_items():
    async with async_session() as session:
        result = await session.execute(select(Item))
        items = result.scalars().all()
        return [
            {
                "id": i.id,
                "name": i.name,
                "price": i.price,
                "category": i.category,
                "inStock": i.in_stock,
                "imageUrl": i.image_url,
            }
            for i in items
        ]

@router.post("/")
async def create_item(
    name: str = Form(...),
    price: float = Form(...),
    category: str = Form(None),
    inStock: bool = Form(True),
    image: UploadFile = File(None),
):
    image_url = None
    if image:
        image_path = os.path.join(UPLOAD_DIR, image.filename)
        with open(image_path, "wb") as f:
            f.write(await image.read())
        image_url = f"/{UPLOAD_DIR}/{image.filename}"
    async with async_session() as session:
        db_item = Item(
            name=name,
            price=price,
            category=category,
            in_stock=inStock,
            image_url=image_url,
        )
        session.add(db_item)
        await session.commit()
        await session.refresh(db_item)
        return {
            "id": db_item.id,
            "name": db_item.name,
            "price": db_item.price,
            "category": db_item.category,
            "inStock": db_item.in_stock,
            "imageUrl": db_item.image_url,
        }

@router.put("/{item_id}")
async def update_item(
    item_id: int,
    name: str = Form(None),
    price: float = Form(None),
    category: str = Form(None),
    inStock: bool = Form(None),
    image: UploadFile = File(None),
):
    async with async_session() as session:
        db_item = await session.get(Item, item_id)
        if not db_item:
            raise HTTPException(status_code=404, detail="Item not found")
        if name is not None:
            db_item.name = name
        if price is not None:
            db_item.price = price
        if category is not None:
            db_item.category = category
        if inStock is not None:
            db_item.in_stock = inStock
        if image:
            image_path = os.path.join(UPLOAD_DIR, image.filename)
            with open(image_path, "wb") as f:
                f.write(await image.read())
            db_item.image_url = f"/{UPLOAD_DIR}/{image.filename}"
        await session.commit()
        await session.refresh(db_item)
        return {
            "id": db_item.id,
            "name": db_item.name,
            "price": db_item.price,
            "category": db_item.category,
            "inStock": db_item.in_stock,
            "imageUrl": db_item.image_url,
        }

@router.delete("/{item_id}")
async def delete_item(item_id: int):
    async with async_session() as session:
        db_item = await session.get(Item, item_id)
        if not db_item:
            raise HTTPException(status_code=404, detail="Item not found")
        await session.delete(db_item)
        await session.commit()
        return {"detail": "Item deleted"}
