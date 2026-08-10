<?php
/**
 * Admissions Form Submission Endpoint for cPanel
 */
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle CORS Preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// 1. Load configuration
$config = include __DIR__ . '/config.php';

// 2. Read JSON body
$rawInput = file_get_contents('php://input');
$input = json_decode($rawInput, true);

if (!$input) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid JSON input']);
    exit;
}

$firstName = isset($input['firstName']) ? trim($input['firstName']) : '';
$lastName = isset($input['lastName']) ? trim($input['lastName']) : '';
$email = isset($input['email']) ? trim($input['email']) : '';
$phone = isset($input['phone']) ? trim($input['phone']) : '';
$grade = isset($input['grade']) ? trim($input['grade']) : 'Preschool';
$message = isset($input['message']) ? trim($input['message']) : '';
$recaptchaToken = isset($input['recaptchaToken']) ? $input['recaptchaToken'] : '';

// 3. Validation
if (empty($firstName) || empty($email) || empty($phone)) {
    http_response_code(400);
    echo json_encode(['error' => 'Por favor complete todos los campos obligatorios (Nombre, Email, Teléfono)']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['error' => 'El correo electrónico proporcionado no es válido']);
    exit;
}

// 4. Verify Google reCAPTCHA if enabled
if ($config['recaptcha']['enabled']) {
    if (empty($recaptchaToken)) {
        http_response_code(400);
        echo json_encode(['error' => 'Verificación reCAPTCHA faltante']);
        exit;
    }

    $secretKey = $config['recaptcha']['secretKey'];
    $verifyUrl = "https://www.google.com/recaptcha/api/siteverify";
    
    $options = [
        'http' => [
            'header'  => "Content-type: application/x-www-form-urlencoded\r\n",
            'method'  => 'POST',
            'content' => http_build_query([
                'secret' => $secretKey,
                'response' => $recaptchaToken
            ])
        ]
    ];
    $context  = stream_context_create($options);
    $result = file_get_contents($verifyUrl, false, $context);
    $verifyResponse = json_decode($result, true);

    if (!$verifyResponse || !$verifyResponse['success']) {
        http_response_code(400);
        echo json_encode(['error' => 'La verificación de reCAPTCHA falló. Intente de nuevo.']);
        exit;
    }
}

// 5. Save locally in api/data/admissions.json as backup
$dataDir = __DIR__ . '/data';
if (!is_dir($dataDir)) {
    mkdir($dataDir, 0755, true);
}

$admissionsFile = $dataDir . '/admissions.json';
$submissions = [];

if (file_exists($admissionsFile)) {
    $rawSubmissions = file_get_contents($admissionsFile);
    $submissions = json_decode($rawSubmissions, true) ?: [];
}

$fullName = trim($firstName . ' ' . $lastName);

$newSubmission = [
    'id' => (string)round(microtime(true) * 1000),
    'firstName' => $firstName,
    'lastName' => $lastName,
    'email' => $email,
    'phone' => $phone,
    'grade' => $grade,
    'message' => $message,
    'createdAt' => date('c'), // ISO 8601 date
];

