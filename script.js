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
// VERSÍCULOS DEL DÍA (ROTACIÓN AUTOMÁTICA)
// ===============================
const versiculosDelDia = [
    {
        texto: "Porque de tal manera amó Dios al mundo, que ha dado a su Hijo unigénito, para que todo aquel que en él cree, no se pierda, mas tenga vida eterna.",
        cita: "Juan 3:16"
    },
    {
        texto: "Todo lo puedo en Cristo que me fortalece.",
        cita: "Filipenses 4:13"
    },
    {
        texto: "Jehová es mi pastor; nada me faltará.",
        cita: "Salmos 23:1"
    },
    {
        texto: "No temas, porque yo estoy contigo; no desmayes, porque yo soy tu Dios que te esfuerzo.",
        cita: "Isaías 41:10"
    },
    {
        texto: "Confía en Jehová con todo tu corazón, y no te apoyes en tu propia prudencia.",
        cita: "Proverbios 3:5"
    },
    {
        texto: "Pedid, y se os dará; buscad, y hallaréis; llamad, y se os abrirá.",
        cita: "Mateo 7:7"
    },
    {
        texto: "La paz os dejo, mi paz os doy; yo no os la doy como el mundo la da. No se turbe vuestro corazón, ni tenga miedo.",
        cita: "Juan 14:27"
    },
    {
        texto: "Jehová está conmigo; no temeré lo que me pueda hacer el hombre.",
        cita: "Salmos 118:6"
    },
    {
        texto: "El Señor es mi luz y mi salvación; ¿de quién temeré?",
        cita: "Salmos 27:1"
    },
    {
        texto: "Porque mis pensamientos no son vuestros pensamientos, ni vuestros caminos mis caminos, dice Jehová.",
        cita: "Isaías 55:8"
    },
    {
        texto: "Y sabemos que a los que aman a Dios, todas las cosas les ayudan a bien.",
        cita: "Romanos 8:28"
    },
    {
        texto: "Echa sobre Jehová tu carga, y él te sustentará; no dejará para siempre caído al justo.",
        cita: "Salmos 55:22"
    },
    {
        texto: "Bendito el hombre que confía en Jehová, y cuya confianza es Jehová.",
        cita: "Jeremías 17:7"
    },
    {
        texto: "El que habita al abrigo del Altísimo morará bajo la sombra del Omnipotente.",
        cita: "Salmos 91:1"
    }
];

function mostrarVersiculoDelDia() {
    const hoy = new Date();
    const numeroDia = hoy.getDate() + hoy.getMonth(); // Combinación de día y mes
    const indice = numeroDia % versiculosDelDia.length; // Rotación basada en el día
    
    const versiculoHoy = versiculosDelDia[indice];
    
    const textoElemento = document.getElementById("versiculo-dia-texto");
    const citaElemento = document.getElementById("versiculo-dia-cita");
    
    if (textoElemento && citaElemento) {
        textoElemento.textContent = `"${versiculoHoy.texto}"`;
        citaElemento.textContent = versiculoHoy.cita;
    }
}

// ===============================
// MODO OSCURO
// ===============================
function inicializarModoOscuro() {
    const btnModoOscuro = document.getElementById("btnModoOscuro");
    const body = document.body;
    
    // Verificar si hay preferencia guardada
    const modoGuardado = localStorage.getItem("modoOscuro");
    if (modoGuardado === "activado") {
        body.classList.add("modo-oscuro");
        btnModoOscuro.textContent = "☀️";
    }
    
    btnModoOscuro.addEventListener("click", () => {
        body.classList.toggle("modo-oscuro");
        
        if (body.classList.contains("modo-oscuro")) {
            btnModoOscuro.textContent = "☀️";
            localStorage.setItem("modoOscuro", "activado");
        } else {
            btnModoOscuro.textContent = "🌙";
            localStorage.setItem("modoOscuro", "desactivado");
        }
    });
}

// ===============================
// MÚSICA DE FONDO
// ===============================
function inicializarMusica() {
    const audioVersiculos = document.getElementById("audioVersiculos");
    const audioOracion = document.getElementById("audioOracion");
    const btnMusicaVersiculos = document.getElementById("btnMusicaVersiculos");
    const btnMusicaOracion = document.getElementById("btnMusicaOracion");
    
    let musicaVersiculosActiva = false;
    let musicaOracionActiva = false;
    
    // Volumen suave
    if (audioVersiculos) audioVersiculos.volume = 0.3;
    if (audioOracion) audioOracion.volume = 0.3;
    
    // Control música versículos
    if (btnMusicaVersiculos && audioVersiculos) {
        btnMusicaVersiculos.addEventListener("click", () => {
            musicaVersiculosActiva = !musicaVersiculosActiva;
            
            if (musicaVersiculosActiva) {
                audioVersiculos.play().catch(e => console.log("Error al reproducir:", e));
                btnMusicaVersiculos.classList.add("activo");
            } else {
                audioVersiculos.pause();
                btnMusicaVersiculos.classList.remove("activo");
            }
        });
    }
    
    // Control música oración
    if (btnMusicaOracion && audioOracion) {
        btnMusicaOracion.addEventListener("click", () => {
            musicaOracionActiva = !musicaOracionActiva;
            
            if (musicaOracionActiva) {
                audioOracion.play().catch(e => console.log("Error al reproducir:", e));
                btnMusicaOracion.classList.add("activo");
            } else {
                audioOracion.pause();
                btnMusicaOracion.classList.remove("activo");
            }
        });
    }
    
    // Pausar música al salir de la sección
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                if (entry.target.id === "versiculos" && audioVersiculos) {
                    audioVersiculos.pause();
                    if (btnMusicaVersiculos) btnMusicaVersiculos.classList.remove("activo");
                    musicaVersiculosActiva = false;
                }
                if (entry.target.id === "oracion" && audioOracion) {
                    audioOracion.pause();
                    if (btnMusicaOracion) btnMusicaOracion.classList.remove("activo");
                    musicaOracionActiva = false;
                }
            }
        });
    }, { threshold: 0.3 });
    
    const seccionVersiculos = document.getElementById("versiculos");
    const seccionOracion = document.getElementById("oracion");
    
    if (seccionVersiculos) observer.observe(seccionVersiculos);
    if (seccionOracion) observer.observe(seccionOracion);
}

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
                nombre: document.getElementById("nombreC").value.trim(),
                email: document.getElementById("emailC").value.trim(),
                mensaje: document.getElementById("mensajeC").value.trim(),
                fecha: serverTimestamp()
            });

            alert("📩 Mensaje enviado correctamente.");
            formContacto.reset();

        } catch (error) {
            console.error("Error en contacto:", error);
            alert("❌ No se pudo enviar el mensaje.");
        } finally {
            btn.textContent = "Enviar mensaje";
            btn.disabled = false;
        }
    });
}

// ===============================
// INICIO
// ===============================
window.addEventListener("load", () => {
    cargarCategorias();
    mostrarVersiculoDelDia();
    inicializarModoOscuro();
    inicializarMusica();
});

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
