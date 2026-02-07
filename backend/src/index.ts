import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

import router from './routes';

app.use(cors());
app.use(express.json());

app.use('/api', router);

app.get('/', (req, res) => {
    res.send('ReachInbox Scheduler API is running');
});

import './workers/email.worker'; // Start worker

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
