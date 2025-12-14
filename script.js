// ---------------------------------------------
// Archivo principal de JavaScript
// Aquí puedes agregar funciones del menú,
// interacción del usuario y futuros módulos.
// ---------------------------------------------

console.log("Página Cristiana cargada correctamente");

// Ejemplo: Animar scroll hacia secciones
document.querySelectorAll("nav a").forEach(enlace => {
    enlace.addEventListener("click", function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute("href"));
        target.scrollIntoView({ behavior: "smooth" });
    });
});
