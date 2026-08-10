<?php
/**
 * Configuración Segura para Colegio Bilingüe de Valledupar (cPanel Hosting)
 * 
 * Este archivo ha sido pre-configurado automáticamente con tus credenciales SMTP,
 * llaves de reCAPTCHA y ID de Google Calendar.
 */

// Evitar acceso directo a este archivo por seguridad
if (basename($_SERVER['PHP_SELF']) == 'config.php') {
    header("HTTP/1.1 403 Forbidden");
    exit("Acceso denegado");
}

return [
    // --- CONTRASEÑA DE ADMINISTRADOR ---
    'adminPassword' => 'S0portefcbv@1',

    // --- CONFIGURACIÓN DE CORREO / SMTP ---
    'smtp' => [
        // En cPanel, es altamente recomendable dejar 'use_smtp' en false, ya que cPanel
        // gestiona el envío de correos automáticamente mediante la función nativa mail() de PHP.
        // Si deseas forzar el envío a través del servidor SMTP externo de Gmail, cambia esto a true.
        'use_smtp' => true,                      
        'host' => 'smtp.gmail.com',
        'port' => 587,
        'secure' => 'tls',                        // 'ssl' (puerto 465) o 'tls' (puerto 587)
        'user' => 'contactenos@colegiobilingue.edu.co',
        'pass' => 'vwnu qfnr wgfl hntp',           // Contraseña de aplicación de Gmail
        
        // Direcciones de envío y recepción
        'sender' => 'contactenos@colegiobilingue.edu.co',
        'sender_name' => 'Portal Web Colegio Bilingüe',
        'recipient' => 'contactenos@colegiobilingue.edu.co',
        'admissionsRecipient' => 'admisiones@colegiobilingue.edu.co, contactenos@colegiobilingue.edu.co',
    ],

    // --- GOOGLE RECAPTCHA (v2 Checkbox) ---
    'recaptcha' => [
        'enabled' => false,                       // Cambiar a true si deseas activar el filtro de spam reCAPTCHA
        'siteKey' => '6LfKcnwjAAAAABjMLbpeE9xNOfc1EQQZq23yY_2g',
        'secretKey' => '6LfKcnwjAAAAADwdu67S7FbXYjrncQumCl52aP15',
    ],

    // --- GOOGLE CALENDAR ---
    'calendar' => [
        'id' => 'c_745f306f7f6a4473035ad8e18878e58a3f90247aa82269fc69c91c5ae17e50d0@group.calendar.google.com',
        'apiKey' => 'AIzaSyCISHPcGyCUzREM12k6HqqFswb3ENq7Iks',
    ],
];
