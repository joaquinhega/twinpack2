<?php
//conexion
include_once '../php/conexion1.php';
include_once 'cors.php';

$conexionPDO= new PDO("mysql:host=$servidor;dbname=$bd;charset=UTF8",$usuario,$clave);
session_start();

$ordenes = $_POST['Ordenes'];
$ordenes_array = json_decode($ordenes,true,512, JSON_OBJECT_AS_ARRAY);

$count_success = 0;
$count_errors = 0;

$response = array();
$logData = array(); 

for($z=0;$z<count($ordenes_array);$z++){
    $id = $ordenes_array[$z]["id"];
    $cliente = $ordenes_array[$z]["cliente"];
    $proveedor = $ordenes_array[$z]["proveedor"];

    $sql1="UPDATE ORDEN SET recibida = 1 WHERE id='$id'";

    $ejecucionSQL1= $conexionPDO->prepare($sql1); 
    if ($ejecucionSQL1 ->execute()){
        $count_success ++;
    }
    else{;
        $count_errors ++;
    }

    $items= array();
    $items_fechas= array();
    $sql="SELECT id, fecha_solicitud FROM ORDENES WHERE orden_id = $id";
    $ejecucionSQL= $conexionPDO->prepare($sql); 
    $ejecucionSQL ->execute();
    while($filaPDO=$ejecucionSQL->fetch(PDO::FETCH_ASSOC)){
        array_push($items, $filaPDO['id']);
        array_push($items_fechas, $filaPDO['fecha_solicitud']);
    }

    for($x=0;$x<count($items);$x++){
        $id_item = $items[$x];
        $fecha_item = $items_fechas[$x];
        $sql2="INSERT INTO SEGUIMIENTOS (orden_id, visible, estado_id ,fecha, fecha_entrega) VALUES ($id_item,1,1,(SELECT CURDATE()),'$fecha_item')";
        $ejecucionSQL2= $conexionPDO->prepare($sql2); 
        $ejecucionSQL2 ->execute();
    }
}

$text ="";
if($count_success>0){
    if($count_success == 1){
        $response['status'] = 'success';
        $response['message'] = 'Solicitud recibida correctamente';
        $text .= "1 registro guardado correctamente. ";
    } else {
        $text .= $count_success." registros guardados correctamente. ";
    }
}
if ($count_errors>0){
    if($count_errors == 1){
        $text .= "Falló el guardado de 1 registro. ";
    } else {
        $text .= $text += "Falló el guardado de ".$count_errors." registros. ";
    }
}
echo $text;

$response['logs'] = $logData;
echo json_encode($response);
echo json_encode("ID: ", $id);
$conexionPDO = null;
$sql1 = null;
$sql2 = null;

die();
?>