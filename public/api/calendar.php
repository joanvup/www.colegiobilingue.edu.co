<?php
/**
 * Google Calendar Events Proxy or Mock Events Fallback for cPanel
 */
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type');

$config = include __DIR__ . '/config.php';

// Helper to generate dynamic mock dates relative to current month/year
function getMockEvents() {
    $currentMonth = (int)date('m');
    $currentYear = (int)date('Y');

    $createDate = function($monthOffset, $day, $hour) use ($currentMonth, $currentYear) {
        $date = new DateTime();
        // Set to first day of current month/year first to prevent offset errors
        $date->setDate($currentYear, $currentMonth, 1);
        
        if ($monthOffset !== 0) {
            $sign = $monthOffset > 0 ? '+' : '';
            $date->modify($sign . $monthOffset . ' month');
        }
        
        $date->setDate((int)$date->format('Y'), (int)$date->format('m'), $day);
        $date->setTime($hour, 0, 0);
        return $date->format('c'); // ISO 8601
    };

    return [
        [
            'id' => 'mock-1',
            'title' => 'Inicio del Bimestre Académico',
            'description' => 'Bienvenida a estudiantes y docentes. Inicio formal de clases y asamblea general en el polideportivo.',
            'start' => $createDate(0, 1, 7),
            'end' => $createDate(0, 1, 14),
            'allDay' => true,
            'location' => 'Campus Principal',
        ],
        [
            'id' => 'mock-2',
            'title' => 'Reunión General de Padres de Familia',
            'description' => 'Espacio de integración y socialización sobre las directrices académicas del bimestre actual.',
            'start' => $createDate(0, 5, 18),
            'end' => $createDate(0, 5, 20),
            'allDay' => false,
            'location' => 'Auditorio Principal Julio Villazón Baquero',
        ],
        [
            'id' => 'mock-3',
            'title' => 'Copa Inter-Houses & Día de la Familia',
            'description' => 'Competencias deportivas, danzas, integraciones familiares y recreación entre las casas Red, White y Blue.',
            'start' => $createDate(0, 15, 8),
            'end' => $createDate(0, 15, 16),
            'allDay' => false,
            'location' => 'Polideportivo y Zonas Verdes',
        ],
        [
            'id' => 'mock-4',
            'title' => 'Exámenes Bimestrales',
            'description' => 'Evaluaciones bimonthly académicas acumulativas para todas las asignaturas y niveles.',
            'start' => $createDate(0, 22, 7),
            'end' => $createDate(0, 24, 14),
            'allDay' => true,
            'location' => 'Aulas de clase',
        ],
        [
            'id' => 'mock-5',
            'title' => 'Feria de Ciencia, Tecnología y Arte',
            'description' => 'Exposición pública de proyectos creativos e investigaciones desarrolladas por los estudiantes.',
            'start' => $createDate(0, 28, 9),
            'end' => $createDate(0, 28, 15),
            'allDay' => false,
            'location' => 'Plaza de la Ciencia',
        ],
        [
            'id' => 'mock-6',
            'title' => 'Taller Psicopedagógico para Padres',
            'description' => 'Charla interactiva orientada por psicología escolar acerca del desarrollo emocional y asertividad.',
            'start' => $createDate(1, 10, 18),
            'end' => $createDate(1, 10, 19),
            'allDay' => false,
            'location' => 'Auditorio de Preescolar',
        ],
        [
            'id' => 'mock-7',
            'title' => 'Salida Ecológica y Trabajo Comunitario',
            'description' => 'Inmersión práctica en preservación ecológica y proyectos de impacto social.',
            'start' => $createDate(1, 18, 7),
            'end' => $createDate(1, 18, 14),
            'allDay' => false,
            'location' => 'Valledupar y alrededores',
        ],
        [
            'id' => 'mock-8',
            'title' => 'Clausura del Bimestre y Boletines',
            'description' => 'Ceremonia de mérito académico y entrega formal de calificaciones del bimestre.',
            'start' => $createDate(1, 28, 8),
            'end' => $createDate(1, 28, 12),
            'allDay' => false,
            'location' => 'Salones de Orientación',
        ]
    ];
}

$calendarId = $config['calendar']['id'];
$apiKey = $config['calendar']['apiKey'];

// If no credentials, output the mock events instantly
if (empty($calendarId) || empty($apiKey)) {
    echo json_encode([
        'isMock' => true,
        'events' => getMockEvents()
    ]);
    exit;
}

// Get query parameters or use defaults (45 days ago to 60 days in the future)
$timeMin = isset($_GET['timeMin']) ? $_GET['timeMin'] : date('c', time() - 45 * 24 * 60 * 60);
$timeMax = isset($_GET['timeMax']) ? $_GET['timeMax'] : date('c', time() + 60 * 24 * 60 * 60);

$url = "https://www.googleapis.com/calendar/v3/calendars/" . urlencode($calendarId) . "/events?" . http_build_query([
    'key' => $apiKey,
    'timeMin' => $timeMin,
    'timeMax' => $timeMax,
    'singleEvents' => 'true',
    'orderBy' => 'startTime'
]);

// Fetch from Google Calendar REST API
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 10);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($httpCode !== 200 || !$response) {
    // If request fails (invalid key or calendar ID, or restricted access), fallback to mock data
    echo json_encode([
        'statusError' => 'Failed to fetch from Google Calendar',
        'detailsMessage' => 'Calendar access restricted or ID not found. Ensure the Google Calendar is public.',
        'isPrivateOrNotFound' => ($httpCode === 404),
        'isMock' => true,
        'events' => getMockEvents()
    ]);
    exit;
}

$data = json_decode($response, true);
$events = [];

if (isset($data['items']) && is_array($data['items'])) {
    foreach ($data['items'] as $item) {
        $startDateTime = isset($item['start']['dateTime']) ? $item['start']['dateTime'] : null;
        $startDate = isset($item['start']['date']) ? $item['start']['date'] : null;
        $endDateTime = isset($item['end']['dateTime']) ? $item['end']['dateTime'] : null;
        $endDate = isset($item['end']['date']) ? $item['end']['date'] : null;

        $events[] = [
            'id' => isset($item['id']) ? $item['id'] : uniqid('gcal_'),
            'title' => isset($item['summary']) ? $item['summary'] : 'Evento sin título',
            'description' => isset($item['description']) ? $item['description'] : '',
            'start' => $startDateTime ? $startDateTime : $startDate,
            'end' => $endDateTime ? $endDateTime : $endDate,
            'allDay' => !empty($startDate),
            'location' => isset($item['location']) ? $item['location'] : '',
        ];
    }
}

echo json_encode([
    'isMock' => false,
    'events' => $events
]);
