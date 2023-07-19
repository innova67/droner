// --------------- LECTOR QR ---------------
var resultContainer = document.getElementById("seriales");
var countResults = 0;
var lastQr = null;
const t10Parts = [
	"Dron",
	"Control remoto",
	"Batería Agras",	
	"Cargador T10",
	"Fuente de cargador",
	"Hub de carga WB37",
	"Batería WB37",
	"AC Adapter",
	"Cargador 15W",
	"Modem 4G",
	"Tanque de liquidos",
	"ESC",
	"SOLENOIDE",
	"CAMARA FPV",
	"RADAR OMNIDIRECCIONAL",
	"ANTENA RTK",
	"POWER BOARD",
	"DISTRIBUTION BOARD",
	"BAROMETRO",
	"RADAR SUPERIOR",
	"AERIAL ELECTRONICS",
	"SPRAYING MODULE",
	"RF MODULE",
	"BOMBA",
	"SENSOR DE FLUJO",
	"Sensor de peso",

	"CORREA CONTROL REMOTO",
	"CABLE AC",
	"SET DE BOQUILLAS",
	"CABLE USB TIPO C",
	"SENSOR DE NIVEL",
	"FILTRO TANQUE SUPERIOR",
	"FILTRO TANQUE INFERIOR",
	"FLOTADOR TANQUE",
	"VALVULA DE TANQUE LIQUIDO"
]

const t10Serials = [
	"4VNBJ7500",
	"4D2BJ7H00",
	"3VJPJ64CA",
	"43PHJ5X36",
	"4Q2HJ4X11",
	"0J6BJ7BR0",
	"0DNAI6183",
	"F18253211",
	"143CHAQ13",
	"320715033",

	"4VMBJ7500",
	"3TXBJ6T0A",
	"4BCBJ7500",
	"3TWBJ7500",
	"3TSDJ6J00",
	"3TRBJ6T00",
	"3TUBJ6H00",
	"44FBJ6S10",
	"3TKBJ6U00",
	"3TTDJ4F00",

	"3TNDJ6P00",
	"3TMBJ7500",
	"3TPBJ6P00",
	"3TZBJ6M00",
	"3TYBJ6P00",
	"52VCK8A00" 
]


function serialValidator(serial) {
	// inicializar flag en true para no advertir nada
	var noflag = 0;
	//obtener los primeros 9 numeros del serial escaneado
	var tempComparador = serial.slice(0,9);
	// comparar con el array de seriales
	function compararSerial(element, index){
		// si se encuentra agregar a la lista de items el nombre asociado al serial
		if (tempComparador == element.toString()) {
			resultContainer.innerHTML += `<div>[${t10Parts[index]}] - ${serial}</div>`;
		}
		// sino avisar por consola 
		else {
			noflag++;
		}
	};
	// loop en los seriales para comparar
	t10Serials.forEach(compararSerial);

	// si se pasa por todo el array sin encontrar un match avisar por consola
	if (noflag == t10Serials.length) {
		console.log("no se encontro el serial en la DB");
	}
}

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
		serialValidator(decodedText);
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