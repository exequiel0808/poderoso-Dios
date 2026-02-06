// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDg6RXRQLroOmsmIlziXlv1Rqnp3qaeEoM",
  authDomain: "poderoso-es-dios-b59f6.firebaseapp.com",
  projectId: "poderoso-es-dios-b59f6",
  storageBucket: "poderoso-es-dios-b59f6.firebasestorage.app",
  messagingSenderId: "974573934460",
  appId: "1:974573934460:web:67983211175a88811db6f9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// ==========================================
// 1. MODO OSCURO
// ==========================================
const btnModoOscuro = document.getElementById('btnModoOscuro');
const iconoModo = document.getElementById('iconoModo');

// Cargar preferencia guardada
if (localStorage.getItem('modoOscuro') === 'true') {
    document.body.classList.add('modo-oscuro');
    if (iconoModo) iconoModo.textContent = '☀️';
}

if (btnModoOscuro) {
    btnModoOscuro.addEventListener('click', () => {
        document.body.classList.toggle('modo-oscuro');
        const esModoOscuro = document.body.classList.contains('modo-oscuro');
        if (iconoModo) iconoModo.textContent = esModoOscuro ? '☀️' : '🌙';
        localStorage.setItem('modoOscuro', esModoOscuro);
    });
}

// ==========================================
// 2. NAVEGACIÓN Y MENÚ MÓVIL
// ==========================================
function inicializarMenuMovil() {
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    const header = document.querySelector('.navbar');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            const icon = menuToggle.querySelector('i');
            if (icon) icon.classList.toggle('fa-times');
        });

        // Cerrar menú al hacer click en un enlace
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                const icon = menuToggle.querySelector('i');
                if (icon) icon.classList.remove('fa-times');
            });
        });
    }

    // Efecto de scroll en Header
    window.addEventListener('scroll', () => {
        if (header) header.classList.toggle('scrolled', window.scrollY > 50);
    });
}

function inicializarAcordeon() {
    const items = document.querySelectorAll('.faq-item');

    items.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        const icon = question.querySelector('i');

        question.addEventListener('click', () => {
            const abierto = item.classList.contains('activo');

            // Cerrar todos
            items.forEach(i => {
                i.classList.remove('activo');
                i.querySelector('.faq-answer').style.maxHeight = null;
                i.querySelector('i').classList.remove('fa-minus');
                i.querySelector('i').classList.add('fa-plus');
            });

            // Abrir el actual
            if (!abierto) {
                item.classList.add('activo');
                answer.style.maxHeight = answer.scrollHeight + 'px';
                icon.classList.remove('fa-plus');
                icon.classList.add('fa-minus');
            }
        });
    });
}


// ==========================================
// 4. VERSÍCULO DEL DÍA (CORREGIDO)
// ==========================================
async function cargarVersiculoDiario() {
    const URL_JSON = "https://raw.githubusercontent.com/exequiel0808/poderoso-Dios/main/biblia-completa-rv1960.json";
    const textoDia = document.getElementById("texto-dia");
    const citaDia = document.getElementById("cita-dia");

    if (!textoDia || !citaDia) {
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

        // Usar el día del año para selección consistente
        const ahora = new Date();
        const inicioAnio = new Date(ahora.getFullYear(), 0, 0);
        const diff = ahora - inicioAnio;
        const unDia = 1000 * 60 * 60 * 24;
        const diaDelAnio = Math.floor(diff / unDia);

        // Seleccionar versículo basado en el día
        const indice = diaDelAnio % versiculos.length;
        const seleccionado = versiculos[indice];

        // Mostrar versículo
        textoDia.textContent = `"${seleccionado.texto}"`;
        citaDia.textContent = seleccionado.cita;

        console.log("✅ Versículo del día cargado:", seleccionado.cita);

    } catch (error) {
        console.error("❌ Error cargando versículo:", error);
        textoDia.textContent = "Lámpara es a mis pies tu palabra, y lumbrera a mi camino.";
        citaDia.textContent = "Salmos 119:105";
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
// 5. CONTROL DE MÚSICA AMBIENTAL - CORREGIDO
// ==========================================
function inicializarMusica() {
    const btnMusica = document.getElementById('btnMusica');
    const audio = document.getElementById('audioFondo');

    if (!btnMusica || !audio) {
        console.error("❌ Botón de música o audio no encontrado");
        return;
    }

    audio.volume = 0.3; // Volumen suave por defecto

    btnMusica.addEventListener('click', () => {
        const isPaused = audio.paused;
        
        if (isPaused) {
            audio.play().catch(err => {
                console.error("Error reproduciendo audio:", err);
            });
            btnMusica.classList.add('activo');
            const span = btnMusica.querySelector('span');
            if (span) span.textContent = 'Pausar Paz';
        } else {
            audio.pause();
            btnMusica.classList.remove('activo');
            const span = btnMusica.querySelector('span');
            if (span) span.textContent = 'Música de Paz';
        }
    });
}

// ==========================================
// 6. CARGA DE CATEGORÍAS (Firebase / Dinámico)
// ==========================================
async function cargarCategorias() {
    const contenedor = document.getElementById("contenedorBotones");
    const displayTexto = document.getElementById("texto-biblico");
    const displayCita = document.getElementById("cita-biblica");

    if (!contenedor) return;

    try {
        const querySnapshot = await getDocs(collection(db, "categorias"));
        contenedor.innerHTML = "";

        querySnapshot.forEach(doc => {
            const data = doc.data();
            const btn = document.createElement("button");
            
            btn.className = "btn-cat-dinamico";
            btn.textContent = data.nombre;
            
            btn.onclick = () => {
                // Efecto de transición suave
                if (displayTexto) {
                    displayTexto.style.opacity = 0;
                    setTimeout(() => {
                        displayTexto.textContent = `"${data.texto}"`;
                        if (displayCita) displayCita.textContent = data.cita;
                        displayTexto.style.opacity = 1;
                    }, 300);
                }
            };
            contenedor.appendChild(btn);
        });
    } catch (error) {
        console.warn("Firebase no detectado o error de red. Usando marcadores de posición.");
        contenedor.innerHTML = "<p style='opacity:0.6'>Conectando con la palabra...</p>";
    }
}

// ==========================================
// INICIALIZACIÓN AL CARGAR LA PÁGINA
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    console.log("🚀 Iniciando aplicación...");
    
    // Inicializar todas las funciones
    inicializarMenuMovil();
    inicializarAcordeon();
    cargarVersiculoDiario();
    inicializarMusica();
    cargarCategorias();
    
    console.log("✅ Aplicación iniciada correctamente");
});
