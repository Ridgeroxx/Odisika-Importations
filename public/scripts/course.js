document.addEventListener("DOMContentLoaded", function () {
    const auth = firebase.auth();
    const db = firebase.firestore();
    
    const courseTitle = document.getElementById("courseTitle");
    const courseDescription = document.getElementById("courseDescription");
    const lessonList = document.getElementById("lessonList");
    const resourceList = document.getElementById("resourceList");

    // ✅ Get Course from Local Storage (From Access Code Entry)
    const courseId = localStorage.getItem("accessCourseId");
    const accessCode = localStorage.getItem("userAccessCode");

    if (!courseId || !accessCode) {
        alert("❌ Unauthorized access. Please enter your access code.");
        window.location.href = "access.html"; // Redirect if access is invalid
    }

    // ✅ Fetch Course Data from Firestore
    db.collection("courses").doc(courseId).get()
        .then((doc) => {
            if (doc.exists) {
                const courseData = doc.data();
                courseTitle.textContent = courseData.title;
                courseDescription.textContent = courseData.description;

                // 📝 Load Lessons
                courseData.lessons.forEach(lesson => {
                    let li = document.createElement("li");
                    li.textContent = lesson;
                    lessonList.appendChild(li);
                });

                // 📂 Load Resources
                courseData.resources.forEach(resource => {
                    let li = document.createElement("li");
                    li.innerHTML = `<a href="assets/${resource}" target="_blank">${resource}</a>`;
                    resourceList.appendChild(li);
                });

                console.log("✅ Course Loaded Successfully:", courseData);
            } else {
                alert("❌ Course not found.");
                window.location.href = "dashboard.html";
            }
        })
        .catch((error) => {
            console.error("❌ Error loading course:", error);
            alert("❌ Error loading course. Try again.");
        });
});
