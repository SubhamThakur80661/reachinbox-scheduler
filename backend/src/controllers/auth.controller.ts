import { Request, Response } from 'express';
import { getGoogleAuthURL, oauth2Client } from '../lib/google';
import { prisma } from '../lib/prisma';
import { google } from 'googleapis';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

export const login = (req: Request, res: Response) => {
    const url = getGoogleAuthURL();
    res.json({ url });
};

export const googleCallback = async (req: Request, res: Response) => {
    const { code } = req.query;

    if (!code || typeof code !== 'string') {
        return res.status(400).json({ error: 'Invalid code' });
    }

    try {
        const { tokens } = await oauth2Client.getToken(code);
        oauth2Client.setCredentials(tokens);

        const oauth2 = google.oauth2({
            auth: oauth2Client,
            version: 'v2',
        });

        const { data } = await oauth2.userinfo.get();

        if (!data.email || !data.id) {
            return res.status(400).json({ error: 'Google profile missing email or id' });
        }

        // Upsert user
        const user = await prisma.user.upsert({
            where: { email: data.email },
            update: {
                googleId: data.id,
                name: data.name,
                accessToken: tokens.access_token,
                refreshToken: tokens.refresh_token,
            },
            create: {
                email: data.email,
                googleId: data.id,
                name: data.name,
                accessToken: tokens.access_token,
                refreshToken: tokens.refresh_token,
            },
        });

        // Generate JWT
        const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
            expiresIn: '7d',
        });

        // Redirect to frontend with token
        res.redirect(`http://localhost:5173/auth/success?token=${token}&user=${encodeURIComponent(JSON.stringify({ id: user.id, name: user.name, email: user.email }))}`);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Authentication failed' });
    }
};

export const mockLogin = async (req: Request, res: Response) => {
    try {
        // Create Mock User
        const user = await prisma.user.upsert({
            where: { email: 'demo@reachinbox.com' },
            update: {
                name: 'Demo User',
            },
            create: {
                email: 'demo@reachinbox.com',
                googleId: 'mock-google-id',
                name: 'Demo User',
                accessToken: 'mock-access-token',
                refreshToken: 'mock-refresh-token',
            },
        });

        const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
            expiresIn: '7d',
        });

        res.redirect(`http://localhost:5173/auth/success?token=${token}&user=${encodeURIComponent(JSON.stringify({ id: user.id, name: user.name, email: user.email }))}`);
    } catch (error) {
        console.error('Mock login failed', error);
        res.status(500).json({ error: 'Mock login failed' });
    }
};
