<?php
include_once '../php/conexion1.php'; 
include_once 'cors.php';

$conexionPDO = new PDO("mysql:host=$servidor;dbname=$bd;charset=UTF8", $usuario, $clave);
session_start();

// Verificar si los datos existen en POST
if (isset($_POST['email']) && isset($_POST['password'])) {
    $mail = $_POST['email'];
    $clave = sha1($_POST['password']); // Encriptar la contraseña

    // Consulta SQL
    $sql = "SELECT id, nombre, mail, tipo, proveedor_id, cliente_id FROM USUARIOS WHERE mail = :email AND clave = :clave AND activo = 1 LIMIT 1";
    $ejecucionSQL = $conexionPDO->prepare($sql);

    // Ejecutar la consulta con parámetros
    $ejecucionSQL->execute([
        ':email' => $mail,
        ':clave' => $clave
    ]);

    // Obtener el resultado
    if ($filaPDO1 = $ejecucionSQL->fetch(PDO::FETCH_ASSOC)) {
        $_SESSION['IDSesion'] = $filaPDO1['id'];
        $_SESSION['NombreSesion'] = $filaPDO1['nombre'];
        $_SESSION['TipoSesion'] = $filaPDO1['tipo'];
        $_SESSION['ProveedorSesion'] = $filaPDO1['proveedor_id'];
        $_SESSION['ClienteSesion'] = $filaPDO1['cliente_id'];
        $item = new stdClass();
        $item->id = $_SESSION['IDSesion'];
        $item->nombre = $filaPDO1['nombre'];
        $item->tipo = $filaPDO1['tipo'];
        $item->proveedor_id = $filaPDO1['proveedor_id'];
        $item->cliente_id = $filaPDO1['cliente_id'];

        // Responder con los datos
        echo json_encode($item);
    } else {
        echo json_encode(['error' => 'Usuario o contraseña incorrecta']);
    }
} else {
    echo json_encode(['error' => 'Faltan datos']);
}
$conexionPDO = null;
?>
