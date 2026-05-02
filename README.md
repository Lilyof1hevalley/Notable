# Notable

Notable is a local-first study productivity app for organizing notebooks, notes, tasks, resources, and focus sessions. The MVP combines a React/Vite frontend with an Express/SQLite backend and implements the core flow described in the group report: authentication, dashboard, notebook workspace, BHPS task priority, and focus-session recommendations.

Group report: [Notable Group Report](https://docs.google.com/document/d/1MLaiFm2-XS0ueA3eEfL4rn2nbUW_koQJesylkEIdjTQ/edit?usp=sharing)

## Project Structure

```text
Notable/
├── Backend/      # Express API, SQLite database, auth, tasks, notes, resources
├── Frontend/     # React + Vite app
└── README.md
```

## Tech Stack

- Frontend: React, Vite, React Router, ESLint
- Backend: Node.js, Express, SQLite via better-sqlite3
- Auth: bcrypt password hashing, JWT bearer tokens
- Uploads: multer, local `Backend/uploads/`
- Optional email delivery: nodemailer

## Local Setup

Install backend dependencies:

```bash
cd Backend
npm install
```

Install frontend dependencies:

```bash
cd Frontend
npm install
```

Create `Backend/.env`:

```env
PORT=3000
JWT_SECRET=replace-with-a-long-random-secret
FRONTEND_URL=http://127.0.0.1:5173

# Optional. If omitted, forgot-password returns a local reset token/link for testing.
EMAIL_USER=
EMAIL_PASS=

# Optional, not part of the local MVP flow.
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

## Running Locally

Start the backend in one terminal:

```bash
cd Backend
npm start
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

## MVP Features

- Register, login, logout, protected dashboard, and local JWT session storage.
- Password reset flow for local testing. If SMTP credentials are not configured, `/auth/forgot-password` returns a reset token/link in the response.
- Dynamic dashboard using backend data:
  - profile greeting
  - folders and notebooks
  - todos with deadline, academic weight, estimated effort, BHPS score, and priority label
  - upcoming task timeline
  - focus-session recommendation and start/end controls
- Notebook detail route at `/notebook/:id`:
  - chapter list from backend
  - chapter search
  - create chapter
  - create quick note linked optionally to a todo
  - upload resource to notebook/chapter
  - download resource
- Backend ownership checks prevent users from updating/deleting/downloading another user's data.
- SQLite schema is created idempotently on startup, so a fresh local database can boot without manual migration.

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
| `POST` | `/auth/forgot-password` | Request password reset; returns local token/link when SMTP is not configured |
| `POST` | `/auth/reset-password` | Reset password with token |

Protected routes require:

```http
Authorization: Bearer <token>
```

| Method | Route | Description |
| --- | --- | --- |
| `GET` | `/user/profile` | Get safe current-user profile |
| `PATCH` | `/user/profile` | Update profile name/display name |
| `GET` | `/folders` | List folders |
| `POST` | `/folders` | Create folder |
| `PATCH` | `/folders/:id` | Update folder |
| `DELETE` | `/folders/:id` | Delete folder |
| `GET` | `/folders/:id/notebooks` | List notebooks in a folder |
| `GET` | `/notebooks` | List notebooks |
| `POST` | `/notebooks` | Create notebook |
| `PATCH` | `/notebooks/:id` | Update notebook |
| `DELETE` | `/notebooks/:id` | Delete notebook |
| `GET` | `/notebooks/:notebookId/chapters` | List notebook chapters |
| `POST` | `/notebooks/:notebookId/chapters` | Create chapter |
| `PATCH` | `/chapters/:id` | Update chapter |
| `DELETE` | `/chapters/:id` | Delete chapter |
| `GET` | `/todos` | List todos ranked with BHPS |
| `POST` | `/todos` | Create todo |
| `PATCH` | `/todos/:id` | Update todo |
| `PATCH` | `/todos/:id/complete` | Mark todo complete |
| `DELETE` | `/todos/:id` | Delete todo |
| `GET` | `/notes` | List notes |
| `POST` | `/notes` | Create note |
| `PATCH` | `/notes/:id` | Update note |
| `DELETE` | `/notes/:id` | Delete note |
| `GET` | `/resources` | List resources |
| `POST` | `/resources` | Upload resource with multipart `file` |
| `GET` | `/resources/notebook/:notebookId` | List notebook resources |
| `GET` | `/resources/chapter/:chapterId` | List chapter resources |
| `GET` | `/resources/:id/download` | Download resource |
| `DELETE` | `/resources/:id` | Delete resource |
| `GET` | `/focus-sessions` | List focus sessions |
| `GET` | `/focus-sessions/recommended` | Recommend incomplete todos by BHPS |
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
    "deadline": "2026-05-25",
    "academic_weight": 8,
    "estimated_effort": 4
  }'
```

## Verification

Frontend:

```bash
cd Frontend
npm run lint
npm run build
```

Backend smoke check:

```bash
cd Backend
npm start
```

Then in another terminal:

```bash
curl http://localhost:3000/
```

Expected response:

```json
{"message":"Notable Backend is running!"}
```

## Local Data Notes

- SQLite data is stored in `Backend/database/notable.db`.
- Uploaded files are stored in `Backend/uploads/`.
- These local runtime artifacts may change during manual testing.
