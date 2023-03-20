// --------------- LECTOR QR ---------------
var resultContainer = document.getElementById("qr-results");
var countResults = 0;
var lastQr = null;

// lo que pasa cuando se detecta el QR
function onScanSuccess(decodedText, decodedResult) {
	
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

// lo que pasa cuando no se detecta nada
function onScanFailure(error) {
	// handle scan failure, usually better to ignore and keep scanning.
	// for example:
	console.warn(`Code scan error = ${error}`);
}

// --------------- OBJETOS ---------------
// crear objeto de API
let scanner = new Html5QrcodeScanner(
	"qr-reader",
	{ fps: 10, qrbox: { width: 250, height: 250 } },
	/* verbose= */ false
);

// ejecutar objeto
scanner.render(onScanSuccess, onScanFailure);

// --------------- FORMULARIO CLIENTE ---------------
var fcliente = document.getElementById("cliente-info");

var nombre = document.getElementById("c-nombre").value;
var apellido = document.getElementById("c-apellidos").value;
var empresa = document.getElementById("c-empresa").value;
var direccion = document.getElementById("c-direccion").value;
var email = document.getElementById("c-email").value;
var telefono = document.getElementById("c-telefono").value;
var departamento = document.getElementById("c-departamento").value;

// escuchando cuando se envie el formulario
fcliente.addEventListener("submit", (event) => {
	event.preventDefault();

	console.log(
		nombre,
		apellido,
		empresa,
		direccion,
		email,
		telefono,
		departamento
	);
});