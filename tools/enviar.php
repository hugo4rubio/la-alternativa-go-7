<?php
/* =============================================================================
   enviar.php — Recibe el formulario y envía el correo con formato
   -----------------------------------------------------------------------------
   Alternativa a FormSubmit, sin intermediarios: los datos van de tu web a tu
   correo y no pasan por ningún tercero. Necesita que tu hosting admita PHP.

   CÓMO USARLO
   1. Sube este archivo a la RAÍZ de la web (junto a index.html).
   2. En assets/js/form.js cambia el endpoint:
          endpoint: 'enviar.php'
   3. Envía el formulario una vez para comprobar que llega.

   Si no llega nada, casi siempre es que el hosting tiene mail() capado.
   Pregunta a tu proveedor por los datos SMTP y usa PHPMailer.
   ============================================================================= */

declare(strict_types=1);

const DESTINO = 'hugo4rubio@gmail.com';
const MARCA   = 'La Alternativa Go';
const AMARILLO = '#ffc300';

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'Método no permitido']);
    exit;
}

/* -------- Entrada --------
   El formulario manda JSON. Se acepta también POST clásico por si algún día
   se envía desde otro sitio. */
$entrada = $_POST;
$crudo = file_get_contents('php://input');
if ($crudo !== false && $crudo !== '') {
    $json = json_decode($crudo, true);
    if (is_array($json)) {
        $entrada = $json;
    }
}

/* Trampa antispam: los robots rellenan los campos ocultos */
if (!empty($entrada['_honey'])) {
    echo json_encode(['ok' => true]);   // fingimos éxito y no enviamos nada
    exit;
}

/* -------- Utilidades -------- */

function campo(string $clave, int $max = 500): string
{
    global $entrada;
    $valor = trim((string)($entrada[$clave] ?? ''));
    $valor = str_replace(["\r", "\n"], ' ', $valor);   // evita inyección de cabeceras
    return mb_substr($valor, 0, $max);
}

