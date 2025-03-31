// Inicialización de elementos del reproductor
const audioPlayer = document.getElementById('audio');
const audioTitle = document.getElementById('audio-title');
const audioArtist = document.getElementById('audio-artist');
const albumImage = document.getElementById('album-image');
const playPauseBtn = document.getElementById('play-pause-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const currentTimeElement = document.getElementById('current-time');
const totalDurationElement = document.getElementById('total-duration');
const progressBar = document.getElementById('progress-bar');
const likeButton = document.querySelector('.me-gusta');

// Constantes y variables globales
const SKIP_TIME = 10;
let likedAudios = JSON.parse(localStorage.getItem("likedTracks")) || [];
let currentAudio = null;

// Función para obtener el audioId desde la URL
function getAudioIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('audioId');
}

// Función para obtener el audio específico desde el backend
function fetchAudio() {
    const audioId = getAudioIdFromUrl();

    if (!audioId) {
        console.error("No se proporcionó un audioId en la URL.");
        audioTitle.textContent = "Error: No se proporcionó un ID de audio.";
        return;
    }

    fetch(`http://127.0.0.1:8000/v1/audios/${audioId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    })
        .then((response) => {
            if (!response.ok) {
                return response.json().then(err => {
                    throw new Error(err.message || "Error en la solicitud: " + response.statusText);
                });
            }
            return response.json();
        })
        .then((data) => {
            console.log(`Audio con ID ${audioId}:`, data);
            if (!data || !data.audio_file) {
                audioTitle.textContent = `Error: No se encontró el audio con ID ${audioId}.`;
                return;
            }

            // Actualizar el título de la página
            const albumTitle = document.getElementById("titulo-album");
            albumTitle.textContent = `Reproducción: ${data.title}`;

            // Guardar el audio actual
            currentAudio = data;

            // Cargar el audio
            loadAudio(data.audio_file, data.title, data.description || "Sin descripción", data.image_file);
        })
        .catch((error) => {
            console.error("Error al obtener el audio:", error);
            audioTitle.textContent = `Error al cargar el audio: ${error.message}. Asegúrate de que el servidor esté corriendo en http://127.0.0.1:8000.`;
        });
}

// Función para cargar un audio (sin reproducirlo automáticamente)
function loadAudio(audioUrl, title, description, cover) {
    if (!audioUrl) {
        console.error('No hay ningún audio actualmente en reproducción.');
        return;
    }

    audioPlayer.src = audioUrl;
    audioTitle.textContent = title;
    audioArtist.textContent = description;
    albumImage.src = cover;
    audioPlayer.load();

    playPauseBtn.innerHTML = '▶'; // Mostrar play por defecto
    updateLikeButtonState();
}

// Función para actualizar el estado del botón de me gusta
function updateLikeButtonState() {
    if (!likeButton || !currentAudio) return;
    const isLiked = likedAudios.some(audio => audio.id === currentAudio.id);

    if (isLiked) {
        likeButton.classList.add('active');
        likeButton.dataset.audioId = currentAudio.id;
    } else {
        likeButton.classList.remove('active');
        delete likeButton.dataset.audioId;
    }
}

// Función para alternar el estado de me gusta
function toggleLike(element) {
    if (!currentAudio) return;

    element.classList.toggle('active');
    const isLiked = element.classList.contains('active');

    if (isLiked) {
        const mockLikeId = Date.now();
        element.dataset.likeId = mockLikeId;
        element.dataset.audioId = currentAudio.id;
        likedAudios.push({ ...currentAudio, like_id: mockLikeId });
    } else {
        const audioId = parseInt(element.dataset.audioId);
        const index = likedAudios.findIndex(audio => audio.id === audioId);
        if (index !== -1) {
            likedAudios.splice(index, 1);
        }
        delete element.dataset.likeId;
    }
    localStorage.setItem("likedTracks", JSON.stringify(likedAudios));
}

// Funciones para el dropdown
function toggleDropdown(id) {
    const dropdown = document.getElementById(id);
    dropdown.classList.toggle('show');
}

function toggleNestedDropdown(id) {
    const nestedDropdown = document.getElementById(id);
    if (nestedDropdown.classList.contains('show')) {
        nestedDropdown.classList.remove('show');
    } else {
        const allNested = document.getElementsByClassName('nested-dropdown');
        for (let nested of allNested) {
            nested.classList.remove('show');
        }
        nestedDropdown.classList.add('show');
    }
    event.stopPropagation();
}

