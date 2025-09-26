<?php
require_once __DIR__ .'/../checkers/auth.php';
require_once __DIR__ . '/../mail/mail.php';
require_once "categories.php";
$json = json_decode(file_get_contents(__DIR__.'/../categories.json'),true);






function googleAuth($token){
    $client = new Google_Client(['client_id'=> $_ENV['GOOGLE_CLIENT_ID']]);
    $payload = $client->verifyIdToken($token);
    if($payload){
        $checker = googleAuthChecker($payload['email']);
        if($checker){
            if($checker['type']=='1'){
                makeSession($checker['id'],$checker['username'],$payload['email'],$checker['theme'],1);
                echo json_encode(['status'=>200, 'email'=>$payload['email']]);
                    
            }
            else{
                echo json_encode(['error'=>'your account is not a google account!']);
            }
            
            
        }
        else{
            global $class;
            global $json;
            $pdo = $class->connect();
            $username = usernameGenerator($pdo);
            $stmt =$pdo->prepare("INSERT INTO users (email, type,username) 
            VALUES (:email, :type,:username)");
            $stmt->execute([':email'=>$payload['email'], ':type'=>1,':username'=>$username]);
            $id = $pdo->lastInsertId();
            addCategories($id,$json);            
            makeSession($id,$username,$payload['email'],1,1);
            echo json_encode(['status'=>200, 'email'=>$payload['email']]);
        }
    }
    else{
        echo json_encode(['error'=>'token not verified']);
    }
}

function usernameGenerator($pdo){
    do{
        $username = 'user_' . substr(str_shuffle('abcdefjhijklmnopqrstuvwxyzgrhjuwqwcvkureewv'),0,7);
        $stmt = $pdo->prepare("SELECT COUNT(*) FROM users WHERE username= ?");
        $stmt->execute([$username]);
        
        $exists = $stmt->fetchColumn();
    }
    while($exists);

    return $username;
}

function makeSession($id,$username,$email,$theme,$type){
    $_SESSION['toDo_id']= $id;
    $_SESSION['toDo_username'] = $username;
    $_SESSION['toDo_email'] = $email;
    $_SESSION['toDo_theme'] = $theme;
    $_SESSION['toDo_type'] = $type;
}
function login($password,$email){
    $checker = AuthChecker($email,$password);
    if($checker){
        if($checker===2){
            echo json_encode(['error'=>'wrong pass']);
        }
        elseif($checker===3){
            echo json_encode(['error'=>'your account is not an email account, try something else!!']);
        }
        elseif($checker===5){
            echo json_encode(['error'=>'email not verified!!']);
        }
        else{

            makeSession($checker['id'],$checker['username'],$email,$checker['theme'],2);
            echo json_encode(['status'=>200, 'email'=>$email]);
            
        }
    }
    else{
        
        echo json_encode(['error'=>"account does'nt exist"]);
    }
}

function emailFilter($email){
    $f = false;
    if(filter_var($email,FILTER_VALIDATE_EMAIL)){
        $f = true;
    }
    return $f;
    
}
function signUp($username, $password,$email){
    $filter =emailFilter($email);
    if($filter){    
        $emailChecker = emailChecker($email);
        if($emailChecker){
            echo json_encode(['error'=>'acount exists with this email']);
        }
        else{
            $checker = usernameAuthChecker($username);
            if($checker){
                echo json_encode(['error'=>'username taken']);
        
            }
            else{
                global $class;
                global $json;
                $token = createToken();
                $expDate = add_expDate();
                $pdo = $class->connect();
                $hash = password_hash($password,PASSWORD_BCRYPT);
                $stmt =$pdo->prepare("INSERT INTO users 
                (username, password, type,email, token, verified, exp_date) 
                VALUES (:username, :password, :type, :email, :token, :verified, :exp_date)");
                $stmt->execute([
                    ':username'=>$username, 
                    ':password'=>$hash, 
                    ':type'=>2,
                    ':email'=>$email,
                    ':token'=>$token,
                    ':verified'=>0,
                    ':exp_date'=>$expDate]);
                $id = $pdo->lastInsertId();
                mailer($token,$email,$_ENV['TO_DO_EMAIL']);
                addCategories($id,$json);
                echo json_encode(['status'=>200, 'username'=>$username]);
            }
        
        }
    }
    else{
        echo json_encode(['error'=>'invalid email']); 
    }
}

function forgotPassword($email){
    global $class;
    $checker = emailChecker($email);
    if($checker){
        if($checker==2){
            $token = createToken();
            $expDate = add_expDate();
            $_SESSION['toDo_passChangeEmail'] = $email;
            $class->query("UPDATE users SET token=:token,exp_date=:exp_date
             WHERE email=:email",
        [':token'=>$token, ':email'=>$email, ':exp_date'=>$expDate]);
            mailer($token,$email,$_ENV['TO_DO_EMAIL']);
            echo json_encode(['status'=>200]);
        }
        else{
            echo json_encode(['error'=>'account was not created with email']);
        }
       
    }
    else{
        echo json_encode(['error'=>'account was not found']);
    }
    
}

function changePass($password){
    $email =  $_SESSION['toDo_passChangeEmail'] ?? '';
    if(!empty($email)){
        $checker=  tokenChecker($email);
        if($checker){
            if($checker===2){
                echo json_encode(['error'=>'email is not verified']);
            }
            else{
                $hash = password_hash($password,PASSWORD_BCRYPT);
                global $class;
                $class->query("UPDATE users SET password=:password WHERE email=:email",
            [':password'=>$hash,':email'=>$email]);
                echo json_encode(['status'=>200]);
            }
        }
        else{
            echo json_encode(['error'=>'account doesnt exist']);
        }
    }
    else{
        echo json_encode(['error'=>'try again']);
    }
}

function createToken(){
    return bin2hex(random_bytes(16));
}


function add_expDate(){
    return date('Y-m-d H:i:s',strtotime("+ 20 minutes"));
}



?>