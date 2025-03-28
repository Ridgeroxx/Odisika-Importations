// 🔥 Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyCk-c9_JPCS6mtAyo1sc3BJccZDj34bYiY",
    authDomain: "odi-imports.firebaseapp.com",
    projectId: "odi-imports",
    storageBucket: "odi-imports.appspot.com",
    messagingSenderId: "1069598625412",
    appId: "1:1069598625412:web:2080e772d6f7dbbf0a3cd1"
};

// ✅ Ensure Firebase SDK is loaded before initializing
document.addEventListener("DOMContentLoaded", function () {
    if (typeof firebase !== "undefined") {
        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
            console.log("🔥 Firebase Initialized!");
        }
    } else {
        console.error("❌ Firebase SDK not loaded. Check script order in HTML.");
    }

    // ✅ Initialize Firestore (Only If Firebase is Loaded)
    if (typeof firebase !== "undefined") {
        window.db = firebase.firestore();
    } else {
        console.error("❌ Firestore not initialized. Firebase is missing.");
    }
});
