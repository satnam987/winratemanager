import { google } from 'googleapis';
import dotenv from 'dotenv';

dotenv.config();

async function cleanupSheet() {
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

        console.log('📋 Bezig met opschonen van de sheet...');

        // Stap 1: Lees alle bestaande data
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: sheetId,
            range: 'Blad1!A:Z',
        });

        const rows = response.data.values || [];
        console.log(`📊 Gevonden: ${rows.length} rijen`);

        // Stap 2: Wis alles behalve de header
        await sheets.spreadsheets.values.clear({
            spreadsheetId: sheetId,
            range: 'Blad1!A2:Z',
        });

        console.log('🧹 Oude data gewist');

        // Stap 3: Zet headers opnieuw
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

        await sheets.spreadsheets.values.update({
            spreadsheetId: sheetId,
            range: 'Blad1!A1:W1',
            valueInputOption: 'USER_ENTERED',
            requestBody: {
                values: [headers],
            },
        });

        console.log('✅ Headers geplaatst');

        // Stap 4: Herformatteer oude data (skip header row)
        if (rows.length > 1) {
            const cleanedData = [];

            for (let i = 1; i < rows.length; i++) {
                const row = rows[i];

                // Skip lege rijen
                if (!row || row.length === 0 || !row[0]) continue;

                // Basisdata (A-H)
                const cleanRow = [
                    row[0] || '',  // Date
                    row[1] || '',  // Type
                    row[2] || '',  // Result
                    row[3] || '',  // RSI
                    row[4] || '',  // Comment
                    row[5] || '',  // Strategy
                    row[6] || 'Live',  // Trade Type
                    row[7] || 'S&P500',  // PAIR
                ];

                // RSI Timeframe data (I-W) - als deze er zijn
                for (let j = 8; j <= 22; j++) {
                    cleanRow.push(row[j] || '');
                }

                cleanedData.push(cleanRow);
            }

            if (cleanedData.length > 0) {
                await sheets.spreadsheets.values.append({
                    spreadsheetId: sheetId,
                    range: 'Blad1!A2:W',
                    valueInputOption: 'USER_ENTERED',
                    requestBody: {
                        values: cleanedData,
                    },
                });

                console.log(`✅ ${cleanedData.length} trades herformatted en opgeslagen`);
            }
        }

        console.log('🎉 Sheet succesvol opgeschoond!');

    } catch (error) {
        console.error('❌ Fout bij opschonen:', error.message);
    }
}

cleanupSheet();
