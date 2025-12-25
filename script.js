import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, getDocs, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Tu configuración de Firebase
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

// --- 1. CARGAR CATEGORÍAS DINÁMICAMENTE ---
async function cargarCategorias() {
    const contenedor = document.getElementById('contenedorBotones');
    const textoBiblico = document.getElementById('texto-biblico');
    const citaBiblica = document.getElementById('cita-biblica');

    if (!contenedor) return;

    try {
        // Obtenemos los documentos de la colección "categorias"
        const querySnapshot = await getDocs(collection(db, "categorias"));
        
        // Limpiamos el mensaje de "Cargando..."
        contenedor.innerHTML = "";

        querySnapshot.forEach((doc) => {
            const datos = doc.data();
            
            // Crear el botón para cada categoría
            const boton = document.createElement('button');
            boton.className = 'btn-cat';
            boton.innerHTML = datos.nombre; // Ejemplo: "🙏 Fortaleza"

            // Evento al hacer clic en el botón
            boton.onclick = () => {
                textoBiblico.style.opacity = 0;
                setTimeout(() => {
                    textoBiblico.innerText = datos.texto;
                    citaBiblica.innerText = datos.cita;
                    textoBiblico.style.opacity = 1;
                }, 200);
            };
            
            contenedor.appendChild(boton);
        });

        if (querySnapshot.empty) {
            contenedor.innerHTML = "<p>Aún no hay categorías. Agrega una desde el panel.</p>";
        }

    } catch (error) {
        console.error("Error al obtener categorías:", error);
        contenedor.innerHTML = "<p>Error al cargar la Palabra. Revisa la conexión.</p>";
    }
}

// --- 2. ENVIAR PETICIONES DE ORACIÓN ---
const formOracion = document.getElementById("formOracion");
if (formOracion) {
    formOracion.addEventListener("submit", async (e) => {
        e.preventDefault();
        
        const nombre = document.getElementById("nombreInput").value;
        const peticion = document.getElementById("peticionInput").value;
        const btnEnviar = e.target.querySelector("button");

        btnEnviar.innerText = "Enviando...";
        btnEnviar.disabled = true;

        try {
            await addDoc(collection(db, "oraciones"), {
                nombre: nombre,
                peticion: peticion,
                fecha: serverTimestamp()
            });
            
            alert("🙏 Tu petición ha sido enviada. Estaremos orando por ti.");
            formOracion.reset();
        } catch (error) {
            console.error("Error al enviar oración:", error);
            alert("Lo sentimos, hubo un error. Inténtalo más tarde.");
        } finally {
            btnEnviar.innerText = "Enviar Petición";
            btnEnviar.disabled = false;
        }
    });
}

// Ejecutar la carga al iniciar la página
window.addEventListener('DOMContentLoaded', cargarCategorias);