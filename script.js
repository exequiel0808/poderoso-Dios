import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, getDocs, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDg6RXRQLroOmsmIlziXlv1Rqnp3qaeEoM",
  authDomain: "poderoso-es-dios-b59f6.firebaseapp.com",
  projectId: "poderoso-es-dios-b59f6",
  storageBucket: "poderoso-es-dios-b59f6.firebasestorage.app",
  messagingSenderId: "974573934460",
  appId: "1:974573934460:web:67983211175a88811db6f9"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// CARGAR CATEGORÍAS
async function cargarCategorias() {
    const contenedor = document.getElementById("contenedorBotones");
    const textoBiblico = document.getElementById("texto-biblico");
    const citaBiblica = document.getElementById("cita-biblica");Q
    
    if (!contenedor) return;

    contenedor.innerHTML = `
        <div class="loader-container">
            <div class="corazon-latido">❤️</div>
            <p class="cargando-texto">Buscando promesas para ti...</p>
        </div>`;

    try {
        const snapshot = await getDocs(collection(db, "categorias"));
        contenedor.innerHTML = "";
        
        snapshot.forEach(doc => {
            const datos = doc.data();
            const btn = document.createElement("button");
            btn.className = "btn-cat";
            btn.textContent = datos.nombre;
            btn.addEventListener("click", () => {
                textoBiblico.style.opacity = 0;
                setTimeout(() => {
                    textoBiblico.textContent = datos.texto;
                    citaBiblica.textContent = datos.cita;
                    textoBiblico.style.opacity = 1;
                }, 300);
            });
            contenedor.appendChild(btn);
        });
    } catch (error) {
        console.error("Error Firebase:", error);
        contenedor.innerHTML = "<p>El servicio está descansando por hoy. Por favor, vuelve mañana para ver más versículos.</p>";
    }
}

// FORMULARIO DE ORACIÓN
const formOracion = document.getElementById("formOracion");
if (formOracion) {
    formOracion.addEventListener("submit", async (e) => {
        e.preventDefault();
        const btn = formOracion.querySelector("button");
        btn.textContent = "Enviando...";
        btn.disabled = true;

        try {
            await addDoc(collection(db, "oraciones"), {
                nombre: document.getElementById("nombreInput").value.trim(),
                peticion: document.getElementById("peticionInput").value.trim(),
                fecha: serverTimestamp()
            });
            alert("🙏 Tu petición ha sido recibida. Estaremos orando por ti.");
            formOracion.reset();
        } catch (error) {
            alert("❌ Lo sentimos, el límite de peticiones diarias se ha alcanzado. Intenta de nuevo mañana.");
        } finally {
            btn.textContent = "Enviar petición 🙏";
            btn.disabled = false;
        }
    });
}

// FORMULARIO DE CONTACTO
const formContacto = document.getElementById("formContacto");
if (formContacto) {
    formContacto.addEventListener("submit", async (e) => {
        e.preventDefault();
        const btn = formContacto.querySelector(".btn-azul-mensaje");
        btn.textContent = "Enviando...";
        btn.disabled = true;

        try {
            await addDoc(collection(db, "contacto"), {
                nombre: document.getElementById("nombreC").value.trim(),
                email: document.getElementById("emailC").value.trim(),
                mensaje: document.getElementById("mensajeC").value.trim(),
                fecha: serverTimestamp()
            });
            alert("📩 Mensaje enviado con éxito.");
            formContacto.reset();
        } catch (error) {
            alert("❌ Hubo un error al enviar el mensaje.");
        } finally {
            btn.textContent = "Enviar mensaje";
            btn.disabled = false;
        }
    });
}

window.addEventListener("load", cargarCategorias);
// ==========================================
// VERSÍCULO DEL DÍA (JSON DESDE GITHUB)
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    cargarVersiculoDiario();
});

async function cargarVersiculoDiario() {
    const URL_JSON = "https://raw.githubusercontent.com/exequiel0808/poderoso-Dios/main/biblia-completa-rv1960.json";

    const textoDia = document.getElementById("versiculo-dia-texto");
    const citaDia = document.getElementById("versiculo-dia-cita");

    if (!textoDia || !citaDia) {
        console.error("❌ No se encontraron los elementos del versículo del día");
        return;
    }

    try {
        const respuesta = await fetch(URL_JSON + "?v=" + new Date().getTime());
        const biblia = await respuesta.json();

        const hoy = new Date();
        const inicioAnio = new Date(hoy.getFullYear(), 0, 0);
        const dif = hoy - inicioAnio;
        const diaDelAnio = Math.floor(dif / (1000 * 60 * 60 * 24));

        const indice = diaDelAnio % biblia.length;
        const versiculo = biblia[indice];

        textoDia.textContent = `"${versiculo.texto}"`;
        citaDia.textContent = versiculo.cita;

        console.log("✅ Versículo del día cargado:", versiculo.cita);

    } catch (error) {
        console.error("❌ Error cargando el versículo del día:", error);
        textoDia.textContent = "Lámpara es a mis pies tu palabra, y lumbrera a mi camino.";
        citaDia.textContent = "Salmos 119:105";
    }
}



// Llama a la función al cargar la página
window.addEventListener("load", () => {
    cargarVersiculoDiario(); // Nueva función
    cargarCategorias();      // Tu función existente de Firebase
});
