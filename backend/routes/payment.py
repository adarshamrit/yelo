from fastapi import APIRouter

router = APIRouter()

@router.post("/payment")
def process_payment():
    return {"status": "Payment integration coming soon."}
