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
            privateKey = privateKey.slice(1, -1);
        }
        privateKey = privateKey.replace(/\\n/g, '\n');

        const auth = new google.auth.GoogleAuth({
            credentials: {
                client_email: clientEmail,
                private_key: privateKey,
            },
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });

        const sheets = google.sheets({ version: 'v4', auth });

        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: sheetId,
            range: 'Blad1!A:Z',
        });

        const rows = response.data.values || [];

        const trades = rows.slice(1).map((row, index) => ({
            id: `sheet-${index}`,
            date: row[0] || '',
            type: row[1] || '',
            result: row[2] || '',
            rsi: row[3] || '',
            comment: row[4] || '',
            strategy: row[5] || '',
            tradeType: row[6] || 'Live',
            pair: row[7] || 'S&P500',
            rsiTimeframes: {
                '15min': {
                    context: row[8] || null,
                    direction: row[9] || null,
                    rsi1530: row[10] || ''
                },
                '30min': {
                    context: row[11] || null,
                    direction: row[12] || null,
                    rsi1530: row[13] || ''
                },
                '45min': {
                    context: row[14] || null,
                    direction: row[15] || null,
                    rsi1530: row[16] || ''
                },
                '1h': {
                    context: row[17] || null,
                    direction: row[18] || null,
                    rsi1530: row[19] || ''
                },
                '2h': {
                    context: row[20] || null,
                    direction: row[21] || null,
                    rsi1530: row[22] || ''
                }
            }
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
