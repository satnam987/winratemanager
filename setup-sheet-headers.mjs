import { google } from 'googleapis';
import dotenv from 'dotenv';

dotenv.config();

async function setupHeaders() {
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

        // Define headers
        const headers = [
            'Date',
            'Type',
            'Result',
            'RSI',
            'Comment',
            'Strategy',
            'Trade Type',
            'PAIR',
            '15MIN Context',
            '15MIN Direction',
            '15MIN RSI 15:30',
            '30MIN Context',
            '30MIN Direction',
            '30MIN RSI 15:30',
            '45MIN Context',
            '45MIN Direction',
            '45MIN RSI 15:30',
            '1H Context',
            '1H Direction',
            '1H RSI 15:30',
            '2H Context',
            '2H Direction',
            '2H RSI 15:30'
        ];

        // Update the first row with headers
        await sheets.spreadsheets.values.update({
            spreadsheetId: sheetId,
            range: 'Blad1!A1:W1',
            valueInputOption: 'USER_ENTERED',
            requestBody: {
                values: [headers],
            },
        });

        console.log('✅ Headers succesvol toegevoegd aan de sheet!');
        console.log('Kolommen:', headers.join(', '));

    } catch (error) {
        console.error('❌ Fout bij het toevoegen van headers:', error.message);
    }
}

setupHeaders();
