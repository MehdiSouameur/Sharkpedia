const axios = require("axios")
const sharp = require("sharp");
const routes = require("../config.js");
const { db, storage, admin } = require("../firebaseConfig")

 exports.verifyIdToken = async (req,res) => {
      try {
        const id_token = req.cookies.firebaseIdToken; 

        if (!id_token) {
            return false;
        }

        // Verify the ID token using Firebase Admin SDK
        const decodedToken = await admin.auth().verifyIdToken(id_token);

        // You can now use the decodedToken to access user info
        console.log('Decoded token:', decodedToken);

        return true;

    } catch (error) {
        // If token is invalid or expired
        console.error('Error verifying ID token:', error);
        return false;
    }
};