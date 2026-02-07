import { Router } from 'express';
import { googleCallback, login, mockLogin } from './controllers/auth.controller';

const router = Router();

router.get('/auth/login', login);
router.get('/auth/google/callback', googleCallback);
router.get('/auth/mock-login', mockLogin);

// Schedule Controller Imports
import { scheduleEmail, getScheduledEmails, getSentEmails, deleteScheduledEmail } from './controllers/schedule.controller';

router.post('/schedule', scheduleEmail);
router.get('/scheduled-emails', getScheduledEmails);
router.get('/sent-emails', getSentEmails);
router.delete('/schedule/:id', deleteScheduledEmail);

export default router;
