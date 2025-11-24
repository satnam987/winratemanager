import { google } from 'googleapis';

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
