<?php
/**
 * Administration API Endpoint for Colegio Bilingüe Web (cPanel/Apache compatible)
 * Manages SMTP settings, Google Calendar/reCAPTCHA config, and retrieves/deletes web submissions.
 */
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Admin-Token');

// Handle CORS Preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// 1. Load configuration
$configPath = __DIR__ . '/config.php';
if (!file_exists($configPath)) {
    http_response_code(500);
    echo json_encode(['error' => 'Config file not found on server']);
    exit;
}
$config = include $configPath;

// 2. Extract Authorization Token
$authHeader = isset($_SERVER['HTTP_AUTHORIZATION']) ? $_SERVER['HTTP_AUTHORIZATION'] : '';
if (empty($authHeader) && function_exists('apache_request_headers')) {
    $headers = apache_request_headers();
    if (isset($headers['Authorization'])) {
        $authHeader = $headers['Authorization'];
    }
}

$token = '';
if (preg_match('/Bearer\s+(.*)$/i', $authHeader, $matches)) {
    $token = $matches[1];
}

// Fallback for cPanel setups where standard Authorization header is stripped by Apache
if (empty($token)) {
    if (isset($_SERVER['HTTP_X_ADMIN_TOKEN'])) {
        $token = $_SERVER['HTTP_X_ADMIN_TOKEN'];
    } elseif (function_exists('apache_request_headers')) {
        $headers = apache_request_headers();
        if (isset($headers['X-Admin-Token'])) {
            $token = $headers['X-Admin-Token'];
        }
    }
}

// Fallback to query parameter for absolute convenience
if (empty($token) && isset($_GET['token'])) {
    $token = $_GET['token'];
}

// 3. Verify Admin Password
$expectedPassword = isset($config['adminPassword']) ? $config['adminPassword'] : 'admin';
if (empty($token) || $token !== $expectedPassword) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized admin access']);
    exit;
}

// 4. Router
$action = isset($_GET['action']) ? $_GET['action'] : '';
$method = $_SERVER['REQUEST_METHOD'];

