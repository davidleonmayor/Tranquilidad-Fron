// Función para hacer scroll hasta el carrusel
function scrollToTop() {
    const carousel = document.getElementById("carouselExample");

    carousel.scrollIntoView({ behavior: "smooth" });
}

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
    { title: "Practica la Respiración Profunda", img: "/imagenes/repirar.png", recommendation: "Haz respiraciones lentas y profundas..." },
    { title: "Realiza Ejercicio Regular", img: "/imagenes/ejercicio.png", recommendation: "Hacer ejercicio 30 minutos al día..." },
    { title: "Mantén una Dieta Balanceada", img: "/imagenes/alimentacion.png", recommendation: "Consume frutas, verduras y proteínas..." },
    { title: "Practica la Meditación", img: "/imagenes/meditacion.png", recommendation: "Dedica 10 minutos diarios a la meditación..." },
    { title: "Prioriza el Sueño", img: "/imagenes/sueño.png", recommendation: "Dormir al menos 7 horas es clave..." },
    { title: "Establece Metas Diarias", img: "/imagenes/metas.png", recommendation: "Establecer metas pequeñas cada día..." },
    // Paginas 2
    { title: "Evita el Estrés", img: "/imagenes/estres.png", recommendation: "Tómate un tiempo para relajarte cada día..." },
    { title: "Organiza tu Espacio", img: "/imagenes/espacio.png", recommendation: "Un espacio ordenado te ayuda a concentrarte..." },
    { title: "Escucha Música Relajante", img: "/imagenes/musica.png", recommendation: "La música tranquila puede mejorar tu ánimo..." },
    { title: "Pasa Tiempo en la Naturaleza", img: "/imagenes/naturaleza.png", recommendation: "Conectar con la naturaleza reduce el estrés..." },
    { title: "Aprende Algo Nuevo", img: "/imagenes/aprender.png", recommendation: "El aprendizaje continuo estimula la mente..." },
    { title: "Socializa con Amigos", img: "/imagenes/socializar.png", recommendation: "Pasar tiempo con amigos fortalece relaciones..." },
    // Página 3
    { title: "Bebe Suficiente Agua", img: "/imagenes/agua.png", recommendation: "Mantente hidratado para mejorar tu energía y concentración." },
    { title: "Evita el Exceso de Azúcar", img: "/imagenes/azucar.png", recommendation: "Reducir el consumo de azúcar ayuda a mantener tu nivel de energía estable." },
    { title: "Practica la Gratitud", img: "/imagenes/gratitud.png", recommendation: "Tomarte unos minutos para agradecer cada día mejora el bienestar general." },
    { title: "Haz una Pausa", img: "/imagenes/pausas.png", recommendation: "Tomarse descansos cortos durante el día ayuda a mantener la productividad." },
    { title: "Usa Protector Solar", img: "/imagenes/solar.png", recommendation: "Protege tu piel con protector solar incluso en días nublados." },
    { title: "Lee Libros Motivacionales", img: "/imagenes/leer.png", recommendation: "Leer libros inspiradores te ayuda a mantener una actitud positiva." },
    // Página 4
    { title: "Desconéctate de la Tecnología", img: "/imagenes/tecnologia.png", recommendation: "Dedica al menos una hora al día sin tecnología para relajarte." },
    { title: "Escribe un Diario", img: "/imagenes/escribir.png", recommendation: "Llevar un diario ayuda a reflexionar sobre tus emociones y experiencias." },
    { title: "Aprende a Decir No", img: "/imagenes/no.png", recommendation: "Poner límites mejora tu salud mental y evita el agotamiento." },
    { title: "Haz Estiramientos", img: "/imagenes/estirar.png", recommendation: "Los estiramientos ayudan a reducir la tensión muscular y mejoran la circulación." },
    { title: "Realiza un Acto de Bondad", img: "/imagenes/bondad.png", recommendation: "Pequeños actos de bondad elevan tu ánimo y el de los demás." },
    { title: "Haz una Limpieza Digital", img: "/imagenes/limpieza.png", recommendation: "Ordena tu espacio digital para reducir el estrés y mejorar la organización." },
    // Página 5
    { title: "Prueba la Respiración con Diafragma", img: "/imagenes/respiracion.png", recommendation: "Respirar con el diafragma mejora la relajación y reduce la ansiedad." },
    { title: "Escucha un Podcast Educativo", img: "/imagenes/escucha.png", recommendation: "Los podcasts son una gran forma de aprender algo nuevo mientras te relajas." },
    { title: "Practica el Yoga", img: "/imagenes/yoga.png", recommendation: "El yoga ayuda a mejorar la flexibilidad y reduce el estrés." },
    { title: "Escribe una Lista de Tareas", img: "/imagenes/lista.png", recommendation: "Organizar tu día con una lista de tareas mejora la productividad." },
    { title: "Cocina tu Propia Comida", img: "/imagenes/cocinar.png", recommendation: "Preparar tus comidas es más saludable y te permite controlar los ingredientes." },
    { title: "Limita el Tiempo en Redes Sociales", img: "/imagenes/redes.png", recommendation: "Reducir el tiempo en redes sociales mejora el bienestar emocional." }
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

        // Crear el contenido de cada tarjeta con el botón que redirige
        tipCard.innerHTML = `
            <h3>${tip.title}</h3>
            <img src="${tip.img}" alt="${tip.title}">
            <button onclick="goToRecommendation(${(page - 1) * tipsPerPage + index})">Ver Más</button>
        `;

        tipsContainer.appendChild(tipCard);
    });
}

function goToRecommendation(index) {
    // Redirigir a los archivos HTML dentro de la carpeta "Recomendacion"
    const pageNumber = index + 1; // Asumiendo que los archivos son "recomendacion1.html", "recomendacion2.html", etc.
    window.location.href = `Recomendacion/recomendacion${pageNumber}.html`;
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




