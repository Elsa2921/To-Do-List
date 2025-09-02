<?php

require_once __DIR__ .'/vendor/autoload.php';
use Dotenv\Dotenv;
$first_path = __DIR__;
// $secont_path = __DIR__.'/pages';
if(file_exists($first_path . '/.env')){
    $dotenv = Dotenv::createImmutable($first_path);

}
// elseif(file_exists($secont_path.'/.env')){
//     $dotenv = Dotenv::createImmutable($secont_path);
// }
else{
    throw new Exception('file not found');
}
$dotenv->load();
$dotenv->safeLoad();
?>