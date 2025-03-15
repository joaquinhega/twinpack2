<?php
    //conexion
    include_once 'cors.php';
    include_once '../php/conexion1.php';
    $conexionPDO= new PDO("mysql:host=$servidor;dbname=$bd;charset=UTF8",$usuario,$clave);
    session_start();

    $id = intval($_POST['ID']);
    $items= array();

    $sql="SELECT ESTADOS.estado, SEGUIMIENTOS.visible, SEGUIMIENTOS.fecha, SEGUIMIENTOS.fecha_entrega
    FROM ESTADOS
    LEFT JOIN SEGUIMIENTOS ON ESTADOS.id = SEGUIMIENTOS.estado_id AND SEGUIMIENTOS.orden_id = $id ";
    $ejecucionSQL= $conexionPDO->prepare($sql); 
    $ejecucionSQL ->execute();
    while($filaPDO=$ejecucionSQL->fetch(PDO::FETCH_ASSOC)){
        $item=new stdClass();
        if(is_null($filaPDO['visible'])){
            $item->dd=1;
            $item->d=1;
        } else {
            $item->dd=$filaPDO['visible'];
            $item->d=$filaPDO['visible'];
        }
        $item->status=$filaPDO['estado'];
        if($filaPDO['fecha']=='0000-00-00'){
            $item->created='';
        } else{
            $item->created=$filaPDO['fecha'];
        }
        if($filaPDO['fecha_entrega']=='0000-00-00'){
            $item->entrega='';
        } else{
            $item->entrega=$filaPDO['fecha_entrega'];
        }
        
        array_push($items, $item);
    }
   
echo json_encode($items);

$conexionPDO = null;
$sql1 = null;

die();
?>