<?php
require_once __DIR__ . '/../checkers/reload.php';

function reload_(){
    $id = $_SESSION['toDo_id'] ?? '';
    $email = $_SESSION['toDo_email'] ?? '';
    $username = $_SESSION['toDo_username'] ?? '';
    $type = $_SESSION['toDo_type'] ?? '';
    if(!empty($id) and !empty($email) and !empty($type)){
        $checker = reload_check($id);
        if($checker){
            if($checker['type']==$type){
                if($checker['email']==$email){
                    echo json_encode(['status'=>200, 'profile'=>['username'=>$username,'email'=>$email, 'theme'=>$checker['theme']]]);
                }
                else{
                    echo json_encode(['status'=>200, 'profile'=>false]);
                }
            }
            else{
                echo json_encode(['status'=>200, 'profile'=>false]);
            }
        }
        else{
            echo json_encode(['status'=>200, 'profile'=>false]);
        }
    }
    else{
        echo json_encode(['status'=>200, 'profile'=>false]);
    }
}




function homeReload($category){
    $id = $_SESSION['toDo_id'] ?? '';
    if(!empty($id)){
        $select = homeReloadSelect($id);
        $c_data = [];
        if(!empty($category)){
           $c_data =  getTasks($category,$id);
        }
        else{
            // $category = homeReloadSelect($id);
            $c_data =  getTasks($select[0]['categorie'],$id);
        }
        echo json_encode(['status'=>200, 'categories'=>$select,$c_data]);
    }
    else{

        echo json_encode(['status'=>200, 'categories'=>[]]);
    }

   
}


function profileReload(){
    $id = $_SESSION['toDo_id'] ?? '';
    $email = $_SESSION['toDo_email'] ?? '';
    $username = $_SESSION['toDo_username'] ?? '';
    $type = $_SESSION['toDo_type'] ?? '';
    if(!empty($id) and !empty($username) and !empty($email) and !empty($type)){
        $checker = reload_check($id);
        if($checker){
            if($checker['type']==$type){
                if($checker['email']==$email && $checker['username']==$username){
                    $all = getComletedTasks($id);
                    $today = getComletedTasksToday($id);
                    $seven = getComletedTasks7($id);
                    $days = [];
                    for($i = 6; $i>=0; $i--){
                        $day = date('Y-m-d',strtotime("-$i days"));
                        $days[$day] = 0;
                    }
                    foreach($seven as $one){
                        $days[$one['date']] = (int) $one['total'];
                    } 
                    echo json_encode(['status'=>200, 
                        'profile'=>['username'=>$username,'email'=>$email],
                        'allCompletedTasks'=>$all,
                        'todayCompletedTasks'=>$today,
                        'graphic'=>$days
                    ]);

                        // session_destroy();
                    
                    
                }
                else{
                    echo json_encode(['status'=>200, 'profile'=>false]);
                }
            }
            else{
                echo json_encode(['status'=>200, 'profile'=>false]);
            }
        }
        else{
            echo json_encode(['status'=>200, 'profile'=>false]);
        }
    }
    else{
        echo json_encode(['status'=>200, 'profile'=>false]);
    }
}

function changeTheme($theme){
    $id = $_SESSION['toDo_id'] ?? '';
    if(!empty($id)){
        global $class;
        $class->query("UPDATE users SET theme=:theme WHERE id=:id",
    [':theme'=>$theme, ':id'=>$id]);
    }
}



function createProjectReload(){
    $id = $_SESSION['toDo_id'] ?? '';
    $projects = [];
    if(!empty($id)){
        $projects['projects'] = getProjects($id);
    }
    echo json_encode($projects);
}


function teamTasksReload(){
    $id = $_SESSION['toDo_id'] ?? '';
    $projects = [];
    if(!empty($id)){
        $projects['projects'] = getProjects($id);
    }
    echo json_encode($projects);
}


function pendingTaskReload(){
    $id = $_SESSION['toDo_id'] ?? '';
    $data = [];
    if(!empty($id)){
        $projects = getMyTeamTasks($id);
        $projects_name = getTeamTaskNames($projects);
        $creator_name = getProjectCreatorName($projects_name);
        $data['projects'] = $creator_name;
        
    }
    echo json_encode($data);
}
?>