from fastapi import APIRouter

router = APIRouter()

@router.get("/cart")
def get_cart():
    return [
        {"id": 1, "name": "Pizza", "price": 10, "qty": 1},
        {"id": 2, "name": "Burger", "price": 8, "qty": 2},
    ]
