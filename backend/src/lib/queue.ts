import { Queue } from 'bullmq';
import Redis from 'ioredis';
import dotenv from 'dotenv';
dotenv.config();

// Redis connection details.
// Local dev: plain localhost, no password, no TLS (defaults).
// Hosted Redis (e.g. Upstash): set REDIS_HOST + REDIS_PORT + REDIS_PASSWORD
// and REDIS_TLS=true — or set REDIS_URL (rediss://...) instead of host/port.
export function createRedisConnection(): Redis {
    if (process.env.REDIS_URL) {
        // rediss:// URLs imply TLS automatically.
        return new Redis(process.env.REDIS_URL, { maxRetriesPerRequest: null });
    }
    return new Redis({
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
        ...(process.env.REDIS_PASSWORD ? { password: process.env.REDIS_PASSWORD } : {}),
        ...(process.env.REDIS_TLS === 'true' ? { tls: {} } : {}),
        maxRetriesPerRequest: null,
    });
}

const connection = createRedisConnection();

export const emailQueue = new Queue('email-queue', { connection });

export const POST_EMAIL_QUEUE_NAME = 'email-queue';
