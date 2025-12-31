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
// VERSÍCULO DEL DÍA (DESDE JSON)
// ===============================
function cargarVersiculoDelDia() {
  fetch("biblia_rvr1960.json")
    .then(res => res.json())
    .then(data => {
      const libros = Object.keys(data.libros);
      const libro = libros[Math.floor(Math.random() * libros.length)];

      const caps = Object.keys(data.libros[libro]);
      const cap = caps[Math.floor(Math.random() * caps.length)];

      const vers = Object.keys(data.libros[libro][cap]);
      const v = vers[Math.floor(Math.random() * vers.length)];

      document.getElementById("versiculo-dia-texto").textContent =
        `"${data.libros[libro][cap][v]}"`;

      document.getElementById("versiculo-dia-cita").textContent =
        `${libro} ${cap}:${v}`;
    })
    .catch(err => {
      console.error("Error cargando Biblia:", err);
      document.getElementById("versiculo-dia-texto").textContent =
        "No se pudo cargar el versículo 🙏";
    });
}

// ===============================
// MODO OSCURO
// ===============================
function inicializarModoOscuro() {
  const btn = document.getElementById("btnModoOscuro");
  if (!btn) return;

  const modo = localStorage.getItem("modoOscuro");
  if (modo === "on") {
    document.body.classList.add("modo-oscuro");
    btn.textContent = "☀️";
  }

  btn.addEventListener("click", () => {
    document.body.classList.toggle("modo-oscuro");
    const activo = document.body.classList.contains("modo-oscuro");
    btn.textContent = activo ? "☀️" : "🌙";
    localStorage.setItem("modoOscuro", activo ? "on" : "off");
  });
}

// ===============================
// MÚSICA
// ===============================
function inicializarMusica() {
  const audioV = document.getElementById("audioVersiculos");
  const audioO = document.getElementById("audioOracion");
  const btnV = document.getElementById("btnMusicaVersiculos");
  const btnO = document.getElementById("btnMusicaOracion");

  if (audioV) audioV.volume = 0.3;
  if (audioO) audioO.volume = 0.3;

  btnV?.addEventListener("click", () => {
    audioV.paused ? audioV.play() : audioV.pause();
  });

  btnO?.addEventListener("click", () => {
    audioO.paused ? audioO.play() : audioO.pause();
  });
}

// ===============================
// CARGAR CATEGORÍAS (FIRESTORE)
// ===============================
async function cargarCategorias() {
  const contenedor = document.getElementById("contenedorBotones");
  const texto = document.getElementById("texto-biblico");
  const cita = document.getElementById("cita-biblica");
  if (!contenedor) return;

  contenedor.innerHTML = "Cargando promesas...";

  try {
    const snap = await getDocs(collection(db, "categorias"));
    contenedor.innerHTML = "";

    snap.forEach(doc => {
      const d = doc.data();
      const btn = document.createElement("button");
      btn.className = "btn-cat";
      btn.textContent = d.nombre;
      btn.onclick = () => {
        texto.textContent = d.texto;
        cita.textContent = d.cita;
      };
      contenedor.appendChild(btn);
    });
  } catch (e) {
    contenedor.innerHTML = "Error al cargar versículos";
  }
}

// ===============================
// FORMULARIO ORACIÓN
// ===============================
const formOracion = document.getElementById("formOracion");
if (formOracion) {
  formOracion.addEventListener("submit", async e => {
    e.preventDefault();

    await addDoc(collection(db, "oraciones"), {
      nombre: document.getElementById("nombreInput").value,
      peticion: document.getElementById("peticionInput").value,
      fecha: serverTimestamp()
    });

    alert("🙏 Oración enviada");
    formOracion.reset();
  });
}

// ===============================
// FORMULARIO CONTACTO
// ===============================
const formContacto = document.getElementById("formContacto");
if (formContacto) {
  formContacto.addEventListener("submit", async e => {
    e.preventDefault();

    await addDoc(collection(db, "contacto"), {
      nombre: document.getElementById("nombreC").value,
      email: document.getElementById("emailC").value,
      mensaje: document.getElementById("mensajeC").value,
      fecha: serverTimestamp()
    });

    alert("📩 Mensaje enviado");
    formContacto.reset();
  });
}

// ===============================
// INICIO
// ===============================
window.addEventListener("load", () => {
  cargarVersiculoDelDia();
  cargarCategorias();
  inicializarModoOscuro();
  inicializarMusica();
});

