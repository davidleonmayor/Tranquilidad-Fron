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
let currentAudio = null; // Para almacenar el audio binaural seleccionado

// Función para obtener el binauralId desde la URL
function getBinauralIdFromUrl() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('binauralId');
}

// Función para obtener el audio binaural específico desde el backend
function fetchBinauralAudio() {
  const binauralId = getBinauralIdFromUrl();

  if (!binauralId) {
    console.error("No se proporcionó un binauralId en la URL.");
    audioTitle.textContent = "Error: No se proporcionó un ID de audio binaural.";
    return;
  }

  fetch(`http://127.0.0.1:8000/v1/audios/${binauralId}`, {
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
      console.log(`Audio binaural con ID ${binauralId}:`, data);
      if (!data || !data.audio_file) {
        audioTitle.textContent = `Error: No se encontró el audio binaural con ID ${binauralId}.`;
        return;
      }

      // Actualizar el título de la página
      const albumTitle = document.getElementById("titulo-album");
      albumTitle.textContent = `Sonido Binaural: ${data.title}`;

      // Guardar el audio actual
      currentAudio = data;

      // Cargar el audio binaural seleccionado
      loadAudio(data.audio_file, data.title, data.description || "Sin descripción", data.image_file);
    })
    .catch((error) => {
      console.error("Error al obtener el audio binaural:", error);
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
      console.log('Error playing audio:', error);
    });
    playPauseBtn.innerHTML = '❚❚';
  } else {
    audioPlayer.pause();
    playPauseBtn.innerHTML = '▶';
  }
});

function updateProgressBar() {
  if (!isNaN(audioPlayer.duration)) {
    const progressPercentage = (audioPlayer.currentTime / audioPlayer.duration) * 100;
    progressBar.value = progressPercentage;
    progressBar.style.background = `linear-gradient(to right, #59009A ${progressPercentage}%, #e1bee7 ${progressPercentage}%)`;
    currentTimeElement.textContent = formatTime(audioPlayer.currentTime);
    totalDurationElement.textContent = formatTime(audioPlayer.duration);
  }
}

progressBar.addEventListener('input', function () {
  const seekTime = (progressBar.value / 100) * audioPlayer.duration;
  audioPlayer.currentTime = seekTime;
});

audioPlayer.addEventListener('timeupdate', updateProgressBar);

nextBtn.addEventListener('click', function () {
  audioPlayer.currentTime = Math.min(audioPlayer.currentTime + SKIP_TIME, audioPlayer.duration);
});

prevBtn.addEventListener('click', function () {
  audioPlayer.currentTime = Math.max(audioPlayer.currentTime - SKIP_TIME, 0);
});

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
}

audioPlayer.addEventListener('ended', function () {
  console.log('El audio ha terminado');
  playPauseBtn.innerHTML = '▶';
});

if (likeButton) {
  likeButton.addEventListener('click', function (e) {
    e.preventDefault();
    toggleLike(this);
  });
}

// Ejecutar la función cuando la página esté cargada
document.addEventListener('DOMContentLoaded', fetchBinauralAudio);