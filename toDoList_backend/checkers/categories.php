<?php
require_once __DIR__ .'/../base/base.php';

function categorieChecker($id,$category){
    global $class;
    $pdo  = $class->connect();   
    $stmt = $pdo->prepare("SELECT id,categorie FROM categories WHERE user_id=:user_id AND categorie=:category");
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
    $stmt = $pdo->prepare("SELECT id,categorie FROM categories WHERE user_id=:user_id");
    $stmt->execute([':user_id'=>$id]);
    $flag = [];
    if($stmt->rowCount()>0){
        $flag = $stmt->fetchAll();
    }
    return $flag;
}
?>