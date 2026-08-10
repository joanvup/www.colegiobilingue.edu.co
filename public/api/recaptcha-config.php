<?php
/**
 * reCAPTCHA Configuration Endpoint for cPanel
 */
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type');

$config = include __DIR__ . '/config.php';

echo json_encode([
    'enabled' => (bool)$config['recaptcha']['enabled'],
    'siteKey' => (string)$config['recaptcha']['siteKey']
]);
