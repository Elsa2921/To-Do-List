<?php
    function mailer($token, $email, $fromEmail) {
        // Create verification link
        $link = "https://elsa.xn--99aqkba3a6acc6a.xn--y9a3aq/toDoList_backend/validation/index.php/$token";
    
        $to = $email;
        $subject = "Validation Email";
    
        // Proper headers
        $headers  = "From: $fromEmail\r\n";
        $headers .= "Reply-To: $fromEmail\r\n";
        $headers .= "MIME-Version: 1.0\r\n";
        $headers .= "Content-Type: text/html; charset=UTF-8\r\n";
        $headers .= "X-Mailer: PHP/" . phpversion() . "\r\n";
    
        // HTML message with clickable link
        $message = "
            <html>
            <body>
                <p>Hello from <b>To-Do-List</b>.</p>
                <p>This is a verification email for your account.</p>
                <p>Please click the link below to verify your email (valid for 20 minutes):</p>
                <p><a href='$link'>$link</a></p>
            </body>
            </html>
        ";
    
        if (mail($to, $subject, $message, $headers)) {
            return true;
        } else {
            return false;
        }
    }
?>