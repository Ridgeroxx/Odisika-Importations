document.addEventListener("DOMContentLoaded", function () {
    console.log("✅ Navbar & Profile Loaded!");

    // 🔹 Get Elements
    const authNav = document.getElementById("authNav");
    const profileModal = document.getElementById("profileModal");
    const profileOverlay = document.createElement("div"); // Create an overlay
    profileOverlay.classList.add("modal-overlay");
    document.body.appendChild(profileOverlay);
    const closeProfile = document.getElementById("closeProfile");
    const profileToggle = document.getElementById("authLink"); 
    const userName = document.getElementById("userName");
    const userEmail = document.getElementById("userEmail");
    const userStatus = document.getElementById("userStatus");
    const courseList = document.getElementById("courseList");
    const editProfileBtn = document.getElementById("editProfile");
    const resetPasswordBtn = document.getElementById("resetPassword");
    const logoutBtn = document.getElementById("logout");

    // ✅ Check Firebase
    if (typeof firebase === "undefined") {
        console.error("🔥 Firebase SDK not loaded. Check script order in HTML.");
        return;
    }

    const auth = firebase.auth();
    const db = firebase.firestore();

    // ✅ Toggle Function for Profile Pop-up
    function toggleProfile() {
    if (profileModal.classList.contains("show")) {
        profileModal.classList.remove("show");
        profileOverlay.classList.remove("show");
    } else {
        profileModal.classList.add("show");
        profileOverlay.classList.add("show");
    }
}

    // ✅ Open Pop-up When Clicking "Profile"
    console.log("🔍 Checking authNav:", document.getElementById("authNav"));
    authNav.addEventListener("click", function (event) {
        event.preventDefault();
        if (authNav.classList.contains("logged-in")) {
            toggleProfile();
        } else {
            window.location.href = "login.html"; // Redirect if not logged in
        }
    });

    // ✅ Close Modal When Clicking ❌ Button or Outside
document.getElementById("closeProfile").addEventListener("click", toggleProfile);
profileOverlay.addEventListener("click", toggleProfile);

    // ✅ Check Authentication & Update Navbar
    auth.onAuthStateChanged((user) => {
        if (user) {
            console.log("✅ User Logged In:", user.email);

            // ✅ Update Navbar to Show Profile Instead of Login
            authNav.innerHTML = `
                <a href="#" id="authLink">
                    <i class="fas fa-user-circle"></i> Profile
                </a>
            `;
            authNav.classList.add("logged-in");

            userEmail.textContent = user.email;

            // 🔍 Fetch User Details from Firestore
            db.collection("users").doc(user.uid).get()
                .then(doc => {
                    if (doc.exists) {
                        userName.textContent = doc.data().fullName || "User";
                    }
                });

            // ✅ Load User's Enrolled Courses
            loadUserCourses(user.uid);
        } else {
            console.log("❌ No user logged in.");
            authNav.innerHTML = `
                <a href="login.html" id="authLink">
                    <i class="fas fa-sign-in-alt"></i> Login
                </a>
            `;
            authNav.classList.remove("logged-in");
            profileModal.classList.add("hidden");
        }
    });

    // ✅ Load Enrolled Courses
    function loadUserCourses(userId) {
        courseList.innerHTML = "<li>Loading...</li>";

        db.collection("enrollments").where("userId", "==", userId).get()
            .then(querySnapshot => {
                courseList.innerHTML = "";
                if (querySnapshot.empty) {
                    courseList.innerHTML = "<li>⚠️ No courses enrolled yet.</li>";
                    return;
                }
                querySnapshot.forEach(doc => {
                    const courseData = doc.data();
                    let li = document.createElement("li");
                    li.innerHTML = `<strong>${courseData.course}</strong> 
                        <span class="${courseData.unlocked ? 'unlocked' : 'locked'}">
                            ${courseData.unlocked ? "✅ Unlocked" : "🔒 Locked"}
                        </span>`;
                    courseList.appendChild(li);
                });

                userStatus.innerHTML = "✅ Status: Enrolled";
            })
            .catch(error => console.error("❌ Error loading courses:", error));
    }

    // ✅ Logout Function
    if (logoutBtn) {
        logoutBtn.addEventListener("click", function () {
            auth.signOut().then(() => {
                console.log("✅ Logged Out Successfully!");
                window.location.href = "index.html";
            }).catch(error => {
                console.error("🚨 Logout Error:", error.message);
            });
        });
    }

    // ✅ Reset Password Function
    if (resetPasswordBtn) {
        resetPasswordBtn.addEventListener("click", function () {
            const email = localStorage.getItem("userEmail");
            if (!email) {
                alert("❌ No email found. Please log in.");
                return;
            }

            firebase.auth().sendPasswordResetEmail(email)
                .then(() => alert("✅ Password reset email sent! Check your inbox."))
                .catch(error => alert("❌ Error: " + error.message));
        });
    }

    // ✅ Update Profile Function
    if (editProfileBtn) {
        editProfileBtn.addEventListener("click", function () {
            const fullName = prompt("Enter your full name:");
            if (!fullName) {
                alert("❌ Name cannot be empty.");
                return;
            }

            const user = auth.currentUser;
            user.updateProfile({ displayName: fullName })
                .then(() => {
                    db.collection("users").doc(user.uid).set({ fullName }, { merge: true })
                        .then(() => {
                            alert("✅ Profile Updated Successfully!");
                            userName.textContent = fullName;
                        });
                })
                .catch(error => alert("❌ Error updating profile: " + error.message));
        });
    }
});
