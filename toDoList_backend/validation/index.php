<?php
require_once 'validation.php';
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (!empty($origin) and $origin==$_ENV['ALLOWED_ORIGINS']) {
    header("Access-Control-Allow-Origin: $origin");
    header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
    header("Access-Control-Allow-Credentials: true");
    header("Access-Control-Allow-Headers: Content-Type");
}

if($_SERVER["REQUEST_METHOD"]=="GET"){
    $uri = $_SERVER["REQUEST_URI"];
    getToken($uri);
}
else{
    http_response_code(403);
}

?>