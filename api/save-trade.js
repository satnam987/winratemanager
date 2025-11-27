import { google } from 'googleapis';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const { date, type, result, rsi, comment, strategy, tradeType, pair, rsiTimeframes } = req.body;

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

        if (!privateKey.includes('-----BEGIN PRIVATE KEY-----')) {
            throw new Error('Invalid Private Key format');
        }

        const auth = new google.auth.GoogleAuth({
            credentials: {
                client_email: clientEmail,
                private_key: privateKey,
            },
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });

        const sheets = google.sheets({ version: 'v4', auth });

        // Extract RSI timeframe data
        const rsiData = rsiTimeframes || {};
        const timeframes = ['15min', '30min', '45min', '1h', '2h'];

        // Build array with all RSI data: context, direction, rsi1530 for each timeframe
        const rsiColumns = [];
        timeframes.forEach(tf => {
            const tfData = rsiData[tf] || { context: '', direction: '', rsi1530: '' };
            rsiColumns.push(tfData.context || '');
            rsiColumns.push(tfData.direction || '');
            rsiColumns.push(tfData.rsi1530 || '');
        });

        await sheets.spreadsheets.values.append({
            spreadsheetId: sheetId,
            range: 'Blad1!A:Z',
            valueInputOption: 'USER_ENTERED',
            requestBody: {
                values: [[
                    date,
                    type,
                    result,
                    rsi,
                    comment,
                    strategy || '',
                    tradeType || 'Live',
                    pair || 'S&P500',
                    ...rsiColumns
                ]],
            },
        });

        return res.status(200).json({ message: 'Success' });

    } catch (error) {
        console.error('Google Sheets Error:', error);

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
