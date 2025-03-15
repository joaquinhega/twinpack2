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
$password = $_POST['password'];
$empresa = $_POST['empresa'];
$razonSocial = $_POST['razonSocial'];
$nombre = $_POST['nombreApellidoContacto'];
$telefono = $_POST['telefonoContacto'];

$password_sha1 = sha1($password);


$sptm = $conexionPDO->prepare("SELECT mail FROM USUARIOS WHERE mail = '$email'");
$sptm->execute();

if($sptm->rowCount() > 0){
        echo "Ya existe un usuario con ese correo";
        die();
} else {
    $sql1="INSERT INTO USUARIOS (mail, clave, empresa, razon_social, nombre, telefono, activo) VALUES (
    '$email' , '$password_sha1' , '$empresa' , '$razonSocial' , '$nombre' , '$telefono' , 0)";
     $ejecucionSQL1= $conexionPDO->prepare($sql1); 
     if ($ejecucionSQL1 ->execute()){
        echo "Datos guardados correctamente";
     }
      else{echo "Error al guardar datos";
           die();
     }
}


$email_user = "administracion@twinpack.com.ar";
$email_password = "X@NZqZv9mH";
$host = "c2530768.ferozo.com";

$bad = array("content-type","bcc:","to:","cc:","href");

//Correo a Empresa
$the_subject = utf8_decode("Nuevo Usuario");
$the_title = utf8_decode("Nuevo Usuario");
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
$phpmailer->AddAddress("florencia@twinpack.com.ar"); // recipients email
$phpmailer->AddAddress("celina@twinpack.com.ar");
$phpmailer->AddAddress("mf_arias@yahoo.com");

$phpmailer->AddEmbeddedImage('logo.jpg', 'logo_2u');

$phpmailer->Subject = $the_subject; 
$phpmailer->Body .="<img style='width:100px' src='cid:logo_2u'/>";
$phpmailer->Body .="<h1>".$the_title."</h1>";
    $phpmailer->Body .= "<p style='margin:0px;margin-top:20px;'>Un nuevo Usuario se ha registrado en la plataforma</p>";
    $phpmailer->Body .= "<p style='margin:0px'>".utf8_decode("Ingrese a la sección de Administración para habilitarlo ")." </p>";
$phpmailer->IsHTML(true);

$phpmailer->Send();


//Correo a Usuario
$the_subject = utf8_decode("Nuevo Usuario en TwinPack");
$the_title = utf8_decode("Nuevo Usuario");
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
    $phpmailer->Body .= "<p style='margin:0px;margin-top:20px;'>Su registro en TwinPack se ha realizado correctamente</p>";
    $phpmailer->Body .= "<p style='margin:0px'>".utf8_decode("El Administrador del sistema verificará los datos")." </p>";
    $phpmailer->Body .= "<p style='margin:0px'>".utf8_decode("Le llegará un correo cuando su usuario esté habilitado para ingresar al sistema.")." </p>";
$phpmailer->IsHTML(true);

$phpmailer->Send();


$conexionPDO = null;
$sql = null;
$sql1 = null;

die();
?>