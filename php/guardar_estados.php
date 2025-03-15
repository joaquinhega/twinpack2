<?php
//conexion
include_once '../php/conexion1.php';
include_once 'cors.php';

$conexionPDO= new PDO("mysql:host=$servidor;dbname=$bd;charset=UTF8",$usuario,$clave);
session_start();


$estados_item = $_POST['StatusItems'];
$estados_array = json_decode($estados_item,true,512, JSON_OBJECT_AS_ARRAY);
$precio = $_POST['Precio'];
$cantidad = $_POST['Cantidad'];
$motivos = $_POST['Motivos'];
$id = $_POST['ID'];
$observaciones = $_POST['Observaciones'];

$ultimo_estado = '';
for($z=0;$z<count($estados_array);$z++){
    if($estados_array[$z]["created"] !=""){
        $ultimo_estado = $estados_array[$z]["status"];
    }
}
$sql1="UPDATE ORDENES SET precio = '$precio', cantidad = '$cantidad' , motivo_no_asignacion = '$motivos', observaciones = '$observaciones',
        estado_id = (SELECT id FROM ESTADOS WHERE estado = '$ultimo_estado' )
        WHERE id='$id'";
$ejecucionSQL1= $conexionPDO->prepare($sql1); 

if ($ejecucionSQL1 ->execute()){
    echo "Solicitud editada correctamente";
}
else{
    echo "Error al editar la solicitud";
}

$sql1="DELETE FROM SEGUIMIENTOS WHERE orden_id='$id'";
$ejecucionSQL1= $conexionPDO->prepare($sql1); 
$ejecucionSQL1 ->execute();

for($z=0;$z<count($estados_array);$z++){
    $visible = $estados_array[$z]["dd"];
    $estado = $estados_array[$z]["status"];
    $created = $estados_array[$z]["created"];
    $entrega = $estados_array[$z]["entrega"];
    $sql1="INSERT SEGUIMIENTOS (orden_id , visible, estado_id, fecha, fecha_entrega ) 
    VALUES($id, $visible, (SELECT id FROM ESTADOS WHERE estado = '$estado') , '$created', '$entrega' ) ";
    $ejecucionSQL1= $conexionPDO->prepare($sql1); 
    $ejecucionSQL1 ->execute();
}

$conexionPDO = null;
$sql1 = null;

die();
?>