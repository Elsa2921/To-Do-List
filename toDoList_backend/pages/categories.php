<?php
require_once __DIR__ .'/../checkers/categories.php';
function checkCategory($category){
    $id = $_SESSION['toDo_id'] ?? '';
    if(!empty($id)){
        $checker = categoryChecker($id,$category);
        if($checker){
            echo json_encode(['error'=>'this category already existsg']);
        }
        else{
            addCategories($id,[['categorie'=>$category]]);
        }
        
    }
    else{
        echo json_encode(['error'=>"you can't add something without an account"]);
    }
}
function addCategories($id, $data){
    global $class;
    
    foreach($data as $element){
        
        $class->query("INSERT INTO categories (user_id, category) 
        VALUES (:user_id, :category)",
    [':user_id'=>$id, ':category'=>$element['categorie']]);
    }
}

function getCategories(){
    $id = $_SESSION['toDo_id'] ?? '';
    if(!empty($id)){
        $categories = getCategories_($id);
        echo json_encode($categories);
    }
}

function deleteCategory($id){
    $u_id = $_SESSION['toDo_id'] ?? '';
    if(!empty($u_id)){
        global $class;
        $class->query("DELETE FROM categories
        WHERE id=:id 
            AND user_id=:user_id",
    [':id'=>$id, ':user_id'=>$u_id]);
        echo json_encode(['status'=>200]);  
        
    }
    else{
        echo json_encode(['error'=>"you can't delete staff without an account"]);
    }
}
?>