<?php
require_once __DIR__ .'/../base/base.php';


function getProjects($id){
    global $class;
    $pdo  = $class->connect();
    $stmt = $pdo->prepare("SELECT 
    tn.id,
    tn.name,
    tn.deadline 
    FROM team_task_name AS tn
    INNER JOIN users AS u
        ON u.id = tn.user_id 
    WHERE u.id=:user_id 
        AND deadline>=CURDATE()");

    $stmt->execute([':user_id'=>$id]);
    return $stmt->fetchAll();
}
function reload_check($id){
    global $class;
    $pdo = $class->connect();
    $stmt = $pdo->prepare("SELECT email,username,theme,type 
    FROM users 
    WHERE id=:id");
    $stmt->execute([':id'=>$id]);
    $flag  = false;
    if($stmt->rowCount()>0){
        $flag = $stmt->fetch(PDO::FETCH_ASSOC);

    }
    return $flag;
}


function homeReloadSelect($id){
    global $class;
    $pdo = $class->connect();
    $stmt = $pdo->prepare("SELECT c.id AS category_id, 
    c.category FROM categories AS c
    INNER JOIN users AS u
    ON u.id = c.user_id
    WHERE u.id = :user_id
    ");
    $stmt->execute([':user_id'=>$id]);
    $flag  = [];
    if($stmt->rowCount()>0){
        $flag = $stmt->fetchAll();

    }
    return $flag;
}





function getTasks($category,$user_id){
    global $class;
    $pdo = $class->connect();
    $stmt = $pdo->prepare("SELECT 
        t.id, 
        t.task
        FROM tasks AS t
        INNER JOIN categories AS c 
            ON c.id = t.category_id 
        INNER JOIN users AS  u 
            ON u.id = c.user_id
        WHERE  t.category_id=:category 
            AND u.id = :user_id");
    $stmt->execute([':category'=>$category,':user_id'=>$user_id]);
    $flag  = [];
    if($stmt->rowCount()>0){
        $data = $stmt->fetchAll();
        // $flag = $data;
        $flag = sortTasks($data,$user_id);

    }
    return $flag;
}



function sortTasks($data,$user_id){
    global $class;
    $pdo = $class->connect();
    $date = date('Y-m-d');
    $done = [];
    $remaining = [];
    $result = [];
    
    $stmt = $pdo->prepare("SELECT
    dt.task_id
     FROM done_tasks AS dt
     INNER JOIN tasks AS t
        ON t.id = dt.task_id
     INNER JOIN categories AS c 
        ON t.category_id = c.id
     INNER JOIN users AS u
        ON u.id = c.user_id
      WHERE date=:date 
      AND u.id = :user_id");


    $stmt->execute([
        ':date'    => $date,
        ':user_id' => $user_id
    ]);

    $result['done'] = [];
    $result['tasks'] = [];
    $fetch = $stmt->fetchAll(PDO::FETCH_COLUMN);
    $doneTaskIds = array_flip($fetch);
    foreach($data as $key=>$value){
        if(isset($doneTaskIds[$value['id']])){
            $result['done'][] = $value;
        }
        else{
            $result['tasks'][] = $value;
        }
    }
    return $result;
}

function getComletedTasks($id){
    global $class;
    $pdo = $class->connect();
    $stmt = $pdo->prepare("SELECT date FROM done_tasks AS dt
    INNER JOIN tasks AS t
        ON t.id = dt.task_id
    INNER JOIN categories AS c
        ON c.id = t.category_id
    INNER JOIN users AS u
        ON c.user_id = u.id
    WHERE u.id=:user_id");
    $stmt->execute([':user_id'=>$id]);
    $flag = $stmt->rowCount();
    return $flag;
}


function getComletedTasksToday($id){
    global $class;
    $pdo = $class->connect();
    $date = date('Y-m-d');
    $stmt = $pdo->prepare("SELECT date FROM done_tasks AS dt
    INNER JOIN tasks AS t
        ON t.id = dt.task_id
    INNER JOIN categories AS c
        ON c.id = t.category_id
    INNER JOIN users AS u
        ON c.user_id = u.id
    WHERE u.id=:user_id 
        AND date=:date");
    $stmt->execute([':user_id'=>$id,':date'=>$date]);
    $flag = $stmt->rowCount();
    return $flag;
}


function getComletedTasks7($id){
    global $class;
    $pdo = $class->connect();
    $start = date('Y-m-d',strtotime('-6 days'));
    $end = date('Y-m-d');
    
    $stmt = $pdo->prepare("SELECT date, COUNT(*) as total FROM done_tasks  AS dt
    INNER JOIN tasks AS t
        ON t.id = dt.task_id
    INNER JOIN categories AS c
        ON c.id = t.category_id
    INNER JOIN users AS u
        ON c.user_id = u.id
    WHERE u.id=:user_id 
        AND date BETWEEN :start
        AND :end GROUP BY date");
    $stmt->execute([':user_id'=>$id,':start'=>$start, ':end'=>$end]);
    $flag = $stmt->fetchAll();
    return $flag;
}


function getMyTeamTasks($id){
    global $class;
    $pdo = $class->connect();
    $stmt = $pdo->prepare("SELECT 
    tm.id ,
    u.username AS creator_username,
    tn.name AS p_name,
    tn.deadline AS project_deadline
    FROM team_members AS tm
    INNER JOIN team_task_name AS tn 
        ON tn.id = tm.project_id
    INNER JOIN users AS u
        ON u.id = tn.user_id

    WHERE tm.user_id=:member_id
     ");
    $stmt->execute([':member_id'=>$id]);
    return $stmt->fetchAll();
}
?>