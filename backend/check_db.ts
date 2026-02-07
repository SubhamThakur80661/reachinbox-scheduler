
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function checkJobs() {
    const jobs = await prisma.emailJob.findMany();
    console.log('--- All Email Jobs ---');
    console.log(JSON.stringify(jobs, null, 2));
}

checkJobs()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
