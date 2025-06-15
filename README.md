# 🚀 Yelo: Hyperlocal Delivery System

Yelo is a monorepo for a modern, full-stack hyperlocal delivery system.

## 🗂️ Structure
- **frontend/**: Next.js webapp (TypeScript, Tailwind CSS)
- **backend/**: FastAPI backend (Python, PostgreSQL)

## ✨ Features
- 🛒 Items listing & search
- 🛍️ Cart management with global context
- 💳 Payment methods (add, delete, set default)
- 👤 User authentication (JWT, phone/email)
- 🏠 Multiple addresses per user
- 📦 Order creation, history, and tracking
- 🗺️ Map integration for delivery
- 🛠️ Admin dashboard (CRUD for items, orders, users, analytics)
- 🎨 Modern UI/UX with animated bubbles, smooth transitions

## 🚀 Getting Started

### Frontend
```bash
cd frontend
npm install
npm run dev
```
Visit [http://localhost:3000](http://localhost:3000)

### Backend
```powershell
cd backend
./Scripts/Activate.ps1  # Activate virtualenv (Windows)
pip install -r requirements.txt
uvicorn main:app --reload
```
Visit [http://localhost:8000/docs](http://localhost:8000/docs) for API docs

### Database
- PostgreSQL required. Update connection string in `backend/database.py`.
- Run Alembic migrations if needed.

## 📁 Folder Structure
- `frontend/` - Next.js app (src/app, src/components, etc.)
- `backend/` - FastAPI app (main.py, models/, routes/)

## 🧑‍💻 Development
- Update this README as you add features.
- Replace placeholder code for payment and map with real integrations as needed.
- See each folder for more docs.

---

Made with ❤️ for hyperlocal delivery.
