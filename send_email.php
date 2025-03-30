<?php
// ✅ Clear Output Buffer to Prevent Extra Characters
ob_clean();
header("Access-Control-Allow-Origin: https://ridgeroxx.github.io"); // Allow GitHub Pages
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// ✅ Enable Error Reporting for Debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

// ✅ Handle Preflight Request for CORS
if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit;
}

// ✅ Require Composer Autoloader for PHPMailer & Dotenv
require 'vendor/autoload.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use Dotenv\Dotenv;

// ✅ Load .env file for sensitive credentials
$dotenv = Dotenv::createImmutable(__DIR__);
$dotenv->load();

// ✅ Ensure the script only runs on POST requests
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    error_log("❌ Received " . $_SERVER["REQUEST_METHOD"] . " instead of POST.");
    echo json_encode(["success" => false, "message" => "Invalid request method."]);
    exit;
}

// ✅ Get and Decode JSON Data from Request
$rawData = file_get_contents("php://input");
$data = json_decode($rawData, true);

// ✅ Log JSON Decoding Errors
if (json_last_error() !== JSON_ERROR_NONE) {
    error_log("❌ JSON Parse Error: " . json_last_error_msg());
    echo json_encode(["success" => false, "message" => "Invalid JSON format."]);
    exit;
}

// ✅ Validate Required Fields
$email = isset($data["email"]) ? filter_var($data["email"], FILTER_VALIDATE_EMAIL) : null;
$course = isset($data["course"]) ? trim($data["course"]) : null;
$accessCode = isset($data["accessCode"]) ? trim($data["accessCode"]) : null;
$reference = isset($data["reference"]) ? trim($data["reference"]) : null;

if (!$email || !$course || !$accessCode || !$reference) {
    error_log("❌ Missing Parameters!");
    echo json_encode(["success" => false, "message" => "Missing required parameters."]);
    exit;
}

// ✅ Initialize PHPMailer
$mail = new PHPMailer(true);

try {
    // ✅ Setup Gmail SMTP Securely
    $mail->isSMTP();
    $mail->Host       = $_ENV['GMAIL_HOST'];
    $mail->SMTPAuth   = true;
    $mail->Username   = $_ENV['GMAIL_USERNAME'];
    $mail->Password   = $_ENV['GMAIL_PASSWORD'];
    $mail->SMTPSecure = $_ENV['GMAIL_ENCRYPTION'];
    $mail->Port       = $_ENV['GMAIL_PORT'];
    $mail->SMTPDebug  = 0; // Set to 2 for debugging, 0 for production

    // ✅ Email Settings
    $mail->setFrom($_ENV['GMAIL_USERNAME'], 'Odisika Importation');
    $mail->addAddress($email); // Recipient

    // ✅ Email Content (HTML)
    $mail->isHTML(true);
    $mail->Subject = "🎉 Payment Successful - Your Course Access Code Inside!";
    $mail->Body    = "
        <h2>🎉 Congratulations on Your Enrollment!</h2>
        <p>Dear Student,</p>
        <p>Thank you for enrolling in <strong>$course</strong>. Your payment has been received successfully!</p>
        
        <h3>💳 Payment Details:</h3>
        <p><strong>Transaction Reference:</strong> <span style='color:green;'>$reference</span></p>

        <h3>🔑 Your Access Code:</h3>
        <p style='font-size:20px; color:blue; font-weight:bold;'>$accessCode</p>
        <p>Use this code to unlock your course on our platform.</p>

        <h3>📌 Next Steps:</h3>
        <ul>
            <li>Login to your account and go to the course dashboard.</li>
            <li>Enter your access code to unlock the course.</li>
            <li>Start learning and enjoy your journey! 🚀</li>
        </ul>

        <p>If you have any issues, contact us at <a href='mailto:support@odisika.com'>support@odisika.com</a>.</p>

        <br>
        <p>Best Regards,<br><strong>Odisika Team</strong></p>
    ";

    // ✅ Send email
    if ($mail->send()) {
        error_log("✅ Email Sent Successfully to $email");
        echo json_encode(["success" => true, "message" => "Access code and payment confirmation sent via email"]);
    } else {
        error_log("❌ Email Sending Failed: " . $mail->ErrorInfo);
        echo json_encode(["success" => false, "message" => "Email sending failed: " . $mail->ErrorInfo]);
    }

} catch (Exception $e) {
    error_log("❌ Mailer Error: " . $mail->ErrorInfo);
    header('Content-Type: application/json'); // ✅ Ensure JSON response
    echo json_encode(["success" => false, "message" => "Mailer Error: " . $mail->ErrorInfo], JSON_PRETTY_PRINT);
    exit;    
}
?>
