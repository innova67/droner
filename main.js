// --------------- LECTOR QR ---------------
var resultContainer = document.getElementById("seriales");
var countResults = 0;
var lastQr = null;

function onScanSuccess(decodedText, decodedResult) {
	// si se lee un nuevo codigo
	if (lastQr != decodedText) {
		// consola
		console.log(`Code matched = ${decodedText}`, decodedResult);
		// guardar codigo
		lastQr = decodedText;
		// sumar contador
		++countResults;
		// mostrar en la pagina lo que se detecta
		resultContainer.innerHTML += `<div>[${countResults}] - ${decodedText}</div>`;
	}
}
// crear objeto de API
let scanner = new Html5QrcodeScanner(
	"qr-reader-box",
	{ 
		fps: 10, 
		qrbox: { width: 300, height: 300 },
		rememberLastUsedCamera: true, 
		showTorchButtonIfSupported: true 
	},
	/* verbose= */ false
);

// renderizar objeto API
scanner.render(onScanSuccess);




// --------------- FORMULARIO CLIENTE ---------------
var fcliente = document.getElementById("cliente-info");

var nombre = document.getElementById("c-nombre").value;
var apellido = document.getElementById("c-apellidos").value;
var empresa = document.getElementById("c-empresa").value;
var direccion = document.getElementById("c-direccion").value;
var email = document.getElementById("c-email").value;
var telefono = document.getElementById("c-telefono").value;
var departamento = document.getElementById("c-departamento").value;

function generarExcel() {

	// Obtener libro de trabajo del servidor
	function jalarExcel() {
		return new Promise(function (resolve, reject) {
			var req = new XMLHttpRequest();
			var url = "templates/template_diagnostico.xlsx";
			req.open("GET", url, true);
			req.responseType = "arraybuffer";
			req.onreadystatechange = function () {
				if (req.readyState === 4){
					if (req.status === 200) {
						resolve(XlsxPopulate.fromDataAsync(req.response));
					} else {
						reject("Received a " + req.status + " HTTP code.");
					}
				}
			};
			req.send();
		});
    }
	
	// Rellenar libro de trabajo
	const workbook = jalarExcel().then(workbook => {

		// obtener fecha para nombre de archivo
		const fecha = new Date();
		const anoActual = fecha.getFullYear();
		const hoy = fecha.getDate();
		const mesActual = fecha.getMonth() + 1;

		console.log(fecha);
		console.log(typeof nombre);
		console.log(apellido);
		console.log(empresa);

		// Usar la primer hoja del libro de trabajo
		const sheet = workbook.sheet(0);

		// Agregar datos a la hoja
		let auxNombre = nombre + " " + apellido;
		// sheet.cell("A25").value(auxNombre);
		// sheet.cell("A28").value(email);
		sheet.cell("D25").value(direccion);
		// sheet.cell("D28").value(telefono);
		sheet.cell("G25").value(empresa);
		sheet.cell("G28").value(departamento);

		// Descargar excel
		workbook.outputAsync().then(function (blob) {
			// Crear un objeto URL para el Blob
			var url = URL.createObjectURL(blob);

			// Crear un objeto FileReader para leer el Blob como ArrayBuffer
			var reader = new FileReader();
			reader.readAsArrayBuffer(blob);

			// Cuando el FileReader termine de leer el Blob, generar archivo Excel y descargar
			reader.onloadend = function () {

				if (mesActual < 10) {
					mesActual = "0"+ mesActual.toString();
				}
				let auxNomArch = hoy.toString()+mesActual.toString()+anoActual.toString()+"-01"+".xlsx";

				// Descargar archivo Excel
				var excelLink = document.createElement("a");
				excelLink.href = url;
				excelLink.download = auxNomArch;
				excelLink.click();
				
				// Liberar el objeto URL
				URL.revokeObjectURL(url);
			};
		});
	});
}

// escuchando cuando se envie el formulario
fcliente.addEventListener("submit", (event) => {
	// evitar que se borren los datos ingresados en el formulario hasta no estar seguros de que todo esta bien
	event.preventDefault();
	// rellenar excel
	generarExcel()
});