function esc(string $texto): string
{
    return htmlspecialchars($texto, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

function fechaLarga(string $iso): string
{
    $partes = explode('-', $iso);
    if (count($partes) !== 3) return $iso;

    $meses = ['enero','febrero','marzo','abril','mayo','junio','julio',
              'agosto','septiembre','octubre','noviembre','diciembre'];
    $mes = $meses[(int)$partes[1] - 1] ?? $partes[1];

    return sprintf('%d de %s de %s', (int)$partes[2], $mes, $partes[0]);
}

/* -------- Datos recibidos -------- */

$nombre    = trim(campo('nombre', 80) . ' ' . campo('apellidos', 120));
$telefono  = campo('telefono', 40);
$email     = campo('email', 120);
$servicio  = campo('servicio', 80);
$evento    = campo('tipoEvento', 80);
$fechaIso  = campo('fecha', 20);
$localidad = campo('localidad', 120);
$personas  = campo('personas', 10);
$mensaje   = mb_substr(trim((string)($entrada['mensaje'] ?? '')), 0, 3000);

/* Validación en servidor: nunca confíes sólo en la del navegador */
if ($nombre === '' || $telefono === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(422);
    echo json_encode(['ok' => false, 'error' => 'Faltan datos obligatorios']);
    exit;
}

$filas = [
    'Cliente'             => $nombre,
    'Teléfono'            => $telefono,
    'Email'               => $email,
    'Servicio solicitado' => $servicio,
    'Tipo de evento'      => $evento,
    'Fecha del evento'    => $fechaIso !== '' ? fechaLarga($fechaIso) : '—',
    'Localidad'           => $localidad,
    'Personas (aprox.)'   => $personas !== '' ? $personas : 'Sin especificar',
];

/* -------- Asunto: legible de un vistazo en la bandeja -------- */
$asuntoPartes = ['Presupuesto'];
if ($evento !== '')   $asuntoPartes[] = $evento;
if ($fechaIso !== '') {
    $p = explode('-', $fechaIso);
    if (count($p) === 3) $asuntoPartes[] = "$p[2]/$p[1]/$p[0]";
}
if ($localidad !== '') $asuntoPartes[] = $localidad;
$asunto = implode(' · ', $asuntoPartes);

/* -------- Versión en texto plano (para clientes sin HTML) -------- */
$textoPlano = "Nueva solicitud de presupuesto — " . MARCA . "\n\n";
foreach ($filas as $etiqueta => $valor) {
    $textoPlano .= $etiqueta . ': ' . $valor . "\n";
}
$textoPlano .= "\nMensaje:\n" . ($mensaje !== '' ? $mensaje : '—') . "\n";

/* -------- Versión con formato --------
   Correo en tablas y con estilos en línea: es la única forma de que se vea
   igual en Gmail, Outlook y el móvil. Nada de CSS externo ni flexbox. */
$filasHtml = '';
foreach ($filas as $etiqueta => $valor) {
    $filasHtml .= '
      <tr>
        <td style="padding:12px 16px;border-bottom:1px solid #eeeeee;font-size:13px;
                   color:#666666;white-space:nowrap;vertical-align:top;">' . esc($etiqueta) . '</td>
        <td style="padding:12px 16px;border-bottom:1px solid #eeeeee;font-size:15px;
                   color:#111111;font-weight:600;">' . esc($valor) . '</td>
      </tr>';
}

$mensajeHtml = $mensaje !== ''
    ? nl2br(esc($mensaje))
    : '<span style="color:#999999;">Sin mensaje</span>';

$html = '<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><title>' . esc($asunto) . '</title></head>
<body style="margin:0;padding:24px 12px;background:#f4f4f4;
             font-family:Arial,Helvetica,sans-serif;">

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:580px;margin:0 auto;">

    <!-- Cabecera -->
    <tr>
      <td style="background:#000000;padding:24px;border-radius:10px 10px 0 0;">
        <div style="color:' . AMARILLO . ';font-size:12px;letter-spacing:2px;
                    text-transform:uppercase;font-weight:bold;">' . MARCA . '</div>
        <div style="color:#ffffff;font-size:22px;font-weight:bold;margin-top:6px;">
          Nueva solicitud de presupuesto
        </div>
      </td>
    </tr>

    <!-- Datos -->
    <tr>
      <td style="background:#ffffff;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">' . $filasHtml . '
        </table>
      </td>
    </tr>

    <!-- Mensaje del cliente -->
    <tr>
      <td style="background:#ffffff;padding:16px;">
        <div style="font-size:13px;color:#666666;margin-bottom:8px;">Mensaje</div>
        <div style="background:#fafafa;border-left:4px solid ' . AMARILLO . ';padding:14px;
                    font-size:15px;color:#111111;line-height:1.6;">' . $mensajeHtml . '</div>
      </td>
    </tr>

    <!-- Acciones rápidas -->
    <tr>
      <td style="background:#ffffff;padding:8px 16px 24px;">
        <a href="tel:' . esc($telefono) . '"
           style="display:inline-block;background:' . AMARILLO . ';color:#000000;
                  text-decoration:none;font-weight:bold;font-size:14px;
                  padding:12px 22px;border-radius:999px;margin-right:8px;">Llamar</a>
        <a href="mailto:' . esc($email) . '?subject=' . rawurlencode('Re: ' . $asunto) . '"
           style="display:inline-block;background:#000000;color:#ffffff;
                  text-decoration:none;font-weight:bold;font-size:14px;
                  padding:12px 22px;border-radius:999px;">Responder</a>
      </td>
    </tr>

    <!-- Pie -->
    <tr>
      <td style="background:#000000;padding:16px;border-radius:0 0 10px 10px;
                 text-align:center;font-size:12px;color:#999999;">
        Enviado desde el formulario de ' . esc($_SERVER['HTTP_HOST'] ?? 'la web') . '
      </td>
    </tr>

  </table>
</body>
</html>';

/* -------- Envío: texto plano + HTML en el mismo correo -------- */
$limite = 'lag_' . bin2hex(random_bytes(12));
$dominio = $_SERVER['HTTP_HOST'] ?? 'localhost';

$cabeceras = implode("\r\n", [
    'From: ' . MARCA . ' <no-reply@' . $dominio . '>',
    'Reply-To: ' . $nombre . ' <' . $email . '>',   // responder va al cliente
    'MIME-Version: 1.0',
    'Content-Type: multipart/alternative; boundary="' . $limite . '"',
    'X-Mailer: PHP/' . phpversion(),
]);

$cuerpo =
    "--$limite\r\n" .
    "Content-Type: text/plain; charset=UTF-8\r\n" .
    "Content-Transfer-Encoding: 8bit\r\n\r\n" .
    $textoPlano . "\r\n" .
    "--$limite\r\n" .
    "Content-Type: text/html; charset=UTF-8\r\n" .
    "Content-Transfer-Encoding: 8bit\r\n\r\n" .
    $html . "\r\n" .
    "--$limite--";

/* El asunto se codifica para que las tildes y la «·» no se rompan */
$asuntoCodificado = '=?UTF-8?B?' . base64_encode($asunto) . '?=';

if (mail(DESTINO, $asuntoCodificado, $cuerpo, $cabeceras)) {
    echo json_encode(['ok' => true]);
} else {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'No se pudo enviar el correo']);
}
