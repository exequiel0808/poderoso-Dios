// ======================================================
// FIREBASE
// ======================================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "TU_AUTH_DOMAIN",
  projectId: "TU_PROJECT_ID",
  storageBucket: "TU_STORAGE",
  messagingSenderId: "TU_SENDER_ID",
  appId: "TU_APP_ID"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ======================================================
// VERSÍCULO DEL DÍA (JSON DESDE GITHUB)
// ======================================================
async function cargarVersiculoDelDia() {
  const URL_JSON =
    "https://raw.githubusercontent.com/exequiel0808/poderoso-Dios/main/biblia-completa-rv1960.json";

  const texto = document.getElementById("versiculo-dia-texto");
  const cita = document.getElementById("versiculo-dia-cita");

  if (!texto || !cita) return;

  try {
    const res = await fetch(URL_JSON + "?t=" + Date.now());
    const biblia = await res.json();

    const hoy = new Date();
    const inicio = new Date(hoy.getFullYear(), 0, 0);
    const dia = Math.floor((hoy - inicio) / 86400000);

    const versiculo = biblia[dia % biblia.length];

    texto.textContent = `"${versiculo.texto}"`;
    cita.textContent = versiculo.cita;

  } catch (e) {
    texto.textContent =
      "Lámpara es a mis pies tu palabra, y lumbrera a mi camino.";
    cita.textContent = "Salmos 119:105";
  }
}

// ======================================================
// CATEGORÍAS DE VERSÍCULOS (FIREBASE)
// ======================================================
async function cargarCategorias() {
  const contenedor = document.getElementById("contenedorBotones");
  const texto = document.getElementById("texto-biblico");
  const cita = document.getElementById("cita-biblica");

  if (!contenedor) return;

  contenedor.innerHTML = "Cargando...";

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
  } catch {
    contenedor.innerHTML = "No se pudieron cargar los versículos.";
  }
}

// ======================================================
// FORMULARIO ORACIÓN
// ======================================================
const formOracion = document.getElementById("formOracion");
if (formOracion) {
  formOracion.addEventListener("submit", async e => {
    e.preventDefault();

    try {
      await addDoc(collection(db, "oraciones"), {
        nombre: nombreInput.value.trim(),
        peticion: peticionInput.value.trim(),
        fecha: serverTimestamp()
      });

      alert("🙏 Tu petición fue enviada. Estamos orando por ti.");
      formOracion.reset();
    } catch {
      alert("❌ No se pudo enviar la petición.");
    }
  });
}

// ======================================================
// FORMULARIO CONTACTO
// ======================================================
const formContacto = document.getElementById("formContacto");
if (formContacto) {
  formContacto.addEventListener("submit", async e => {
    e.preventDefault();

    try {
      await addDoc(collection(db, "contacto"), {
        nombre: nombreC.value.trim(),
        email: emailC.value.trim(),
        mensaje: mensajeC.value.trim(),
        fecha: serverTimestamp()
      });

      alert("📩 Mensaje enviado correctamente.");
      formContacto.reset();
    } catch {
      alert("❌ Error al enviar mensaje.");
    }
  });
}

// ======================================================
// MODO OSCURO
// ======================================================
const btnModo = document.getElementById("btnModoOscuro");
if (btnModo) {
  if (localStorage.getItem("modo") === "oscuro") {
    document.body.classList.add("modo-oscuro");
    btnModo.textContent = "☀️";
  }

  btnModo.onclick = () => {
    document.body.classList.toggle("modo-oscuro");
    const oscuro = document.body.classList.contains("modo-oscuro");
    btnModo.textContent = oscuro ? "☀️" : "🌙";
    localStorage.setItem("modo", oscuro ? "oscuro" : "claro");
  };
}

// ======================================================
// MÚSICA
// ======================================================
function musica(btnId, audioId) {
  const btn = document.getElementById(btnId);
  const audio = document.getElementById(audioId);
  if (!btn || !audio) return;

  audio.volume = 0.3;

  btn.onclick = () => {
    if (audio.paused) {
      audio.play();
      btn.classList.add("activo");
    } else {
      audio.pause();
      btn.classList.remove("activo");
    }
  };
}

musica("btnMusicaVersiculos", "audioVersiculos");
musica("btnMusicaOracion", "audioOracion");

// ======================================================
// FUNDAMENTOS DE FE (FAQ)
// ======================================================
document.querySelectorAll(".faq-pregunta").forEach(btn => {
  btn.onclick = () => {
    const r = btn.nextElementSibling;
    r.style.display = r.style.display === "block" ? "none" : "block";
  };
});

// ======================================================
// BOTÓN PEDIR ORACIÓN
// ======================================================
document.querySelectorAll("[data-ir-oracion]").forEach(btn => {
  btn.onclick = () =>
    document.getElementById("oracion").scrollIntoView({ behavior: "smooth" });
});

// ======================================================
// INICIO
// ======================================================
window.addEventListener("load", () => {
  cargarVersiculoDelDia();
  cargarCategorias();
});
