<?php
require_once __DIR__ .'/../checkers/profile.php';

function editUsername($username){
    $id = $_SESSION['toDo_id'] ?? '';
    if(!empty($id)){
        $checker = checkUserName($username);
        if($checker){
            echo json_encode(['error'=>'username exists']);
        }
        else{
            global $class;
            $class->query("UPDATE users SET username=:username WHERE id=:id",
        [':username'=>$username, ':id'=>$id]);
        $_SESSION['toDo_username'] = $username;
            echo json_encode(['status'=>200]);
            
        }
        
    }
    else{
        echo json_encode(['error'=>'something went wrong']);
    }

}
?>