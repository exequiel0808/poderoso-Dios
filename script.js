// 1. IMPORTAR MÓDULOS DE FIREBASE
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// 2. CONFIGURACIÓN DE TU PROYECTO (ID: 15744)
const firebaseConfig = {
    apiKey: "AIzaSyBqaBUSSEza1hcpub0CzUTWTPoP0LBrfs0",
    authDomain: "poderoso-es-dios-15744.firebaseapp.com",
    projectId: "poderoso-es-dios-15744",
    storageBucket: "poderoso-es-dios-15744.firebasestorage.app",
    messagingSenderId: "99676155688",
    appId: "1:99676155688:web:583160c8dd0200d8e52a1d"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

console.log("Página Cristiana y Firebase cargados correctamente");

// ---------------------------------------------------------
// 3. TUS FUNCIONES DE NAVEGACIÓN (Scroll Suave)
// ---------------------------------------------------------
document.querySelectorAll("nav a").forEach(enlace => {
    enlace.addEventListener("click", function(e) {
        const href = this.getAttribute("href");
        if (href.startsWith("#")) {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({ behavior: "smooth" });
            }
        }
    });
});

// ---------------------------------------------------------
// 4. LÓGICA DEL FORMULARIO DE ORACIÓN (Envío a Firebase)
// ---------------------------------------------------------
const form = document.getElementById("formOracion");

if (form) {
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        
        const nombre = document.getElementById("nombreInput").value;
        const peticion = document.getElementById("peticionInput").value;

        try {
            // Guardamos en la colección "oraciones" de tu base de datos
            await addDoc(collection(db, "oraciones"), {
                nombre: nombre,
                peticion: peticion,
                fecha: serverTimestamp()
            });

            alert("🙏 Tu petición fue enviada. Estamos orando por ti.");
            form.reset();
        } catch (error) {
            console.error("Error al enviar a Firebase:", error);
            alert("❌ Hubo un error al enviar tu petición. Inténtalo de nuevo.");
        }
    });
}

// ---------------------------------------------------------
// 5. LÓGICA DE VERSÍCULOS POR CATEGORÍA
// ---------------------------------------------------------
window.mostrarVersiculo = function(categoria) {
    const lista = {
        'pareja': { 
            texto: "“El amor es sufrido, es benigno; el amor no tiene envidia, el amor no es jactancioso, no se envanece.”", 
            cita: "— 1 Corintios 13:4" 
        },
        'paz': { 
            texto: "“La paz os dejo, mi paz os doy; yo no os la doy como el mundo la da. No se turbe vuestro corazón.”", 
            cita: "— Juan 14:27" 
        },
        'fortaleza': { 
            texto: "“Mira que te mando que te esfuerces y seas valiente; no temas ni desmayes, porque Jehová tu Dios estará contigo.”", 
            cita: "— Josué 1:9" 
        },
        'esperanza': { 
            texto: "“Porque yo sé los planes que tengo para vosotros, dice Jehová, planes de bienestar y no de calamidad.”", 
            cita: "— Jeremías 29:11" 
        }
    };

    const textoElem = document.getElementById('texto-biblico');
    const citaElem = document.getElementById('cita-biblica');

    if (textoElem && citaElem) {
        textoElem.style.opacity = 0; // Efecto de parpadeo suave
        setTimeout(() => {
            textoElem.innerText = lista[categoria].texto;
            citaElem.innerText = lista[categoria].cita;
            textoElem.style.opacity = 1;
        }, 200);
    }
};

// ---------------------------------------------------------
// 6. TUS FUNCIONES DE MODAL (Si decides usarlas después)
// ---------------------------------------------------------
window.abrirFormulario = function() {
    const modal = document.getElementById("modalOracion");
    if (modal) modal.style.display = "block";
}

window.cerrarFormulario = function() {
    const modal = document.getElementById("modalOracion");
    if (modal) modal.style.display = "none";
}