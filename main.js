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
	// Crear objeto con datos a guardar
	const data = { nombre, apellido, empresa, direccion, email, telefono, departamento };

	// Obtener libro de trabajo actual
	const workbook = XlsxPopulate.fromBlankAsync().then(workbook => {

		// Usar la primer hoja del libro de trabajo
		const sheet = workbook.sheet(0);

		// Agregar datos a la hoja
		sheet.cell("A1").value([Object.keys(data)]);
		sheet.cell("A2").value([Object.values(data)]);

		// Generar PDF con el blob llenado
		workbook.outputAsync().then(function (blob) {
			// Crear un objeto URL para el Blob
			var url = URL.createObjectURL(blob);

			// Crear un objeto FileReader para leer el Blob como ArrayBuffer
			var reader = new FileReader();
			reader.readAsArrayBuffer(blob);

			// Cuando el FileReader termine de leer el Blob, generar archivo Excel y descargar
			reader.onloadend = function () {
				// Descargar archivo Excel
				var excelLink = document.createElement("a");
				excelLink.href = url;
				excelLink.download = "informacion.xlsx";
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
	// mostrar datos en consola
	console.log(
		nombre,
		apellido,
		empresa,
		direccion,
		email,
		telefono,
		departamento
	);
	// rellenar excel
	generarExcel()
});