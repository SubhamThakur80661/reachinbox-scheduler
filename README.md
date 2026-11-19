# ReachInbox Scheduler

Schedule email campaigns for later — upload a CSV of recipients or compose one-off emails, set a time, and track what's scheduled and what's sent.

Live demo: https://reachinbox-scheduler-hydra-hamerins-projects.vercel.app

## What it does

- Upload a CSV (or paste addresses) and schedule a campaign
- Compose emails with a schedule-later option
- Real-time tracking of scheduled vs sent emails
- Google sign-in, plus a guest login to try it out

## How it works

Campaigns go into Postgres, and a delayed job goes onto a BullMQ queue (Redis). When the time comes, a worker picks the job up and sends the email. Jobs survive restarts because the queue lives in Redis.

## Stack

- Backend: TypeScript, Express, Prisma, PostgreSQL, BullMQ, Redis
- Frontend: React, TypeScript, Vite, Tailwind CSS

## Run it locally

You need Postgres and Redis running — Docker Compose handles both:

```bash
docker-compose up -d
```

Backend:

```bash
cd backend
npm install
npx prisma generate
npx prisma db push
npm run dev
```

Frontend:

```bash
cd frontend
npm install
npm run dev
```

Backend env (`backend/.env`): `DATABASE_URL`, `REDIS_URL` (or `REDIS_HOST` / `REDIS_PORT` for a local Redis), `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `JWT_SECRET`. Email delivery uses Ethereal (fake SMTP) unless you plug in a real provider.

## Deployment

The live demo runs on Vercel (frontend) and Render (backend), with Postgres on Neon and Redis on Upstash.
