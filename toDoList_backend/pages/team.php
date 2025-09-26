<?php
require_once __DIR__ ."/../checkers/teamProjects.php";
function createProject($name,$deadline){
    $id = $_SESSION['toDo_id'] ?? '';
    if(!empty($id)){
        $checker = project_name_checker($id,$name);
        if($checker){
            echo json_encode(['error'=>'project name exists']);

        }
        else{
            global $class;
            $class->query("INSERT INTO team_task_name (user_id, name ,deadline) 
            VALUES (:user_id, :name , :deadline)",
        [':user_id'=>$id, ':name'=>$name, ':deadline'=>$deadline]);
            echo json_encode(['status'=>200]);

        }
    }
    else{
        echo json_encode(['status'=>403]);
    }
}


function changeProjectDeadline($deadline,$id){
    $user_id = $_SESSION['toDo_id'] ?? '';
    if(!empty($user_id)){
        global $class;
        $class->query("UPDATE team_task_name
        SET deadline=:deadline 
        WHERE id=:id AND user_id = :user_id",
    [':deadline'=>$deadline, ':id'=>$id, ':user_id'=>$user_id]);
        echo json_encode(['o']);
    }
    
}


function searchUser($search,$id){
    $data = getSearchUser($search,$id);  
    echo json_encode(['searchRes'=>$data]);

}


function addTeamMember($member_id,$project_id){
    $user_id = $_SESSION['toDo_id'] ?? '';
    if(!empty($user_id)){
        global $class;
        $class->query("INSERT INTO team_members (project_id,user_id) 
        SELECT :p_id, :u_id FROM team_task_name AS tn
        
        WHERE tn.user_id = :user_id
        AND tn.id = :project_id",
    [
        ':p_id'=>$project_id,
        ':u_id'=>$member_id,
        ':user_id' => $user_id,
        ':project_id' => $project_id
    ]);
        echo json_encode(['o']);
    }
}


function getTeamMemebers($id){
    $data = getAllMembers($id);
    echo json_encode(['members'=>$data]);
}


function memberDelete($id){
    $user_id = $_SESSION['toDo_id'] ?? '';
    if(!empty($user_id)){
        global $class;
        $class->query("DELETE tm FROM team_members AS tm
        INNER JOIN team_task_name AS tn 
            ON tn.id = tm.project_id
        WHERE tm.id=:id
            AND tn.user_id = :user_id
        "
        ,[':id'=>$id, ':user_id'=>$user_id]);
        echo json_encode(['o']);
    }
    
    
}

function getTaskInfo($id){
    $data = getAllMembers($id);

    

    echo json_encode(['members'=>$data]);
}

function getProjectMTasks($id){
    $tasks = getMemberTasks($id);
    // $data = [];
    $data['tasks'] = [];
    $data['done_tasks'] = [];
    foreach($tasks as &$value){
        if(!$value['status']){
            unset($value['done_date']); 
            $data['tasks'][] = $value;
            
        }
        if($value['status']){
            $data['done_tasks'][] = $value;

        }
    }
    echo json_encode($data);

}

function createProjectTask($task,$deadline,$memberId,$projectId){
    $user_id = $_SESSION['toDo_id'] ?? '';
    if(!empty($user_id)){
        global $class;
        $class->query("INSERT INTO team_tasks 
        (task,team_member_id,deadline) 
        SELECT :task, :member_id, :deadline
        FROM team_members AS tm
        INNER JOIN team_task_name AS tn
            ON tn.id = tm.project_id
        WHERE tn.user_id = :user_id 
            AND tm.project_id = :project_id
            AND tm.id = :team_member_id
        ",
        [ ':task'=>$task,
         ':member_id'=>$memberId,
          ':deadline'=>$deadline,
          ':project_id' =>$projectId,
          ':team_member_id'=>$memberId,
          ':user_id' => $user_id
        ]);

    }
    
}


function deleteProjectTask($id){
    $user_id = $_SESSION['toDo_id'] ?? '';
    if(!empty($user_id)){
        global $class;
        $class->query("DELETE tt 
        FROM team_tasks AS tt
        INNER JOIN team_members AS tm 
            ON tm.id = tt.team_member_id
        INNER JOIN team_task_name AS tn 
            ON tm.project_id = tn.id
        WHERE tt.id=:id     
            AND tn.user_id = :user_id",
[':id'=>$id, ':user_id'=>$user_id]);
    }
    
}


function getMyTasks($id){
    $user_id = $_SESSION['toDo_id'] ?? '';
    $data = [];

    if(!empty($user_id)){
        $getTasks= getMyTaskNames($id,$user_id);
        $data['tasks'] = [];
        $data['done_tasks'] = [];
        foreach($getTasks as &$value){
            if(!$value['status']){
                $data['tasks'][] = $value;
                
            }
            if($value['status']){
                $data['done_tasks'][] = $value;
    
            }
        }
    }
    
    echo json_encode($data);

}

function checkPrTask($id,$check){
    $user_id = $_SESSION['toDo_id'] ?? '';
    if(!empty($user_id)){
        global $class;
        $date = date("Y-m-d");
        $class->query("UPDATE team_tasks AS tt
        INNER JOIN team_members AS tm
            ON tm.id = tt.team_member_id
        SET tt.status=:status,
        tt.done_date=:date
        WHERE tt.id=:id
            AND tm.user_id = :user_id",
    [
        ':status'=>$check,
        ':date'=>$date,
        ':id'=>$id,
        ':user_id'=>$user_id
        ]);
    }
}


function deleteProject($id){
    $user_id = $_SESSION['toDo_id'] ?? '';
    if(!empty($user_id)){
        global $class;
        $class->query("DELETE FROM team_task_name 
        WHERE id=:id 
        AND user_id=:user_id",
    [':id'=>$id, ':user_id'=>$user_id]);
    }
   
}
?>