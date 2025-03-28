<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'vendor/autoload.php'; // Make sure Composer installed PHPMailer

$mail = new PHPMailer(true);

try {
    $mail->isSMTP();
    $mail->Host       = 'smtp.gmail.com'; // Gmail SMTP Server
    $mail->SMTPAuth   = true;
    $mail->Username   = 'ridgeroxx13@gmail.com'; // 🔹 Your Gmail Address
    $mail->Password   = 'wyzu opmq myif hlpw'; // 🔹 Use Gmail App Password (See Step 3)
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port       = 587;

    // Recipient
    $mail->setFrom('nanabk442@gmail.com', 'EduTrain');
    $mail->addAddress('linderwalker06@gmail.com', 'Student'); // 🔹 Replace with your email

    // Content
    $mail->isHTML(true);
    $mail->Subject = 'Test Email';
    $mail->Body    = '<h2>This is a test email from PHPMailer!</h2>';

    $mail->send();
    echo "✅ Test email sent successfully!";
} catch (Exception $e) {
    echo "❌ Email failed: " . $mail->ErrorInfo;
}
?>
