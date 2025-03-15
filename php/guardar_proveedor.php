<?php
//conexion
include_once '../php/conexion1.php';
include_once 'cors.php';

$conexionPDO= new PDO("mysql:host=$servidor;dbname=$bd;charset=UTF8",$usuario,$clave);
session_start();

$proveedor = $_POST['Proveedor'];
$sql1="INSERT INTO PROVEEDORES (proveedor, activo) VALUES ('$proveedor' , 1)";
     $ejecucionSQL1= $conexionPDO->prepare($sql1); 
     if ($ejecucionSQL1 ->execute()){
        echo "Datos guardados correctamente";
     }
      else{echo "Error al guardar datos";
     }

$conexionPDO = null;
$sql1 = null;

die();
?>