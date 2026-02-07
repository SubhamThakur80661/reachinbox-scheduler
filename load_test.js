const axios = require('axios');

const API_URL = 'http://localhost:3000/api/schedule';
const TOTAL_REQUESTS = 50; // Try to hit the rate limit (50/hr)

const runLoadTest = async () => {
    console.log(`🚀 Starting Load Test via ${API_URL}`);
    console.log(`Sending ${TOTAL_REQUESTS} requests...`);

    const promises = [];
    for (let i = 0; i < TOTAL_REQUESTS; i++) {
        promises.push(
            axios.post(API_URL, {
                recipient: `user${i}@example.com`,
                subject: `Load Test Email ${i}`,
                body: ` दिस इस अ टेस्ट ईमेल नंबर ${i}.`,
                scheduledAt: new Date(Date.now() + 1000 * 60).toISOString(), // Schedule 1 min from now
                userId: 'load-test-user'
            }).then(() => process.stdout.write('.'))
                .catch(e => process.stdout.write('x'))
        );
    }

    await Promise.all(promises);
    console.log('\n✅ Load Test Requests Sent!');
    console.log('👉 Check your Backend Terminal/Logs to see BullMQ processing these jobs.');
    console.log('👉 Observe if the Rate Limiter kicks in (workers should process systematically).');
};

runLoadTest();
