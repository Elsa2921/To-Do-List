<?php
session_set_cookie_params([
    'lifetime' => 0,
    'path' => '/',
    'secure' => true,   // requires HTTPS
    'httponly' => true,
    'samesite' => 'None'
]);
session_start();

require_once  './pages/auth.php';
require_once './pages/reload.php';
require_once './pages/categories.php';
require_once './pages/home.php';
require_once './pages/team.php';
require_once './pages/profile.php';
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';

if (!empty($origin) and $origin==$_ENV['ALLOWED_ORIGINS']) {
    header("Access-Control-Allow-Origin: $origin");
    header("Access-Control-Allow-Credentials: true");
    header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
}

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit();
}

if($_SERVER["REQUEST_METHOD"]==="POST"){
    $post = json_decode(file_get_contents("php://input"),true);
    if(
        isset($post['googleToken'])){
        googleAuth($post['googleToken']);
    }
    elseif(
        isset($post['username']) 
        and isset($post['password'])
        and isset($post['email'])

        ){
       signUp($post['username'], $post['password'],$post['email']);
    }
    elseif(
        isset($post['password'])
        and isset($post['login'])
        and isset($post['email'])
    ){
        login( $post['password'],$post['email']);
    }
    elseif(isset($post['addCategory']) and !empty($post['addCategory'])){
        checkCategory($post['addCategory']);
    }
    elseif(isset($post['task']) and isset($post['category'])){
        addTask($post['task'],$post['category']);
    }
    elseif(
        isset($post['project_deadline'])
        and isset($post['project_name'])
        and isset($post['add_project'])
    ){
        createProject($post['project_name'],$post['project_deadline']);
    }
    elseif(
        isset($post['addTeamMember'])
        and isset($post['id'])
        ){
        addTeamMember($post['addTeamMember'],$post['id']);
    }
    elseif(
        isset($post['task'])
        and isset($post['deadline'])
        and isset($post['member'])
        and isset($post['projectId'])
    ){
        createProjectTask($post['task'],$post['deadline'],$post['member'],$post['projectId']);
    }
    else{
        http_response_code(403);
        exit();
    }
}
elseif($_SERVER["REQUEST_METHOD"] === 'GET'){

    if(isset($_GET["reload"])){
        reload_();
    }
    elseif(isset($_GET['categories'])){
        getCategories();
    }
    elseif(isset($_GET['homeReload']) and isset($_GET['category'])){
        homeReload($_GET['category']);
    }
    elseif(isset($_GET['profileReload'])){
        profileReload();
    }
    elseif(isset($_GET['createTeamReload'])){
        createProjectReload();
    }
    elseif(isset($_GET['searchUser']) and isset($_GET['id'])){
        searchUser($_GET['searchUser'],$_GET['id']);
    }
    elseif(isset($_GET['getTeamMembers'])){
        getTeamMemebers($_GET['getTeamMembers']);
    }
    elseif(isset($_GET['teamTasksReload'])){
        teamTasksReload();
    }
    elseif(isset($_GET['selectTeamMembers'])){
        getTaskInfo($_GET['selectTeamMembers']);
    }
    elseif(isset($_GET['getMemberTasks'])){
        getProjectMTasks($_GET['getMemberTasks']);
    }
    elseif(isset($_GET['pendingTaskReload'])){
        pendingTaskReload();
    }
    elseif(isset($_GET['getMyTasksId'])){
        getMyTasks($_GET['getMyTasksId']);
    }
    else{
        http_response_code(403);
        exit();
    }
}
elseif($_SERVER["REQUEST_METHOD"]=== "DELETE"){
    $delete = json_decode(file_get_contents('php://input'));
    if(isset($delete->categorie) and isset($delete->id) and !empty($delete->id)){
        deleteCategory($delete->id);
    }
    elseif(isset($delete->task) and isset($delete->id)){
        deleteTask($delete->id);
    }
    elseif(isset($delete->logout)){
        session_destroy();
        exit();
    }
    elseif(isset($delete->memberDelete)){
        memberDelete($delete->memberDelete);
    }
    elseif(isset($delete->deleteProjectTask)){
        deleteProjectTask($delete->deleteProjectTask);
    }
    elseif(isset($delete->deleteProjectId)){
        deleteProject($delete->deleteProjectId);
    }
    elseif(isset($delete->deleteAccount)){
        deleteAccount();
    }
    // else{
    //     http_response_code(403);
    // }
    
}
elseif($_SERVER["REQUEST_METHOD"]==="PUT"){
    $put = json_decode(file_get_contents('php://input'),true);
    if(isset($put['editTask']) and isset($put['id'])){
        editTask($put['editTask'],$put['id']);
    }
    elseif(isset($put['checkTask']) and isset($put['id'])){
        checkTask($put['id'], $put['checkTask']);
    }
    elseif(isset($put['theme'])){
        changeTheme($put['theme']);
    }
    elseif(
        isset($put['forgotpassword'])
        and isset($put['email'])
    ){
        forgotPassword($put['email']);
    }
    elseif(
        isset($put['change'])
        and isset($put['password'])
    ){
        changePass($put['password']);
    }
    elseif(
        isset($put['changeProjectDeadline'])
        and isset($put['id'])
    ){
        changeProjectDeadline($put['changeProjectDeadline'],$put['id']);
    }
    elseif(isset($put['checkPrTask']) and isset($put['id'])){
        checkPrTask($put['id'],$put['checkPrTask']);
    }
    elseif(isset($put['editUsername'])){
        editUsername($put['editUsername']);
    }
    else{
        http_response_code(403);
        exit();
    }
    
    // else{
    //     http_response_code(403);
    // }
}

// print_r($_SESSION);
?>