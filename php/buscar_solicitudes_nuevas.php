<?php
//conexion
include_once '../php/conexion1.php';
include_once 'cors.php';

$conexionPDO= new PDO("mysql:host=$servidor;dbname=$bd;charset=UTF8",$usuario,$clave);
session_start();

$items= array();
$sql="SELECT ORDEN.id, ORDEN.created_at, USUARIOS.nombre, ORDEN.observaciones, CLIENTES.cliente, PROVEEDORES.proveedor, ORDEN.monto_total
        FROM ORDEN
        INNER JOIN USUARIOS ON USUARIOS.id = ORDEN.user_id
        LEFT JOIN CLIENTES ON CLIENTES.id = ORDEN.cliente_id
        LEFT JOIN PROVEEDORES ON PROVEEDORES.id = ORDEN.proveedor_id
        WHERE ORDEN.recibida = 0 AND ORDEN.activo = 1
        ORDER BY ORDEN.created_at DESC";

$ejecucionSQL= $conexionPDO->prepare($sql); 
$ejecucionSQL ->execute();

while($filaPDO=$ejecucionSQL->fetch(PDO::FETCH_ASSOC)){
    $item=new stdClass();
    $item->id=$filaPDO['id'];
    $item->fecha=$filaPDO['created_at'];
    $item->usuario=$filaPDO['nombre'];
    $item->observaciones=$filaPDO['observaciones'];
    $item->cliente=$filaPDO['cliente'];
    $item->proveedor=$filaPDO['proveedor'];
    $item->monto_total=$filaPDO['monto_total'];
    array_push($items, $item);
}
echo json_encode($items);

$conexionPDO = null;
$sql1 = null;

die();
?>