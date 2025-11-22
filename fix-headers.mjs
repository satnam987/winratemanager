import { google } from 'googleapis';
import dotenv from 'dotenv';

dotenv.config();

async function fixSheetHeaders() {
    try {
        const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
        let privateKey = process.env.GOOGLE_PRIVATE_KEY;
        const sheetId = process.env.GOOGLE_SHEET_ID;

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

        // Update headers to include Trade Type
        await sheets.spreadsheets.values.update({
            spreadsheetId: sheetId,
            range: 'Blad1!A1:G1',
            valueInputOption: 'USER_ENTERED',
            requestBody: {
                values: [['Date', 'Type', 'Result', 'RSI', 'Comment', 'Strategy', 'Trade Type']],
            },
        });

        console.log('✅ Headers updated successfully!');
        console.log('New headers: Date | Type | Result | RSI | Comment | Strategy | Trade Type');

    } catch (error) {
        console.error('❌ Error updating headers:', error.message);
    }
}

fixSheetHeaders();
