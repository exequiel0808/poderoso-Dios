const claveCorrecta = "DiosEsFiel2024"; // CAMBIA ESTO POR TU CONTRASEÑA
const pass = prompt("Introduce la clave de administrador:");

if (pass === claveCorrecta) {
    document.getElementById("adminContent").style.display = "block";
} else {
    alert("Acceso denegado");
    window.location.href = "index.html";
}

// Aquí agregaríamos la lógica para que el botón "Guardar"
// envíe el nuevo versículo a una colección de Firebase llamada "categorias"