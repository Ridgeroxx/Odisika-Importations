document.addEventListener("DOMContentLoaded", function () {
    const auth = firebase.auth();
    const db = firebase.firestore();

    // ✅ Prevent automatic redirection in login.html
    if (window.location.pathname.includes("login.html")) {
        auth.signOut(); // 🔥 Forces user to manually log in
    }

    // ✅ SIGNUP FUNCTION (Save User Data in Firestore)
    if (document.getElementById("signupForm")) {
        document.getElementById("signupForm").addEventListener("submit", function (e) {
            e.preventDefault();

            const fullName = document.getElementById("signupFullName").value.trim();
            const email = document.getElementById("signupEmail").value.trim();
            const password = document.getElementById("signupPassword").value.trim();

            if (!fullName || !email || !password) {
                alert("❌ Please fill in all fields.");
                return;
            }

            auth.createUserWithEmailAndPassword(email, password)
                .then((userCredential) => {
                    const user = userCredential.user;
                    return db.collection("users").doc(user.uid).set({
                        fullName: fullName,
                        email: email,
                        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                    });
                })
                .then(() => {
                    localStorage.setItem("userEmail", email);
                    alert("✅ Account Created Successfully!");
                    window.location.href = "login.html";
                })
                .catch(error => {
                    console.error("🚨 Signup Error:", error.message);
                    alert("❌ Signup Error: " + error.message);
                });
        });
    }

    // ✅ LOGIN FUNCTION (User Must Manually Login)
    if (document.getElementById("loginForm")) {
        document.getElementById("loginForm").addEventListener("submit", function (e) {
            e.preventDefault();
            
            const email = document.getElementById("loginEmail").value.trim();
            const password = document.getElementById("loginPassword").value.trim();

            if (!email || !password) {
                alert("❌ Please fill in both email and password.");
                return;
            }

            auth.signInWithEmailAndPassword(email, password)
                .then((userCredential) => {
                    const user = userCredential.user;

                    return db.collection("users").doc(user.uid).get();
                })
                .then((doc) => {
                    if (doc.exists) {
                        const userData = doc.data();
                        localStorage.setItem("userEmail", userData.email);
                        localStorage.setItem("userFullName", userData.fullName);
                        alert(`✅ Welcome back, ${userData.fullName}!`);
                        
                        // ✅ Redirect User Based on Previous Page
                        const redirectPage = localStorage.getItem("redirectAfterLogin") || "index.html";
                        localStorage.removeItem("redirectAfterLogin"); // Clear redirect cache
                        window.location.href = redirectPage;
                    } else {
                        alert("⚠️ User data not found. Please contact support.");
                    }
                })
                .catch(error => {
                    console.error("🚨 Login Error:", error.message);
                    alert("❌ Login Error: " + error.message);
                });                
        });
    }

    // ✅ LOGOUT FUNCTION
    window.logout = function () {
        auth.signOut().then(() => {
            localStorage.removeItem("userEmail");
            alert("✅ Logged Out Successfully!");
            window.location.href = "index.html";
        }).catch(error => {
            console.error("🚨 Logout Error:", error.message);
        });
    };

    // ✅ Ensure User Manually Logs In
    auth.onAuthStateChanged((user) => {
        if (user && window.location.pathname.includes("login.html")) {
            console.log("✅ User is already logged in. Waiting for manual action...");
        } else if (!user) {
            console.log("❌ No user logged in. Manual login required.");
        }
    });
});
