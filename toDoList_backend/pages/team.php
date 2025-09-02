<?php
require_once __DIR__ ."/../checkers/teamProjects.php";
function createProject($name,$deadline){
    $id = $_SESSION['toDo_id'];
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
    global $class;
    $class->query("UPDATE team_task_name SET deadline=:deadline WHERE id=:id",
[':deadline'=>$deadline, ':id'=>$id]);
    echo json_encode(['o']);
}


function searchUser($search,$id){
    $data = getSearchUser($search);
    $members = getMemebers($id);
    if(!empty($members)){
        $data = array_filter($data, function($value) use ($members){
            foreach($members as $member){
                if($member['member_id'] == $value['id']){
                    return false;
                }
            }
            return true;
        });
        $data = array_values($data);
    }
    echo json_encode(['searchRes'=>$data]);

}


function addTeamMember($user_id,$id){
    global $class;
    $class->query("INSERT INTO team_members (project_id,member_id) VALUES (:p_id, :u_id)",
[':p_id'=>$id, ':u_id'=>$user_id]);
    echo json_encode(['o']);
}


function getTeamMemebers($id){
    $data = getMemebers($id);
    $get_names = getMemberNames($data);
    echo json_encode(['members'=>$get_names]);
}


function memberDelete($id){
    global $class;
    $class->query("DELETE FROM team_members WHERE id=:id",[':id'=>$id]);
    echo json_encode(['o']);
    
}

function getTaskInfo($id){
    $membersInfo = getMemebers($id);
    $get_names = getMemberNames($membersInfo);

    

    $data['members'] = $get_names;
    echo json_encode($data);
}

function getProjectMTasks($id){
    $get_tasks = getMemberTasks($id);
    foreach($get_tasks as &$value){
        $get_member = getMember($value['team_member_id']);
        $get_name = getMemberNames($get_member);
        $value['members'] = $get_name[0];
    }
    $data = [];
    $data['tasks'] = [];
    $data['done_tasks'] = [];
    foreach($get_tasks as &$value){
        if(!$value['status']){
            $data['tasks'][] = $value;
            
        }
        if($value['status']){
            $data['done_tasks'][] = $value;

        }
    }
    echo json_encode($data);

}

function createProjectTask($task,$deadline,$memberId,$projectId){
    global $class;
        $class->query("INSERT INTO team_tasks (project_id,task,team_member_id,deadline) 
        VALUES (:projectId, :task, :member_id, :deadline)",
        [':projectId'=>$projectId, ':task'=>$task, ':member_id'=>$memberId, ':deadline'=>$deadline]);

}


function deleteProjectTask($id){
    global $class;
    $class->query("DELETE FROM team_tasks WHERE id=:id",
[':id'=>$id]);
}


function getMyTasks($id){
    $getTasks= getMyTaskNames($id);
    $data = [];
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
    echo json_encode($data);

}


function checkPrTask($id,$check){
    global $class;
    $date = date("Y-m-d");
    $class->query("UPDATE team_tasks SET status=:status,done_date=:date WHERE id=:id",
[':status'=>$check,':date'=>$date, ':id'=>$id]);
}


function deleteProject($id){
    global $class;
    $class->query("DELETE FROM team_task_name WHERE id=:id",
[':id'=>$id]);
    $class->query("DELETE FROM team_tasks WHERE project_id=:id",
[':id'=>$id]);
    $class->query("DELETE FROM team_members WHERE project_id=:id",
[':id'=>$id]);
}
?>