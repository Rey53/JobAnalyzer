<?php
/**
 * Pharma Specialist Portal (PSP) - PHP Wrapper
 * Purpose: Serve index.html and provide support for .env configuration.
 */

// Basic .env loader
$env_file = __DIR__ . '/.env';
$env_vars = [];

if (file_exists($env_file)) {
    $lines = file($env_file, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (strpos(trim($line), '#') === 0) continue;
        if (strpos($line, '=') !== false) {
            list($name, $value) = explode('=', $line, 2);
            $env_vars[trim($name)] = trim($value);
        }
    }
}

// Read the built index.html
$html = file_get_contents(__DIR__ . '/index.html');

// Security: If the VITE_GEMINI_API_KEY is found in .env, ensure it can be used 
// by the frontend. (Standard Vite builds already hardcode it, but this allows for runtime checks).
$injected_script = "\n<script>window.SERVER_ENV = " . json_encode($env_vars) . ";</script>\n";
$html = str_replace('</head>', $injected_script . '</head>', $html);

echo $html;
?>
