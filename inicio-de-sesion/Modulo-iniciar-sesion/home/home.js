const quotes = [
    "La tranquilidad es el camino hacia la paz interior.",
    "Respira profundamente y encuentra tu centro.",
    "Cada día es una nueva oportunidad para encontrar la paz."
];

let currentQuote = 0;
setInterval(() => {
    currentQuote = (currentQuote + 1) % quotes.length;
    document.getElementById('motivational-quote').innerText = quotes[currentQuote];
}, 5000);

// Array de tips y recomendaciones
const tips = [
    // Pagina 1
    { title: "Practica la Respiración Profunda", img: "/Imagenes/repirar.png", recommendation: "Haz respiraciones lentas y profundas..." },
    { title: "Realiza Ejercicio Regular", img: "/Imagenes/ejercicio.png", recommendation: "Hacer ejercicio 30 minutos al día..." },
    { title: "Mantén una Dieta Balanceada", img: "/Imagenes/alimentacion.png", recommendation: "Consume frutas, verduras y proteínas..." },
    { title: "Practica la Meditación", img: "/Imagenes/meditacion.png", recommendation: "Dedica 10 minutos diarios a la meditación..." },
    { title: "Prioriza el Sueño", img: "/Imagenes/sueño.png", recommendation: "Dormir al menos 7 horas es clave..." },
    { title: "Establece Metas Diarias", img: "/Imagenes/metas.png", recommendation: "Establecer metas pequeñas cada día..." },
    // Paginas 2
    { title: "Evita el Estrés", img: "/Imagenes/estres.png", recommendation: "Tómate un tiempo para relajarte cada día..." },
    { title: "Organiza tu Espacio", img: "/Imagenes/espacio.png", recommendation: "Un espacio ordenado te ayuda a concentrarte..." },
    { title: "Escucha Música Relajante", img: "/Imagenes/musica.png", recommendation: "La música tranquila puede mejorar tu ánimo..." },
    { title: "Pasa Tiempo en la Naturaleza", img: "/Imagenes/naturaleza.png", recommendation: "Conectar con la naturaleza reduce el estrés..." },
    { title: "Aprende Algo Nuevo", img: "/Imagenes/aprender.png", recommendation: "El aprendizaje continuo estimula la mente..." },
    { title: "Socializa con Amigos", img: "/Imagenes/socializar.png", recommendation: "Pasar tiempo con amigos fortalece relaciones..." },
    // Página 3
    { title: "Bebe Suficiente Agua", img: "/Imagenes/agua.png", recommendation: "Mantente hidratado para mejorar tu energía y concentración." },
    { title: "Evita el Exceso de Azúcar", img: "/Imagenes/azucar.png", recommendation: "Reducir el consumo de azúcar ayuda a mantener tu nivel de energía estable." },
    { title: "Practica la Gratitud", img: "/Imagenes/gratitud.png", recommendation: "Tomarte unos minutos para agradecer cada día mejora el bienestar general." },
    { title: "Haz una Pausa", img: "/Imagenes/pausas.png", recommendation: "Tomarse descansos cortos durante el día ayuda a mantener la productividad." },
    { title: "Usa Protector Solar", img: "/Imagenes/solar.png", recommendation: "Protege tu piel con protector solar incluso en días nublados." },
    { title: "Lee Libros Motivacionales", img: "/Imagenes/leer.png", recommendation: "Leer libros inspiradores te ayuda a mantener una actitud positiva." },
    // Página 4
    { title: "Desconéctate de la Tecnología", img: "/Imagenes/tecnologia.png", recommendation: "Dedica al menos una hora al día sin tecnología para relajarte." },
    { title: "Escribe un Diario", img: "/Imagenes/escribir.png", recommendation: "Llevar un diario ayuda a reflexionar sobre tus emociones y experiencias." },
    { title: "Aprende a Decir No", img: "/Imagenes/no.png", recommendation: "Poner límites mejora tu salud mental y evita el agotamiento." },
    { title: "Haz Estiramientos", img: "/Imagenes/estirar.png", recommendation: "Los estiramientos ayudan a reducir la tensión muscular y mejoran la circulación." },
    { title: "Realiza un Acto de Bondad", img: "/Imagenes/bondad.png", recommendation: "Pequeños actos de bondad elevan tu ánimo y el de los demás." },
    { title: "Haz una Limpieza Digital", img: "/Imagenes/limpieza.png", recommendation: "Ordena tu espacio digital para reducir el estrés y mejorar la organización." },
    // Página 5
    { title: "Prueba la Respiración con Diafragma", img: "/Imagenes/respiracion.png", recommendation: "Respirar con el diafragma mejora la relajación y reduce la ansiedad." },
    { title: "Escucha un Podcast Educativo", img: "/Imagenes/escucha.png", recommendation: "Los podcasts son una gran forma de aprender algo nuevo mientras te relajas." },
    { title: "Practica el Yoga", img: "/Imagenes/yoga.png", recommendation: "El yoga ayuda a mejorar la flexibilidad y reduce el estrés." },
    { title: "Escribe una Lista de Tareas", img: "/Imagenes/lista.png", recommendation: "Organizar tu día con una lista de tareas mejora la productividad." },
    { title: "Cocina tu Propia Comida", img: "/Imagenes/cocinar.png", recommendation: "Preparar tus comidas es más saludable y te permite controlar los ingredientes." },
    { title: "Limita el Tiempo en Redes Sociales", img: "/Imagenes/redes.png", recommendation: "Reducir el tiempo en redes sociales mejora el bienestar emocional." }
];

