// ===============================
// FIREBASE CONFIG
// ===============================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { 
    getFirestore, 
    collection, 
    getDocs, 
    addDoc, 
    serverTimestamp 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

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

// ===============================
// CARGAR CATEGORÍAS / VERSÍCULOS
// ===============================
async function cargarCategorias() {
    const contenedor = document.getElementById("contenedorBotones");
    const textoBiblico = document.getElementById("texto-biblico");
    const citaBiblica = document.getElementById("cita-biblica");

    if (!contenedor) return;

    contenedor.innerHTML = `
        <div class="loader-container">
            <div class="corazon-latido">❤️</div>
            <p class="cargando-texto">Buscando promesas para ti...</p>
        </div>
    `;

    try {
        const querySnapshot = await getDocs(collection(db, "categorias"));
        contenedor.innerHTML = "";

        if (querySnapshot.empty) {
            contenedor.innerHTML = "<p>Pronto añadiremos más bendiciones.</p>";
            return;
        }

        querySnapshot.forEach((doc) => {
            const datos = doc.data();
            const boton = document.createElement("button");

            boton.className = "btn-cat";
            boton.textContent = datos.nombre;

            boton.addEventListener("click", () => {
                textoBiblico.style.opacity = 0;

                setTimeout(() => {
                    textoBiblico.textContent = datos.texto;
                    citaBiblica.textContent = datos.cita;
                    textoBiblico.style.opacity = 1;
                }, 300);
            });

            contenedor.appendChild(boton);
        });

    } catch (error) {
        console.error("Error cargando categorías:", error);
        contenedor.innerHTML = "<p>Error al conectar con las bendiciones.</p>";
    }
}

// ===============================
// FORMULARIO DE ORACIÓN
// ===============================
const formOracion = document.getElementById("formOracion");

if (formOracion) {
    formOracion.addEventListener("submit", async (e) => {
        e.preventDefault();

        const btnEnviar = formOracion.querySelector("button");
        btnEnviar.textContent = "Enviando...";
        btnEnviar.disabled = true;

        try {
            await addDoc(collection(db, "oraciones"), {
                nombre: document.getElementById("nombreInput").value.trim(),
                peticion: document.getElementById("peticionInput").value.trim(),
                fecha: serverTimestamp()
            });

            alert("🙏 Tu petición fue enviada. Estamos orando por ti.");
            formOracion.reset();

        } catch (error) {
            console.error("Error al enviar oración:", error);
            alert("❌ Ocurrió un error al enviar tu petición.");
        } finally {
            btnEnviar.textContent = "Enviar petición 🙏";
            btnEnviar.disabled = false;
        }
    });
}

// ===============================
// FORMULARIO DE CONTACTO
// ===============================
const formContacto = document.getElementById("formContacto");

if (formContacto) {
    formContacto.addEventListener("submit", async (e) => {
        e.preventDefault();

        const btn = formContacto.querySelector("button");
        btn.textContent = "Enviando...";
        btn.disabled = true;

        try {
            await addDoc(collection(db, "contacto"), {
                nombre: document.getElementById("nombreContacto").value.trim(),
                email: document.getElementById("emailContacto").value.trim(),
                mensaje: document.getElementById("mensajeContacto").value.trim(),
                fecha: serverTimestamp()
            });

            alert("📩 Mensaje enviado correctamente.");
            formContacto.reset();

        } catch (error) {
            console.error("Error en contacto:", error);
            alert("❌ No se pudo enviar el mensaje.");
        } finally {
            btn.textContent = "Enviar Mensaje";
            btn.disabled = false;
        }
    });
}

// ===============================
// INICIO
// ===============================
window.addEventListener("load", cargarCategorias);
