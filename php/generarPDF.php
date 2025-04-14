<?php
include_once 'cors.php';
header('Content-Type: application/pdf');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
header('Pragma: public');

require('fpdf186/fpdf.php');
include_once 'conexion1.php'; 
session_start();

class PDF extends FPDF {
    public $logoDir;

    function Header() {
        $this->Image('image.png', 10, 10, 30); 
        $this->SetFont('Arial', 'B', 16);
        $this->Cell(0, 10, utf8_decode('COTIZACIÓN'), 0, 0, 'C');
        if (!empty($this->logoDir)) {
            $logoLocalPath = __DIR__ . '/temp_logo.jpg'; // Ruta temporal para guardar el logo
            if (@file_put_contents($logoLocalPath, file_get_contents($this->logoDir))) {
                $this->Image($logoLocalPath, 170, 10, 30); // Mostrar el logo descargado
                unlink($logoLocalPath); // Eliminar el archivo temporal después de usarlo
            } else {
                $this->SetFont('Arial', 'I', 10);
                $this->Cell(0, 10, utf8_decode('Logo no disponible'), 0, 1, 'R');
            }
        } else {
            $this->SetFont('Arial', 'I', 10);
            $this->Cell(0, 10, utf8_decode('Logo no disponible'), 0, 1, 'R');
        }

        $this->Ln(20);
    }
    function Footer() {
        $this->SetY(-15);
        $this->SetFont('Arial', 'I', 8);
        $this->Cell(0, 10, utf8_decode('Página ') . $this->PageNo(), 0, 0, 'C');
    }
}

$monto = $_POST['monto'];
$fecha = $_POST['fecha'];
$destinatario = $_POST['destinatario'];
$texto_presentacion = $_POST['textoPresentacion'];
$condiciones = $_POST['condiciones'];
$order_id = $_POST['orderId'];
$nombre_usuario = $_POST['nombreUsuario'];
$logoPath = $_POST['logoPath'];
$logoDir = "https://twinpack.com.ar/sistema/php/logos/" . basename($logoPath);
//$logoDir = "http://localhost/pruebaTwinpack/php/logos/" . basename($logoPath);
error_log("Generando PDF para la orden con ID: $order_id");
error_log("Datos recibidos: monto: $monto, fecha: $fecha, destinatario: $destinatario, texto_presentacion: $texto_presentacion, condiciones: $condiciones, order_id: $order_id, nombre_usuario: $nombre_usuario, logoPath: $logoPath");

if (isset($_FILES['logo']) && $_FILES['logo']['error'] == UPLOAD_ERR_OK) {
    $uploadDir = 'uploads/';
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0755, true);
    }
    $fileName = basename($_FILES['logo']['name']);
    $logoPath = $uploadDir . $fileName;

    if (move_uploaded_file($_FILES['logo']['tmp_name'], $logoPath)) {
        $imageInfo = getimagesize($logoPath);
        if ($imageInfo['mime'] == 'image/png' || $imageInfo['mime'] == 'image/jpeg') {
            $logs[] = "Archivo aceptado: $logoPath";
        } else {
            $logs[] = "Formato de archivo no soportado: " . $imageInfo['mime'];
            unlink($logoPath); 
            $logoPath = null;
        }
    } else {
        $logs[] = "Error al mover el archivo.";
        $logoPath = null;
    }
}

$conexionPDO = new PDO("mysql:host=$servidor;dbname=$bd;charset=UTF8", $usuario, $clave);
$sql = "SELECT c.cliente AS cliente FROM ORDEN o JOIN CLIENTES c ON o.cliente_id = c.id WHERE o.id = :order_id";
$statement = $conexionPDO->prepare($sql);
$statement->execute(['order_id' => $order_id]);
$cliente = $statement->fetchColumn();

$sql = "SELECT descripcion, cantidad, precio FROM ORDENES WHERE orden_id = :order_id AND activo=1";
$statement = $conexionPDO->prepare($sql);
$statement->execute(['order_id' => $order_id]);
$productos = $statement->fetchAll(PDO::FETCH_ASSOC);

