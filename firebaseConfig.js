require('dotenv').config();

// Get the base64-encoded JSON string from env var
const base64ServiceAccount = process.env.FIREBASE_ADMIN_CREDENTIALS_BASE64;

if (!base64ServiceAccount) {
  throw new Error('FIREBASE_ADMIN_CREDENTIALS_BASE64 env var is not set');
}

// Decode from base64 to JSON string, then parse it
const serviceAccount = JSON.parse(Buffer.from(base64ServiceAccount, 'base64').toString('utf8'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://sharkpedia-d4531.firebaseio.com',
  storageBucket: 'sharkpedia-d4531.firebasestorage.app',
});

const storage = admin.storage().bucket();
const db = admin.firestore();

module.exports = { db, storage, admin };
