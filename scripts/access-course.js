document.addEventListener("DOMContentLoaded", function () {
    const verifyBtn = document.getElementById("verifyAccessBtn");
    const accessCodeInput = document.getElementById("accessCodeInput");
    const accessMessage = document.getElementById("accessMessage");
    const loadingSpinner = document.getElementById("loadingSpinner");

    // ✅ Ensure Firebase is Initialized
    if (!firebase.apps.length) {
        console.error("🔥 Firebase SDK not loaded!");
    }

    const auth = firebase.auth();
    const db = firebase.firestore();

    // ✅ Check User Authentication
    auth.onAuthStateChanged((user) => {
        if (!user) {
            alert("❌ Please log in first!");
            window.location.href = "login.html";
        }
    });

    // ✅ Verify Access Code
    verifyBtn.addEventListener("click", async function () {
        const user = auth.currentUser;
        if (!user) {
            accessMessage.textContent = "❌ You must be logged in!";
            accessMessage.style.color = "red";
            return;
        }

        const accessCode = accessCodeInput.value.trim();
        if (!accessCode) {
            accessMessage.textContent = "❌ Please enter a valid access code!";
            accessMessage.style.color = "red";
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
                accessMessage.style.color = "red";
                loadingSpinner.style.display = "none";
                return;
            }

            // ✅ Unlock the Course
            enrollmentRef.forEach(doc => {
                doc.ref.update({ unlocked: true });
            });

            accessMessage.textContent = "✅ Access Granted! Redirecting...";
            accessMessage.style.color = "green";
            
            setTimeout(() => {
                window.location.href = "course-dashboard.html"; // ✅ Redirect
            }, 5000);

        } catch (error) {
            console.error("❌ Error verifying access:", error);
            accessMessage.textContent = "❌ Error verifying access!";
            accessMessage.style.color = "red";
        } finally {
            // 🔥 Hide Spinner After Verification
            setTimeout(() => {
                loadingSpinner.style.display = "none";
            }, 3000);
        }
    });

    // ✅ Logout Function
    window.logout = function () {
        auth.signOut()
            .then(() => {
                window.location.href = "login.html";
            })
            .catch((error) => {
                console.error("❌ Error logging out:", error);
            });
    };
});
