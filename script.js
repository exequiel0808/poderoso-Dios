// ======================================================
// FIREBASE CONFIG
// ======================================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

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

// ======================================================
// DEBUG: Verificar conexión a Firebase
// ======================================================
async function testFirebase() {
    try {
        console.log("🔍 Probando conexión a Firebase...");
        const snapshot = await getDocs(collection(db, "categorias"));
        console.log("✅ Conexión exitosa");
        console.log("📊 Documentos encontrados en categorias:", snapshot.size);
        snapshot.forEach(doc => {
            console.log("📄 Documento:", doc.id, doc.data());
        });
    } catch (error) {
        console.error("❌ Error de conexión:", error);
    }
}

// ======================================================
// VERSÍCULO DEL DÍA (JSON DESDE GITHUB) - VERSIÓN CORREGIDA
// ======================================================
async function cargarVersiculoDiario() {
  const texto = document.getElementById("texto-dia");
  const cita = document.getElementById("cita-dia");

  if (!texto || !cita) return;

  // Mostrar mensaje de carga
  texto.textContent = "Cargando palabra de esperanza...";
  cita.textContent = "";

  try {
    // PRIMERO: Intentar con la URL que tienes
    const URL = "https://raw.githubusercontent.com/exequiel0808/poderoso-Dios/main/biblia-completa-rv1960.json";
    
    console.log("📖 Cargando versículo del día desde:", URL);
    
    const res = await fetch(URL + "?v=" + Date.now());
    
    if (!res.ok) {
      throw new Error(`Error HTTP: ${res.status}`);
    }
    
    const biblia = await res.json();
    console.log("✅ Biblia cargada. Versículos:", biblia.length);
    
    // Calcular día del año para tener un versículo diferente cada día
    const hoy = new Date();
    const inicio = new Date(hoy.getFullYear(), 0, 0);
    const dia = Math.floor((hoy - inicio) / (1000 * 60 * 60 * 24));
    
    // Seleccionar versículo basado en el día
    const indice = dia % biblia.length;
    const versiculo = biblia[indice];
    
    console.log(`📅 Día ${dia}, Índice ${indice}:`, versiculo);
    
    // Mostrar el versículo
    if (versiculo && versiculo.texto && versiculo.cita) {
      texto.textContent = `"${versiculo.texto}"`;
      cita.textContent = versiculo.cita;
    } else {
      throw new Error("Estructura de versículo incorrecta");
    }
    
  } catch (error) {
    console.error("❌ Error al cargar versículo:", error);
    
    // VERSÍCULOS DE RESPALDO (por si falla la carga)
    const versiculosRespaldo = [
      { texto: "Lámpara es a mis pies tu palabra, y lumbrera a mi camino.", cita: "Salmos 119:105" },
      { texto: "Porque de tal manera amó Dios al mundo, que ha dado a su Hijo unigénito, para que todo aquel que en él cree no se pierda, mas tenga vida eterna.", cita: "Juan 3:16" },
      { texto: "Todo lo puedo en Cristo que me fortalece.", cita: "Filipenses 4:13" },
      { texto: "Jehová es mi pastor; nada me faltará.", cita: "Salmos 23:1" },
      { texto: "El Señor te bendiga y te guarde.", cita: "Números 6:24" }
    ];
    
    // Seleccionar uno aleatorio para hoy (basado en la fecha)
    const dia = new Date().getDate();
    const respaldo = versiculosRespaldo[dia % versiculosRespaldo.length];
    
    texto.textContent = `"${respaldo.texto}"`;
    cita.textContent = respaldo.cita;
  }
}

