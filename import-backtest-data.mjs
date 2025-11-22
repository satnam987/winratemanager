import { google } from 'googleapis';
import dotenv from 'dotenv';

dotenv.config();

// Historical backtest data from user
const historicalData = [
    { date: '2025-06-02', type: '', result: '', rsi: '', comment: '', strategy: 'Mondje' },
    { date: '2025-06-03', type: 'SELL', result: 'WIN', rsi: 'MONDJE WAS Open naar BUY, RSI OVERBOUGHT', comment: '', strategy: 'Mondje' },
    { date: '2025-06-04', type: 'SELL', result: 'WIN', rsi: 'MONDJE Open naar SELL, RSI OVERBOUGHT', comment: 'NIET GEHOLD TOT 5min wel to gehold 1min en2min', strategy: 'Mondje' },
    { date: '2025-06-05', type: 'SELL', result: 'WIN', rsi: 'MONDJE Open naar SELL, RSI OVERBOUGHT', comment: 'NIET GEHOLD TOT 5min wel to gehold 1min', strategy: 'Mondje' },
    { date: '2025-06-06', type: 'BUY & SELL', result: 'WIN', rsi: 'MONDJE WAS OPEN NAAR BUY, RSI OVERBOUGHT', comment: 'TRADE heel raar was gekke price action', strategy: 'Mondje' },
    { date: '2025-06-07', type: '', result: '', rsi: '', comment: '', strategy: 'Mondje' },
    { date: '2025-06-09', type: 'BUY', result: 'WIN', rsi: 'MONDJE WAS OPEN NAAR BUY, RSI OVERBOUGHT', comment: 'TRADE was buy gegaan', strategy: 'Mondje' },
    { date: '2025-06-10', type: 'SELL', result: 'WIN', rsi: 'MONDJE OPEN NAAR SELL, RSI OVERBOUGHT', comment: 'NIET GEHOLD TOT 5min wel to gehold 1min en2min en 3MIn', strategy: 'Mondje' },
    { date: '2025-06-11', type: 'SELL', result: 'WIN', rsi: 'MONDJE WAS OPEN NAAR BUY, RSI OVERBOUGHT', comment: 'een sell op 17:15 heel holden kon tot5min', strategy: 'Mondje' },
    { date: '2025-06-12', type: 'BUY', result: 'WIN', rsi: 'MONDJE WAS OPEN NAAR BUY, RSI OVERSOLD', comment: 'WE ZIJN BUY GEGAAN ZOALS VERWACHT', strategy: 'Mondje' },
    { date: '2025-06-13', type: 'BUY', result: 'WIN', rsi: 'MONDJE WAS OPEN NAAR BUY, RSI OVERSOLD', comment: 'ZOALS VERWACHT BUY GEGAAN DOOR OVERSOLD plus MONDJE NAAR BUY OPEN', strategy: 'Mondje' },
    { date: '2025-06-14', type: '', result: '', rsi: '', comment: '', strategy: 'Mondje' },
    { date: '2025-06-15', type: '', result: '', rsi: '', comment: '', strategy: 'Mondje' },
    { date: '2025-06-16', type: 'BUY', result: 'WIN', rsi: 'MONDJE WAS OPEN NAAR BUY, RSI OVERBOUGHT', comment: 'PRACHTIGE BUY KON GEHOLD WORDEN Tot 5min', strategy: 'Mondje' },
    { date: '2025-06-17', type: 'SELL', result: 'WIN', rsi: 'MONDJE OPEN NAAR SELL, RSI OVERBOUGHT', comment: 'EERSTE TRADE ZOU op 1min zou loss zijn 2de zou geo dzou maar denk beste is om 2min entry te pakken 1min geefts soms fakouts kon gehold worden tot 3min', strategy: 'Mondje' },
    { date: '2025-06-18', type: 'BUY', result: 'WIN', rsi: 'MONDJE WAS OPEN NAAR BUY, RSI OVERSOLD', comment: 'top trade kon gehold worden tot 5min en 10min rsi', strategy: 'Mondje' },
    { date: '2025-06-19', type: 'SELL', result: 'WIN', rsi: 'MONDJE OPEN NAAR SELL, RSI OVERSOLD', comment: 'kon gehold worden tot 30min rsi', strategy: 'Mondje' },
    { date: '2025-06-20', type: 'SELL', result: 'LOSS', rsi: 'MONDJE WAS OPEN NAAR BUY, RSI OVERSOLD', comment: 'verlies had buy entry maar ging sl raken', strategy: 'Mondje' },
];

async function importHistoricalData() {
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

        // Prepare rows for import (Date, Type, Result, RSI, Comment, Strategy, TradeType)
        const rows = historicalData.map(trade => [
            trade.date,
            trade.type,
            trade.result,
            trade.rsi,
            trade.comment,
            trade.strategy,
            'Backtest'  // All historical data is Backtest
        ]);

        // Append all rows at once
        await sheets.spreadsheets.values.append({
            spreadsheetId: sheetId,
            range: 'Blad1!A:G',
            valueInputOption: 'USER_ENTERED',
            requestBody: {
                values: rows,
            },
        });

        console.log(`✅ Successfully imported ${rows.length} historical trades!`);
        console.log('All trades marked as: Backtest');

    } catch (error) {
        console.error('❌ Error importing data:', error.message);
    }
}

importHistoricalData();
