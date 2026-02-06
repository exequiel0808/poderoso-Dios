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

// ==========================================
// 3. ACORDEÓN DE FE (FAQ) - CORREGIDO
// ==========================================
function inicializarAcordeon() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');

        if (question && answer) {
            question.addEventListener('click', () => {
                const isCurrentlyOpen = answer.style.maxHeight;

                // Cerrar todos los demás
                document.querySelectorAll('.faq-answer').forEach(a => {
                    a.style.maxHeight = null;
                });
                document.querySelectorAll('.faq-question i').forEach(i => {
                    i.classList.remove('fa-minus');
                    i.classList.add('fa-plus');
                });

                // Abrir el actual si estaba cerrado
                if (!isCurrentlyOpen) {
                    answer.style.maxHeight = answer.scrollHeight + "px";
                    const icon = question.querySelector('i');
                    icon.classList.remove('fa-plus');
                    icon.classList.add('fa-minus');
                }
            });
        }
    });
}

// ==========================================
// 4. VERSÍCULO DEL DÍA - VERSIÓN MODERNA
// ==========================================
async function cargarVersiculoDiario() {
    const textoDia = document.getElementById("texto-dia");
    const citaDia = document.getElementById("cita-dia");

    if (!textoDia || !citaDia) {
        console.error("❌ IDs del versículo no encontrados");
        return;
    }

    // 30 versículos populares en lenguaje moderno
    const versiculosModernos = [
        { texto: "Porque de tal manera amó Dios al mundo, que dio a su Hijo unigénito, para que todo aquel que cree en él no se pierda, sino que tenga vida eterna.", cita: "Juan 3:16" },
        { texto: "Todo lo puedo en Cristo que me fortalece.", cita: "Filipenses 4:13" },
        { texto: "Confía en el Señor de todo corazón, y no en tu propia inteligencia. Reconócelo en todos tus caminos, y él allanará tus sendas.", cita: "Proverbios 3:5-6" },
        { texto: "El Señor es mi pastor, nada me falta.", cita: "Salmos 23:1" },
        { texto: "No temas, porque yo estoy contigo; no desmayes, porque yo soy tu Dios que te fortalece; siempre te ayudaré, siempre te sustentaré con la diestra de mi justicia.", cita: "Isaías 41:10" },
        { texto: "Porque yo sé muy bien los planes que tengo para ustedes —afirma el Señor—, planes de bienestar y no de calamidad, a fin de darles un futuro y una esperanza.", cita: "Jeremías 29:11" },
        { texto: "Vengan a mí todos ustedes que están cansados y agobiados, y yo les daré descanso.", cita: "Mateo 11:28" },
        { texto: "El Señor te bendiga y te guarde; el Señor te mire con agrado y te extienda su amor; el Señor te muestre su favor y te conceda la paz.", cita: "Números 6:24-26" },
        { texto: "Si Dios está a favor nuestro, ¿quién puede estar en contra nuestra?", cita: "Romanos 8:31" },
        { texto: "El amor es paciente, es bondadoso. El amor no es envidioso ni jactancioso ni orgulloso.", cita: "1 Corintios 13:4" },
        { texto: "Echen todas sus ansiedades sobre él, porque él tiene cuidado de ustedes.", cita: "1 Pedro 5:7" },
        { texto: "Alégrense siempre en el Señor. Insisto: ¡Alégrense!", cita: "Filipenses 4:4" },
        { texto: "Busquen primeramente el reino de Dios y su justicia, y todas estas cosas les serán añadidas.", cita: "Mateo 6:33" },
        { texto: "Porque donde dos o tres se reúnen en mi nombre, allí estoy yo en medio de ellos.", cita: "Mateo 18:20" },
        { texto: "El Señor es mi luz y mi salvación; ¿a quién temeré? El Señor es el baluarte de mi vida; ¿quién podrá amedrentarme?", cita: "Salmos 27:1" },
        { texto: "Dichosos los que tienen hambre y sed de justicia, porque serán saciados.", cita: "Mateo 5:6" },
        { texto: "Yo soy el camino, la verdad y la vida. Nadie llega al Padre sino por mí.", cita: "Juan 14:6" },
        { texto: "Den gracias al Señor, porque él es bueno; su gran amor perdura para siempre.", cita: "Salmos 107:1" },
        { texto: "En ti confían los que conocen tu nombre, porque tú, Señor, jamás abandonas a los que te buscan.", cita: "Salmos 9:10" },
        { texto: "Así que no temas, porque yo estoy contigo; no te angusties, porque yo soy tu Dios.", cita: "Isaías 41:10" },
        { texto: "El que habita al abrigo del Altísimo se acoge a la sombra del Todopoderoso.", cita: "Salmos 91:1" },
        { texto: "Ustedes son la luz del mundo. Una ciudad en lo alto de una colina no puede esconderse.", cita: "Mateo 5:14" },
        { texto: "Por lo tanto, si alguno está en Cristo, es una nueva creación. ¡Lo viejo ha pasado, ha llegado ya lo nuevo!", cita: "2 Corintios 5:17" },
        { texto: "No se inquieten por nada; más bien, en toda ocasión, con oración y ruego, presenten sus peticiones a Dios y denle gracias.", cita: "Filipenses 4:6" },
        { texto: "Encomienda al Señor tu camino; confía en él, y él actuará.", cita: "Salmos 37:5" },
        { texto: "Porque él nos salvó y nos llamó a una vida santa, no por nuestras propias obras, sino por su propia determinación y gracia.", cita: "2 Timoteo 1:9" },
        { texto: "Ama al Señor tu Dios con todo tu corazón, con todo tu ser y con toda tu mente.", cita: "Mateo 22:37" },
        { texto: "Y todo lo que hagan, de palabra o de obra, háganlo en el nombre del Señor Jesús, dando gracias a Dios el Padre por medio de él.", cita: "Colosenses 3:17" },
        { texto: "El Señor es bueno; para siempre es su misericordia, y su fidelidad por todas las generaciones.", cita: "Salmos 100:5" },
        { texto: "Tu palabra es una lámpara a mis pies; es una luz en mi sendero.", cita: "Salmos 119:105" }
    ];

    try {
        // Seleccionar un versículo aleatorio
        const indice = Math.floor(Math.random() * versiculosModernos.length);
        const seleccionado = versiculosModernos[indice];

        // Mostrar versículo
        textoDia.textContent = `"${seleccionado.texto}"`;
        citaDia.textContent = seleccionado.cita;

        console.log("✅ Versículo del día cargado:", seleccionado.cita);

    } catch (error) {
        console.error("❌ Error cargando versículo:", error);
        textoDia.textContent = "Tu palabra es una lámpara a mis pies; es una luz en mi sendero.";
        citaDia.textContent = "Salmos 119:105";
    }
}

// ==========================================
// 5. CONTROL DE MÚSICA AMBIENTAL
// ==========================================
function inicializarMusica() {
    const btnMusica = document.getElementById('btnMusica');
    const audio = document.getElementById('audioFondo');

    if (!btnMusica || !audio) {
        console.error("❌ Botón de música o audio no encontrado");
        return;
    }

    audio.volume = 0.3;

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
// 6. CARGA DE CATEGORÍAS
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
        console.warn("Firebase no detectado o error de red.");
        contenedor.innerHTML = "<p style='opacity:0.6'>Conectando con la palabra...</p>";
    }
}

// ==========================================
// INICIALIZACIÓN
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    console.log("🚀 Iniciando aplicación...");
    
    inicializarMenuMovil();
    inicializarAcordeon();
    cargarVersiculoDiario();
    inicializarMusica();
    cargarCategorias();
    
    console.log("✅ Aplicación iniciada correctamente");
});