// ======================================================
// CARGAR CATEGORÍAS DESDE FIREBASE (VERSIÓN CORREGIDA)
// ======================================================
async function cargarCategorias() {
    const contenedor = document.getElementById("contenedorBotones");
    const textoBiblico = document.getElementById("texto-biblico");
    const citaBiblica = document.getElementById("cita-biblica");
    
    if (!contenedor) {
        console.log("❌ No se encontró el contenedor de botones");
        return;
    }
    
    try {
        console.log("Cargando categorías...");
        contenedor.innerHTML = '<p style="color: var(--dorado-lux);">Cargando categorías...</p>';
        
        const querySnapshot = await getDocs(collection(db, "categorias"));
        console.log("Categorías encontradas:", querySnapshot.size);
        
        if (querySnapshot.empty) {
            contenedor.innerHTML = '<p>No hay categorías disponibles. Agrega algunas desde el panel admin.</p>';
            return;
        }
        
        contenedor.innerHTML = '';
        
        querySnapshot.forEach(doc => {
            const cat = doc.data();
            console.log("Categoría:", cat);
            
            const boton = document.createElement('button');
            boton.className = 'btn-categoria';
            boton.setAttribute('data-id', cat.id || doc.id);
            boton.setAttribute('data-texto', cat.texto || '');
            boton.setAttribute('data-cita', cat.cita || '');
            boton.textContent = cat.nombre || 'Categoría';
            
            boton.addEventListener('click', () => {
                document.querySelectorAll('.btn-categoria').forEach(btn => {
                    btn.classList.remove('active');
                });
                
                boton.classList.add('active');
                
                textoBiblico.style.opacity = '0';
                citaBiblica.style.opacity = '0';
                
                setTimeout(() => {
                    textoBiblico.textContent = `"${cat.texto || ''}"`;
                    citaBiblica.textContent = cat.cita || '';
                    textoBiblico.style.opacity = '1';
                    citaBiblica.style.opacity = '1';
                }, 300);
            });
            
            contenedor.appendChild(boton);
        });
        
        // 👇 ELIMINAR O COMENTAR ESTAS LÍNEAS
        // if (contenedor.firstChild) {
        //     contenedor.firstChild.click();
        // }
        
        // 👇 AGREGAR ESTO PARA RESTAURAR EL TEXTO INICIAL
        textoBiblico.textContent = "Selecciona una categoría para recibir una promesa...";
        citaBiblica.textContent = "";
        
    } catch (error) {
        console.error("Error al cargar categorías:", error);
        contenedor.innerHTML = '<p>Error al cargar las categorías. Revisa la consola.</p>';
    }
}

// ======================================================
// CARGAR PRÉDICAS DESDE FIREBASE
// ======================================================
async function cargarPredicas() {
    const contenedor = document.querySelector(".predicas-grid");
    if (!contenedor) {
        console.log("No se encontró el contenedor de predicas");
        return;
    }
    
    try {
        console.log("Cargando predicas...");
        const querySnapshot = await getDocs(collection(db, "predicas"));
        console.log("Prédicas encontradas:", querySnapshot.size);
        
        if (querySnapshot.empty) {
            contenedor.innerHTML = '<p style="color: var(--dorado-lux); text-align: center;">No hay prédicas disponibles próximamente.</p>';
            return;
        }
        
        let html = '';
        querySnapshot.forEach(doc => {
            const predica = doc.data();
            console.log("Prédica:", predica);
            
            let videoId = '';
            const url = predica.url || '';
            
            if (url.includes('youtu.be/')) {
                videoId = url.split('youtu.be/')[1]?.split('?')[0];
            } else if (url.includes('youtube.com/watch?v=')) {
                videoId = url.split('v=')[1]?.split('&')[0];
            } else if (url.includes('youtube.com/embed/')) {
                videoId = url.split('embed/')[1]?.split('?')[0];
            }
            
            if (videoId) {
                html += `
                    <div class="video-card">
                        <div class="video-container">
                            <iframe 
                                src="https://www.youtube.com/embed/${videoId}" 
                                frameborder="0" 
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                allowfullscreen>
                            </iframe>
                        </div>
                        <div style="margin-top: 15px; text-align: left;">
                            <h3 style="color: var(--dorado-lux); font-size: 1.2rem;">${predica.nombre || 'Prédica'}</h3>
                            ${predica.predicador ? `<p style="color: white; opacity: 0.8;">🎤 ${predica.predicador}</p>` : ''}
                        </div>
                    </div>
                `;
            }
        });
        
        if (html === '') {
            contenedor.innerHTML = '<p style="color: var(--dorado-lux); text-align: center;">No hay videos válidos para mostrar.</p>';
        } else {
            contenedor.innerHTML = html;
        }
        
    } catch (error) {
        console.error("Error al cargar prédicas:", error);
        contenedor.innerHTML = '<p style="color: red; text-align: center;">Error al cargar las prédicas.</p>';
    }
}

