<?php
include_once 'conexion1.php'; 
include_once 'cors.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $orderId = $_POST['orderId'];
    $amount = $_POST['Monto'];

    // Log para ver los valores recibidos
    error_log("Valores recibidos: orderId=$orderId, amount=$amount");

    if (empty($orderId) || empty($amount)) {
        echo json_encode(['success' => false, 'message' => 'Faltan datos requeridos']);
        exit;
    }

    $client = isset($_POST['Cliente']) ? $_POST['Cliente'] : null;
    $provider = isset($_POST['Proveedor']) ? $_POST['Proveedor'] : null;
    $observations = isset($_POST['Observaciones']) ? $_POST['Observaciones'] : null;

    try {
        $conexionPDO = new PDO("mysql:host=$servidor;dbname=$bd;charset=UTF8", $usuario, $clave);

        $sql = "UPDATE ORDEN SET monto_total = :amount";
        $params = ['amount' => $amount, 'orderId' => $orderId];

        if ($client !== null) {
            $sql .= ", cliente_id = :client";
            $params['client'] = $client;
        }
        if ($provider !== null) {
            $sql .= ", proveedor_id = :provider";
            $params['provider'] = $provider;
        }
        if ($observations !== null) {
            $sql .= ", observaciones = :observations";
            $params['observations'] = $observations;
        }

        $sql .= " WHERE id = :orderId";
        $statement = $conexionPDO->prepare($sql);
        $statement->execute($params);

        // Log para ver si la actualización fue exitosa
        error_log("Actualización de la orden exitosa: orderId=$orderId");

        // Manejo de archivos
        $uploadedFiles = [];
        foreach ($_FILES as $fileKey => $file) {
            if ($file['error'] === UPLOAD_ERR_OK) {
                $uploadDir = 'uploads/'; 
                if (!is_dir($uploadDir)) {
                    mkdir($uploadDir, 0777, true); 
                }
        
                $originalName = basename($file['name']);
                $finalName = $originalName;
                $filePath = $uploadDir . $finalName;
                $i = 1;
        
                while (file_exists($filePath)) {
                    $fileExtension = pathinfo($originalName, PATHINFO_EXTENSION);
                    $fileBaseName = pathinfo($originalName, PATHINFO_FILENAME);
                    $finalName = $fileBaseName . "_{$i}." . $fileExtension;
                    $filePath = $uploadDir . $finalName;
                    $i++;
                }
        
                if (move_uploaded_file($file['tmp_name'], $filePath)) {
                    $uploadedFiles[] = $finalName;
                    $sql2 = "INSERT INTO ARCHIVOS (orden_id, nombre) VALUES (:orderId, :fileName)";
                    $statementFile = $conexionPDO->prepare($sql2);
                    $statementFile->execute(['orderId' => $orderId, 'fileName' => $finalName]);
                } else {
                    throw new Exception("Error al mover el archivo: " . $file['name']);
                }
            } else {
                throw new Exception("Error al subir archivo: " . $file['name']);
            }
        }

        echo json_encode(['success' => true, 'message' => 'Orden actualizada correctamente']);
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'message' => 'Error al procesar la solicitud: ' . $e->getMessage()]);
    }
} else {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Método no permitido']);
}
?>