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

$idUsuario = $_SESSION['IDSesion'];

// Abriendo el archivo
$url_img = '';
if(isset($_FILES['File'])){
    $nombre = $_FILES['File']['name'];
    $tamaño =$_FILES['File']['size'];
    $nombretmp =$_FILES['File']['tmp_name'];
    $tipo=$_FILES['File']['type'];
    $ext1=explode('.',$nombre);
    $ext=strtolower(end($ext1));
    $extpermitidas= array("csv");
    if(in_array($ext,$extpermitidas)=== false){
       echo "Tipo de archivo no valido";
       die();
    }
    if($tamaño > 1000000){
       echo "El tamaño del archivo supera el máximo permitido (1Mb)";
       die();
    }

    $fila = 1;
    $success = 0;
    $error = 0; 
    $detalle_error = "";
    if (($gestor = fopen($nombretmp, "r")) !== FALSE) {
        while (($datos = fgetcsv($gestor, 1000, ",")) !== FALSE) {
            $numero = count($datos);
            if($fila == 1){ //Guarda los valores de la cabecera
                $sql="INSERT INTO ORDENES ( ";
                for ($c=0; $c < $numero; $c++) {
                    if($c > 0){
                        $sql = $sql.", ";  
                    }
                    $sql = $sql.$datos[$c];
                }
                $sql = $sql." , estado_id , user_id ) VALUES ( "   ; 
            } else {
                $sql_final = $sql;
                for ($c=0; $c < $numero; $c++) {
                    if($c > 0){
                        $sql_final = $sql_final.", ";  
                    }
                    $sql_final = $sql_final."'".$datos[$c]."'";
                }
                $sql_final = $sql_final." , 1, '$idUsuario' ) "   ; 
            }

            $ejecucionSQL1= $conexionPDO->prepare($sql_final); 
            $ejecucionSQL1 ->execute();
            $affected = $ejecucionSQL1 ->rowCount();
            echo $affected;
            if($affected == 1){
               $success ++;
            }
            else{
                if($fila >1){
                    $error ++;
                    $detalle_error = $detalle_error."<br>".$sql_final;
                }
            }
            $fila++;
        }
        fclose($gestor);
    }
}


$conexionPDO = null;
$sql = null;

/*
$error_text = "";
if($error > 0){
    $error_text = $error." Ordenes no pudieron ser cargadas. ";
}
echo $success." Ordenes se cargaron correctamente. ".$error_text;


$email_user = "administracion@twinpack.com.ar";
$email_password = "X@NZqZv9mH";
$host = "c2530768.ferozo.com";

$bad = array("content-type","bcc:","to:","cc:","href");

//Correo a Empresa
$the_subject = utf8_decode("Nuevas Órdenes desde archivo");
$the_title = utf8_decode("Nuevas Órdenes desde archivo");
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
    $phpmailer->Body .= "<p style='margin:0px;margin-top:20px;'>".$success." Ordenes se cargaron correctamente. </p>";
    $phpmailer->Body .= "<p style='margin:0px'>".utf8_decode("Ingrese a la sección de Administración para confirmarlas ")." </p>";

    if($error > 0){
        $phpmailer->Body .= "<p style='margin:0px;margin-top:40px;'>".$error_text."</p>";
        $phpmailer->Body .= "<p style='margin:0px;margin-top:20px;'>Detalle de órdenes no cargadas</p>";
        $phpmailer->Body .= "<p style='margin:0px;margin-top:20px;'>".$detalle_error."</p>";
    }
    
$phpmailer->IsHTML(true);

$phpmailer->Send();
*/

die();
?>