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

// --- 1. CARGAR CATEGORÍAS DINÁMICAMENTE CON ANIMACIÓN ---
async function cargarCategorias() {
    const contenedor = document.getElementById('contenedorBotones');
    const textoBiblico = document.getElementById('texto-biblico');
    const citaBiblica = document.getElementById('cita-biblica');

    if (!contenedor) {
        console.error("No se encontró el contenedor de botones");
        return;
    }

    // MODIFICACIÓN: Ponemos el corazón latiendo mientras se descargan los datos
    contenedor.innerHTML = `
        <div class="loader-container">
            <div class="corazon-latido">❤️</div>
            <p class="cargando-texto">Buscando promesas para ti...</p>
        </div>
    `;

    try {
        const querySnapshot = await getDocs(collection(db, "categorias"));
        
        // Limpiamos el cargador
        contenedor.innerHTML = "";

        if (querySnapshot.empty) {
            contenedor.innerHTML = "<p>Aún no hay categorías. Agrega una desde el panel.</p>";
            return;
        }

        querySnapshot.forEach((doc) => {
            const datos = doc.data();
            
            const boton = document.createElement('button');
            boton.className = 'btn-cat';
            boton.innerHTML = datos.nombre; 

            boton.onclick = () => {
                // MODIFICACIÓN: Efecto suave de transición
                if(textoBiblico) {
                    textoBiblico.style.opacity = 0;
                    setTimeout(() => {
                        textoBiblico.innerText = datos.texto;
                        if(citaBiblica) citaBiblica.innerText = datos.cita;
                        textoBiblico.style.opacity = 1;
                    }, 300);
                }
            };
            
            contenedor.appendChild(boton);
        });

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
        
        const nombreInput = document.getElementById("nombreInput");
        const peticionInput = document.getElementById("peticionInput");
        const btnEnviar = e.target.querySelector("button");

        if(!nombreInput || !peticionInput) return;

        btnEnviar.innerText = "Enviando...";
        btnEnviar.disabled = true;

        try {
            await addDoc(collection(db, "oraciones"), {
                nombre: nombreInput.value,
                peticion: peticionInput.value,
                fecha: serverTimestamp()
            });
            
            alert("🙏 Tu petición ha sido enviada. Estaremos orando por ti.");
            formOracion.reset();
        } catch (error) {
            console.error("Error al enviar oración:", error);
            alert("Lo sentimos, hubo un error. Inténtalo más tarde.");
        } finally {
            btnEnviar.innerText = "Enviar Petición 🙏";
            btnEnviar.disabled = false;
        }
    });
}

// MODIFICACIÓN: Usamos window.onload para asegurar que todos los elementos existan
window.onload = () => {
    cargarCategorias();
};