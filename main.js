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
		qrbox: { width: 250, height: 250 },
		rememberLastUsedCamera: true, 
		showTorchButtonIfSupported: true 
	},
	/* verbose= */ true
);

// ejecutar objeto
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
});