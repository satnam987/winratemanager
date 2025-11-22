import { google } from 'googleapis';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const { date, type, result, rsi, comment } = req.body;

        // 1. Load credentials from Environment Variables
        const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
        const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'); // Fix newlines
        const sheetId = process.env.GOOGLE_SHEET_ID;

        if (!clientEmail || !privateKey || !sheetId) {
            throw new Error('Missing Google Sheets credentials');
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
            range: 'Sheet1!A:E', // Assumes Sheet1 exists
            valueInputOption: 'USER_ENTERED',
            requestBody: {
                values: [
                    [date, type, result, rsi, comment]
                ],
            },
        });

        return res.status(200).json({ message: 'Success' });

    } catch (error) {
        console.error('Google Sheets Error:', error);
        return res.status(500).json({ message: 'Failed to save to sheet', error: error.message });
    }
}
