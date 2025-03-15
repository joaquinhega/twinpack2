<?php
//conexion
    include_once '../php/conexion1.php';
    include_once 'cors.php';

    use PHPMailer\PHPMailer\PHPMailer;
    use PHPMailer\PHPMailer\SMTP;
    use PHPMailer\PHPMailer\Exception;

    require 'Exception.php';
    require 'PHPMailer.php';
    require 'SMTP.php';
    $conexionPDO= new PDO("mysql:host=$servidor;dbname=$bd;charset=UTF8",$usuario,$clave);
    session_start();

session_start();

$email = $_POST['email'];

$sptm = $conexionPDO->prepare("SELECT mail,id FROM USUARIOS WHERE mail = '$email'");
$sptm->execute();

$permitted_chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
$recover_code = substr(str_shuffle($permitted_chars), 0, 20);

$actual_date = date("Y-m-d H:i:s"); 

if($sptm->rowCount() > 0){
    while($filaPDO=$sptm->fetch(PDO::FETCH_ASSOC)){
        $id = $filaPDO['id'];
        $sql1="UPDATE USUARIOS SET recover_code = '$recover_code' , recover_date = '$actual_date' WHERE id = $id ";
        $ejecucionSQL1= $conexionPDO->prepare($sql1); 
        $ejecucionSQL1->execute();
    }
    
    $email_user = "administracion@twinpack.com.ar";
    $email_password = "X@NZqZv9mH";
    $host = "c2530768.ferozo.com";

    $bad = array("content-type","bcc:","to:","cc:","href");

    //Correo a Empresa
    $the_subject = utf8_decode("Recuperar Contraseña");
    $the_title = utf8_decode("Recuperar Contraseña");
    //$address_to = "florencia@twinpack.com.ar";
    $address_to = $email;
    $from_name = "TwinPack";

    $phpmailer = new PHPMailer();

    // ---------- datos de la cuenta de Gmail -------------------------------
    $phpmailer->Username = $email_user;
    $phpmailer->Password = $email_password; 
    //-----------------------------------------------------------------------
    // $phpmailer->SMTPDebug = 1;
    $phpmailer->SMTPSecure = 'ssl';
    $phpmailer->Host = $host;
    $phpmailer->Port = 465;
    $phpmailer->IsSMTP(); // use SMTP
    $phpmailer->SMTPAuth = true;

    $phpmailer->setFrom($phpmailer->Username,$from_name);
    $phpmailer->AddAddress($address_to); // recipients email

    $phpmailer->AddEmbeddedImage('logo.jpg', 'logo_2u');

    $phpmailer->Subject = $the_subject; 
    $phpmailer->Body .="<img style='width:100px' src='cid:logo_2u'/>";
    $phpmailer->Body .="<h1>".$the_title."</h1>";
    $phpmailer->Body .= "<p style='margin:0px'>".utf8_decode("Se ha solicitado un cambio de contraseña. ")." </p>";
    $phpmailer->Body .= "<p style='margin:0px'>".utf8_decode("Haga click en el siguiente link para cambiarla")." </p>";
    $phpmailer->Body .= "<a style='text-decoration:none' href='https://twinpack.com.ar/sistema/#/sistema/password?code=".$recover_code."'><p style='margin:0px;font-size: 1.8em;margin-top:30px; color: #9f0059'>".utf8_decode("Cambiar Contraseña")."</p></a>";

    $phpmailer->IsHTML(true);

    $phpmailer->Send();
    echo "Se ha enviado un correo con las instrucciones para cambiar la contraseña";
} else {
    echo "No existe un usuario con ese correo";
    die();
}

$conexionPDO = null;
$sql = null;
$sql1 = null;

die();
?>