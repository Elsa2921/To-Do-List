<?php
require_once __DIR__ .'/../base/base.php';
function checkUserName($username){
    global $class;
    $pdo = $class->connect();
    $stmt = $pdo->prepare("SELECT * FROM users WHERE username = :username");
    $stmt->execute([':username'=>$username]);
    $flag = false;
    if($stmt->rowCount()>0){
        $flag = true;
    }
    return $flag;
}
?>