import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, getDocs, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

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

async function cargarCategorias() {
    const contenedor = document.getElementById('contenedorBotones');
    const textoBiblico = document.getElementById('texto-biblico');
    const citaBiblica = document.getElementById('cita-biblica');

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
            const boton = document.createElement('button');
            boton.className = 'btn-cat';
            boton.innerHTML = datos.nombre; 

            boton.onclick = () => {
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
        console.error("Error:", error);
        contenedor.innerHTML = "<p>Error al conectar con la bendición.</p>";
    }
}

// Lógica del Formulario
const formOracion = document.getElementById("formOracion");
if (formOracion) {
    formOracion.addEventListener("submit", async (e) => {
        e.preventDefault();
        const btnEnviar = e.target.querySelector("button");
        btnEnviar.innerText = "Enviando...";
        btnEnviar.disabled = true;

        try {
            await addDoc(collection(db, "oraciones"), {
                nombre: document.getElementById("nombreInput").value,
                peticion: document.getElementById("peticionInput").value,
                fecha: serverTimestamp()
            });
            alert("🙏 Tu petición ha sido enviada.");
            formOracion.reset();
        } catch (error) {
            alert("Error al enviar.");
        } finally {
            btnEnviar.innerText = "Enviar petición 🙏";
            btnEnviar.disabled = false;
        }
    });
}

// Carga inicial
window.onload = cargarCategorias;