<?php
    include_once '../php/conexion1.php';
    include_once 'cors.php';

    $conexionPDO= new PDO("mysql:host=$servidor;dbname=$bd;charset=UTF8",$usuario,$clave);
    session_start();

    $items= array();
    $sql="SELECT USUARIOS.id, USUARIOS.nombre, USUARIOS.mail, USUARIOS.empresa, USUARIOS.razon_social,
    USUARIOS.tipo, USUARIOS.cliente_id, USUARIOS.proveedor_id, USUARIOS.activo, CLIENTES.cliente, PROVEEDORES.proveedor
    FROM USUARIOS
    LEFT JOIN CLIENTES ON CLIENTES.id = USUARIOS.cliente_id
    LEFT JOIN PROVEEDORES ON PROVEEDORES.id = USUARIOS.proveedor_id
    ";
    $ejecucionSQL= $conexionPDO->prepare($sql); 
    $ejecucionSQL ->execute();
    while($filaPDO=$ejecucionSQL->fetch(PDO::FETCH_ASSOC)){
        $item=new stdClass();
        $item->id=$filaPDO['id'];
        $item->nombre=$filaPDO['nombre'];
        $item->mail=$filaPDO['mail'];
        $item->empresa=$filaPDO['empresa'];
        $item->razon_social=$filaPDO['razon_social'];
        $item->tipo_id=$filaPDO['tipo'];
        if($filaPDO['tipo']=='1'){
            $item->tipo='administrador';
        }
        if($filaPDO['tipo']=='2'){
            $item->tipo='cliente';
        }
        if($filaPDO['tipo']=='3'){
            $item->tipo='proveedor';
        }
        if($filaPDO['cliente_id']!=0){
            $item->tercero=$filaPDO['cliente'];
        }
        if($filaPDO['proveedor_id']!=0){
            $item->tercero=$filaPDO['proveedor'];
        }
        $item->activo=$filaPDO['activo'];
        
        array_push($items, $item);
    }
    echo json_encode($items);

$conexionPDO = null;
$sql1 = null;

die();
?>