<?php
include_once 'cors.php';
header('Content-Type: application/pdf');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
header('Pragma: public');

require('fpdf186/fpdf.php');
include_once 'conexion1.php'; 
session_start();

class PDF extends FPDF {
    public $logoPath;

    function Header() {
        $this->Image('image.png', 10, 10, 30); 
        $this->SetFont('Arial', 'B', 16);
        $this->Cell(0, 10, utf8_decode('COTIZACIÓN'), 0, 0, 'C');
        if (!empty($this->logoPath) && file_exists($this->logoPath)) {
            $this->Image($this->logoPath, 170, 10, 30);
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

$logoPath = null;
if (isset($_FILES['logo']) && $_FILES['logo']['error'] == UPLOAD_ERR_OK) {
    $uploadDir = 'uploads/';
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0755, true);
    }
    $fileName = basename($_FILES['logo']['name']);
    $logoPath = $uploadDir . $fileName;

    if (move_uploaded_file($_FILES['logo']['tmp_name'], $logoPath)) {
        $imageInfo = getimagesize($logoPath);
        if ($imageInfo['mime'] == 'image/png') {
            $image = imagecreatefrompng($logoPath);
            $jpegPath = $uploadDir . pathinfo($fileName, PATHINFO_FILENAME) . '.jpg';
            imagejpeg($image, $jpegPath, 100);
            imagedestroy($image);
            $logoPath = $jpegPath;
        }
    } else {
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
$pdf->logoPath = $logoPath;
$pdf->AddPage();
$pdf->SetFont('Arial', '', 12);

// Sección destinatario
$pdf->Cell(0, 10, utf8_decode("Sres: $destinatario"), 0, 1);
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
foreach ($productos as $producto) {
    $descripcion = utf8_decode($producto['descripcion']);
    $cantidad = $producto['cantidad'];
    $precio = '$' . $producto['precio'];
    $total = '$' . number_format($producto['cantidad'] * $producto['precio'], 2);

    $altura = 8; // Ajustar altura de celda a 8
    $anchoDescripcion = 80;
    $alturaDescripcion = $pdf->GetStringWidth($descripcion) > $anchoDescripcion ? 20 : 10;

    // Guardar posición antes de escribir la descripción
    $x = $pdf->GetX();
    $y = $pdf->GetY();

    // Descripción con salto de línea
    $pdf->MultiCell($anchoDescripcion, $altura, $descripcion, 1);

    // Regresar a la posición original para el resto de las celdas
    $pdf->SetXY($x + $anchoDescripcion, $y);
    $pdf->Cell(30, $alturaDescripcion, $cantidad, 1, 0, 'C');
    $pdf->Cell(40, $alturaDescripcion, $precio, 1, 0, 'C');
    $pdf->Cell(40, $alturaDescripcion, $total, 1, 1, 'C');
}
$pdf->Ln(10); // Salto de línea

// Total
$pdf->SetFont('Arial', 'B', 12);
$pdf->Cell(0, 10, utf8_decode("Total: $monto"), 0, 1, 'R');
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