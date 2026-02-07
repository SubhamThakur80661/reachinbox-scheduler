import { Request, Response } from 'express';
import { emailQueue } from '../lib/queue';
import { prisma } from '../lib/prisma';

export const scheduleEmail = async (req: Request, res: Response) => {
    try {
        const { recipient, subject, body, scheduledAt, userId } = req.body;

        if (!recipient || !subject || !body || !scheduledAt || !userId) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const delay = new Date(scheduledAt).getTime() - Date.now();
        if (delay < 0) {
            return res.status(400).json({ error: 'Scheduled time must be in the future' });
        }

        // 1. Create DB Record (PENDING)
        const emailJob = await prisma.emailJob.create({
            data: {
                recipient,
                subject,
                body,
                scheduledAt: new Date(scheduledAt),
                status: 'PENDING',
                userId // In a real app, get this from req.user
            }
        });

        // 2. Add to BullMQ with delay
        await emailQueue.add('send-email', {
            emailJobId: emailJob.id,
            recipient,
            subject,
            body
        }, {
            delay: delay,
            jobId: emailJob.id // Use DB ID as Job ID for idempotency/tracking
        });

        res.json({ message: 'Email scheduled successfully', jobId: emailJob.id });

    } catch (error) {
        console.error('Error scheduling email:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const getScheduledEmails = async (req: Request, res: Response) => {
    try {
        const jobs = await prisma.emailJob.findMany({
            where: { status: 'PENDING' },
            orderBy: { scheduledAt: 'asc' }
        });
        res.json(jobs);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch scheduled emails' });
    }
};

export const getSentEmails = async (req: Request, res: Response) => {
    try {
        const jobs = await prisma.emailJob.findMany({
            where: {
                status: {
                    in: ['SENT', 'FAILED']
                }
            },
            orderBy: { sentAt: 'desc' }
        });
        res.json(jobs);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch sent emails' });
    }
};

export const deleteScheduledEmail = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const job = await prisma.emailJob.findUnique({ where: { id } });

        if (!job) {
            return res.status(404).json({ error: 'Job not found' });
        }

        if (job.status !== 'PENDING') {
            return res.status(400).json({ error: 'Cannot delete a job that is already processed' });
        }

        // Remove from DB
        await prisma.emailJob.delete({ where: { id } });

        // Note: Ideally we should also remove from BullMQ, but for MVP 
        // we will update the Worker to check if DB record exists before sending.

        res.json({ message: 'Scheduled email deleted successfully' });
    } catch (error) {
        console.error('Failed to delete job:', error);
        res.status(500).json({ error: 'Failed to delete scheduled email' });
    }
};
