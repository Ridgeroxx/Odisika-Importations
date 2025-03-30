document.addEventListener("DOMContentLoaded", function () {
    const auth = firebase.auth();
    const db = firebase.firestore();
    
    const courseSelect = document.getElementById("course");
    const priceDisplay = document.getElementById("priceDisplay");
    const payBtn = document.getElementById("payBtn");

    // ✅ Redirect to Enroll Page After Login
    const urlParams = new URLSearchParams(window.location.search);
    const redirectAfterLogin = urlParams.get("redirect");

    auth.onAuthStateChanged((user) => {
        if (!user && redirectAfterLogin) {
            window.location.href = "login.html?redirect=enroll.html";
        }
    });

    // 📝 Update price based on selected course
    courseSelect.addEventListener("change", function () {
        const selectedOption = courseSelect.options[courseSelect.selectedIndex];
        const price = selectedOption.getAttribute("data-price");
        priceDisplay.textContent = `${price} Cedis`;
    });

    // 💳 **Process Payment Only If Logged In**
    payBtn.addEventListener("click", function () {
        const user = auth.currentUser;

        // ✅ **If user is NOT logged in, redirect to login page**
        if (!user) {
            alert("❌ You must be logged in to enroll in a course!");
            window.location.href = "login.html?redirect=enroll.html"; // Redirect to login & return here
            return;
        }

        const fullName = document.getElementById("fullName").value.trim();
        const email = user.email; // ✅ **Use logged-in user email**
        const phone = document.getElementById("phone").value.trim();
        const course = courseSelect.value;
        const mode = document.getElementById("mode").value;
        const selectedOption = courseSelect.options[courseSelect.selectedIndex];
        const amount = selectedOption.getAttribute("data-price") * 100;

        if (!fullName || !phone) {
            alert("❌ Please fill in all fields.");
            return;
        }

        // ✅ **Confirm Enrollment Before Payment**
        if (!confirm(`Are you sure you want to enroll in ${course}?`)) return;

        // ✅ **Initialize Paystack Payment**
        let handler = PaystackPop.setup({
            key: "pk_test_8153e6de3abb8df67a69368a20bb8848e39848c7",
            email: email,
            amount: amount,
            currency: "GHS",
            callback: function (response) {
                console.log("✅ Payment Successful! Reference:", response.reference);
                alert("✅ Payment Successful! Transaction Ref: " + response.reference);

                // 🎯 **Generate Unique 6-Digit Access Code**
                const accessCode = Math.floor(100000 + Math.random() * 900000).toString();

                // ✅ **Store Enrollment in Firestore**
                storeEnrollment(fullName, email, phone, course, mode, response.reference, accessCode);

                // ✅ **Send Access Code & Payment Confirmation via Email**
                sendEmail(email, accessCode, course, response.reference);
            },
            onClose: function () {
                alert("❌ Payment window closed.");
            },
        });

        handler.openIframe();
    });

    // ✅ **Store Enrollment in Firestore**
async function storeEnrollment(name, email, phone, course, mode, transactionId, accessCode) {
    try {
        const user = firebase.auth().currentUser;
        if (!user) {
            console.error("❌ No authenticated user found.");
            return;
        }

        const db = firebase.firestore();

        await db.collection("enrollments").add({
            userId: user.uid,  // ✅ **Store userId for filtering enrollments**
            name,
            email,
            phone,
            course,
            mode,
            transactionId,
            accessCode,
            unlocked: false, // ✅ **Course starts as locked**
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        });

        alert("✅ Enrollment successful! Check your email for access code.");
    } catch (error) {
        console.error("❌ Error saving enrollment:", error);
    }
}


    // 📩 **Send Access Code & Payment Confirmation Email**
    function sendEmail(email, accessCode, course, reference) {
        console.log("📩 Sending email with access code:", accessCode);
    
        fetch("http://localhost:8000/send_email.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, accessCode, course, reference })
        })
        .then(response => response.text())  // 👈 First, log raw response before parsing JSON
        .then(text => {
            console.log("📩 Raw Email Response:", text);  // 👀 Log server response
            return JSON.parse(text);  // ✅ Now, safely parse JSON
        })
        .then(data => {
            if (data.success) {
                alert("✅ Payment confirmed! Check your email for access code.");
                setTimeout(() => {
                    window.location.href = `access-course.html?email=${email}`;
                }, 3000);
            } else {
                alert("❌ Email failed: " + data.message);
            }
        })
        .catch(error => console.error("🚨 Error sending email:", error));
    }    
      
});
