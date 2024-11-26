
    
   // Identificador único para este archivo (cámbialo en cada archivo HTML)
const archivoId = 'comentariosArchivo3'; // Cambia 'comentariosArchivo1' por otro valor en cada archivo

// Seleccionamos los elementos
const comentarioInput = document.getElementById('comentario');
const enviarBtn = document.getElementById('enviar');
const comentariosContainer = document.getElementById('comentarios-container');

// Cargar comentarios almacenados en localStorage al iniciar la página
window.addEventListener('load', function() {
    const comentariosGuardados = JSON.parse(localStorage.getItem(archivoId)) || [];
    comentariosGuardados.forEach(comentario => agregarComentario(comentario));
});

// Agregar evento al botón de enviar
enviarBtn.addEventListener('click', function() {
    const textoComentario = comentarioInput.value.trim();
    if (textoComentario !== "") {
        agregarComentario(textoComentario);
        guardarComentario(textoComentario);
        comentarioInput.value = ''; // Limpiar el área de texto
    }
});

// Función para agregar el comentario al contenedor
function agregarComentario(comentario) {
    const comentarioDiv = document.createElement('div');
    comentarioDiv.classList.add('com');
    comentarioDiv.innerHTML = `
    <div class="usuario">
    <span class="material-symbols-outlined">
person 
</span>
    
    </div>
    <div class="comentar">
    <p>Usuario</p>
        ${comentario}</div>
    `;
    comentariosContainer.appendChild(comentarioDiv);
}

// Función para guardar el comentario en localStorage
function guardarComentario(comentario) {
    let comentariosGuardados = JSON.parse(localStorage.getItem(archivoId)) || [];
    comentariosGuardados.push(comentario);
    localStorage.setItem(archivoId, JSON.stringify(comentariosGuardados));
}
    document.addEventListener("DOMContentLoaded", function () {
        const favoriteIcons = document.querySelectorAll(".favorite");
    
        favoriteIcons.forEach(function (icon) {
            icon.addEventListener("click", function () {
                if (icon.style.color === "red") {
                    icon.style.color = "gray"; // Vuelve al color original
                } else {
                    icon.style.color = "red";  // Cambia a rojo
                }
            });
        });
    });
    



    // Lista de videos locales
const videos = [
    { url: '/rutinas-de-ejercicios/includes/videos/abdominal.mp4', liked: false },
    { url: '/rutinas-de-ejercicios/includes/videos/caja.mp4', liked: false },
    { url: '/rutinas-de-ejercicios/includes/videos/4.mp4', liked: false },
    { url: '/rutinas-de-ejercicios/includes/videos/conrteo.mp4', liked: false }
];

let currentVideoIndex = 0;
const videoElement = document.getElementById('video');
const likeButton = document.getElementById('likeBtn');
const prevButton = document.getElementById('prevBtn');
const nextButton = document.getElementById('nextBtn');
const playPauseButton = document.getElementById('playPauseBtn');
const progress = document.getElementById('progress');
const progressThumb = document.getElementById('progressThumb');
const currentTimeDisplay = document.getElementById('currentTime');
const durationDisplay = document.getElementById('duration');
const optionsButton = document.getElementById('optionsBtn');
const fullscreenButton = document.getElementById('fullscreenBtn');

// Función para cargar el video
function loadVideo(index) {
    const videoData = videos[index];
    videoElement.src = videoData.url;
    likeButton.textContent = videoData.liked ? '💜' : '🤍';
    videoElement.load();
}

loadVideo(currentVideoIndex);

// Función para actualizar el estado del botón de "like"
likeButton.addEventListener('click', () => {
    const videoData = videos[currentVideoIndex];
    videoData.liked = !videoData.liked;
    likeButton.textContent = videoData.liked ? '💜' : '🤍';
});

// Función para pasar al siguiente video
nextButton.addEventListener('click', () => {
    currentVideoIndex = (currentVideoIndex + 1) % videos.length;
    loadVideo(currentVideoIndex);
    videoElement.play();
    playPauseBtn.innerHTML = '&#10074;&#10074;'
});