array_unshift($submissions, $newSubmission); // Add to the top
file_put_contents($admissionsFile, json_encode($submissions, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

// 6. Send email notification
$smtp = $config['smtp'];
// For admissions, prioritize admissionsRecipient list
$recipient = !empty($smtp['admissionsRecipient']) ? $smtp['admissionsRecipient'] : 'admisiones@colegiobilingue.edu.co, contactenos@colegiobilingue.edu.co';
$senderEmail = !empty($smtp['sender']) ? $smtp['sender'] : 'contactenos@colegiobilingue.edu.co';
$senderName = !empty($smtp['sender_name']) ? $smtp['sender_name'] : 'Portal Web Colegio Bilingüe';

$subject = "[Admisiones] Nueva Solicitud de Cupo - " . $fullName;

// Translate grade labels
$gradeLabel = $grade;
if ($grade === 'Preschool') {
    $gradeLabel = 'Preescolar';
} elseif ($grade === 'Primary') {
    $gradeLabel = 'Primaria';
} elseif ($grade === 'High School') {
    $gradeLabel = 'Bachillerato (Secundaria)';
}

// Elegant HTML mail design
$htmlMessage = '
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
</head>
<body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: sans-serif;">
    <div style="font-family: sans-serif; max-width: 600px; margin: 40px auto; padding: 30px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);">
        <div style="text-align: center; margin-bottom: 20px;">
            <h2 style="color: #1b3a6b; margin: 0; font-size: 24px; font-weight: bold; border-bottom: 3px solid #c9a961; padding-bottom: 12px;">Nueva Solicitud de Admisión</h2>
        </div>
        
        <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
            <tr>
                <td style="padding: 8px 0; font-weight: bold; width: 140px; color: #475569; font-size: 14px;">Solicitante:</td>
                <td style="padding: 8px 0; color: #1e293b; font-size: 14px; font-weight: bold;">' . htmlspecialchars($fullName) . '</td>
            </tr>
            <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #475569; font-size: 14px;">Email:</td>
                <td style="padding: 8px 0; color: #1e293b; font-size: 14px;"><a href="mailto:' . htmlspecialchars($email) . '" style="color: #1b3a6b; text-decoration: none; font-weight: bold;">' . htmlspecialchars($email) . '</a></td>
            </tr>
            <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #475569; font-size: 14px;">Teléfono:</td>
                <td style="padding: 8px 0; color: #1e293b; font-size: 14px; font-weight: bold;">' . htmlspecialchars($phone) . '</td>
            </tr>
            <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #475569; font-size: 14px;">Grado de Interés:</td>
                <td style="padding: 8px 0; color: #1b3a6b; font-size: 14px; font-weight: bold; text-transform: uppercase;">' . htmlspecialchars($gradeLabel) . '</td>
            </tr>
            <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #475569; font-size: 14px;">Fecha:</td>
                <td style="padding: 8px 0; color: #1e293b; font-size: 14px;">' . date('Y-m-d H:i:s') . '</td>
            </tr>
        </table>
        
        <div style="margin-top: 25px; padding: 20px; background-color: #f8fafc; border-left: 4px solid #c9a961; border-radius: 8px;">
            <h4 style="margin: 0 0 10px 0; color: #1b3a6b; font-size: 15px; font-weight: bold;">Comentarios / Mensaje Adicional:</h4>
            <p style="margin: 0; color: #334155; white-space: pre-wrap; line-height: 1.6; font-size: 14px;">' . ($message ? nl2br(htmlspecialchars($message)) : '<i>No se incluyeron comentarios adicionales.</i>') . '</p>
        </div>
        
        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin-top: 30px; margin-bottom: 20px;" />
        <p style="font-size: 11px; color: #94a3b8; text-align: center; margin-bottom: 0;">Fundación Colegio Bilingüe de Valledupar — Portal de Admisiones</p>
    </div>
</body>
</html>
';

// 6. Send email notification using mail_helper
require_once __DIR__ . '/mail_helper.php';

$mailSent = false;
$errorDetails = '';
try {
    $mailSent = dispatch_email($recipient, $subject, $htmlMessage, $config);
} catch (Exception $e) {
    $errorDetails = $e->getMessage();
}

if ($mailSent) {
    echo json_encode([
        'success' => true,
        'backup_saved' => true,
        'email_dispatched' => true,
        'message' => 'Solicitud de admisión procesada y enviada exitosamente.'
    ]);
} else {
    echo json_encode([
        'success' => true,
        'backup_saved' => true,
        'email_dispatched' => false,
        'message' => 'Solicitud guardada en servidor, pero la notificación de correo falló.',
        'error_details' => $errorDetails ?: 'Error desconocido de envío de correo.'
    ]);
}

