const verifyBtn = document.getElementById("verifyAccessBtn");
const accessCodeInput = document.getElementById("accessCodeInput");
const accessMessage = document.getElementById("accessMessage");
const loadingSpinner = document.getElementById("loadingSpinner");

// ✅ Ensure Firebase is Loaded
if (typeof firebase === "undefined") {
    console.error("🔥 Firebase SDK not loaded!");
}

// ✅ Firebase Setup (Ensure Firebase is initialized)
const firebaseConfig = {
    apiKey: "AIzaSyCk-c9_JPCS6mtAyo1sc3BJccZDj34bYiY",
    authDomain: "odi-imports.firebaseapp.com",
    projectId: "odi-imports",
};

// 🔹 Initialize Firebase if not already initialized
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

// 🔹 Get Firestore instance
const db = firebase.firestore();
const auth = firebase.auth();

// ✅ Verify Access Code
verifyBtn.addEventListener("click", async function () {
    const user = firebase.auth().currentUser;
    if (!user) {
        accessMessage.textContent = "❌ You must be logged in!";
        return;
    }

    const accessCode = accessCodeInput.value.trim();
    if (!accessCode) {
        accessMessage.textContent = "❌ Please enter a valid access code!";
        return;
    }

    // 🔥 Show Loading Spinner
    loadingSpinner.style.display = "block";
    accessMessage.textContent = "";

    try {
        console.log("🔍 Checking Firestore for:", user.uid, accessCode);

        const enrollmentRef = await db.collection("enrollments")
            .where("userId", "==", user.uid)
            .where("accessCode", "==", accessCode)
            .get();

        console.log("📜 Query Result:", enrollmentRef.docs.map(doc => doc.data()));

        if (enrollmentRef.empty) {
            accessMessage.textContent = "❌ Invalid access code!";
            loadingSpinner.style.display = "none";
            return;
        }

        // ✅ Unlock the Course
        enrollmentRef.forEach(doc => {
            doc.ref.update({ unlocked: true });
        });

        accessMessage.textContent = "✅ Access Granted! Redirecting...";
        
        setTimeout(() => {
            window.location.href = "course-dashboard.html"; // ✅ Redirect
        }, 5000);

    } catch (error) {
        console.error("❌ Error verifying access:", error);
        accessMessage.textContent = "❌ Error verifying access!";
    } finally {
        // 🔥 Hide Spinner After Verification
        setTimeout(() => {
            loadingSpinner.style.display = "none";
        }, 3000);
    }
});

