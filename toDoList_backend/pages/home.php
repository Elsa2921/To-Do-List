<?php
function deleteAccount(){
    $id = $_SESSION['toDo_id'] ?? '';
    $email = $_SESSION['toDo_email'] ?? '';
    if(!empty($id) and !empty($email)){
        global $class;
        $class->query("DELETE FROM users WHERE id=:id AND email=:email",
    [':id'=>$id, ':email'=>$email]);
        $class->query("DELETE FROM categories WHERE user_id=:id",
    [':id'=>$id]);
        $class->query("DELETE FROM done_tasks WHERE user_id=:id",
    [':id'=>$id]);
    $class->query("DELETE FROM tasks WHERE user_id=:id",
    [':id'=>$id]);
    $class->query("DELETE FROM team_task_name WHERE user_id=:id",
    [':id'=>$id]);
    $class->query("DELETE FROM team_members WHERE member_id=:id",
    [':id'=>$id]);
        session_destroy();
    }
}


function addTask($task,$category){
    $id = $_SESSION['toDo_id'] ?? '';
    if(!empty($id)){
        global $class;
        $class->query("INSERT INTO tasks (user_id,category,task) 
        VALUES (:user_id, :category, :task)",
    [':user_id'=>$id, ':category'=>$category, ':task'=>$task]);
        echo json_encode(['message'=>"ok"]);
    }
    else{
        echo json_encode(['error'=>"you can't add a task without an account"]);
    }
}



function editTask($text,$id){
    if(!empty($text) and  strlen($text)!==0){
        global $class;
        $class->query("UPDATE tasks SET task=:task WHERE id=:id",
    [':task'=>$text, ':id'=>$id]);
    }
    
    echo json_encode(['messege'=>'ok']);

}


function deleteTask($id){
    global $class;
        $class->query("DELETE FROM tasks WHERE id=:id",
    [':id'=>$id]);
    echo json_encode(['messege'=>'ok']);
}

function checkTask($id,$check){
    $u_id = $_SESSION['toDo_id'] ?? '';
    if(!empty($u_id)){
        global $class;
        $date = date('Y-m-d');
        if(!$check){
            $class->query("DELETE FROM done_tasks WHERE task_id=:task_id AND date = :date",
        [':task_id'=>$id, ':date'=>$date]);
        }
        else{
            $class->query("INSERT INTO done_tasks (user_id,task_id,date) VALUES (:user_id,:task_id, :date)",
        [':user_id'=>$u_id, ':task_id'=>$id, ':date'=>$date]);
        }
            
        echo json_encode(['messege'=>'ok']);
    }
    else{
        echo json_encode(['error'=>'ok']);
    }
    
}
?>