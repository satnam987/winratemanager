import 'dotenv/config';
import { google } from 'googleapis';

async function checkNames() {
    try {
        const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
        const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');
        const sheetId = process.env.GOOGLE_SHEET_ID;

        const auth = new google.auth.GoogleAuth({
            credentials: {
                client_email: clientEmail,
                private_key: privateKey,
            },
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });

        const sheets = google.sheets({ version: 'v4', auth });

        const response = await sheets.spreadsheets.get({
            spreadsheetId: sheetId,
        });

        console.log('Sheet Title:', response.data.properties.title);
        console.log('Tabs found:');
        response.data.sheets.forEach(sheet => {
            console.log(`- "${sheet.properties.title}"`);
        });

    } catch (error) {
        console.error('FAILED:', error.message);
    }
}

checkNames();
