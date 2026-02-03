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
// 1. MODO OSCURO (Súper Compatible)
// ==========================================
const btnModoOscuro = document.getElementById('btnModoOscuro');
const iconoModo = document.getElementById('iconoModo');

/**
 * Actualiza visualmente el botón y la clase del cuerpo
 * @param {boolean} esOscuro 
 */
function actualizarInterfazModo(esOscuro) {
    if (!iconoModo) return; // Seguridad

    document.body.classList.toggle('modo-oscuro', esOscuro);

    const esEmoji = iconoModo.tagName === 'SPAN';
    const esIcono = iconoModo.tagName === 'I';

    if (esOscuro) {
        if (esEmoji) iconoModo.textContent = '☀️';
        if (esIcono) iconoModo.className = 'fas fa-sun';
    } else {
        if (esEmoji) iconoModo.textContent = '🌙';
        if (esIcono) iconoModo.className = 'fas fa-moon';
    }
}

// Inicialización: Cargar preferencia guardada
const preferenciaGuardada = localStorage.getItem('modoOscuro') === 'true';
actualizarInterfazModo(preferenciaGuardada);

// Evento de clic
if (btnModoOscuro) {
    btnModoOscuro.addEventListener('click', () => {
        const estadoActual = document.body.classList.contains('modo-oscuro');
        const nuevoEstado = !estadoActual;
        
        actualizarInterfazModo(nuevoEstado);
        localStorage.setItem('modoOscuro', nuevoEstado);
    });
}
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
// MENÚ MÓVIL
// ==========================================
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');

if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    
    // Cerrar menú al hacer clic en un enlace
    navMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
}

// ==========================================
// HEADER SCROLL EFFECT
// ==========================================
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (!header) return;
    
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// ==========================================
// NAVEGACIÓN ACTIVA
// ==========================================
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('nav a');

window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

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
// 3. ACORDEÓN DE FE (FAQ)
// ==========================================
function inicializarAcordeon() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');

        if (question && answer) {
            question.addEventListener('click', () => {
                const isCurrentlyOpen = answer.style.display === 'block';

                // Cerrar todos los demás para un efecto limpio
                document.querySelectorAll('.faq-answer').forEach(a => a.style.display = 'none');
                document.querySelectorAll('.faq-question i').forEach(i => {
                    i.classList.replace('fa-minus', 'fa-plus');
                });

                // Abrir el actual si estaba cerrado
                if (!isCurrentlyOpen) {
                    answer.style.display = 'block';
                    question.querySelector('i').classList.replace('fa-plus', 'fa-minus');
                }
            });
        }
    });
}

// ==========================================
// 4. VERSÍCULO DEL DÍA (API JSON)
// ==========================================
async function cargarVersiculoDiario() {
    const URL_JSON = "https://raw.githubusercontent.com/exequiel0808/poderoso-Dios/main/biblia-completa-rv1960.json";
    const contenedorTexto = document.getElementById("texto-dia");
    const contenedorCita = document.getElementById("cita-dia");

    if (!contenedorTexto) return;

    try {
        const res = await fetch(`${URL_JSON}?v=${new Date().getDate()}`);
        const data = await res.json();
        const todosLosVersiculos = [];
        
        // Aplanamiento del JSON para selección aleatoria
        Object.values(data).forEach(libro => {
            libro.chapters.forEach(cap => {
                cap.verses.forEach(v => {
                    todosLosVersiculos.push({ 
                        texto: v.text, 
                        cita: `${libro.book} ${cap.chapter}:${v.verse}` 
                    });
                });
            });
        });

        const random = todosLosVersiculos[Math.floor(Math.random() * todosLosVersiculos.length)];
        contenedorTexto.textContent = `"${random.texto}"`;
        if (contenedorCita) contenedorCita.textContent = random.cita;

    } catch (error) {
        console.error("Error cargando versículo:", error);
        contenedorTexto.textContent = "Lámpara es a mis pies tu palabra...";
        if (contenedorCita) contenedorCita.textContent = "Salmos 119:105";
    }
}

// ==========================================
// 5. CONTROL DE MÚSICA AMBIENTAL
// ==========================================
function inicializarMusica() {
    const btnMusica = document.getElementById('btnMusica');
    const audio = document.getElementById('audioFondo');

    if (!btnMusica || !audio) return;

    audio.volume = 0.3; // Volumen suave por defecto

    btnMusica.addEventListener('click', () => {
        const isPaused = audio.paused;
        
        if (isPaused) {
            audio.play();
            btnMusica.classList.add('activo');
            btnMusica.querySelector('span').textContent = 'Pausar Paz';
        } else {
            audio.pause();
            btnMusica.classList.remove('activo');
            btnMusica.querySelector('span').textContent = 'Música de Paz';
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
        // Nota: Asegúrate de que 'db' y 'getDocs' estén disponibles globalmente
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
                        displayTexto.textContent = data.texto;
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