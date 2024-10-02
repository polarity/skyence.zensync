<?php
$musicDir = __DIR__ . '/music';
error_log("Music directory: " . $musicDir); // Add this line for debugging
$musicFiles = glob($musicDir . '/*.mp3');
error_log("Found " . count($musicFiles) . " MP3 files"); // Add this line for debugging

$musicList = [];

foreach ($musicFiles as $musicFile) {
    $metaFile = str_replace('.mp3', '.json', $musicFile);
    error_log("Checking meta file: " . $metaFile); // Add this line for debugging
    
    if (file_exists($metaFile)) {
        $metaContent = file_get_contents($metaFile);
        $metaData = json_decode($metaContent, true);
        
        if ($metaData === null) {
            error_log("Failed to parse JSON in " . $metaFile); // Add this line for debugging
            continue; // Skip this file if JSON is invalid
        }
        
        $musicList[] = [
            'title' => $metaData['title'] ?? '',
            'file' => 'music/' . basename($musicFile),  // Add 'music/' prefix here
            'category' => $metaData['category'] ?? '',
            'fit' => $metaData['fit'] ?? '',
            'mood' => $metaData['mood'] ?? '',
            'tempo' => $metaData['tempo'] ?? ''
        ];
    } else {
        error_log("Meta file not found: " . $metaFile); // Add this line for debugging
    }
}

error_log("Sending JSON response: " . json_encode($musicList)); // Add this line for debugging
header('Content-Type: application/json');
echo json_encode($musicList);