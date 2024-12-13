<?php
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $fullname = htmlspecialchars($_POST['fullname']);
    $email = htmlspecialchars($_POST['email']);
    $message = htmlspecialchars($_POST['message']);

    $to = "v.deepakakash@gmail.com"; // Replace with your email address
    $subject = "New Contact Form Submission from $fullname";
    $headers = "From: $email\r\n";
    $headers .= "Reply-To: $email\r\n";

    $body = "Name: $fullname\nEmail: $email\n\nMessage:\n$message";

    if (mail($to, $subject, $body, $headers)) {
        echo "Your message has been sent!";
    } else {
        echo "There was an error sending your message.";
    }
} else {
    echo "Invalid request.";
}
?>
