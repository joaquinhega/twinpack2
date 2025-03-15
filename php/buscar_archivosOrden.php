<?php
    include_once 'cors.php';
    include_once '../php/conexion1.php';
    $conexionPDO= new PDO("mysql:host=$servidor;dbname=$bd;charset=UTF8",$usuario,$clave);
    session_start();
    
    $orden_id = $_POST['ID'];

    $items= array();
    $sql="SELECT * FROM ARCHIVOSORDEN WHERE orden_id = $orden_id ";
    $ejecucionSQL= $conexionPDO->prepare($sql); 
    $ejecucionSQL ->execute();
    while($filaPDO=$ejecucionSQL->fetch(PDO::FETCH_ASSOC)){
        $item=new stdClass();
        $item->name=$filaPDO['nombre'];
        array_push($items, $item);
    }
    echo json_encode($items);

$conexionPDO = null;
$sql1 = null;

die();
?>