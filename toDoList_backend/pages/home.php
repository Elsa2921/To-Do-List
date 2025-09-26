<?php
require_once __DIR__ . '/../checkers/home.php';


function deleteAccount(){
    $id = $_SESSION['toDo_id'] ?? '';
    $email = $_SESSION['toDo_email'] ?? '';
    if(!empty($id) and !empty($email)){
        global $class;

        $class->query("DELETE FROM users WHERE id=:id AND email=:email",
    [':id'=>$id, ':email'=>$email]);
        session_destroy();
    }
}


function addTask($task,$category){
    $id = $_SESSION['toDo_id'] ?? '';
    if(!empty($id)){
        global $class;
        $class->query("INSERT INTO tasks (category_id,task) 
        SELECT c.id, :task FROM categories AS c
            INNER JOIN users AS u
                ON u.id = c.user_id
            WHERE c.id = :category
            AND u.id = :user_id
        ",
    [
        ':category'=>$category, 
        ':task'=>$task,
        ':user_id'=>$id
    ]);
        echo json_encode(['message'=>"ok"]);
        // }
    }
    else{
        echo json_encode(['error'=>"you can't add a task without an account"]);
    }
}



function editTask($text,$id){
    $user_id = $_SESSION['toDo_id'] ?? '';
    if(!empty($text) and  strlen($text)!==0 and !empty($user_id)){
        global $class;
        $class->query("UPDATE tasks AS t
        INNER JOIN categories AS c
            ON c.id = t.category_id
        SET t.task=:task 
        WHERE t.id=:id
            AND c.user_id = :user_id",
    [
        ':task'    => $text, 
        ':id'      => $id,
        ':user_id' => $user_id
    ]);
    }
    
    echo json_encode(['messege'=>'ok']);

}


function deleteTask($id){
    $user_id = $_SESSION['toDo_id'] ?? '';
    if(!empty($user_id)){
        global $class;
        $class->query("DELETE t FROM tasks AS t
        INNER JOIN categories AS c
            ON c.id = t.category_id
        INNER JOIN users AS u
            ON u.id = c.user_id
        WHERE t.id=:id
            AND u.id = :user_id",
    [':id'=>$id,
     ':user_id'=>$user_id]);
    }
    
    echo json_encode(['messege'=>'ok']);
}

function checkTask($id,$check){
    $u_id = $_SESSION['toDo_id'] ?? '';
    if(!empty($u_id)){
        global $class;
        $date = date('Y-m-d');
        if(!$check){
            $class->query("DELETE dt FROM done_tasks AS dt
            INNER JOIN tasks AS t 
                ON t.id = dt.task_id
            INNER JOIN categories AS c
                ON t.category_id = c.id
            INNER JOIN users AS u 
                ON u.id = c.user_id
            WHERE dt.task_id=:task_id 
                AND dt.date = :date
                AND c.user_id = :user_id
                ",
        [
            ':task_id'=>$id, 
            ':date'=>$date,
            ':user_id'=> $u_id
        ]);
        }
        else{
            $class->query("INSERT INTO done_tasks (task_id, date)
            SELECT t.id, :date
            FROM tasks AS t
            INNER JOIN categories AS c
                ON t.category_id = c.id
            INNER JOIN users AS u
                ON u.id = c.user_id
            WHERE t.id = :task_id
            AND u.id = :user_id
            ", [
            ':task_id' => $id,
            ':date'    => $date,
            ':user_id' => $u_id
        ]);

        }
            
        echo json_encode(['messege'=>'ok']);
    }
    else{
        echo json_encode(['error'=>'ok']);
    }
    
}
?>