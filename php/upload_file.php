<?php
//conexion
    include_once '../php/conexion1.php';
    include_once 'cors.php';

    $conexionPDO= new PDO("mysql:host=$servidor;dbname=$bd;charset=UTF8",$usuario,$clave);
    session_start();

    $orden_id = $_POST['ID'];

    $nombre = $_FILES['File']['name'];
    $nombre_tmp = $_FILES["File"]["tmp_name"];
    $tamaño =$_FILES['File']['size'];
    $tipo=$_FILES['File']['type'];
    $ext1=explode('.',$nombre);
    $ext=strtolower(end($ext1));
    $extpermitidas= array("jpeg","jpg","png","pdf","eml");

    if(in_array($ext,$extpermitidas)=== false){
        echo " ERROR: Tipo de archivo no válido";
        die();
    }
    if($tamaño > 3000000){
        echo " ERROR: El archivo supera el tamaño permitido. ";
        die();
    }
    if(move_uploaded_file($nombre_tmp, "../archivos/".$orden_id."-".$nombre)){
        echo "Archivo subido correctamente";
    } else{
        echo "Error a subir el archivo";
    }

    $sql2="INSERT INTO ARCHIVOS (orden_id,nombre) VALUES ($orden_id , '$nombre')";
    $ejecucionSQL2= $conexionPDO->prepare($sql2);
    $ejecucionSQL2 ->execute(); 
    
$conexionPDO = null;
$sql2 = null;

die();
?>