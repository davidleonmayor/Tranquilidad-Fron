document.addEventListener('DOMContentLoaded', () => {
    // Get the current page/view identifier
    const pageId = getCurrentPageIdentifier();

    const formComentario = document.getElementById('formComentario');
    const comentarioInput = document.getElementById('comentarioInput');
    const listaComentarios = document.getElementById('listaComentarios');
    const cancelarBtn = document.getElementById('cancelarBtn');
    const contadorLetras = document.getElementById('contadorLetras');
    const enviarBtn = document.getElementById('enviarBtn');

    // Function to get current page/view identifier
    function getCurrentPageIdentifier() {
        // This could be based on URL, page title, or a data attribute
        // Modify this function to match your specific implementation
        return window.location.pathname || 'default-page';
    }

    // Function to format date and time
    function formatDate(date) {
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
        return date.toLocaleDateString('es-ES', options);
    }

    // Function to count letters in text
    function contarLetras(texto) {
        return texto.replace(/\s/g, "").length; // Remove spaces and count letters
    }

    // Function to create a new comment
    function crearComentario(texto, likes = 0, id = Date.now(), fecha = formatDate(new Date())) {
        const comentario = document.createElement('li');
        comentario.classList.add('comentario-item');
        comentario.setAttribute('data-id', id);

        comentario.innerHTML = `
            <div class="comment-header">
                <span class="author">Usuario</span> | <span class="date">${fecha}</span>
            </div>
            <div class="comment-body">${texto}</div>
            <div class="comment-actions">
                <button class="likeBtn">👍 Me gusta <span class="likeCount">${likes}</span></button>
                <button class="deleteBtn">Eliminar</button>
            </div>
        `;

        // Like button
        comentario.querySelector('.likeBtn').addEventListener('click', () => {
            likes++;
            comentario.querySelector('.likeCount').textContent = likes;
            actualizarComentariosEnStorage();
        });

        // Delete button
        comentario.querySelector('.deleteBtn').addEventListener('click', () => {
            comentario.remove();
            actualizarComentariosEnStorage();
        });

        listaComentarios.appendChild(comentario);
        actualizarComentariosEnStorage();
    }

    // Function to save comments in localStorage with page-specific key
    function guardarComentariosEnStorage(comentarios) {
        const storageKey = `comentarios-${pageId}`;
        localStorage.setItem(storageKey, JSON.stringify(comentarios));
    }

    // Function to retrieve comments from localStorage with page-specific key
    function recuperarComentariosDeStorage() {
        const storageKey = `comentarios-${pageId}`;
        const comentarios = localStorage.getItem(storageKey);
        return comentarios ? JSON.parse(comentarios) : [];
    }

    // Function to update comments in local storage
    function actualizarComentariosEnStorage() {
        const comentarios = [];
        document.querySelectorAll('#listaComentarios li').forEach((comentario) => {
            const texto = comentario.querySelector('.comment-body').textContent;
            const likes = parseInt(comentario.querySelector('.likeCount').textContent);
            const id = comentario.getAttribute('data-id');
            const fecha = comentario.querySelector('.date').textContent;
            comentarios.push({ texto, likes, id, fecha });
        });
        comentarios.sort((a, b) => b.likes - a.likes);
        guardarComentariosEnStorage(comentarios);
    }

    // Function to render comments in the interface
    function renderizarComentarios() {
        listaComentarios.innerHTML = '';
        const comentarios = recuperarComentariosDeStorage();
        comentarios.forEach((comentario) => {
            crearComentario(comentario.texto, comentario.likes, comentario.id, comentario.fecha);
        });
    }

    // Load comments when page starts
    function cargarComentarios() {
        renderizarComentarios();
    }

    // Event to count letters and enable send button
    comentarioInput.addEventListener('input', () => {
        const textoComentario = comentarioInput.value.trim();
        const letraCount = contarLetras(textoComentario);

        // Show remaining letters counter
        const letrasRestantes = 500 - letraCount;
        contadorLetras.textContent = `${letrasRestantes} caracteres restantes`;

        // Disable text field and send button if 500 characters are reached
        if (letrasRestantes <= 0) {
            comentarioInput.value = textoComentario.substring(0, 500); // Limit to 500 characters
            contadorLetras.textContent = `0 caracteres restantes`;
            enviarBtn.disabled = false;
            comentarioInput.disabled = true;
        } else {
            // Re-enable text field and send button if limit is not reached
            comentarioInput.disabled = false;
            enviarBtn.disabled = false;
        }
    });

    // Event to send comment
    formComentario.addEventListener('submit', (e) => {
        e.preventDefault();

        const textoComentario = comentarioInput.value.trim();

        // Only add comment if it doesn't exceed character limit
        if (textoComentario !== '' && contarLetras(textoComentario) <= 500) {
            crearComentario(textoComentario);
            comentarioInput.value = '';
            contadorLetras.textContent = `500 caracteres restantes`;
            enviarBtn.disabled = true;
        } else {
            alert("El comentario es demasiado largo, debes escribir menos de 500 caracteres.");
        }
    });

    // Event to cancel comment
    cancelarBtn.addEventListener('click', () => {
        comentarioInput.value = '';
        contadorLetras.textContent = `500 caracteres restantes`;
        enviarBtn.disabled = true;
        comentarioInput.disabled = false;
    });

    // Start loading comments
    cargarComentarios();
});



    // Lista de videos locales
const videos = [
    { url: '/rutinas-de-ejercicios/reproMeditacion/video/plena.mp4', liked: false },
    { url: '/rutinas-de-ejercicios/reproMeditacion/video/sonido.mp4', liked: false },
    { url: '/rutinas-de-ejercicios/reproMeditacion/video/escritura.mp4', liked: false },
    { url: '/rutinas-de-ejercicios/reproMeditacion/video/vela.mp4', liked: false }
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

