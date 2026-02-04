import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import { getFirestore, collection, getDocs, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

/**
 * PODEROSO ES DIOS - SCRIPT MAESTRO COMPLETO
 * Versión Final: Firebase + Biblia JSON + UI + Música
 */

// ==========================================
// 1. CONFIGURACIÓN DE MODO OSCURO
// ==========================================
const btnModoOscuro = document.getElementById('btnModoOscuro');
const iconoModo = document.getElementById('iconoModo');

function actualizarInterfazModo(esOscuro) {
    if (esOscuro) {
        document.body.classList.add('modo-oscuro');
        if (iconoModo) {
            iconoModo.tagName === 'SPAN' ? iconoModo.textContent = '☀️' : iconoModo.className = 'fas fa-sun';
        }
    } else {
        document.body.classList.remove('modo-oscuro');
        if (iconoModo) {
            iconoModo.tagName === 'SPAN' ? iconoModo.textContent = '🌙' : iconoModo.className = 'fas fa-moon';
        }
    }
}

function inicializarModoOscuro() {
    const preferencia = localStorage.getItem('modoOscuro') === 'true';
    actualizarInterfazModo(preferencia);
    if (btnModoOscuro) {
        btnModoOscuro.addEventListener('click', () => {
            const ahoraEsOscuro = document.body.classList.toggle('modo-oscuro');
            actualizarInterfazModo(ahoraEsOscuro);
            localStorage.setItem('modoOscuro', ahoraEsOscuro);
        });
    }
}

// ==========================================
// 2. VERSÍCULO DEL DÍA (BIBLIA JSON)
// ==========================================
async function cargarVersiculoDiario() {
    const URL_JSON = "https://raw.githubusercontent.com/exequiel0808/poderoso-Dios/main/biblia-completa-rv1960.json";
    const textoElemento = document.getElementById("texto-dia");
    const citaElemento = document.getElementById("cita-dia");

    if (!textoElemento) return;

    try {
        const cacheBuster = new Date().toISOString().slice(0, 10);
        const res = await fetch(`${URL_JSON}?v=${cacheBuster}`);
        const data = await res.json();
        const versiculos = [];
        
        Object.values(data).forEach(libro => {
            if (libro.chapters) {
                libro.chapters.forEach(cap => {
                    cap.verses.forEach(v => {
                        versiculos.push({ 
                            texto: v.text, 
                            cita: `${libro.book} ${cap.chapter}:${v.verse}` 
                        });
                    });
                });
            }
        });

        const indice = Math.floor(Math.random() * versiculos.length);
        const seleccionado = versiculos[indice];
        textoElemento.textContent = `"${seleccionado.texto}"`;
        if (citaElemento) citaElemento.textContent = seleccionado.cita;
    } catch (error) {
        console.error("Error Biblia:", error);
        textoElemento.textContent = "Lámpara es a mis pies tu palabra...";
        if (citaElemento) citaElemento.textContent = "Salmos 119:105";
    }
}

// ==========================================
// 3. UI: MENÚ, SCROLL Y NAVEGACIÓN ACTIVA
// ==========================================
function inicializarUI() {
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    const header = document.querySelector('.navbar') || document.querySelector('.header');
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('nav a');

    // Menú Móvil
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            const icon = menuToggle.querySelector('i');
            if (icon) icon.classList.toggle('fa-times');
        });
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => navMenu.classList.remove('active'));
        });
    }

    // Scroll Effects
    window.addEventListener('scroll', () => {
        // Header Scrolled
        if (header) header.classList.toggle('scrolled', window.scrollY > 50);

        // Active Link
        let current = "";
        sections.forEach((section) => {
            const sectionTop = section.offsetTop;
            if (pageYOffset >= sectionTop - 250) {
                current = section.getAttribute("id");
            }
        });
        navLinks.forEach((link) => {
            link.classList.remove("active");
            if (link.getAttribute("href").includes(current)) {
                link.classList.add("active");
            }
        });
    });
}

// ==========================================
// 4. ACORDEÓN DE FE (FAQ)
// ==========================================
function inicializarAcordeon() {
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        if (question && answer) {
            question.addEventListener('click', () => {
                const isOpen = answer.style.display === 'block';
                document.querySelectorAll('.faq-answer').forEach(a => a.style.display = 'none');
                document.querySelectorAll('.faq-question i').forEach(i => i.className = 'fas fa-plus');
                if (!isOpen) {
                    answer.style.display = 'block';
                    const icon = question.querySelector('i');
                    if (icon) icon.className = 'fas fa-minus';
                }
            });
        }
    });
}

// ==========================================
// 5. FIREBASE: CATEGORÍAS Y FORMULARIOS
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
            btn.className = "btn-cat";
            btn.textContent = data.nombre;
            btn.onclick = () => {
                displayTexto.style.opacity = 0;
                setTimeout(() => {
                    displayTexto.textContent = data.texto;
                    if (displayCita) displayCita.textContent = data.cita;
                    displayTexto.style.opacity = 1;
                }, 300);
            };
            contenedor.appendChild(btn);
        });
    } catch (e) { console.warn("Firebase Categorías Offline"); }
}

function inicializarFormularios() {
    // Formulario Oración
    const formOracion = document.getElementById("formOracion");
    if (formOracion) {
        formOracion.addEventListener("submit", async (e) => {
            e.preventDefault();
            const btn = formOracion.querySelector("button");
            btn.textContent = "Enviando...";
            try {
                await addDoc(collection(db, "oraciones"), {
                    nombre: document.getElementById("nombreInput").value,
                    peticion: document.getElementById("peticionInput").value,
                    fecha: serverTimestamp()
                });
                alert("🙏 Estaremos orando por ti.");
                formOracion.reset();
            } catch (e) { alert("❌ Error al enviar."); }
            btn.textContent = "Enviar petición 🙏";
        });
    }
}

// ==========================================
// 6. CONTROL DE MÚSICA
// ==========================================
function inicializarMusica() {
    const btnMusica = document.getElementById('btnMusica');
    const audio = document.getElementById('audioFondo');
    if (!btnMusica || !audio) return;
    audio.volume = 0.3;
    btnMusica.addEventListener('click', () => {
        if (audio.paused) {
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
// INICIO GLOBAL
// ==========================================
window.addEventListener("load", () => {
    inicializarModoOscuro();
    cargarVersiculoDiario();
    inicializarUI();
    inicializarAcordeon();
    inicializarMusica();
    cargarCategorias();
    inicializarFormularios();
});