// Variables de control de paginación
let currentPage = 1;
const tipsPerPage = 6;

function displayTips(page) {
    const startIndex = (page - 1) * tipsPerPage;
    const endIndex = startIndex + tipsPerPage;
    const tipsToDisplay = tips.slice(startIndex, endIndex);

    const tipsContainer = document.getElementById('tips-container');
    tipsContainer.innerHTML = ''; // Limpiar el contenido actual

    tipsToDisplay.forEach((tip, index) => {
        const tipCard = document.createElement('div');
        tipCard.classList.add('tip-card');
        
        tipCard.innerHTML = `
            <h3>${tip.title}</h3>
            <img src="${tip.img}" alt="${tip.title}">
            <button onclick="toggleRecommendation(${index}, this)">Ver Más</button>
            <p class="recommendation" id="rec${index}" style="display: none;">${tip.recommendation}</p>
        `;
        
        tipsContainer.appendChild(tipCard);
    });
}

function toggleRecommendation(index, button) {
    const recommendation = document.getElementById(`rec${index}`);
    
    if (recommendation.style.display === "none" || recommendation.style.display === "") {
        recommendation.style.display = "block";
        button.textContent = "Ocultar";
    } else {
        recommendation.style.display = "none";
        button.textContent = "Ver Más";
    }
}

function changePage(page) {
    currentPage = page;
    displayTips(currentPage);
}

// Inicializar la primera página
displayTips(currentPage);


function mostrarModulos() {
    const modulos = document.getElementById("modulos-extras");
    const botonVerMas = document.querySelector(".btn-ver-mas");

    // Mostrar los módulos con animación y ocultar el botón
    modulos.style.display = "block";
    botonVerMas.style.display = "none";
}

// Mostrar u ocultar la flecha según la posición de scroll
window.onscroll = function () {
    const scrollToTopBtn = document.getElementById("scrollToTop");
    const carousel = document.getElementById("carouselExample");

    if (window.scrollY > 200) {
        scrollToTopBtn.classList.add("show");
    } else {
        scrollToTopBtn.classList.remove("show");
    }
};

// Función para hacer scroll hasta el carrusel
function scrollToTop() {
    const carousel = document.getElementById("carouselExample");

    carousel.scrollIntoView({ behavior: "smooth" });
}


