import { Queue } from 'bullmq';
import Redis from 'ioredis';
import dotenv from 'dotenv';
dotenv.config();

// Redis connection details
const redisOptions = {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    maxRetriesPerRequest: null,
};

const connection = new Redis(redisOptions);

export const emailQueue = new Queue('email-queue', { connection });

export const POST_EMAIL_QUEUE_NAME = 'email-queue';
