<?php
    //conexion
    include_once '../php/conexion1.php';
    include_once 'cors.php';

    $conexionPDO= new PDO("mysql:host=$servidor;dbname=$bd;charset=UTF8",$usuario,$clave);
    session_start();

    $correo_actualizado = $_POST['email'];
    $token_actualizado_hash = password_hash($_POST['password'], PASSWORD_DEFAULT);
    $sql="SELECT * FROM items WHERE correo_actualizado='$correo_actualizado' AND token_actualizado='$token_actualizado_hash' LIMIT 1";
    $ejecucionSQL= $conexionPDO->prepare($sql); 
    $ejecucionSQL ->execute();
    $user = $ejecucionSQL->fetch();
    
    echo json_encode($user);

$conexionPDO = null;
$sql1 = null;

die();
?>