// ======================================================
// MODO OSCURO
// ======================================================
function inicializarModoOscuro() {
  const btn = document.getElementById("btnModoOscuro");
  if (!btn) return;

  const estado = localStorage.getItem("modoOscuro");
  if (estado === "on") document.body.classList.add("modo-oscuro");

  btn.addEventListener("click", () => {
    document.body.classList.toggle("modo-oscuro");
    localStorage.setItem(
      "modoOscuro",
      document.body.classList.contains("modo-oscuro") ? "on" : "off"
    );
  });
}

// ======================================================
// MÚSICA DE FONDO
// ======================================================
function inicializarMusica() {
  const audio = document.getElementById("audioVersiculos");
  const btn = document.getElementById("btnMusicaVersiculos");

  if (!audio || !btn) return;

  btn.addEventListener("click", () => {
    if (audio.paused) {
      audio.play();
      btn.classList.add("activo");
    } else {
      audio.pause();
      btn.classList.remove("activo");
    }
  });
}

// ======================================================
// FAQ – FUNDAMENTOS DE FE (EL +)
// ======================================================
function inicializarFAQ() {
  const items = document.querySelectorAll(".faq-item");

  items.forEach(item => {
    const question = item.querySelector(".faq-question");
    const answer = item.querySelector(".faq-answer");
    const icon = question.querySelector("i");

    answer.style.display = "none";

    question.addEventListener("click", () => {
      const abierto = answer.style.display === "block";

      items.forEach(i => {
        i.querySelector(".faq-answer").style.display = "none";
        i.querySelector("i").classList.replace("fa-minus", "fa-plus");
      });

      if (!abierto) {
        answer.style.display = "block";
        icon.classList.replace("fa-plus", "fa-minus");
      }
    });
  });
}

// ======================================================
// FORMULARIO DE ORACIÓN (FIREBASE)
// ======================================================
const formOracion = document.getElementById("formOracion");
if (formOracion) {
  formOracion.addEventListener("submit", async e => {
    e.preventDefault();

    try {
      const nombreInput = formOracion.querySelector('input[type="text"]');
      const peticionInput = formOracion.querySelector('textarea');
      
      await addDoc(collection(db, "oraciones"), {
        nombre: nombreInput ? nombreInput.value.trim() : "Anónimo",
        peticion: peticionInput ? peticionInput.value.trim() : "",
        fecha: serverTimestamp()
      });

      alert("🙏 Tu petición fue enviada. Estamos orando por ti.");
      formOracion.reset();
    } catch (e) {
      console.error(e);
      alert("❌ No se pudo enviar la petición.");
    }
  });
}

// ======================================================
// FORMULARIO DE CONTACTO (FIREBASE)
// ======================================================
const formContacto = document.getElementById("formContactoLux");
if (formContacto) {
  formContacto.addEventListener("submit", async e => {
    e.preventDefault();

    try {
      const inputs = formContacto.querySelectorAll('input, textarea');
      
      await addDoc(collection(db, "contacto"), {
        nombre: inputs[0] ? inputs[0].value.trim() : "",
        email: inputs[1] ? inputs[1].value.trim() : "",
        mensaje: inputs[2] ? inputs[2].value.trim() : "",
        fecha: serverTimestamp()
      });

      alert("📩 Mensaje enviado correctamente.");
      formContacto.reset();
    } catch (e) {
      console.error(e);
      alert("❌ Error al enviar el mensaje.");
    }
  });
}

// ======================================================
// INICIALIZACIÓN GENERAL
// ======================================================
window.addEventListener("DOMContentLoaded", () => {
  console.log("🚀 Iniciando aplicación...");
  testFirebase();
  cargarVersiculoDiario();
  cargarCategorias();
  cargarPredicas();
  inicializarModoOscuro();
  inicializarMusica();
  inicializarFAQ();
});