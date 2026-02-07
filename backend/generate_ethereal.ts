
import nodemailer from 'nodemailer';
import fs from 'fs';

async function createAccount() {
    const testAccount = await nodemailer.createTestAccount();
    const creds = {
        user: testAccount.user,
        pass: testAccount.pass
    };
    fs.writeFileSync('ethereal_creds.json', JSON.stringify(creds, null, 2));
    console.log('Credentials saved to ethereal_creds.json');
}

createAccount().catch(console.error);
