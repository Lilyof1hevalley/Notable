# Notable

Notable is a study productivity app for organizing notes, tasks, and focus sessions. The project is split into a React/Vite frontend and an Express/SQLite backend.

Group report: [Notable Group Report](https://docs.google.com/document/d/1MLaiFm2-XS0ueA3eEfL4rn2nbUW_koQJesylkEIdjTQ/edit?usp=sharing)

## Project Structure

```text
Notable/
├── Backend/      # Express API, SQLite database, auth, todos, notes
├── Frontend/     # React + Vite app
└── README.md
```

The frontend source of truth is `Frontend/`. The old duplicate `Frontend/notable/` app has been removed.

## Tech Stack

- Frontend: React, Vite, React Router, ESLint
- Backend: Node.js, Express, SQLite via better-sqlite3
- Auth: bcrypt password hashing, JWT bearer tokens
- Other backend utilities: express-validator, express-rate-limit, nodemailer

## Prerequisites

- Node.js
- npm

## Setup

Install frontend dependencies:

```bash
cd Frontend
npm install
```

Install backend dependencies:

```bash
cd Backend
npm install
```

Create `Backend/.env`:

```env
PORT=3000
JWT_SECRET=replace-with-a-long-random-secret
FRONTEND_URL=http://127.0.0.1:5173

# Required only for password-reset email delivery
EMAIL_USER=
EMAIL_PASS=
```

## Running Locally

Start the backend:

```bash
cd Backend
npm run dev
```

The API runs at:

```text
http://localhost:3000
```

Start the frontend in another terminal:

```bash
cd Frontend
npm run dev
```

The app runs at:

```text
http://127.0.0.1:5173
```

## Available Scripts

Frontend:

```bash
npm run dev      # Start Vite dev server
npm run build    # Build production frontend
npm run lint     # Run ESLint
npm run preview  # Preview production build
```

Backend:

```bash
npm start        # Start Express with node
npm run dev      # Start Express with nodemon
```

## Backend API

Base URL:

```text
http://localhost:3000/api
```

Public routes:

| Method | Route | Description |
| --- | --- | --- |
| `POST` | `/auth/register` | Register a user |
| `POST` | `/auth/login` | Log in and receive a JWT |
| `POST` | `/auth/forgot-password` | Request a password reset email |
| `POST` | `/auth/reset-password` | Reset password with token |

Protected routes require:

```http
Authorization: Bearer <token>
```

| Method | Route | Description |
| --- | --- | --- |
| `GET` | `/todos` | List todos |
| `POST` | `/todos` | Create todo |
| `PATCH` | `/todos/:id` | Update todo |
| `PATCH` | `/todos/:id/complete` | Mark todo complete |
| `DELETE` | `/todos/:id` | Delete todo |
| `GET` | `/notes` | List notes |
| `POST` | `/notes` | Create note |
| `PATCH` | `/notes/:id` | Update note |
| `DELETE` | `/notes/:id` | Delete note |
| `GET` | `/focus-sessions` | List focus sessions |
| `GET` | `/focus-sessions/recommended` | Recommend todos for focus |
| `POST` | `/focus-sessions` | Start focus session |
| `PATCH` | `/focus-sessions/:id/end` | End focus session |
| `GET` | `/focus-sessions/:id/summary` | Get focus session summary |

## Example API Calls

Register:

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Student",
    "email": "student@example.com",
    "password": "secret123",
    "display_name": "Student"
  }'
```

Log in:

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student@example.com",
    "password": "secret123"
  }'
```

Create a todo:

```bash
curl -X POST http://localhost:3000/api/todos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "title": "Review Chapter 3",
    "deadline": "2026-05-01",
    "academic_weight": 5,
    "estimated_effort": 3
  }'
```

## Current Integration Status

- The backend API can run locally and supports auth, todos, and notes.
- The frontend builds and routes correctly.
- The frontend is not fully connected to the backend yet. Login/register currently navigate locally instead of calling `/api/auth/login` and `/api/auth/register`.
- Dashboard and notebook screens currently use sample data rather than API data.

## Known Gaps

- Add a frontend API client and token storage.
- Wire login/register/reset-password forms to backend routes.
- Fetch todos and notes from the backend after login.
- Add a real `.env.example`.
- Password reset needs email credentials and database support for reset token fields.
- Focus sessions need matching SQLite tables before those endpoints are production-ready.
- Add automated tests for backend routes and frontend flows.

## Verification

Frontend:

```bash
cd Frontend
npm run build
npm run lint
```

Backend smoke test:

```bash
cd Backend
npm run dev
curl http://localhost:3000/
```
