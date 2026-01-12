# AutoShow

Modern Car Dealership Website built with Django and React.

## Prerequisites

- Python 3.8+
- Node.js 16+

## Setup & Run

### 1. Backend (Django)

Open a terminal and run:

```bash
cd backend
# Create virtual environment (if not exists)
python3 -m venv venv
# Activate virtual environment
source venv/bin/activate
# Install dependencies
pip install -r requirements.txt
# Run migrations
python manage.py migrate
# Create superuser (for admin panel)
python manage.py createsuperuser
# Run server
python manage.py runserver
```

The backend API will be available at `http://localhost:8000`.
Admin panel: `http://localhost:8000/admin`.

### 2. Frontend (React)

Open a **new** terminal and run:

```bash
cd frontend
# Install dependencies
npm install
# Run development server
npm run dev
```

The frontend will be available at `http://localhost:5173`.

## Features

- **Catalog**: Browse cars with filters.
- **Car Details**: View specs and book test drives.
- **Sell Your Car**: Submit commission requests.
- **News**: Stay updated with latest news and promotions.
- **User Dashboard**: Track your requests (requires login).
