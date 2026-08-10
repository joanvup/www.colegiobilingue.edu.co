<?php
/**
 * Lightweight, pure-PHP SMTP Socket Client and Mail Dispatcher for cPanel
 * Supports native mail() and secure SMTP (SSL on 465 / TLS on 587 with STARTTLS)
 * No external dependencies required!
 */

if (basename($_SERVER['PHP_SELF']) == 'mail_helper.php') {
    header("HTTP/1.1 403 Forbidden");
    exit("Access denied");
}

/**
 * Dispatch an HTML email using the chosen method in configuration
 */
function dispatch_email($to, $subject, $htmlMessage, $config) {
    $smtp = $config['smtp'];
    
    // Check if we should use SMTP
    if (isset($smtp['use_smtp']) && $smtp['use_smtp'] === true) {
        return send_smtp_mail_pure($to, $subject, $htmlMessage, $config);
    }
    
    // Fallback: Native PHP mail()
    return send_native_php_mail($to, $subject, $htmlMessage, $config);
}

/**
 * Send email using cPanel's native PHP mail() function
 */
function send_native_php_mail($to, $subject, $htmlMessage, $config) {
    $smtp = $config['smtp'];
    $senderEmail = !empty($smtp['sender']) ? $smtp['sender'] : 'contactenos@colegiobilingue.edu.co';
    $senderName = !empty($smtp['sender_name']) ? $smtp['sender_name'] : 'Portal Web Colegio Bilingüe';
    
    // Setup headers
    $headers = [];
    $headers[] = 'MIME-Version: 1.0';
    $headers[] = 'Content-type: text/html; charset=utf-8';
    $headers[] = 'From: =?utf-8?B?' . base64_encode($senderName) . '?= <' . $senderEmail . '>';
    $headers[] = 'Reply-To: ' . $senderEmail;
    $headers[] = 'X-Mailer: PHP/' . phpversion();
    
    // Support multiple comma-separated recipients securely
    $recipientsList = array_map('trim', explode(',', $to));
    $success = true;
    
    foreach ($recipientsList as $recipient) {
        if (!empty($recipient)) {
            $sent = @mail($recipient, "=?utf-8?B?" . base64_encode($subject) . "?=", $htmlMessage, implode("\r\n", $headers));
            if (!$sent) {
                $success = false;
            }
        }
    }
    
    return $success;
}

/**
 * Send email using a raw SMTP socket connection (perfect for Gmail SMTP)
 */
function send_smtp_mail_pure($to, $subject, $htmlMessage, $config) {
    $smtp = $config['smtp'];
    $host = $smtp['host'];
    $port = (int)$smtp['port'];
    $username = $smtp['user'];
    $password = $smtp['pass'];
    $sender = $smtp['sender'];
    $senderName = $smtp['sender_name'];

    // Parse recipients list
    $recipients = array_filter(array_map('trim', explode(',', $to)));
    if (empty($recipients)) {
        throw new Exception("No recipient emails specified.");
    }

    $headerTo = implode(', ', $recipients);

    // Build standard MIME headers
    $headers = [
        "MIME-Version: 1.0",
        "Content-type: text/html; charset=utf-8",
        "From: =?utf-8?B?" . base64_encode($senderName) . "?= <" . $sender . ">",
        "To: " . $headerTo,
        "Subject: =?utf-8?B?" . base64_encode($subject) . "?=",
        "Date: " . date('r'),
        "X-Mailer: PHP/" . phpversion()
    ];

    $messagePayload = implode("\r\n", $headers) . "\r\n\r\n" . $htmlMessage;

    // Create a SSL stream context that ignores self-signed certificate issues (common on hosting)
    $context = stream_context_create([
        'ssl' => [
            'verify_peer' => false,
            'verify_peer_name' => false,
            'allow_self_signed' => true
        ]
    ]);

    $socketHost = $host;
    // Port 465 requires secure connection from the start
    if ($port === 465) {
        $socketHost = "ssl://" . $host;
    }

    // Connect to server
    $socket = @stream_socket_client($socketHost . ":" . $port, $errno, $errstr, 15, STREAM_CLIENT_CONNECT, $context);
    if (!$socket) {
        throw new Exception("Could not connect to SMTP server $host:$port - Error: $errstr ($errno)");
    }

    // Helper closure to read SMTP responses
    $readResponse = function($sock, $expectedCode) {
        $response = "";
        while ($line = fgets($sock, 515)) {
            $response .= $line;
            // SMTP lines with space as the 4th character indicate the final line of response
            if (substr($line, 3, 1) === " ") {
                break;
            }
        }
        $code = substr($response, 0, 3);
        if ($code !== $expectedCode) {
            throw new Exception("SMTP protocol error. Expected $expectedCode but got: $response");
        }
        return $response;
    };

    try {
        // Init connection
        $readResponse($socket, "220");

        // Say Hello
        $serverName = isset($_SERVER['SERVER_NAME']) ? $_SERVER['SERVER_NAME'] : 'localhost';
        fwrite($socket, "EHLO " . $serverName . "\r\n");
        $readResponse($socket, "250");

        // STARTTLS upgrade if port is 587 or 25
        if ($port === 587 || $port === 25) {
            fwrite($socket, "STARTTLS\r\n");
            $readResponse($socket, "220");
            
            // Enable encryption on the socket
            if (!stream_socket_enable_crypto($socket, true, STREAM_CRYPTO_METHOD_TLS_CLIENT)) {
                throw new Exception("STARTTLS negotiation failed. Cannot secure connection.");
            }
            
            // Re-identify securely
            fwrite($socket, "EHLO " . $serverName . "\r\n");
            $readResponse($socket, "250");
        }

        // Authentication process
        fwrite($socket, "AUTH LOGIN\r\n");
        $readResponse($socket, "334");

        fwrite($socket, base64_encode($username) . "\r\n");
        $readResponse($socket, "334");

        fwrite($socket, base64_encode($password) . "\r\n");
        $readResponse($socket, "235");

        // Mail Envelope From
        fwrite($socket, "MAIL FROM: <" . $sender . ">\r\n");
        $readResponse($socket, "250");

        // Envelope Recipients
        foreach ($recipients as $recipient) {
            fwrite($socket, "RCPT TO: <" . $recipient . ">\r\n");
            $readResponse($socket, "250");
        }

        // Start Data transmission
        fwrite($socket, "DATA\r\n");
        $readResponse($socket, "354");

        // Send payload and end with standard <CRLF>.<CRLF>
        fwrite($socket, $messagePayload . "\r\n.\r\n");
        $readResponse($socket, "250");

        // Gracefully close
        fwrite($socket, "QUIT\r\n");
        fclose($socket);
        return true;
    } catch (Exception $e) {
        @fclose($socket);
        throw $e;
    }
}
