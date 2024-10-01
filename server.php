<?php
$host = 'localhost';
$port = 8000;
$directory = __DIR__;

echo "Starting server at http://$host:$port\n";
echo "Document root is $directory\n";
echo "Press Ctrl-C to quit.\n";

exec("php -S $host:$port -t $directory");