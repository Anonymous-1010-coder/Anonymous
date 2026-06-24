# Anonymous - App Sharing Platform

A full-stack web application for sharing and downloading APK and EXE files with a modern hacker-style dark theme.

## Tech Stack

| Layer       | Technology                     |
|-------------|--------------------------------|
| Frontend    | Next.js 14 + TypeScript        |
| Backend     | Node.js + Express + TypeScript |
| Database    | PostgreSQL                     |
| ORM         | Prisma                         |
| Auth        | JWT + bcrypt                   |
| File Upload | Multer                         |
| Styling     | Tailwind CSS + Framer Motion   |

## Project Structure

```
anonymous/
├── backend/                # Express API server
│   ├── prisma/
│   │   └── schema.prisma   # Database schema
│   ├── src/
│   │   ├── config/         # App configuration
│   │   ├── controllers/    # Route handlers
│   │   ├── middleware/      # Auth, upload, rate limiting
│   │   ├── routes/         # Express routes
│   │   ├── utils/          # Validation helpers
│   │   └── index.ts        # Server entry point
│   ├── uploads/            # Uploaded files (gitignored)
│   ├── .env                # Environment variables
│   └── package.json
├── frontend/               # Next.js client
│   ├── src/
│   │   ├── app/            # Pages (App Router)
│   │   ├── components/     # Reusable components
│   │   ├── lib/            # API client
│   │   └── types/          # TypeScript types
│   ├── .env.local          # Frontend env vars
│   └── package.json
├── supabase_schema.sql     # SQL for Supabase setup
├── start.bat               # One-click launcher
└── README.md
```

## Prerequisites

- **Node.js** v18+
- **PostgreSQL** running (locally or via Supabase)
- **npm**

## Setup Instructions

### 1. Database Setup

**Option A — Local PostgreSQL:**
- Ensure PostgreSQL is running on `localhost:5432`
- Create a database named `anonymous`

**Option B — Supabase:**
- Go to [supabase.com](https://supabase.com) and create a project
- Open the SQL Editor, paste `supabase_schema.sql`, and run it
- Copy your connection string from Project Settings → Database

### 2. Configure Backend

Edit `backend/.env`:

```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/anonymous?schema=public"
JWT_SECRET="change-this-to-a-random-string"
JWT_EXPIRES_IN="7d"
PORT=5000
UPLOAD_DIR="./uploads"
MAX_FILE_SIZE=1073741824
```

For Supabase, replace `DATABASE_URL` with your Supabase connection string (use `?pgbouncer=true&connection_limit=1` for the pooler).

### 3. Run the App

**Using start.bat (Windows):**
- Double-click `start.bat` on the desktop
- It installs dependencies, generates Prisma client, and starts both servers

**Manually:**

```bash
# Terminal 1 — Backend
cd backend
npm install
npx prisma generate
npx prisma db push
npm run dev

# Terminal 2 — Frontend
cd frontend
npm install
npm run dev
```

### 4. Open the App

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000
- **Health Check:** http://localhost:5000/health

## API Documentation

### Authentication

| Method | Endpoint           | Auth     | Description          |
|--------|--------------------|----------|----------------------|
| POST   | `/auth/register`   | No       | Register new user    |
| POST   | `/auth/login`      | No       | Login                |
| GET    | `/auth/profile`    | Required | Get current user     |

**POST /auth/register**
```json
{ "username": "user", "email": "user@example.com", "password": "secret123" }
```
**Response:** `{ token: "...", user: { id, username, email, role } }`

**POST /auth/login**
```json
{ "email": "user@example.com", "password": "secret123" }
```
**Response:** `{ token: "...", user: { id, username, email, role } }`

### Apps

| Method | Endpoint              | Auth     | Description           |
|--------|-----------------------|----------|-----------------------|
| GET    | `/apps/featured`      | No       | Top downloaded apps   |
| GET    | `/apps/list`          | Optional | List/search apps      |
| GET    | `/apps/:id`           | Optional | Get app details       |
| GET    | `/apps/:id/download`  | No       | Download file         |
| POST   | `/apps/upload`        | Required | Upload APK/EXE        |
| GET    | `/apps/my`            | Required | User's uploads        |
| DELETE | `/apps/:id`           | Required | Delete own app        |

**GET /apps/list** query params:
- `search` — search by name/description
- `type` — filter by `APK` or `EXE`
- `page` — page number (default: 1)
- `limit` — results per page (default: 12, max: 50)

**POST /apps/upload** (multipart/form-data):
- `file` — `.apk` or `.exe` file (max 1GB)
- `name` — app name (required)
- `description` — app description

## UI Design

- **Theme:** Dark hacker-style with black (`#0a0a0f`) background
- **Accents:** Neon green (`#00ff41`), purple (`#b300ff`), blue (`#00d4ff`)
- **Components:** Glass-morphism cards with backdrop blur
- **Animations:** Framer Motion for page transitions, card reveals, hover effects
- **Typography:** Monospace accents for code-like UI elements, gradient text for branding
- **Responsive:** Mobile-first with hamburger menu on small screens

## Security

- Passwords hashed with bcrypt (12 rounds)
- JWT authentication with configurable expiry
- File type validation (APK/EXE only)
- Rate limiting on auth and upload routes
- File size limit (1GB default)
- Input sanitization via Prisma parameterized queries
