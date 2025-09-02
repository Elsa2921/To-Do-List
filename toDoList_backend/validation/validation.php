<?php
require_once __DIR__ .'/../base/base.php';

function getToken($uri){
    $parts = explode('/',$uri);
    $last = count($parts)-1;
    $token = $parts[$last];
    verifyToken($token);
    
}


function verifyToken($token){
    global $class;
    $date = date('Y-m-d H:i:s');
    $class->query("UPDATE users SET verified=:v,token=:t,exp_date=:e WHERE token=:token AND exp_date>:date",
[':v'=>1,':t'=>0,':e'=>NULL,':token'=>$token,':date'=>$date]);
}

?>