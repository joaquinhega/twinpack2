<?php
include_once '../php/conexion1.php';
include_once 'cors.php';

$conexionPDO = new PDO("mysql:host=$servidor;dbname=$bd;charset=UTF8", $usuario, $clave);
session_start();

$response = array();
$logs = array();

$cliente_nombre = $_POST['Cliente'];
$proveedor_nombre = $_POST['Proveedor'];
$observaciones = $_POST['Observaciones'];
if ($observaciones == 'null') {
    $observaciones = '';
}
$user_id = $_POST['user_id'];
$orderItems = json_decode($_POST['orderItems'], true);
$totalAmount = $_POST['totalAmount'];
$user_name = "";

$logs[] = "Datos recibidos: Cliente=$cliente_nombre, Proveedor=$proveedor_nombre, Observaciones=$observaciones, User ID=$user_id, Items=" . print_r($orderItems, true) . ", Total Amount=$totalAmount";

$sql = "SELECT nombre FROM USUARIOS WHERE id = :user_id";
$ejecucionSQL = $conexionPDO->prepare($sql);
$ejecucionSQL->bindParam(':user_id', $user_id);
$ejecucionSQL->execute();
while ($filaPDO = $ejecucionSQL->fetch(PDO::FETCH_ASSOC)) {
    $user_name = $filaPDO['nombre'];
}
$logs[] = "Total antes de ingresar: " . $totalAmount;
$sql1 = "INSERT INTO ORDEN (cliente_id, proveedor_id, observaciones, user_id, monto_total, activo) 
VALUES (
    (SELECT id FROM CLIENTES WHERE cliente = :cliente_nombre AND activo = 1), 
    (SELECT id FROM PROVEEDORES WHERE proveedor = :proveedor_nombre AND activo = 1), 
    :observaciones,
    :user_id, 
    :totalAmount, 
    1)";
$ejecucionSQL1 = $conexionPDO->prepare($sql1);
$ejecucionSQL1->bindParam(':cliente_nombre', $cliente_nombre);
$ejecucionSQL1->bindParam(':proveedor_nombre', $proveedor_nombre);
$ejecucionSQL1->bindParam(':observaciones', $observaciones);
$ejecucionSQL1->bindParam(':user_id', $user_id);
$logs[] = "Total despues de ingresar: " . $totalAmount;
$ejecucionSQL1->bindParam(':totalAmount', $totalAmount);

if ($ejecucionSQL1->execute()) {
    $last_id = $conexionPDO->lastInsertId();
    $response[0] = "Solicitud enviada correctamente";
    $response[1] = $last_id;

    $logs[] = "Orden insertada con ID: " . $last_id;

    foreach ($orderItems as $item) {
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, "https://twinpack.com.ar/sistema/php/checkout.php");
//        curl_setopt($ch, CURLOPT_URL, "http://localhost/pruebaTwinpack/php/checkout.php");
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query([
            'quantity' => $item['quantity'],
            'price' => $item['price'],
            'description' => $item['description'] ?? '',
            'date' => $item['date'],
            'code' => $item['code'] ?? '',
            'number' => $item['number'] ?? '',
            'observations' => $item['observations'] ?? '',
            'user_id' => $user_id,
            'category' => $item['category'],
            'order_id' => $last_id
        ]));
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

        $response_item = curl_exec($ch);
        if (curl_errno($ch)) {
            $logs[] = "Error en cURL: " . curl_error($ch);
        } else {
            $logs[] = "Respuesta de checkout: " . $response_item;
        }
        curl_close($ch);
    }

    $uploadedFiles = array();
    foreach ($_FILES as $key => $file) {
        $fileName = $file['name'];
        $fileTmpName = $file['tmp_name'];
        $fileSize = $file['size'];
        $fileError = $file['error'];
        $fileType = $file['type'];

        if ($fileError === 0) {
            $fileDestination = 'uploads/' . $fileName;
            if (move_uploaded_file($fileTmpName, $fileDestination)) {
                $uploadedFiles[] = $fileName;
                $logs[] = "Archivo subido: $fileName, $fileTmpName, $fileSize, $fileError, $fileType";
            } else {
                $logs[] = "Error al mover el archivo: $fileName";
            }
        } else {
            $logs[] = "Error al subir el archivo: $fileName";
        }
        $sql2="INSERT INTO ARCHIVOS (orden_id,nombre) VALUES ($last_id , '$fileName')";
        $ejecucionSQL2= $conexionPDO->prepare($sql2);
        $ejecucionSQL2 ->execute(); 
    }
    $response['logs'] = $logs;
    echo json_encode($response);
} else {
    $response[0] = "Ha ocurrido un error mientras se intentaba enviar la solicitud";
    $response['error'] = $ejecucionSQL1->errorInfo(); // <-- Agrega esta línea para ver el error específico
    $response['logs'] = $logs;
    echo json_encode($response);
    $logs[] = "Error en la ejecución de la consulta SQL: " . print_r($ejecucionSQL1->errorInfo(), true);
}

/*
$email_user = "administracion@twinpack.com.ar";
$email_password = "X@NZqZv9mH";
$host = "c2530768.ferozo.com";

$bad = array("content-type","bcc:","to:","cc:","href");

//Correo a Empresa
$the_subject = utf8_decode("Nuevo Pedido de Cotización");
$the_title = utf8_decode("Pedido de Cotización");
$from_name = "TwinPack";

$phpmailer = new PHPMailer();
$phpmailer->Username = $email_user;
$phpmailer->Password = $email_password; 
$phpmailer->SMTPSecure = 'ssl';
$phpmailer->Host = $host;
$phpmailer->Port = 465;
$phpmailer->IsSMTP();
$phpmailer->SMTPAuth = true;

$phpmailer->setFrom($phpmailer->Username,$from_name);
$phpmailer->AddAddress("florencia@twinpack.com.ar");
$phpmailer->AddAddress("celina@twinpack.com.ar"); 
$phpmailer->AddAddress("mf_arias@yahoo.com");

$phpmailer->AddEmbeddedImage('logo.jpg', 'logo_2u');
$phpmailer->Subject = $the_subject; 
$phpmailer->Body .="<img style='width:100px' src='cid:logo_2u'/>";
$phpmailer->Body .="<h1>".$the_title."</h1>";
$phpmailer->Body .= "<p style='margin:0px;margin-top:20px;'>Usuario: ".  utf8_decode($user_name) ." </p>";
$phpmailer->Body .= "<p style='margin:0px'>".utf8_decode("Cliente: "). utf8_decode($cliente_nombre)." </p>";
$phpmailer->Body .= "<p style='margin:0px'>".utf8_decode("Proveedor: "). utf8_decode($proveedor_nombre)." </p>";

$phpmailer->IsHTML(true);
$phpmailer->Send();
*/

$conexionPDO = null;
$sql1 = null;
$sql2 = null;

die();
?>