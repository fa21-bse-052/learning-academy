# HR Learning Academy

A full-stack learning platform with **FastAPI backend** and **Next.js frontend**.

---

## Table of Contents

* [Features](#features)
* [Tech Stack](#tech-stack)
* [Getting Started](#getting-started)

  * [Backend](#backend)
  * [Frontend](#frontend)
* [Environment Variables](#environment-variables)
* [License](#license)

---

## Features

* User authentication with JWT
* Video courses with quizzes
* LLM-powered quiz generation and checking
* Certificate generation
* Dashboard with stats, courses, and learning paths

---

## Tech Stack

* **Backend:** Python, FastAPI, Pydantic, MongoDB
* **Frontend:** Next.js, React, Tailwind CSS
* **Authentication:** JWT tokens
* **Deployment:** Docker (optional)

---

## Getting Started

### Backend

1. **Clone the repository**:

```bash
git clone https://github.com/fa21-bse-052/PepsiHrItProject.git
cd PepsiHrItProject/Backend
```

2. **Create and activate a virtual environment**:

```bash
python -m venv .venv
# Windows
.venv\Scripts\activate
# Linux/macOS
source .venv/bin/activate
```

3. **Install dependencies**:

```bash
pip install -r requirements.txt
```

4. **Set environment variables** in a `.env` file:

```
SECRET_KEY=your_secret_key_here
MONGO_URI=your_mongodb_uri_here
API_URL=http://localhost:8000
```

5. **Run the backend**:

```bash
uvicorn app.main:app --reload
```

The backend will be available at `http://localhost:8000`.

### Frontend

1. **Navigate to frontend folder**:

```bash
cd PepsiHrItProject/Frontend
```

2. **Install dependencies**:

```bash
npm install
```

3. **Run the frontend**:

```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`.

---

## Environment Variables

* **Backend (`.env`)**:

  * `SECRET_KEY` – JWT secret
  * `MONGO_URI` – MongoDB connection URI
  * `API_URL` – Base URL for API

* **Frontend (`.env.local`)**:

  * `NEXT_PUBLIC_API_URL` – URL to backend API (e.g., `http://localhost:8000`)

---

## License

This project is licensed under the MIT License.
