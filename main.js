// --------------- VARIABLES ---------------
var resultContainer = document.getElementById('qr-results');
var countResults = 0;

// --------------- FUNCIONES ---------------
// lo que pasa cuando se detecta el QR
function onScanSuccess(decodedText, decodedResult) {
	// handle the scanned code as you like, for example:
    // mostrar en consola
	console.log(`Code matched = ${decodedText}`, decodedResult);
    // sumar contador
    ++countResults;
    // mostrar en la pagina lo que se detecta
    resultContainer.innerHTML += `<div>[${countResults}] - ${decodedText}</div>`;
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
