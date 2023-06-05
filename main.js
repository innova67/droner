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

// localizando formulario
var fcliente = document.getElementById("cliente-info");

// escuchando cuando se envie el formulario
fcliente.addEventListener("submit", (event) => {
	
	// evitar que se borren los datos ingresados en el formulario hasta no estar seguros de que todo esta bien
	event.preventDefault();

	// jalando datos ingresados
	var nombre = document.getElementById("c-nombre").value;
	var apellido = document.getElementById("c-apellidos").value;
	var empresa = document.getElementById("c-empresa").value;
	var direccion = document.getElementById("c-direccion").value;
	var email = document.getElementById("c-email").value;
	var telefono = document.getElementById("c-telefono").value;
	var departamento = document.getElementById("c-departamento").value;

	// rellenar excel
	generarExcel(nombre,apellido,empresa,direccion,email,telefono,departamento);
});

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

// rellenando datos y exportando excel
function generarExcel(nom, ape, emp, dir, em, tel, dep) {
	
	// Rellenar libro de trabajo
	const workbook = jalarExcel().then(workbook => {

		// obtener fecha para nombre de archivo
		const fecha = new Date();
		let anoActual = fecha.getFullYear();
		let hoy = fecha.getDate();
		let mesActual = fecha.getMonth() + 1;

		if (mesActual < 10) {
			mesActual = "0"+ mesActual.toString();
		}
		if (hoy < 10) {
			hoy = "0"+ hoy.toString();
		}

		let auxNomArch = hoy.toString()+mesActual.toString()+anoActual.toString()+"-01"+".xlsx";

		console.log(fecha);

		// Usar la primer hoja del libro de trabajo
		const sheet = workbook.sheet(0);

		// Agregar datos a la hoja
		sheet.cell("I5").value(hoy.toString()+mesActual.toString()+anoActual.toString()+"-01");
		sheet.cell("H9").value(hoy);
		sheet.cell("I9").value(mesActual);
		sheet.cell("J9").value(anoActual);
		let auxNom = nom + " " + ape;
		sheet.cell("A25").value(auxNom);
		sheet.cell("A28").value(em);
		sheet.cell("D25").value(emp);
		sheet.cell("D28").value(tel);
		sheet.cell("G25").value(dir);
		sheet.cell("G28").value(dep);

		// Descargar excel
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
				excelLink.download = auxNomArch;
				excelLink.click();
				
				// Liberar el objeto URL
				URL.revokeObjectURL(url);
			};
		});
	});
}