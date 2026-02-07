import { Worker, Job } from 'bullmq';
import Redis from 'ioredis';
import nodemailer from 'nodemailer';
import { prisma } from '../lib/prisma';
import dotenv from 'dotenv';
dotenv.config();

const connection = new Redis({
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    maxRetriesPerRequest: null,
});

// Configure Nodemailer (Ethereal)
const transporter = nodemailer.createTransport({
    // Check for Real SMTP (Gmail, etc.)
    ...(process.env.SMTP_USER && process.env.SMTP_PASS ? {
        service: process.env.SMTP_SERVICE || 'gmail', // Default to Gmail if not specified
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    } : {
        // Fallback to Ethereal
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: process.env.ETHEREAL_EMAIL || 'test',
            pass: process.env.ETHEREAL_PASS || 'test'
        }
    })
});

export const emailWorker = new Worker('email-queue', async (job: Job) => {
    const { emailJobId, recipient, subject, body } = job.data;
    console.log(`Processing job ${job.id}: Sending email to ${recipient}`);

    try {
        // Mock sending delay to test concurrency
        // await new Promise(resolve => setTimeout(resolve, 1000));

        // CHECK: Ensure job still exists in DB (wasn't deleted by user)
        const jobRecord = await prisma.emailJob.findUnique({ where: { id: emailJobId } });
        if (!jobRecord) {
            console.log(`Job ${emailJobId} was deleted. Skipping.`);
            return;
        }

        const info = await transporter.sendMail({
            from: '"ReachInbox Scheduler" <scheduler@reachinbox.com>',
            to: recipient,
            subject: subject,
            text: body,
            html: `<p>${body}</p>`,
        });

        console.log(`Message sent: ${info.messageId}`);
        console.log(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);

        // Update DB status to SENT
        await prisma.emailJob.update({
            where: { id: emailJobId },
            data: {
                status: 'SENT',
                sentAt: new Date()
            }
        });

    } catch (error) {
        console.error(`Failed to send email to ${recipient}:`, error);

        // Update DB status to FAILED
        await prisma.emailJob.update({
            where: { id: emailJobId },
            data: {
                status: 'FAILED',
                failedAt: new Date()
            }
        });

        throw error; // Let BullMQ handle retries if configured
    }

}, {
    connection,
    concurrency: 5, // Requirement: Worker Concurrency
    limiter: {
        max: 50, // Requirement: Rate limiting (e.g., 50 per hour)
        duration: 3600000 // 1 hour in ms
    }
});

console.log('Email Worker started...');
