<?php
//conexion
    include_once '../php/conexion1.php';
    include_once 'cors.php';

    $conexionPDO= new PDO("mysql:host=$servidor;dbname=$bd;charset=UTF8",$usuario,$clave);
    session_start();

session_start();
    if (empty($_SESSION['IDSesion'])) {
    // Agregar luego cuando armemos sesión
        echo "Debe iniciar Sesion";
        die();
    }
$idUsuario = $_SESSION['IDSesion'];
$PermiteEdicion=$_SESSION['PermisoEdicion'];

$token_actualizado = $_POST['password'];
$correo_actualizado = $_POST['email'];


$sql1="SELECT * FROM clientes WHERE token_validate_actualizado = '$token_actualizado' AND correo_actualizado = '$correo_actualizado' LIMIT 1";
$ejecucionSQL1= $conexionPDO->prepare($sql1); 
if ($ejecucionSQL1 ->execute()){
    $sql2 = "UPDATE clientes SET validate_actualizado = 1 WHERE token_validate_actualizado = '$token_actualizado' AND correo_actualizado = '$correo_actualizado'";
    $ejecucionSQL2 = $conexionPDO->prepare($sql2);
    $ejecucionSQL2 ->execute();
    $validated = array("validated");
    echo json_encode($validated);
}
else{echo "Error al guardar datos";
    die();
}
$conexionPDO = null;
$sql = null;
$sql1 = null;

die();
?>