import 'dotenv/config';
import { google } from 'googleapis';

async function test() {
    try {
        const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
        const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');
        const sheetId = process.env.GOOGLE_SHEET_ID;

        console.log('Testing with:');
        console.log('Email:', clientEmail);
        console.log('Sheet ID:', sheetId);
        console.log('Private Key Length:', privateKey ? privateKey.length : 0);

        if (!clientEmail || !privateKey || !sheetId) {
            throw new Error('Missing credentials in .env file');
        }

        const auth = new google.auth.GoogleAuth({
            credentials: {
                client_email: clientEmail,
                private_key: privateKey,
            },
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });

        const sheets = google.sheets({ version: 'v4', auth });

        await sheets.spreadsheets.values.append({
            spreadsheetId: sheetId,
            range: 'Blad1!A:E',
            valueInputOption: 'USER_ENTERED',
            requestBody: {
                values: [
                    ['TEST_DATE', 'TEST_TYPE', 'TEST_RESULT', 'TEST_RSI', 'Connection Successful!']
                ],
            },
        });

        console.log('SUCCESS! Added a test row to the sheet.');
    } catch (error) {
        console.error('FAILED:', error.message);
        if (error.response && error.response.data && error.response.data.error) {
            console.error('Error Details:', error.response.data.error.message);
        }
    }
}

test();
