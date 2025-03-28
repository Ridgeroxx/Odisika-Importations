document.addEventListener("DOMContentLoaded", function () {
    console.log("✅ Profile Page Loaded!");

    // ✅ Ensure Firebase is Initialized
    if (typeof firebase === "undefined") {
        console.error("🔥 Firebase SDK not loaded. Check script order in HTML.");
        return;
    }
    if (!firebase.apps.length) {
        console.error("🔥 Firebase Not Initialized! Check firebase-config.js");
        return;
    }

    // ✅ Firebase Services
    const auth = firebase.auth();
    const db = firebase.firestore();

    // 🔹 Sidebar & Navbar Elements
    const profileSidebar = document.getElementById("profileSidebar");
    const profileToggle = document.getElementById("profileToggle");
    const closeSidebarBtn = document.getElementById("closeSidebar");
    const userName = document.getElementById("userName");
    const userEmail = document.getElementById("userEmail");
    const userStatus = document.getElementById("userStatus");
    const courseList = document.getElementById("courseList");

    

    // ✅ Sidebar Toggle Function
    function toggleSidebar() {
        profileSidebar.classList.toggle("active");
    }

    // ✅ Toggle Sidebar
    function toggleSidebar() {
        profileSidebar.classList.toggle("active");
    }

    // ✅ Open Sidebar When Clicking Profile Button
    profileToggle.addEventListener("click", function (event) {
        event.preventDefault();
        toggleSidebar();
    });

     // ✅ Close Sidebar when clicking ❌ Button
     closeSidebarBtn.addEventListener("click", function () {
        toggleSidebar();
    });

    // ✅ Close Sidebar when clicking outside of it
    document.addEventListener("click", function (event) {
        if (
            profileSidebar.classList.contains("active") &&
            !profileSidebar.contains(event.target) &&
            !profileToggle.contains(event.target)
        ) {
            toggleSidebar();
        }
    });

    // ✅ Close Sidebar When Clicking Outside
     document.addEventListener("click", function (event) {
        if (
            profileSidebar.classList.contains("active") &&
            !profileSidebar.contains(event.target) &&
            !profileToggle.contains(event.target)
        ) {
            toggleSidebar();
        }
    });

    // ✅ Check User Authentication & Redirect if Not Logged In
    auth.onAuthStateChanged((user) => {
        console.log("🔥 Auth State Changed:", user);
    
        if (!user || !user.uid) {  // ✅ Prevent calling `user.uid` if `user` is null
            console.log("❌ No user logged in. Redirecting to Home...");
            window.location.href = "index.html";
            return;
        }
    
        console.log("✅ User Logged In:", user.email);
        userEmail.textContent = user.email;
    
        // 🔍 Fetch User Details from Firestore
        db.collection("users").doc(user.uid).get()
            .then(doc => {
                if (doc.exists) {
                    userName.textContent = doc.data().fullName || "User";
                } else {
                    console.warn("⚠️ User document not found in Firestore!");
                }
            })
            .catch(error => console.error("❌ Error fetching user details:", error));
    
        // ✅ Debugging Log Before Calling `loadUserCourses()`
        console.log("📢 Fetching Enrolled Courses for user:", user.uid);
        loadUserCourses(user.uid);
    });
    

    // ✅ Fetch User's Enrolled Courses
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

                userStatus.textContent = "✅ Status: Enrolled";
            })
            .catch(error => console.error("❌ Error loading courses:", error));
    }

    // ✅ Logout Function
    window.logout = function () {
        auth.signOut().then(() => {
            console.log("✅ Logged Out Successfully!");
            window.location.href = "index.html";
        }).catch(error => {
            console.error("🚨 Logout Error:", error.message);
        });
    };
});
