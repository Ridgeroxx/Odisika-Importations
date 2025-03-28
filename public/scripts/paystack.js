async function handlePaymentSuccess(reference, email, course) {
    console.log("✅ Payment Successful! Reference:", reference);

    // Generate Access Code (6-digit)
    const accessCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Send Access Code via Email
    try {
        const response = await fetch("send_email.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email: email,
                course: course,
                accessCode: accessCode,
                reference: reference
            }),
        });

        const data = await response.json();
        console.log("📩 Email Response:", data);

        if (data.success) {
            alert("✅ Payment Successful! Your access code has been emailed.");
        } else {
            alert("❌ Failed to send email: " + data.message);
        }
    } catch (error) {
        console.error("🚨 Error sending email:", error);
    }
}
