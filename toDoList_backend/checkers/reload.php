<?php
require_once __DIR__ .'/../base/base.php';


function getProjects($id){
    global $class;
    $pdo  = $class->connect();
    $stmt = $pdo->prepare("SELECT id,name,deadline FROM team_task_name 
    WHERE user_id=:user_id AND deadline>=CURDATE()");
    $stmt->execute([':user_id'=>$id]);
    return $stmt->fetchAll();
}
function reload_check($id){
    global $class;
    $pdo = $class->connect();
    $stmt = $pdo->prepare("SELECT email,username,theme,type FROM users WHERE id=:id");
    $stmt->execute([':id'=>$id]);
    $flag  = false;
    if($stmt->rowCount()>0){
        $flag = $stmt->fetch(PDO::FETCH_ASSOC);

    }
    return $flag;
}
// print_r(homeReloadSelect(13));
function homeReloadSelect($id){
    global $class;
    $pdo = $class->connect();
    $stmt = $pdo->prepare("SELECT id,categorie FROM categories WHERE user_id=:user_id");
    $stmt->execute([':user_id'=>$id]);
    $flag  = [];
    if($stmt->rowCount()>0){
        $flag = $stmt->fetchAll();

    }
    return $flag;
}





function getTasks($category,$id){
    global $class;
    $pdo = $class->connect();
    $stmt = $pdo->prepare("SELECT id,task FROM tasks WHERE user_id=:user_id AND category=:category");
    $stmt->execute([':user_id'=>$id, ':category'=>$category]);
    $flag  = [];
    if($stmt->rowCount()>0){
        $data = $stmt->fetchAll();
        $flag = sortTasks($data);

    }
    return $flag;
}



function sortTasks($data){
    global $class;
    $pdo = $class->connect();
    $date = date('Y-m-d');
    $done = [];
    $result = [];
    $stmt = $pdo->prepare("SELECT * FROM done_tasks WHERE task_id=:id AND date=:date");
    foreach($data as $key=>$value){
        $stmt->execute([':id'=>$value['id'], ':date'=>$date]);
        if($stmt->rowCount()>0){
            $done[] = $value;
            unset($data[$key]);
        }
    }
    $result['tasks'] = array_values($data);
    $result['done'] = array_values($done);
    return $result;
}

function getComletedTasks($id){
    global $class;
    $pdo = $class->connect();
    $stmt = $pdo->prepare("SELECT date FROM done_tasks WHERE user_id=:user_id");
    $stmt->execute([':user_id'=>$id]);
    $flag = $stmt->rowCount();
    return $flag;
}


function getComletedTasksToday($id){
    global $class;
    $pdo = $class->connect();
    $date = date('Y-m-d');
    $stmt = $pdo->prepare("SELECT date FROM done_tasks WHERE user_id=:user_id AND date=:date");
    $stmt->execute([':user_id'=>$id,':date'=>$date]);
    $flag = $stmt->rowCount();
    return $flag;
}


function getComletedTasks7($id){
    global $class;
    $pdo = $class->connect();
    $start = date('Y-m-d',strtotime('-6 days'));
    $end = date('Y-m-d');
    
    $stmt = $pdo->prepare("SELECT date, COUNT(*) as total FROM done_tasks WHERE 
    user_id=:user_id AND date BETWEEN :start
     AND :end GROUP BY date");
    $stmt->execute([':user_id'=>$id,':start'=>$start, ':end'=>$end]);
    $flag = $stmt->fetchAll();
    return $flag;
}


function getMyTeamTasks($id){
    global $class;
    $pdo = $class->connect();
    $stmt = $pdo->prepare("SELECT * FROM team_members WHERE member_id=:member_id");
    $stmt->execute([':member_id'=>$id]);
    return $stmt->fetchAll();
}


function getTeamTaskNames($projects){
    global $class;
    $pdo = $class->connect();
    $date = date("Y-m-d");
    $stmt = $pdo->prepare("SELECT * FROM team_task_name WHERE id=:id");
    foreach($projects as &$value){
        $stmt->execute([':id'=>$value['project_id']]);
        $data = $stmt->fetch();
        $value['p_name'] = $data['name'];
        $value['c_user_id'] = $data['user_id'];
        $value['project_deadline'] = $data['deadline'];
    }

    return $projects;
}


function getProjectCreatorName($data){
    global $class;
    $pdo=  $class->connect();
    $stmt = $pdo->prepare("SELECT username FROM users WHERE id=:id");
    foreach($data as &$value){
        $stmt->execute([':id'=>$value['c_user_id']]);
        $d = $stmt->fetchColumn();
        $value['creator_username'] = $d;
        unset($value['c_user_id']);
        unset($value['project_id']);
        unset($value['member_id']);
    }

    return $data;
}
?>