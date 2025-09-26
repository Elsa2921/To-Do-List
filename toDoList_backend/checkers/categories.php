<?php
require_once __DIR__ .'/../base/base.php';

function categoryChecker($id,$category){
    global $class;
    $pdo  = $class->connect();   
    $stmt = $pdo->prepare("SELECT id,category FROM categories 
    WHERE user_id=:user_id 
        AND category=:category");
    $stmt->execute([':user_id'=>$id, ':category'=>$category]);
    $flag = false;
    if($stmt->rowCount()>0){
        $flag = true;
    }
    return $flag; 
}
function getCategories_($id){
    global $class;
    $pdo  = $class->connect();
    $stmt = $pdo->prepare("SELECT id,category 
    FROM categories 
    WHERE user_id=:user_id");
    $stmt->execute([':user_id'=>$id]);
    $flag = [];
    if($stmt->rowCount()>0){
        $flag = $stmt->fetchAll();
    }
    return $flag;
}
?>