import { google } from 'googleapis';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const { date, type, result, rsi, comment } = req.body;

        // 1. Load credentials from Environment Variables
        const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
        let privateKey = process.env.GOOGLE_PRIVATE_KEY;
        const sheetId = process.env.GOOGLE_SHEET_ID;

        if (!clientEmail || !privateKey || !sheetId) {
            throw new Error('Missing Google Sheets credentials');
        }

        // CLEANUP: Fix common copy-paste errors with the key
        // Remove surrounding quotes if present
        if (privateKey.startsWith('"') && privateKey.endsWith('"')) {
            privateKey = privateKey.slice(1, -1);
        }
        // Handle literal "\n" characters AND actual newlines
        privateKey = privateKey.replace(/\\n/g, '\n');

        // Ensure it looks like a key
        if (!privateKey.includes('-----BEGIN PRIVATE KEY-----')) {
            throw new Error('Invalid Private Key format');
        }

        // 2. Authenticate
        const auth = new google.auth.GoogleAuth({
            credentials: {
                client_email: clientEmail,
                private_key: privateKey,
            },
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });

        const sheets = google.sheets({ version: 'v4', auth });

        // 3. Append Row
        await sheets.spreadsheets.values.append({
            spreadsheetId: sheetId,
            range: 'Blad1!A:E',
            valueInputOption: 'USER_ENTERED',
            requestBody: {
                values: [[date, type, result, rsi, comment]],
            },
        });

        return res.status(200).json({ message: 'Success' });

    } catch (error) {
        console.error('Google Sheets Error:', error);

        // DEBUG: Help diagnose key issues
        const keyDebug = process.env.GOOGLE_PRIVATE_KEY
            ? `Key Length: ${process.env.GOOGLE_PRIVATE_KEY.length}, Starts: ${process.env.GOOGLE_PRIVATE_KEY.substring(0, 30)}...`
            : 'Key is undefined';

        return res.status(500).json({
            message: 'Failed to save to sheet',
            error: error.message,
            debug: keyDebug
        });
    }
}
