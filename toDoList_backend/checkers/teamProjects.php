<?php
require_once __DIR__ .'/../base/base.php';
function project_name_checker($id,$name){
    global $class;
    $pdo = $class->connect();
    $stmt = $pdo->prepare("SELECT * FROM team_task_name WHERE user_id=:user_id AND name=:name");
    $stmt->execute([':user_id'=>$id ,':name'=>$name]);
    $flag = false;
    if($stmt->rowCount()>0){
        $flag = true;
    }
    return $flag;
}


function getSearchUser($search){
    global $class;
    $pdo = $class->connect();
    $stmt = $pdo->prepare("SELECT id,username FROM users WHERE username LIKE :username");
    $stmt->execute([':username'=>"%$search%"]);
    return $stmt->fetchAll();
}


function getMemebers($id){
    global $class;
    $pdo = $class->connect();
    $stmt = $pdo->prepare("SELECT id,member_id FROM team_members WHERE project_id=:project_id");
    $stmt->execute(['project_id'=>$id]);
    return $stmt->fetchAll();
}

function getMember($team_member_id){
    global $class;
    $pdo = $class->connect();
    $stmt = $pdo->prepare("SELECT id,member_id FROM team_members WHERE id=:id");
    $stmt->execute(['id'=>$team_member_id]);
    return $stmt->fetchAll();
}



function getMemberNames($data){
    global $class;
    $pdo = $class->connect();
    $stmt  = $pdo->prepare("SELECT username FROM users WHERE id=:id");
    foreach($data as &$value){
        $value['username'] = '';
        $stmt->execute(['id'=>$value['member_id']]);
        if($stmt->rowCount()>0){
            $username = $stmt->fetchColumn();
            $value['username'] = $username;
        }
    }
    return $data;
}


function getMemberTasks($id){
    global $class;
    $pdo = $class->connect();
    $stmt= $pdo->prepare("SELECT * FROM team_tasks WHERE project_id=:p_id ORDER BY deadline");
    $stmt->execute([':p_id'=>$id]);
    return $stmt->fetchAll();
}


function getMyTaskNames($id){
    global $class;
    $pdo = $class->connect();
    $stmt = $pdo->prepare("SELECT * FROM team_tasks WHERE team_member_id=:id ORDER BY deadline");
    $stmt->execute([':id'=>$id]);
    return $stmt->fetchAll();
}


?>