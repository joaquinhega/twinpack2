<?php
//conexion
    include_once '../php/conexion1.php';
    include_once 'cors.php';

    $conexionPDO= new PDO("mysql:host=$servidor;dbname=$bd;charset=UTF8",$usuario,$clave);
    session_start();

$token = $_POST['token'];
$password = $_POST['password'];

//verifica espacio de tiempo

$sptm = $conexionPDO->prepare("SELECT recover_date FROM USUARIOS WHERE recover_code = '$token'");
$sptm->execute();

if($sptm->rowCount() > 0){
    while($filaPDO=$sptm->fetch(PDO::FETCH_ASSOC)){
        $date = $filaPDO['recover_date'];
        $newDate = date("Y-m-d H:i:s", strtotime(' - 3 hours'));
        
        if($newDate > $date){
            echo "El código de verificación ha caducado. Por favor vuelva a solicitar el cambio de contraseña";
            die();
        } else{
            $clave = sha1($password);
            $sql1="UPDATE USUARIOS SET clave = '$clave' , recover_code = '' , recover_date = '0000-00-00 00:00:00' WHERE recover_code = '$token' ";
            $ejecucionSQL1= $conexionPDO->prepare($sql1); 
            $ejecucionSQL1->execute();
            echo "Contraseña cambiada correctamente";
            die();
        }
       
    }
} else {
    echo "Ocurrió un problema con la recuperación de la contraseña";
    die();
}

$conexionPDO = null;
$sql = null;
$sql1 = null;

die();
?>