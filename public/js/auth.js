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

let isSubmitting = false;

document.getElementById("signin-form").addEventListener("submit", async (event) => {
    event.preventDefault();

    if (isSubmitting) return;
    isSubmitting = true;

    const email = document.getElementById("inputEmail").value;
    const password = document.getElementById("inputPassword").value;
    const errorMessage = document.getElementById('error-message');
    const submitButton = document.querySelector("#signin-form button[type='submit']");

    submitButton.disabled = true;
    submitButton.textContent = "Signing in...";

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log("Login successful!");
        console.log("User details:", userCredential.user);

        const idToken = await userCredential.user.getIdToken();

        const expiresIn = new Date(Date.now() + 3600 * 1000).toUTCString();
        document.cookie = `firebaseIdToken=${idToken}; expires=${expiresIn}; path=/; Secure; SameSite=Strict`;

        window.location.href = "/article";
    } catch (error) {
        console.error("Login failed!");
        console.error("Error Code:", error.code);
        console.error("Error Message:", error.message);

        if (error.code === 'auth/too-many-requests') {
            errorMessage.textContent = "Too many attempts. Please try again later.";
        } else {
            errorMessage.textContent = "Login failed. Check your credentials and try again.";
        }

        errorMessage.style.display = 'block';
    } finally {
        isSubmitting = false;
        submitButton.disabled = false;
        submitButton.textContent = "Sign In";
    }
});
