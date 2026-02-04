// =============================================
// FIREBASE CONFIGURACIÓN
// =============================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, getDocs, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDg6RXRQLroOmsmIlziXlv1Rqnp3qaeEoM",
  authDomain: "poderoso-es-dios-b59f6.firebaseapp.com",
  projectId: "poderoso-es-dios-b59f6",
  storageBucket: "poderoso-es-dios-b59f6.appspot.com",
  messagingSenderId: "974573934460",
  appId: "1:974573934460:web:67983211175a88811db6f9"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// =============================================
// VERSÍCULO DEL DÍA (JSON GITHUB)
// =============================================
async function cargarVersiculoDiario() {
  const URL_JSON = "https://raw.githubusercontent.com/exequiel0808/poderoso-Dios/main/biblia-completa-rv1960.json";

  const textoDia = document.getElementById("texto-dia");
  const citaDia = document.getElementById("cita-dia");

  if (!textoDia || !citaDia) return;

  try {
    const res = await fetch(URL_JSON + "?v=" + new Date().getDate());
    const biblia = await res.json();

    const hoy = new Date();
    const inicio = new Date(hoy.getFullYear(), 0, 0);
    const diaAnio = Math.floor((hoy - inicio) / (1000 * 60 * 60 * 24));

    const versiculo = biblia[diaAnio % biblia.length];

    textoDia.textContent = `"${versiculo.texto}"`;
    citaDia.textContent = versiculo.cita;
  } catch (e) {
    textoDia.textContent = "Lámpara es a mis pies tu palabra, y lumbrera a mi camino.";
    citaDia.textContent = "Salmos 119:105";
  }
}

// =============================================
// MODO OSCURO
// =============================================
function iniciarModoOscuro() {
  const btn = document.getElementById("btnModoOscuro");
  if (!btn) return;

  if (localStorage.getItem("modo") === "dark") {
    document.body.classList.add("dark");
    btn.textContent = "☀️";
  }

  btn.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    const activo = document.body.classList.contains("dark");
    btn.textContent = activo ? "☀️" : "🌙";
    localStorage.setItem("modo", activo ? "dark" : "light");
  });
}

// =============================================
// MÚSICA DE FONDO
// =============================================
function iniciarMusica() {
  const audio = document.getElementById("audioVersiculos");
  const btn = document.getElementById("btnMusicaVersiculos");
  if (!audio || !btn) return;

  audio.volume = 0.3;

  btn.addEventListener("click", () => {
    if (audio.paused) {
      audio.play();
      btn.classList.add("activo");
    } else {
      audio.pause();
      btn.classList.remove("activo");
    }
  });
}

// =============================================
// CARGAR CATEGORÍAS
// =============================================
async function cargarCategorias() {
  const contenedor = document.getElementById("contenedorBotones");
  const texto = document.getElementById("texto-biblico");
  const cita = document.getElementById("cita-biblica");

  if (!contenedor) return;

  contenedor.innerHTML = "Cargando categorías…";

  try {
    const snap = await getDocs(collection(db, "categorias"));
    contenedor.innerHTML = "";

    snap.forEach(doc => {
      const d = doc.data();
      const btn = document.createElement("button");
      btn.className = "btn-cat";
      btn.textContent = d.nombre;

      btn.onclick = () => {
        texto.style.opacity = 0;
        setTimeout(() => {
          texto.textContent = d.texto;
          cita.textContent = d.cita;
          texto.style.opacity = 1;
        }, 300);
      };

      contenedor.appendChild(btn);
    });
  } catch (e) {
    contenedor.innerHTML = "Error al cargar categorías";
  }
}

// =============================================
// FORMULARIO ORACIÓN
// =============================================
const formOracion = document.getElementById("formOracion");
if (formOracion) {
  formOracion.addEventListener("submit", async e => {
    e.preventDefault();
    const btn = formOracion.querySelector("button");
    btn.disabled = true;
    btn.textContent = "Enviando…";

    try {
      await addDoc(collection(db, "oraciones"), {
        nombre: nombreInput.value,
        peticion: peticionInput.value,
        fecha: serverTimestamp()
      });
      alert("🙏 Tu petición fue enviada. Estamos orando por ti.");
      formOracion.reset();
    } catch {
      alert("❌ Error al enviar tu petición");
    } finally {
      btn.disabled = false;
      btn.textContent = "Enviar petición 🙏";
    }
  });
}

// =============================================
// FORMULARIO CONTACTO
// =============================================
const formContacto = document.getElementById("formContacto");
if (formContacto) {
  formContacto.addEventListener("submit", async e => {
    e.preventDefault();
    const btn = formContacto.querySelector("button");
    btn.disabled = true;
    btn.textContent = "Enviando…";

    try {
      await addDoc(collection(db, "contacto"), {
        nombre: nombreC.value,
        email: emailC.value,
        mensaje: mensajeC.value,
        fecha: serverTimestamp()
      });
      alert("📩 Mensaje enviado correctamente");
      formContacto.reset();
    } catch {
      alert("❌ Error al enviar mensaje");
    } finally {
      btn.disabled = false;
      btn.textContent = "Enviar mensaje";
    }
  });
}

// =============================================
// INICIO
// =============================================
window.addEventListener("load", () => {
  cargarVersiculoDiario();
  cargarCategorias();
  iniciarModoOscuro();
  iniciarMusica();
});