// Función para retroceder al video anterior
prevButton.addEventListener('click', () => {
    currentVideoIndex = (currentVideoIndex - 1 + videos.length) % videos.length;
    loadVideo(currentVideoIndex);
    videoElement.play();
   playPauseBtn.innerHTML = '&#10074;&#10074;'
});

// Play/Pause video
playPauseButton.addEventListener('click', () => {
    if (videoElement.paused) {
        videoElement.play();
        playPauseBtn.innerHTML = '&#10074;&#10074;'
    } else {
        videoElement.pause();
        playPauseButton.textContent = '▶';
    }
});

// Actualizar barra de progreso y tiempo
videoElement.addEventListener('timeupdate', () => {
    const progressPercent = (videoElement.currentTime / videoElement.duration) * 100;
    progress.style.width = `${progressPercent}%`;
    progressThumb.style.left = `${progressPercent}%`;
    currentTimeDisplay.textContent = formatTime(videoElement.currentTime);
    durationDisplay.textContent = formatTime(videoElement.duration);
});

function formatTime(seconds) {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${min}:${sec}`;
}

optionsButton.addEventListener('click', () => {
    optionsMenu.style.display = optionsMenu.style.display === 'none' ? 'block' : 'none';
});

// Cambiar velocidad de reproducción
function setPlaybackRate(rate) {
    videoElement.playbackRate = rate;
    optionsMenu.style.display = 'none'; // Ocultar el menú después de seleccionar una opción
}

// Alternar subtítulos (si están disponibles)
function toggleSubtitles() {
    const tracks = videoElement.textTracks;
    if (tracks.length > 0) {
        tracks[0].mode = tracks[0].mode === 'showing' ? 'hidden' : 'showing';
    }
    optionsMenu.style.display = 'none'; // Ocultar el menú después de seleccionar una opción
}


fullscreenButton.addEventListener('click', () => {
    if (!document.fullscreenElement) {
        playerContainer.requestFullscreen().catch(err => {
            alert(`Error al activar pantalla completa: ${err.message}`);
        });
    } else {
        document.exitFullscreen();
    }
});


// Ocultar el menú cuando se hace clic fuera de él
document.addEventListener('click', (event) => {
    if (!optionsButton.contains(event.target) && !optionsMenu.contains(event.target)) {
        optionsMenu.style.display = 'none';
    }
});
// Elementos seleccionados

const progressBarContainer = document.querySelector('.progress-bar-container');

let isDragging = false;

// Actualiza la barra de progreso a medida que el video se reproduce
videoElement.addEventListener('timeupdate', updateProgressBar);

function updateProgressBar() {
    const progressPercentage = (videoElement.currentTime / videoElement.duration) * 100;
    progress.style.width = `${progressPercentage}%`;
    progressThumb.style.left = `${progressPercentage}%`;
}

// Función para ajustar el tiempo del video basado en la posición del clic
function seekVideo(event) {
    const rect = progressBarContainer.getBoundingClientRect();
    const offsetX = event.clientX - rect.left;
    const width = rect.width;
    const clickPositionRatio = offsetX / width;
    videoElement.currentTime = clickPositionRatio * videoElement.duration;
}

// Evento de clic en la barra de progreso para saltar a una posición
progressBarContainer.addEventListener('click', seekVideo);

// Eventos para arrastrar el pulgar de progreso
progressThumb.addEventListener('mousedown', () => {
    isDragging = true;
});

document.addEventListener('mouseup', () => {
    if (isDragging) {
        isDragging = false;
    }
});

document.addEventListener('mousemove', (event) => {
    if (isDragging) {
        const rect = progressBarContainer.getBoundingClientRect();
        const offsetX = event.clientX - rect.left;
        const width = rect.width;
        const dragPositionRatio = Math.min(Math.max(offsetX / width, 0), 1); // Limita entre 0 y 1
        progress.style.width = `${dragPositionRatio * 100}%`;
        progressThumb.style.left = `${dragPositionRatio * 100}%`;
        videoElement.currentTime = dragPositionRatio * videoElement.duration;
    }
});

