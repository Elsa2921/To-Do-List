<?php
require_once __DIR__ .'/../base/base.php';


function googleAuthChecker($email){
    global $class;
    $pdo = $class->connect();
    $stmt = $pdo->prepare("SELECT id,theme,type,username 
    FROM users 
    WHERE email=:email");
    $stmt->execute([':email'=>$email]);
    $flag = false;
    if($stmt->rowCount()>0){
        $flag = $stmt->fetch();
            
    }

    return $flag;
}

function AuthChecker($email,$password){
    global $class;
    $pdo = $class->connect();
    $stmt = $pdo->prepare("SELECT id,theme,password,type 
    FROM users 
    WHERE email=:email");
    $stmt->execute([':email'=>$email]);
    $flag = false;
    if($stmt->rowCount()>0){
        $data = $stmt->fetch();
        if($data['type']==2){
            $f = verified_checker($email);
            if($f===5){
                $flag = 5;
            }
            else{
                if(password_verify($password, $data['password'])){
                    $flag = $f;
                }
                else{
                    $flag = 2;
                }
            }
           
        }
        else{
            $flag = 3;
        }
        
        
 
    }

    return $flag;
}

function verified_checker($email){
    global $class;
    $pdo = $class->connect();
    $stmt = $pdo->prepare("SELECT id,theme,password,verified,username 
    FROM users 
    WHERE email=:email 
        AND verified=:v");
    $stmt->execute([':email'=>$email,':v'=>1]);
    $flag = 5;
    if($stmt->rowCount()>0){
        $flag = $stmt->fetch();
 
    }

    return $flag;
}

function usernameAuthChecker($username){
    global $class;
    $pdo = $class->connect();
    $stmt = $pdo->prepare("SELECT id,theme,password FROM users WHERE username=:username");
    $stmt->execute([':username'=>$username]);
    $flag = false;
    if($stmt->rowCount()>0){
        $flag = true;
 
    }

    return $flag;
    
}




function emailChecker($email){
    global $class;
    $pdo = $class->connect();
    $stmt = $pdo->prepare("SELECT type  
    FROM users 
    WHERE email=:email");
    $stmt->execute([':email'=>$email]);
    $flag = false;
    if($stmt->rowCount()>0){
        $flag = $stmt->fetchColumn();
 
    }

    return $flag;
}




function tokenChecker($email){
    global $class;
    $pdo = $class->connect();
    $stmt = $pdo->prepare("SELECT token 
    FROM users 
    WHERE email=:email");
    $stmt->execute([':email'=>$email]);
    $flag = false;
    if($stmt->rowCount()>0){
        $token = $stmt->fetchColumn();
        if($token==='0'){
            $flag = true;
        }
        else{
            $flag = 2;
        }
    }

    return $flag;
    
}


?>