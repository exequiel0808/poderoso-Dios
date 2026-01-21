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

// ==========================================
// VERSÍCULO DEL DÍA (CORREGIDO)
// ==========================================
async function cargarVersiculoDiario() {
  const URL_JSON = "https://raw.githubusercontent.com/exequiel0808/poderoso-Dios/main/biblia-completa-rv1960.json";
  const texto = document.getElementById("texto-dia");
  const cita = document.getElementById("cita-dia");

  if (!texto || !cita) {
    console.error("❌ IDs del versículo no encontrados");
    return;
  }

  try {
    // Agregar timestamp para evitar caché
    const cacheBuster = new Date().toISOString().slice(0, 10);
    const res = await fetch(`${URL_JSON}?v=${cacheBuster}`);
    
    if (!res.ok) {
      throw new Error(`Error HTTP: ${res.status}`);
    }
    
    const data = await res.json();
    
    // Extraer todos los versículos
    const versiculos = [];
    
    for (const libro in data) {
      const bookData = data[libro];
      if (bookData.chapters && Array.isArray(bookData.chapters)) {
        bookData.chapters.forEach(chapter => {
          if (chapter.verses && Array.isArray(chapter.verses)) {
            chapter.verses.forEach(v => {
              versiculos.push({
                texto: v.text,
                cita: `${bookData.book} ${chapter.chapter}:${v.verse}`
              });
            });
          }
        });
      }
    }

    if (versiculos.length === 0) {
      throw new Error("No se encontraron versículos en el JSON");
    }

    // OPCIÓN 1: Versículo consistente por día (mismo todo el día)
    // const hoy = new Date();
    // const inicio = new Date(hoy.getFullYear(), 0, 0);
    // const diferencia = hoy - inicio;
    // const diaDelAnio = Math.floor(diferencia / 86400000);
    
    // OPCIÓN 2: Versículo aleatorio (ACTIVO)
    const diaDelAnio = Math.floor(Math.random() * versiculos.length);

    // Seleccionar versículo basado en el día
    const indice = diaDelAnio % versiculos.length;
    const seleccionado = versiculos[indice];

    // Mostrar versículo
    texto.textContent = `"${seleccionado.texto}"`;
    cita.textContent = seleccionado.cita;

    console.log("✅ Versículo del día cargado:", seleccionado.cita);
    console.log("📅 Día del año:", diaDelAnio);
    console.log("📖 Total versículos:", versiculos.length);

  } catch (error) {
    console.error("❌ Error cargando versículo:", error);
    texto.textContent = "Lámpara es a mis pies tu palabra, y lumbrera a mi camino.";
    cita.textContent = "Salmos 119:105";
  }
}

// ==========================================
// CARGAR CATEGORÍAS
// ==========================================
async function cargarCategorias() {
    const contenedor = document.getElementById("contenedorBotones");
    const textoBiblico = document.getElementById("texto-biblico");
    const citaBiblica = document.getElementById("cita-biblica");
    
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

// ==========================================
// FORMULARIO DE ORACIÓN
// ==========================================
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
            console.error("Error:", error);
            alert("❌ Lo sentimos, el límite de peticiones diarias se ha alcanzado. Intenta de nuevo mañana.");
        } finally {
            btn.textContent = "Enviar petición 🙏";
            btn.disabled = false;
        }
    });
}

// ==========================================
// FORMULARIO DE CONTACTO
// ==========================================
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
            console.error("Error:", error);
            alert("❌ Hubo un error al enviar el mensaje.");
        } finally {
            btn.textContent = "Enviar mensaje";
            btn.disabled = false;
        }
    });
}

// ==========================================
// INICIALIZACIÓN
// ==========================================
window.addEventListener("load", () => {
    cargarVersiculoDiario();
    cargarCategorias();
});