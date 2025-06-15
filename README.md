# Yelo: Hyperlocal Delivery System

Yelo is a monorepo for a hyperlocal delivery system. It consists of:

- **frontend/**: Next.js single-page webapp (TypeScript, Tailwind CSS)
- **backend/**: FastAPI backend (Python)

## Features
- Items listing
- Cart management
- Payment integration (placeholder)
- User login
- Map integration for order delivery

## Getting Started

### Frontend
```bash
cd frontend
npm run dev
```

### Backend
```bash
# Windows PowerShell
./backend/Scripts/Activate.ps1
uvicorn main:app --reload
```

## Folder Structure
- `frontend/` - Next.js app (src/pages, src/components, etc.)
- `backend/` - FastAPI app (main.py, models/, routes/)

## Development
- Update the README as you add features.
- Replace placeholder code for payment and map with real integrations as needed.

---

For more details, see the documentation in each folder.
