import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyBqaBUSSEza1hcpub0CzUTWTPoP0LBrfs0",
    authDomain: "poderoso-es-dios-15744.firebaseapp.com",
    projectId: "poderoso-es-dios-15744",
    storageBucket: "poderoso-es-dios-15744.firebasestorage.app",
    messagingSenderId: "99676155688",
    appId: "1:99676155688:web:583160c8dd0200d8e52a1d"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// --- SEGURIDAD AL CARGAR LA PÁGINA ---
function verificarAcceso() {
    const claveCorrecta = "AdminDios2024"; // Asegúrate de que esta sea la que usas
    const pass = prompt("Clave de acceso:");

    if (pass === claveCorrecta) {
        document.getElementById("adminContent").style.display = "block";
    } else {
        alert("Acceso denegado");
        window.location.href = "index.html";
    }
}

// Ejecutamos la verificación solo una vez
verificarAcceso();

// --- GUARDAR CATEGORÍA SIN RECARGAR ---
const formVer = document.getElementById("formVersiculo");
if (formVer) {
    formVer.addEventListener("submit", async (e) => {
        e.preventDefault(); // ESTO evita que la página se recargue y pida clave de nuevo
        
        const btn = e.target.querySelector("button");
        btn.innerText = "Guardando...";
        btn.disabled = true;

        try {
            await addDoc(collection(db, "categorias"), {
                nombre: document.getElementById("catNombre").value,
                texto: document.getElementById("catTexto").value,
                cita: document.getElementById("catCita").value,
                id: document.getElementById("catId").value.toLowerCase()
            });
            alert("✅ ¡Categoría guardada exitosamente en Firebase!");
            formVer.reset();
        } catch (error) {
            console.error("Error completo:", error);
            alert("❌ Error al guardar. Revisa la consola (F12) o las reglas de Firebase.");
        } finally {
            btn.innerText = "Guardar Categoría";
            btn.disabled = false;
        }
    });
}