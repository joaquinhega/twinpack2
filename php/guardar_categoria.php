<?php
//conexion
include_once '../php/conexion1.php';
include_once 'cors.php';

$conexionPDO= new PDO("mysql:host=$servidor;dbname=$bd;charset=UTF8",$usuario,$clave);
session_start();

$categoria = $_POST['Categoria'];
$sql1="INSERT INTO CATEGORIAS (categoria, activo) VALUES ('$categoria' , 1)";
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