switch ($action) {
    case 'smtp':
        if ($method === 'GET') {
            // Retrieve config in the structure that matches React's smtpConfig state
            $response = [
                'host' => isset($config['smtp']['host']) ? $config['smtp']['host'] : '',
                'port' => isset($config['smtp']['port']) ? (int)$config['smtp']['port'] : 587,
                'secure' => isset($config['smtp']['secure']) ? ($config['smtp']['secure'] === 'ssl' || $config['smtp']['secure'] === true) : false,
                'user' => isset($config['smtp']['user']) ? $config['smtp']['user'] : '',
                'pass' => isset($config['smtp']['pass']) ? $config['smtp']['pass'] : '',
                'sender' => isset($config['smtp']['sender']) ? $config['smtp']['sender'] : '',
                'recipient' => isset($config['smtp']['recipient']) ? $config['smtp']['recipient'] : '',
                'admissionsRecipient' => isset($config['smtp']['admissionsRecipient']) ? $config['smtp']['admissionsRecipient'] : '',
                'adminPassword' => $expectedPassword,
                'recaptchaEnabled' => isset($config['recaptcha']['enabled']) ? (bool)$config['recaptcha']['enabled'] : false,
                'recaptchaSiteKey' => isset($config['recaptcha']['siteKey']) ? $config['recaptcha']['siteKey'] : '',
                'recaptchaSecretKey' => isset($config['recaptcha']['secretKey']) ? $config['recaptcha']['secretKey'] : '',
                'googleCalendarId' => isset($config['calendar']['id']) ? $config['calendar']['id'] : '',
                'googleCalendarApiKey' => isset($config['calendar']['apiKey']) ? $config['calendar']['apiKey'] : '',
            ];
            echo json_encode($response);
            exit;
            
        } elseif ($method === 'POST') {
            // Parse inputs
            $rawInput = file_get_contents('php://input');
            $input = json_decode($rawInput, true);
            
            if (!$input) {
                http_response_code(400);
                echo json_encode(['error' => 'Invalid JSON body input']);
                exit;
            }
            
            // Build and write PHP configuration dynamically
            $secureValue = (isset($input['secure']) && $input['secure'] === true) ? 'ssl' : 'tls';
            
            $configContent = "<?php\n" .
                "/**\n" .
                " * Configuración Segura para Colegio Bilingüe de Valledupar (cPanel Hosting)\n" .
                " * Generada automáticamente mediante el Panel de Administración.\n" .
                " */\n\n" .
                "if (basename(\$_SERVER['PHP_SELF']) == 'config.php') {\n" .
                "    header(\"HTTP/1.1 403 Forbidden\");\n" .
                "    exit(\"Acceso denegado\");\n" .
                "}\n\n" .
                "return [\n" .
                "    // --- CONTRASEÑA DE ADMINISTRADOR ---\n" .
                "    'adminPassword' => '" . addslashes($input['adminPassword']) . "',\n\n" .
                "    // --- CONFIGURACIÓN DE CORREO / SMTP ---\n" .
                "    'smtp' => [\n" .
                "        'use_smtp' => true,\n" .
                "        'host' => '" . addslashes($input['host']) . "',\n" .
                "        'port' => " . (int)$input['port'] . ",\n" .
                "        'secure' => '" . addslashes($secureValue) . "',\n" .
                "        'user' => '" . addslashes($input['user']) . "',\n" .
                "        'pass' => '" . addslashes($input['pass']) . "',\n" .
                "        'sender' => '" . addslashes($input['sender']) . "',\n" .
                "        'sender_name' => 'Portal Web Colegio Bilingüe',\n" .
                "        'recipient' => '" . addslashes($input['recipient']) . "',\n" .
                "        'admissionsRecipient' => '" . addslashes($input['admissionsRecipient']) . "',\n" .
                "    ],\n\n" .
                "    // --- GOOGLE RECAPTCHA (v2 Checkbox) ---\n" .
                "    'recaptcha' => [\n" .
                "        'enabled' => " . ($input['recaptchaEnabled'] ? "true" : "false") . ",\n" .
                "        'siteKey' => '" . addslashes($input['recaptchaSiteKey']) . "',\n" .
                "        'secretKey' => '" . addslashes($input['recaptchaSecretKey']) . "',\n" .
                "    ],\n\n" .
                "    // --- GOOGLE CALENDAR ---\n" .
                "    'calendar' => [\n" .
                "        'id' => '" . addslashes($input['googleCalendarId']) . "',\n" .
                "        'apiKey' => '" . addslashes($input['googleCalendarApiKey']) . "',\n" .
                "    ],\n" .
                "];\n";
                
            if (file_put_contents($configPath, $configContent) !== false) {
                echo json_encode(['success' => true, 'smtp' => $input]);
            } else {
                http_response_code(500);
                echo json_encode(['error' => 'No se pudo escribir en el archivo de configuración config.php. Verifique permisos de escritura.']);
            }
            exit;
        }
        break;

    case 'smtp_test':
        if ($method === 'POST') {
            require_once __DIR__ . '/mail_helper.php';
            
            $testSubject = 'Prueba de configuración de Servidor SMTP — Colegio Bilingüe';
            $testRecipient = isset($config['smtp']['recipient']) ? $config['smtp']['recipient'] : 'contactenos@colegiobilingue.edu.co';
            
            $htmlMessage = '
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #10b981; border-radius: 12px; background-color: #f0fdf4;">
                <h2 style="color: #047857; margin-top: 0;">✔ Conexión de Servidor Exitosa (cPanel)</h2>
                <p style="color: #065f46; font-size: 14px;">La configuración SMTP de tu servidor de correos está funcionando correctamente desde PHP.</p>
                <div style="background-color: #ffffff; padding: 14px; border-radius: 8px; border: 1px solid #d1fae5; margin-top: 16px;">
                    <ul style="margin: 0; padding-left: 20px; font-size: 13px; color: #374151; line-height: 1.6;">
                        <li><strong>Servidor Host:</strong> ' . htmlspecialchars($config['smtp']['host']) . '</li>
                        <li><strong>Puerto:</strong> ' . htmlspecialchars($config['smtp']['port']) . '</li>
                        <li><strong>Seguro:</strong> ' . htmlspecialchars($config['smtp']['secure']) . '</li>
                        <li><strong>Usuario:</strong> ' . htmlspecialchars($config['smtp']['user']) . '</li>
                    </ul>
                </div>
                <p style="font-size: 11px; color: #6b7280; text-align: center; margin-top: 24px; margin-bottom: 0;">Prueba de Servidor Automática — Fundación Colegio Bilingüe de Valledupar</p>
            </div>';
            
            try {
                $success = dispatch_email($testRecipient, $testSubject, $htmlMessage, $config);
                if ($success) {
                    echo json_encode(['success' => true, 'message' => 'Test email sent successfully to ' . $testRecipient]);
                } else {
                    http_response_code(500);
                    echo json_encode(['error' => 'El envío del correo falló. Revisa las credenciales SMTP en config.php.']);
                }
            } catch (Exception $e) {
                http_response_code(500);
                echo json_encode(['error' => $e->getMessage()]);
            }
            exit;
        }
        break;

    case 'contact':
        if ($method === 'GET') {
            $submissionsFile = __DIR__ . '/data/submissions.json';
            $submissions = [];
            if (file_exists($submissionsFile)) {
                $raw = file_get_contents($submissionsFile);
                $submissions = json_decode($raw, true) ?: [];
            }
            echo json_encode($submissions);
            exit;
        }
        break;

    case 'contact_delete':
        if ($method === 'DELETE') {
            $id = isset($_GET['id']) ? $_GET['id'] : '';
            if (empty($id)) {
                http_response_code(400);
                echo json_encode(['error' => 'Missing submission ID']);
                exit;
            }
            
            $submissionsFile = __DIR__ . '/data/submissions.json';
            if (file_exists($submissionsFile)) {
                $raw = file_get_contents($submissionsFile);
                $submissions = json_decode($raw, true) ?: [];
                
                $filtered = array_values(array_filter($submissions, function($sub) use ($id) {
                    return $sub['id'] !== $id;
                }));
                
                file_put_contents($submissionsFile, json_encode($filtered, JSON_PRETTY_PRINT));
                echo json_encode(['success' => true]);
            } else {
                echo json_encode(['success' => true]);
            }
            exit;
        }
        break;

    case 'admissions':
        if ($method === 'GET') {
            $admissionsFile = __DIR__ . '/data/admissions.json';
            $admissions = [];
            if (file_exists($admissionsFile)) {
                $raw = file_get_contents($admissionsFile);
                $admissions = json_decode($raw, true) ?: [];
            }
            echo json_encode($admissions);
            exit;
        }
        break;

    case 'admissions_delete':
        if ($method === 'DELETE') {
            $id = isset($_GET['id']) ? $_GET['id'] : '';
            if (empty($id)) {
                http_response_code(400);
                echo json_encode(['error' => 'Missing admissions ID']);
                exit;
            }
            
            $admissionsFile = __DIR__ . '/data/admissions.json';
            if (file_exists($admissionsFile)) {
                $raw = file_get_contents($admissionsFile);
                $admissions = json_decode($raw, true) ?: [];
                
                $filtered = array_values(array_filter($admissions, function($item) use ($id) {
                    return $item['id'] !== $id;
                }));
                
                file_put_contents($admissionsFile, json_encode($filtered, JSON_PRETTY_PRINT));
                echo json_encode(['success' => true]);
            } else {
                echo json_encode(['success' => true]);
            }
            exit;
        }
        break;

    default:
        http_response_code(404);
        echo json_encode(['error' => 'Action or route not found']);
        exit;
}
