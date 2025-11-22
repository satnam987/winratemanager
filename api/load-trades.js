import { google } from 'googleapis';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        // 1. Load credentials
        const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
        let privateKey = process.env.GOOGLE_PRIVATE_KEY;
        const sheetId = process.env.GOOGLE_SHEET_ID;

        if (!clientEmail || !privateKey || !sheetId) {
            throw new Error('Missing Google Sheets credentials');
        }

        // CLEANUP
        if (privateKey.startsWith('"') && privateKey.endsWith('"')) {
            privateKey = privateKey.slice(1, -1);
        }
        privateKey = privateKey.replace(/\\n/g, '\n');

        // 2. Authenticate
        const auth = new google.auth.GoogleAuth({
            credentials: {
                client_email: clientEmail,
                private_key: privateKey,
            },
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });

        const sheets = google.sheets({ version: 'v4', auth });

        // 3. Read all data from Sheet
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: sheetId,
            range: 'Blad1!A:F',
        });

        const rows = response.data.values || [];

        // Convert rows to trade objects (skip header if present)
        const trades = rows.slice(1).map((row, index) => ({
            id: `sheet-${index}`,
            date: row[0] || '',
            type: row[1] || '',
            result: row[2] || '',
            rsi: row[3] || '',
            comment: row[4] || '',
            strategy: row[5] || ''
        }));

        return res.status(200).json({ trades });

    } catch (error) {
        console.error('Google Sheets Read Error:', error);
        return res.status(500).json({
            message: 'Failed to load trades from sheet',
            error: error.message
        });
    }
}
