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

$usuarios = $_POST['Usuarios'];
$usuarios_array = json_decode($usuarios,true,512, JSON_OBJECT_AS_ARRAY);

$count_success = 0;
$count_errors = 0;

for($z=0;$z<count($usuarios_array);$z++){
    $id = $usuarios_array[$z]["id"];
    $tipo_id = $usuarios_array[$z]["tipo_id"];
    $activo = $usuarios_array[$z]["activo"];
    $tercero = $usuarios_array[$z]["tercero"];

    if($tipo_id == 1){
        $sql1="UPDATE USUARIOS SET tipo = '$tipo_id', cliente_id = '', proveedor_id = '',  activo = '$activo'
        WHERE id='$id'";
    }
    if($tipo_id == 2){
        $sql1="UPDATE USUARIOS SET tipo = '$tipo_id', 
        cliente_id = (SELECT id FROM CLIENTES WHERE cliente = '$tercero'), 
        proveedor_id = '', 
        activo = '$activo'
        WHERE id='$id'";
    }

    if($tipo_id == 3){
        $sql1="UPDATE USUARIOS SET tipo = '$tipo_id', 
        cliente_id = '', 
        proveedor_id = (SELECT id FROM PROVEEDORES WHERE proveedor = '$tercero'), 
        activo = '$activo'
        WHERE id='$id'";
    }
    
    $ejecucionSQL1= $conexionPDO->prepare($sql1); 
    if ($ejecucionSQL1 ->execute()){
        $count_success ++;
        // envía correo de confirmación al usuario si está activo
        //busca correo a enviar
        if ($activo=='1'){
            $user_email = "";
            $sql="SELECT mail FROM USUARIOS WHERE id = ".$id ;
            $ejecucionSQL= $conexionPDO->prepare($sql); 
            $ejecucionSQL ->execute();
            while($filaPDO=$ejecucionSQL->fetch(PDO::FETCH_ASSOC)){
                $user_email = $filaPDO['mail'];
            }


            $email_user = "administracion@twinpack.com.ar";
            $email_password = "X@NZqZv9mH";
            $host = "c2530768.ferozo.com";

            $bad = array("content-type","bcc:","to:","cc:","href");

            $the_subject = utf8_decode("Actualización de Usuario");
            $the_title = utf8_decode("Actualización de Usuario");
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
            $phpmailer->AddAddress($user_email); // recipients email

            $phpmailer->AddEmbeddedImage('logo.jpg', 'logo_2u');

            $phpmailer->Subject = $the_subject; 
            $phpmailer->Body .="<img style='width:100px' src='cid:logo_2u'/>";
            $phpmailer->Body .="<h1>".$the_title."</h1>";
                $phpmailer->Body .= "<p style='margin:0px;margin-top:20px;'>Su usuario en el sistema TWINPACK ha sido activado correctamente. </p>";
                $phpmailer->Body .= "<p style='margin:0px;margin-top:20px;'>Ya puede utilizar la plataforma para solicitar cotizaciones y hacer seguimiento de las mismas.</p>";

                $phpmailer->Body .= "<p style='margin:0px'>".utf8_decode("Haga click en el siguiente link para acceder")." </p>";
                $phpmailer->Body .= "<a style='text-decoration:none' href='https://twinpack.com.ar/sistema/#/sistema/'><p style='margin:0px;font-size: 1.8em;margin-top:30px; color: #9f0059'>".utf8_decode("Iniciar Sesión")."</p></a>";
            
            $phpmailer->IsHTML(true);

            $phpmailer->Send();
        }

        //termina envío de correo
    }
    else{;
        $count_errors ++;
    }
}

$text ="";
if($count_success>0){
    if($count_success == 1){
        $text .= "1 registro guardado correctamente. ";
    } else {
        $text .= $count_success." registros guardados correctamente. ";
    }
}
if ($count_errors>0){
    if($count_errors == 1){
        $text .= "Falló el guardado de 1 registro. ";
    } else {
        $text .= $text += "Falló el guardado de ".$count_errors." registros. ";
    }
}
echo $text;

$conexionPDO = null;
$sql1 = null;

die();
?>