function showHorizontalList() {
    const dropdown = document.getElementById("dropdown");
    const horizontalList = document.getElementById("horizontal-list");
    dropdown.classList.remove('show');
    horizontalList.style.display = horizontalList.style.display === "flex" ? "none" : "flex";
}

function copyLink() {
    const dummy = document.createElement("textarea");
    document.body.appendChild(dummy);
    dummy.value = window.location.href;
    dummy.select();
    document.execCommand("copy");
    document.body.removeChild(dummy);

    const button = document.querySelector('.horizontal-list button');
    const originalText = button.textContent;
    button.textContent = "¡Copiado!";
    setTimeout(() => {
        button.textContent = originalText;
    }, 2000);
}

// Cierra los dropdowns si el usuario hace clic fuera de ellos
window.onclick = function (event) {
    if (!event.target.matches('.dropdown-button, .dropdown-content, .horizontal-list img, .horizontal-list button')) {
        const dropdowns = document.getElementsByClassName('dropdown');
        for (const dropdown of dropdowns) {
            if (dropdown.classList.contains('show')) {
                dropdown.classList.remove('show');
            }
        }
        const nestedDropdowns = document.getElementsByClassName('nested-dropdown');
        for (const nested of nestedDropdowns) {
            if (nested.classList.contains('show')) {
                nested.classList.remove('show');
            }
        }
        const horizontalList = document.getElementById("horizontal-list");
        if (horizontalList.style.display === "flex") {
            horizontalList.style.display = "none";
        }
    }
};

// Event Listeners
playPauseBtn.addEventListener('click', function () {
    if (audioPlayer.paused) {
        audioPlayer.play().catch(function (error) {
            console.error("Error al reproducir el audio:", error);
        });
        playPauseBtn.innerHTML = '⏸️';
    } else {
        audioPlayer.pause();
        playPauseBtn.innerHTML = '▶';
    }
});

prevBtn.addEventListener('click', function () {
    if (audioPlayer.currentTime >= SKIP_TIME) {
        audioPlayer.currentTime -= SKIP_TIME;
    } else {
        audioPlayer.currentTime = 0;
    }
});

nextBtn.addEventListener('click', function () {
    if (audioPlayer.currentTime + SKIP_TIME < audioPlayer.duration) {
        audioPlayer.currentTime += SKIP_TIME;
    } else {
        audioPlayer.currentTime = audioPlayer.duration;
    }
});

// Actualiza el tiempo y la barra de progreso
audioPlayer.addEventListener('timeupdate', function () {
    if (isNaN(audioPlayer.duration)) return;

    const currentTime = audioPlayer.currentTime;
    const duration = audioPlayer.duration;

    // Actualizar el tiempo actual
    const currentMinutes = Math.floor(currentTime / 60);
    const currentSeconds = Math.floor(currentTime % 60);
    currentTimeElement.textContent = `${currentMinutes}:${currentSeconds.toString().padStart(2, '0')}`;

    // Actualizar la barra de progreso
    const percentage = (currentTime / duration) * 100;
    progressBar.value = percentage;
});

// Cuando se carga los metadatos del audio
audioPlayer.addEventListener('loadedmetadata', function () {
    if (isNaN(audioPlayer.duration)) return;

    const duration = audioPlayer.duration;
    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration % 60);
    totalDurationElement.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
});

// Para cambiar la posición del audio usando la barra de progreso
progressBar.addEventListener('input', function () {
    const seekTime = (progressBar.value * audioPlayer.duration) / 100;
    audioPlayer.currentTime = seekTime;
});

// Cuando el audio termina, reiniciar el botón de reproducción
audioPlayer.addEventListener('ended', function () {
    playPauseBtn.innerHTML = '▶';
});

// Evento para el botón de "Me gusta"
likeButton.addEventListener('click', function () {
    toggleLike(this);
});

// Función para crear una nueva playlist
function createNewPlaylist() {
    const playlistName = prompt("Nombre de la nueva playlist:");
    if (playlistName && playlistName.trim() !== "") {
        // Aquí iría la lógica para crear una nueva playlist
        alert(`Playlist "${playlistName}" creada exitosamente`);

        // Cerrar el dropdown después de crear la playlist
        const nestedDropdown = document.getElementById('playlist-dropdown');
        nestedDropdown.classList.remove('show');
        const dropdown = document.getElementById('dropdown');
        dropdown.classList.remove('show');
    }
}

// Inicializar la página
document.addEventListener('DOMContentLoaded', function () {
    // Inicializar el reproductor con el audio de la URL
    fetchAudio();

    // Configurar estado inicial de elementos UI
    const horizontalList = document.getElementById("horizontal-list");
    horizontalList.style.display = "none";
});