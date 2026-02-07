# ReachInbox Email Scheduler

A production-grade full-stack email scheduling system built with Node.js, Express, BullMQ, Redis, PostgreSQL, and React.

## 🚀 Features

### Backend
- **Reliable Scheduling**: Uses BullMQ (Redis-backed) for persistent job scheduling (No Cron).
- **Concurreny & Rate Limiting**: Workers configured to process jobs concurrently with rate limits (e.g., 50 emails/hour).
- **Restart Persistence**: Jobs are stored in Redis/DB and resume automatically after server restarts.
- **Google OAuth**: Secure authentication flow.
- **Ethereal Email**: Fake SMTP transport for testing email delivery.

### Frontend
- **Modern Dashboard**: Built with React, Vite, and Tailwind CSS.
- **Google Login**: Real OAuth integration.
- **Campaign Management**: 
    - CSV/Text file upload for bulk scheduling.
    - Compose email interface with "Schedule Later" functionality.
- **Tracking**: Real-time status of Scheduled and Sent emails.

## 🛠️ Tech Stack
- **Backend**: TypeScript, Express.js, Prisma, PostgreSQL, BullMQ, Redis.
- **Frontend**: React, TypeScript, Tailwind CSS, Axios.
- **Infrastructure**: Docker Compose.

## 📦 Prerequisites
- Node.js (v18+)
- Docker & Docker Compose (Required for Redis & Postgres)
- Google Cloud Credentials (Client ID & Secret)

## 🏃‍♂️ How to Run

### 1. Setup Environment Variables
Create `.env` in `backend/`:
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/reachinbox?schema=public"
PORT=3000
GOOGLE_CLIENT_ID="your_client_id"
GOOGLE_CLIENT_SECRET="your_client_secret"
GOOGLE_REDIRECT_URI="http://localhost:3000/api/auth/google/callback"
JWT_SECRET="supersecret"
REDIS_HOST="localhost"
REDIS_PORT=6379
ETHEREAL_EMAIL="noop"
ETHEREAL_PASS="noop"
```

### 2. Start Infrastructure
Start Redis and PostgreSQL:
```bash
docker-compose up -d
```

### 3. Backend Setup
```bash
cd backend
npm install
npx prisma generate
npx prisma db push
npm run dev
```
Server runs on `http://localhost:3000`.

### 4. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
App runs on `http://localhost:5173`.

## 🏗️ Architecture Overview

1. **Scheduling**: 
    - User submits a request via `/api/schedule`.
    - Server creates a `PENDING` record in Postgres and adds a Delayed Job to BullMQ.
2. **Processing**:
    - BullMQ Worker picks up the job when delay expires.
    - Checks Rate Limits (Redis-backed).
    - Sends email via Nodemailer (Ethereal).
3. **Persistence**:
    - Redis holds the job state (Active, Delayed, Failed).
    - Postgres holds the business data (Content, Logs, User info).
    - If server crashes, Redis holds the queue. On restart, Worker reconnects and resumes processing.

## 🧪 Rate Limiting Strategy
- BullMQ `RateLimiter` is configured in `src/workers/email.worker.ts`.
- Config: `max: 50, duration: 3600000` (50 emails per hour).
- If limit exceeded, jobs are automatically delayed by BullMQ until the next window.

## 📸 Demo Video
(Link to demo video would go here)
