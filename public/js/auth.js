import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js';
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyAVCCS1NuG2JJ4Q9ZvOC-Son0YljOcOaeE",
    authDomain: "sharkpedia-d4531.firebaseapp.com",
    projectId: "sharkpedia-d4531",
    storageBucket: "sharkpedia-d4531.firebasestorage.app",
    messagingSenderId: "194539597099",
    appId: "1:194539597099:web:f089a5bcb90869e892a96e",
    measurementId: "G-WSBV8FTNR2"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

document.getElementById("signin-form").addEventListener("submit", async (event) => {
                        
    event.preventDefault();  // Prevent the default form submission behavior

    const email = document.getElementById("inputEmail").value;
    const password = document.getElementById("inputPassword").value;

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Successfully signed in
            console.log("Login successful!");
            console.log("User details:", userCredential.user);

            // Get the ID token (similar to session ID)
            userCredential.user.getIdToken()
                .then((idToken) => {
                    // Now you have the Firebase ID token
                    console.log("ID Token (Session ID):", idToken);

                    const expiresIn = new Date(Date.now() + 3600 * 1000).toUTCString(); // 1 hour expiration
                    document.cookie = `firebaseIdToken=${idToken}; expires=${expiresIn}; path=/; Secure; SameSite=Strict`;
                    window.location.href = "/article"

                })
                .catch((error) => {
                    console.error("Error getting ID token:", error);
                    const errorMessage = document.getElementById('error-message');
                    errorMessage.style.display = 'none';  // Hide the error message
                });
        })
        .catch((error) => {
            // Failed to sign in
            console.error("Login failed!");
            console.error("Error Code:", error.code);
            console.error("Error Message:", error.message);
            console.error("Setting error");
            const errorMessage = document.getElementById('error-message');
            errorMessage.style.display = 'block';  // Hide the error message
        });

    });