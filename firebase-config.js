// 🔥 Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyCk-c9_JPCS6mtAyo1sc3BJccZDj34bYiY",
    authDomain: "odi-imports.firebaseapp.com",
    projectId: "odi-imports",
    storageBucket: "odi-imports.appspot.com",
    messagingSenderId: "1069598625412",
    appId: "1:1069598625412:web:2080e772d6f7dbbf0a3cd1"
};

// ✅ Ensure Firebase SDK is Loaded Before Initializing
if (typeof firebase !== "undefined" && !firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
    console.log("🔥 Firebase Initialized Successfully!");
} else if (typeof firebase === "undefined") {
    console.error("🔥 Firebase SDK not loaded. Check script order in HTML.");
}

// ✅ Initialize Firestore (Ensure Firebase is Loaded First)
let db = null;
if (typeof firebase !== "undefined") {
    db = firebase.firestore();
}

firebase.firestore.setLogLevel("debug");
