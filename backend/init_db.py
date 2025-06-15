import asyncio
from database import engine, async_session
from models.item import Base as ItemBase
from models.order import Base as OrderBase
from models.user import Base as UserBase

async def init_db():
    async with engine.begin() as conn:
        await conn.run_sync(ItemBase.metadata.create_all)
        await conn.run_sync(OrderBase.metadata.create_all)
        await conn.run_sync(UserBase.metadata.create_all)
    # Insert dummy data
    async with async_session() as session:
        items = [
            Item(name="Pizza", price=10.0),
            Item(name="Burger", price=8.0),
            Item(name="Sushi", price=15.0)
        ]
        session.add_all(items)
        await session.commit()

if __name__ == "__main__":
    asyncio.run(init_db())
