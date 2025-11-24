import { google } from 'googleapis';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
        let privateKey = process.env.GOOGLE_PRIVATE_KEY;
        const sheetId = process.env.GOOGLE_SHEET_ID;

        if (!clientEmail || !privateKey || !sheetId) {
            throw new Error('Missing Google Sheets credentials');
        }

        if (privateKey.startsWith('"') && privateKey.endsWith('"')) {
            message: 'Failed to load trades from sheet',
                error: error.message
        });
    }
}
