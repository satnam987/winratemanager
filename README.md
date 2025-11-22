# WinRate Manager

**Last Updated:** 2025-11-22

A trading performance tracker with Google Sheets integration and analytics.ulator.

## Features
- **Dashboard**: View your Win Rate, Total Trades, Wins, and Losses.
- **Trade Log**: Add trades with Date, Type (Buy/Sell), Result (Win/Loss), RSI Context, and Comments.
- **Persistence**: Data is saved in your browser's LocalStorage.
- **Responsive Design**: Works on desktop and mobile.

## Getting Started

### Local Development
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the dev server:
   ```bash
   npm run dev
   ```
3. Open [http://localhost:5173](http://localhost:5173) in your browser.

### Deployment (Vercel)
1. Push this code to a GitHub repository.
2. Go to [Vercel](https://vercel.com) and import the repository.
3. Vercel will automatically detect the Vite settings.
4. Click **Deploy**.

## Tech Stack
- React
- Vite
- Vanilla CSS (Glassmorphism Theme)
- Google Sheets API

## Google Sheets Setup
To enable the spreadsheet backup, ensure the following Environment Variables are set in Vercel:
- `GOOGLE_CLIENT_EMAIL`
- `GOOGLE_PRIVATE_KEY`
- `GOOGLE_SHEET_ID`

