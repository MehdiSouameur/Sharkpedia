// Admin firebase connection
const admin = require('firebase-admin');
const serviceAccount = require('./firebase_admin.json');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://sharkpedia-d4531.firebaseio.com',
    storageBucket: 'sharkpedia-d4531.firebasestorage.app' 

});

const storage = admin.storage().bucket();
const db = admin.firestore();

module.exports = { db, storage };