<?php
date_default_timezone_set("UTC");
require_once __DIR__.'/../use.php'; 
class Base{
    public $host = 'localhost';
    protected $db;
    protected $username;
    private $password;
    
    public function __construct($db, $username, $password){
        $this->db = $db;
        $this->username = $username;
        $this->password  = $password;
    }

    public function connect(){
        try{
            return new PDO("mysql:host=$this->host; dbname=$this->db; charset=utf8mb4",
            $this->username, $this->password, [
                PDO::ATTR_ERRMODE=> PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE=>PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES=> false
            ]);
        }catch(PDOException $e){
            throw new Exception('Connection Failed'. $e->getMessage());
        }
    }

    public function query($query,$execute){
        $pdo = $this->connect();
        $stmt = $pdo->prepare($query);
        $stmt->execute($execute);
    }
}
$class =new Base($_ENV['TO_DO_MYSQL_DB'],$_ENV['TO_DO_MYSQL_USERNAME'],$_ENV['TO_DO_MYSQL_PASS']);
// new Base('to_do_list','root','');
?>