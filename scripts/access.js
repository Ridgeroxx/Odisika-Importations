document.addEventListener("DOMContentLoaded", function () {
    const auth = firebase.auth();
    const db = firebase.firestore();
    const accessMessage = document.getElementById("accessMessage");

    // ✅ Ensure User is Logged In
    auth.onAuthStateChanged((user) => {
        if (!user) {
            alert("❌ Please log in first!");
            window.location.href = "login.html";
        }
    });
});

// ✅ Verify Access Code & Unlock Course
function verifyAccessCode() {
    const accessCode = document.getElementById("accessCode").value.trim();
    const accessMessage = document.getElementById("accessMessage");

    if (!accessCode) {
        alert("❌ Please enter an access code.");
        return;
    }

    firebase.auth().onAuthStateChanged((user) => {
        if (!user) {
            alert("❌ You must be logged in to unlock a course.");
            return;
        }

        db.collection("enrollments")
            .where("email", "==", user.email) // ✅ Using email instead of userId
            .where("accessCode", "==", accessCode)
            .get()
            .then(querySnapshot => {
                if (querySnapshot.empty) {
                    accessMessage.innerHTML = "❌ Invalid access code!";
                    accessMessage.style.color = "red";
                    return;
                }

                querySnapshot.forEach(doc => {
                    // ✅ Mark the course as unlocked
                    db.collection("enrollments").doc(doc.id).update({
                        unlocked: true
                    })
                    .then(() => {
                        accessMessage.innerHTML = "✅ Course unlocked successfully!";
                        accessMessage.style.color = "green";

                        // ✅ Redirect to dashboard after 2 seconds
                        setTimeout(() => {
                            window.location.href = "dashboard.html";
                        }, 2000);
                    })
                    .catch(error => {
                        console.error("❌ Error unlocking course:", error);
                        accessMessage.innerHTML = "❌ Error unlocking course.";
                        accessMessage.style.color = "red";
                    });
                });
            })
            .catch(error => {
                console.error("❌ Error verifying access code:", error);
            });
    });
}
