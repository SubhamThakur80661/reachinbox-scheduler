
import { PrismaClient } from '@prisma/client';
import axios from 'axios';

const prisma = new PrismaClient();

async function verify() {
    console.log('1. Fetching a user...');
    const user = await prisma.user.findFirst();
    if (!user) {
        console.error('No user found! Cannot test. Please login via the UI first to create a user.');
        return;
    }
    console.log(`   Found user: ${user.email} (${user.id})`);

    console.log('2. Scheduling a test email via API...');
    try {
        const res = await axios.post('http://localhost:3000/api/schedule', {
            recipient: process.env.SMTP_USER || 'test@example.com', // Send to self to test
            subject: 'ReachInbox Real Email Test',
            body: 'If you are reading this, your Gmail SMTP configuration is working perfectly! 🚀',
            scheduledAt: new Date(Date.now() + 10000).toISOString(), // 10s from now
            userId: user.id
        });
        console.log('   API Response:', JSON.stringify(res.data));
        console.log('SUCCESS: Email scheduled. Check your inbox in ~10-20 seconds.');
    } catch (err: any) {
        console.error('FAILED:', err.response?.data || err.message);
    }
}

verify()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
