<?php
include_once 'cors.php';
include_once '../php/conexion1.php';

try {
    $conexionPDO = new PDO("mysql:host=$servidor;dbname=$bd;charset=UTF8", $usuario, $clave);
    $conexionPDO->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $orden_id = isset($_POST['ID']) ? intval($_POST['ID']) : 0;

    if ($orden_id <= 0) {
        echo json_encode(['error' => 'ID de orden no válido']);
        die();
    }

    $sql = "
        SELECT id, nombre, 'ARCHIVOS' AS origen
        FROM ARCHIVOS
        WHERE orden_id = :orden_id
        UNION
        SELECT id, nombre, 'ARCHIVOSORDEN' AS origen
        FROM ARCHIVOSORDEN
        WHERE orden_id = :orden_id
    ";
    $ejecucionSQL = $conexionPDO->prepare($sql);
    $ejecucionSQL->bindParam(':orden_id', $orden_id, PDO::PARAM_INT);
    $ejecucionSQL->execute();

    $archivos = [];
    while ($fila = $ejecucionSQL->fetch(PDO::FETCH_ASSOC)) {
        $archivos[] = [
            'id' => $fila['id'],
            'name' => $fila['nombre'],
            'origin' => $fila['origen'],
        ];
    }

    echo json_encode(['status' => 'success', 'files' => $archivos]);
} catch (PDOException $e) {
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
} finally {
    $conexionPDO = null;
    die();
}
?>
