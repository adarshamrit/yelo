import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from backend.routes import items, cart, payment, login, delivery_map, admin_items, admin_orders, admin_users, admin_analytics, admin_settings, addresses, orders

app = FastAPI()

# Serve uploaded images
app.mount("/uploaded_images", StaticFiles(directory="uploaded_images"), name="uploaded_images")

# Allow CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Only allow frontend origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Yelo FastAPI backend is running!"}

app.include_router(items.router)
app.include_router(cart.router)
app.include_router(payment.router)
app.include_router(login.router)
app.include_router(delivery_map.router)
app.include_router(admin_items.router)
app.include_router(admin_orders.router)
app.include_router(admin_users.router)
app.include_router(admin_analytics.router)
app.include_router(admin_settings.router)
app.include_router(addresses.router)
app.include_router(orders.router)

# Placeholder for items, cart, payment, login, and order delivery endpoints
# Add your routes in routes/ and import them here
