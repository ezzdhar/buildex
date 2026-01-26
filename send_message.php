<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Get form data
    $first_name = $_POST['first_name'];
    $last_name = $_POST['last_name'];
    $email = $_POST['email'];
    $phone = $_POST['phone'];
    $message = $_POST['message'];

    // Recipient's email address
    $to = "buildexarchitecture@gmail.com";
    
    // Subject
    $subject = "رسالة من الموقع - $first_name $last_name";

    // Message
    $message_body = "
    <html>
    <head>
        <title>رسالة من الموقع</title>
    </head>
    <body>
        <h2>تفاصيل الرسالة:</h2>
        <p><strong>الاسم الأول:</strong> $first_name</p>
        <p><strong>الاسم الأخير:</strong> $last_name</p>
        <p><strong>البريد الإلكتروني:</strong> $email</p>
        <p><strong>رقم الهاتف:</strong> $phone</p>
        <p><strong>الرسالة:</strong></p>
        <p>$message</p>
    </body>
    </html>
    ";

    // Headers
    $headers = "MIME-Version: 1.0" . "\r\n";
    $headers .= "Content-Type: text/html; charset=UTF-8" . "\r\n";
    $headers .= "From: $email" . "\r\n";
    $headers .= "Reply-To: $email" . "\r\n";

    // Send email
    if (mail($to, $subject, $message_body, $headers)) {
        echo "<script>alert('تم إرسال الرسالة بنجاح!'); window.location.href = 'thank-you.html';</script>";
    } else {
        echo "<script>alert('فشل إرسال الرسالة. حاول مرة أخرى.');</script>";
    }
}
?>
