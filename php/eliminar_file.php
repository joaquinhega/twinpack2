<?php
include_once '../php/conexion1.php';
include_once 'cors.php';

$conexionPDO = new PDO("mysql:host=$servidor;dbname=$bd;charset=UTF8", $usuario, $clave);

$response = array();
$logs = array();

if (isset($_POST['nombre']) && isset($_POST['origen'])) {
    $nombre = $_POST['nombre'];
    $origen = $_POST['origen']; 
    $filePath = "uploads/" . $nombre; 

    $logs[] = "Nombre del archivo: $nombre";
    $logs[] = "Origen: $origen";
    $logs[] = "Ruta del archivo: $filePath";

    $tablasPermitidas = ['ARCHIVOS', 'ARCHIVOSORDEN']; 
    if (in_array($origen, $tablasPermitidas)) {
        if (file_exists($filePath)) {
            if (unlink($filePath)) {
                $logs[] = "Archivo eliminado del sistema de archivos";

                $sql = "DELETE FROM $origen WHERE nombre = :nombre";
                $ejecucionSQL = $conexionPDO->prepare($sql);
                $ejecucionSQL->bindParam(':nombre', $nombre);
                if ($ejecucionSQL->execute()) {
                    $response['success'] = true;
                    $response['message'] = "Archivo eliminado correctamente";
                    $logs[] = "Referencia del archivo eliminada de la base de datos";
                } else {
                    $response['success'] = false;
                    $response['message'] = "Error al eliminar la referencia del archivo en la base de datos";
                    $logs[] = $response['message'];
                }
            } else {
                $response['success'] = false;
                $response['message'] = "Error al eliminar el archivo del sistema de archivos";
                $logs[] = $response['message'];
            }
        } else {
            $response['success'] = false;
            $response['message'] = "Archivo no encontrado en el sistema de archivos";
            $logs[] = $response['message'];
        }
    } else {
        $response['success'] = false;
        $response['message'] = "Tabla no permitida o inválida";
        $logs[] = $response['message'];
    }
} else {
    $response['success'] = false;
    $response['message'] = "Datos insuficientes para procesar la solicitud";
    $logs[] = $response['message'];
}

file_put_contents('logs_eliminacion.txt', implode("\n", $logs), FILE_APPEND);

header('Content-Type: application/json');
echo json_encode($response);
?>