<?php
//conexion
include_once '../php/conexion1.php';
include_once 'cors.php';

$conexionPDO= new PDO("mysql:host=$servidor;dbname=$bd;charset=UTF8",$usuario,$clave);
session_start();

$cliente = $_POST['Cliente'];
$sql1="INSERT INTO CLIENTES (cliente, activo) VALUES ('$cliente' , 1)";
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