$condiciones_array = explode("\n", $condiciones);
$saludo = $nombre_usuario;

$pdf = new PDF();
$pdf->logoDir = $logoDir;
$pdf->AddPage();
$pdf->SetFont('Arial', '', 12);

// Sección destinatario
$pdf->Cell(0, 10, utf8_decode("Sr/es: $destinatario"), 0, 1);
$pdf->Cell(0, 10, utf8_decode("Fecha: $fecha"), 0, 1);
$pdf->Ln(10); // Salto de línea

// Texto de presentación
$pdf->SetFont('Arial', 'I', 10);
$pdf->MultiCell(0, 5, utf8_decode($texto_presentacion)); // Ajustar altura de celda a 5
$pdf->Ln(10);

// Tabla de productos
$pdf->SetFont('Arial', 'B', 10);
$pdf->SetFillColor(200, 150, 100); // Color de fondo
$pdf->Cell(80, 10, utf8_decode('Descripción'), 1, 0, 'C', true);
$pdf->Cell(30, 10, 'Cantidad', 1, 0, 'C', true);
$pdf->Cell(40, 10, 'Precio Unitario', 1, 0, 'C', true);
$pdf->Cell(40, 10, 'Total', 1, 1, 'C', true);

$pdf->SetFont('Arial', '', 10);
$totalProductos = 0;
foreach ($productos as $producto) {
    $descripcion = utf8_decode($producto['descripcion']);
    $cantidad = $producto['cantidad'];
    $precio = '$' . $producto['precio'];
    $total = '$' . number_format($producto['cantidad'] * $producto['precio'], 2);

    // Calcular la altura de la celda de la descripción
    $anchoDescripcion = 80;
    $alturaLinea = 8; // Altura de cada línea
    $alturaDescripcion = $pdf->GetStringWidth($descripcion) > $anchoDescripcion
        ? ceil($pdf->GetStringWidth($descripcion) / $anchoDescripcion) * $alturaLinea
        : $alturaLinea;

    // Asegurar que todas las celdas de la fila tengan la misma altura
    $alturaFila = max($alturaDescripcion, $alturaLinea);

    // Guardar posición antes de escribir la descripción
    $x = $pdf->GetX();
    $y = $pdf->GetY();

    // Descripción con salto de línea
    $pdf->MultiCell($anchoDescripcion, $alturaLinea, $descripcion, 1);

    // Regresar a la posición original para el resto de las celdas
    $pdf->SetXY($x + $anchoDescripcion, $y);
    $pdf->Cell(30, $alturaFila, $cantidad, 1, 0, 'C');
    $pdf->Cell(40, $alturaFila, $precio, 1, 0, 'C');
    $pdf->Cell(40, $alturaFila, $total, 1, 1, 'C');
    $totalProductos += $producto['cantidad'] * $producto['precio'];
}
$pdf->Ln(10); // Salto de línea

// Total
$pdf->SetFont('Arial', 'B', 12);
if($totalProductos == $monto){
    $pdf->Cell(0, 10, utf8_decode("Total: $$totalProductos"), 0, 1, 'R');
} else {
    $pdf->Cell(0, 10, utf8_decode("Total reducido: $$monto"), 0, 1, 'R');    
}
$pdf->Ln(10);

// Condiciones comerciales
$pdf->SetFont('Arial', 'B', 10);
$pdf->Cell(0, 10, utf8_decode("CONDICIONES COMERCIALES"), 0, 1);
$pdf->SetFont('Arial', '', 10);
foreach ($condiciones_array as $condicion) {
    $pdf->MultiCell(0, 5, utf8_decode("- $condicion")); // Ajustar altura de celda a 5
}
$pdf->Ln(10);

// Saludo
$pdf->Cell(0, 10, utf8_decode("Saluda atentamente:"), 0, 1, 'R');
$pdf->Cell(0, 10, utf8_decode($saludo), 0, 1, 'R');

// Generar nombre del archivo
$nombreArchivo = "Cotizacion_{$cliente}_{$fecha}.pdf";

// Salida
$pdf->Output('D', $nombreArchivo); 
?>