<?php
require_once __DIR__ .'/../base/base.php';
function project_name_checker($id,$name){
    global $class;
    $pdo = $class->connect();
    $stmt = $pdo->prepare("SELECT * FROM team_task_name
     WHERE user_id=:user_id 
     AND name=:name");
    $stmt->execute([':user_id'=>$id ,':name'=>$name]);
    $flag = false;
    if($stmt->rowCount()>0){
        $flag = true;
    }
    return $flag;
}


function getSearchUser($search,$project_id){
    global $class;
    $pdo = $class->connect();
    if($project_id){
        $stmt = $pdo->prepare("SELECT 
        u.id,
        u.username 
        FROM users AS u
        LEFT JOIN team_members AS tm 
        ON u.id = tm.user_id 
         AND tm.project_id = :p_id
        WHERE u.username LIKE :username
            AND  tm.user_id IS NULL LIMIT 5");
        $stmt->execute([':username'=>"%$search%", ':p_id'=>$project_id]);
    }
    else{
        $stmt = $pdo->prepare("SELECT 
        users.id,
        users.username 
        FROM users 
        WHERE username LIKE :username LIMIT 5");
        $stmt->execute([':username'=>"%$search%"]);
    }
    return $stmt->fetchAll();
}

function getAllMembers($id){
    $user_id = $_SESSION['toDo_id'] ?? '';
    if(!empty($user_id)){
        global $class;
        $pdo = $class->connect();
        $stmt = $pdo->prepare("SELECT 
            tm.id,
            u.username,
            tm.user_id
            FROM team_members  AS  tm
            INNER JOIN users AS u ON u.id = tm.user_id
            INNER JOIN team_task_name AS tt ON  tt.id = tm.project_id
            AND tt.user_id = :user_id
            WHERE tm.project_id = :project_id
        ");
        $stmt->execute(['project_id'=>$id, ':user_id'=>$user_id]);
        return $stmt->fetchAll();
    }
    
}



function getMemberTasks($id){
    $user_id = $_SESSION['toDo_id'] ?? '';
    $flag = false;
    if(!empty($user_id)){
        global $class;
        $pdo = $class->connect();
        $stmt= $pdo->prepare("SELECT 
        tt.id,
        u.username,
        tt.task,
        tt.deadline,
        tt.done_date,
        tt.status
        FROM team_members AS tm
        INNER JOIN users AS u  
            ON u.id = tm.user_id
        INNER JOIN team_tasks AS tt  
            ON tt.team_member_id = tm.id
        INNER JOIN team_task_name AS tn 
            ON  tn.id = tm.project_id
        WHERE tm.project_id=:p_id 
            AND tn.user_id = :user_id 
        ORDER BY tt.deadline");
        $stmt->execute([':p_id'=>$id, ':user_id'=>$user_id]);
        $flag = $stmt->fetchAll();
       
    }
    return $flag;
}


function getMyTaskNames($id,$user_id){
    global $class;
    $pdo = $class->connect();
    $stmt = $pdo->prepare("SELECT
     tt.id,
     tt.task,
     tt.deadline,
     tt.done_date,
     tt.status 
    FROM team_tasks AS tt
    INNER JOIN team_members AS tm 
        ON tm.id = tt.team_member_id
    WHERE tt.team_member_id=:id 
        AND tm.user_id = :user_id
    ORDER BY tt.deadline");
    $stmt->execute([
        ':id'=>$id,
        ':user_id'=>$user_id]);
    return $stmt->fetchAll();
}


?>