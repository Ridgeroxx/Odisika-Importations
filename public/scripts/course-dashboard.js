document.addEventListener("DOMContentLoaded", function () {
    const lessonList = document.getElementById("lessonList");
    const courseVideo = document.getElementById("courseVideo");
    const lectureText = document.getElementById("lectureText");

    // 📜 Lesson data (You can fetch from Firebase instead)
    const lessons = {
        "assets/videos/lesson1.mp4": "Introduction to the course and what you will learn.",
        "videos/lesson2.mp4": "Deep dive into topic 2 with hands-on examples.",
        "videos/lesson3.mp4": "Advanced techniques and strategies."
    };

    // ✅ Switch Video & Update Lecture Notes
    lessonList.addEventListener("click", function (event) {
        if (event.target.tagName === "LI") {
            const videoSrc = event.target.getAttribute("data-video");
            courseVideo.src = videoSrc;
            lectureText.textContent = lessons[videoSrc] || "No lecture notes available.";
            courseVideo.play();
        }
    });
});
