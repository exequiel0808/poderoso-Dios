// ==========================================
// FIREBASE CONFIG
// ==========================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

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
// VERSÍCULO DEL DÍA (JSON DESDE GITHUB)
// ==========================================
async function cargarVersiculoDiario() {
  const URL_JSON =
    "https://raw.githubusercontent.com/exequiel0808/poderoso-Dios/main/biblia-completa-rv1960.json";

  const texto = document.getElementById("texto-dia");
  const cita = document.getElementById("cita-dia");

  if (!texto || !cita) return;

  try {
    const res = await fetch(URL_JSON + "?t=" + Date.now());
    const biblia = await res.json();

    const hoy = new Date();
    const inicio = new Date(hoy.getFullYear(), 0, 0);
    const diff = hoy - inicio;
    const dia = Math.floor(diff / (1000 * 60 * 60 * 24));

    const versiculo = biblia[dia % biblia.length];

    texto.textContent = `"${versiculo.texto}"`;
    cita.textContent = versiculo.cita;
  } catch (e) {
    console.error("Error versículo diario:", e);
    texto.textContent =
      "Lámpara es a mis pies tu palabra, y lumbrera a mi camino.";
    cita.textContent = "Salmos 119:105";
  }
}

// ==========================================
// CATEGORÍAS DE VERSÍCULOS (FIREBASE)
// ==========================================
async function cargarCategorias() {
  const contenedor = document.getElementById("contenedorBotones");
  const texto = document.getElementById("texto-biblico");
  const cita = document.getElementById("cita-biblica");

  if (!contenedor) return;

  contenedor.innerHTML = "Cargando categorías...";

  try {
    const snap = await getDocs(collection(db, "categorias"));
    contenedor.innerHTML = "";

    snap.forEach(doc => {
      const data = doc.data();
      const btn = document.createElement("button");
      btn.className = "btn-cat";
      btn.textContent = data.nombre;

      btn.addEventListener("click", () => {
        texto.textContent = data.texto;
        cita.textContent = data.cita;
      });

      contenedor.appendChild(btn);
    });
  } catch (e) {
    console.error(e);
    contenedor.innerHTML =
      "No se pudieron cargar las categorías en este momento.";
  }
}

// ==========================================
// FORMULARIO DE ORACIÓN (FIREBASE)
// ==========================================
const formOracion = document.getElementById("formOracion");

if (formOracion) {
  formOracion.addEventListener("submit", async e => {
    e.preventDefault();

    try {
      await addDoc(collection(db, "oraciones"), {
        nombre: document.getElementById("nombreInput").value.trim(),
        peticion: document.getElementById("peticionInput").value.trim(),
        fecha: serverTimestamp()
      });

      alert("🙏 Tu petición fue enviada. Estamos orando por ti.");
      formOracion.reset();
    } catch (e) {
      alert("❌ No se pudo enviar la petición.");
    }
  });
}

// ==========================================
// FORMULARIO DE CONTACTO (FIREBASE)
// ==========================================
const formContacto = document.getElementById("formContacto");

if (formContacto) {
  formContacto.addEventListener("submit", async e => {
    e.preventDefault();

    try {
      await addDoc(collection(db, "contacto"), {
        nombre: document.getElementById("nombreC").value.trim(),
        email: document.getElementById("emailC").value.trim(),
        mensaje: document.getElementById("mensajeC").value.trim(),
        fecha: serverTimestamp()
      });

      alert("📩 Mensaje enviado correctamente.");
      formContacto.reset();
    } catch (e) {
      alert("❌ Error al enviar el mensaje.");
    }
  });
}

// ==========================================
// FUNDAMENTOS DE FE – FAQ (ACORDEÓN)
// ==========================================
function inicializarAcordeon() {
  const items = document.querySelectorAll(".faq-item");

  items.forEach(item => {
    const question = item.querySelector(".faq-question");
    const answer = item.querySelector(".faq-answer");
    const icon = question.querySelector("i");

    question.addEventListener("click", () => {
      const abierto = item.classList.contains("activo");

      items.forEach(i => {
        i.classList.remove("activo");
        i.querySelector(".faq-answer").style.maxHeight = null;
        const ic = i.querySelector("i");
        ic.classList.remove("fa-minus");
        ic.classList.add("fa-plus");
      });

      if (!abierto) {
        item.classList.add("activo");
        answer.style.maxHeight = answer.scrollHeight + "px";
        icon.classList.remove("fa-plus");
        icon.classList.add("fa-minus");
      }
    });
  });
}

// ==========================================
// INICIALIZACIÓN GENERAL
// ==========================================
window.addEventListener("DOMContentLoaded", () => {
  cargarVersiculoDiario();
  cargarCategorias();
  inicializarAcordeon();
});
