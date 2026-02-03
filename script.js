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
/**
 * SCRIPT MAESTRO - PODEROSO ES DIOS
 * Organización Unificada, Optimizada y Segura
 */

document.addEventListener('DOMContentLoaded', () => {
    // Inicializar funciones críticas
    inicializarModoOscuro();
    inicializarMenuMovil();
    inicializarMusica();
    inicializarAcordeon();
    
    // Cargas asíncronas
    cargarVersiculoDiario();
    cargarCategorias();
});

// ==========================================
// 1. GESTIÓN DE MODO OSCURO
// ==========================================
function inicializarModoOscuro() {
    const btnModoOscuro = document.getElementById('btnModoOscuro');
    const iconoModo = document.getElementById('iconoModo');

    const aplicarTema = (esOscuro) => {
        document.body.classList.toggle('modo-oscuro', esOscuro);
        if (iconoModo) {
            iconoModo.classList.replace(esOscuro ? 'fa-moon' : 'fa-sun', esOscuro ? 'fa-sun' : 'fa-moon');
        }
        localStorage.setItem('modoOscuro', esOscuro);
    };

    // Cargar preferencia guardada
    const preferencia = localStorage.getItem('modoOscuro') === 'true';
    if (preferencia) aplicarTema(true);

    if (btnModoOscuro) {
        btnModoOscuro.addEventListener('click', () => {
            const esAhoraOscuro = !document.body.classList.contains('modo-oscuro');
            aplicarTema(esAhoraOscuro);
        });
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