document.addEventListener("DOMContentLoaded", function () {
    const auth = firebase.auth();
    const db = firebase.firestore();

    window.unlockCourse = function () {
        const accessCode = document.getElementById("accessCodeInput").value.trim();
        const statusMessage = document.getElementById("statusMessage");
        const loadingScreen = document.getElementById("loadingScreen");

        if (!accessCode) {
            statusMessage.textContent = "❌ Please enter an access code!";
            return;
        }

        auth.onAuthStateChanged((user) => {
            if (!user) {
                statusMessage.textContent = "❌ You must be logged in!";
                return;
            }

            // 🔹 Show Loading Screen
            loadingScreen.style.display = "flex";

            db.collection("enrollments")
                .where("userId", "==", user.uid)
                .where("accessCode", "==", accessCode)
                .get()
                .then(querySnapshot => {
                    if (querySnapshot.empty) {
                        loadingScreen.style.display = "none"; // Hide loading if failed
                        statusMessage.textContent = "❌ Invalid access code!";
                        return;
                    }

                    querySnapshot.forEach(doc => {
                        db.collection("enrollments").doc(doc.id).update({ unlocked: true })
                            .then(() => {
                                statusMessage.textContent = "✅ Course Unlocked! Redirecting...";

                                // 🔄 **Keep Loading for a Few Seconds Before Redirecting**
                                setTimeout(() => {
                                    window.location.href = "dashboard.html"; // Redirect to Course Dashboard
                                }, 3000);
                            })
                            .catch(error => {
                                loadingScreen.style.display = "none";
                                console.error("❌ Error unlocking course:", error);
                            });
                    });
                })
                .catch(error => {
                    loadingScreen.style.display = "none";
                    console.error("❌ Error verifying access code:", error);
                });
        });
    };
});
