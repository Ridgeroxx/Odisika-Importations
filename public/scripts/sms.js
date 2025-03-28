async function sendSMS(phone, course) {
    const accessCode = Math.floor(100000 + Math.random() * 900000).toString();

    const twilioData = {
        to: phone,
        course: course,  // ✅ Ensure "course" is sent
        body: `Your EduTrain Access Code for ${course}: ${accessCode}. Do not share!`
    };

    try {
        const response = await fetch("send_sms.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(twilioData),
        });

        const data = await response.json();
        console.log("🔍 Twilio Response:", data); // ✅ Log full response for debugging

        if (data.success) {
            alert("✅ Access code sent via SMS!");
        } else {
            alert(`❌ Failed to send access code: ${data.message}`);
        }
    } catch (error) {
        console.error("🚨 Error sending SMS:", error);
    }
}
