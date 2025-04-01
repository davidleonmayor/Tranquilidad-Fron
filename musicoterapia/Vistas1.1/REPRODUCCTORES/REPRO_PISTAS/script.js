// Get DOM elements
const authToken = localStorage.getItem('authToken');
const playlistNameElement = document.getElementById('playlist-name');
const tracksList = document.getElementById('tracks-list');
const audioPlayer = document.getElementById('audio-player');
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

// Variables
let audios = [];
let currentTrackIndex = 0;
let likedAudios = JSON.parse(localStorage.getItem('likedTracks')) || [];

// Get playlist ID from URL
const urlParams = new URLSearchParams(window.location.search);
const playlistId = urlParams.get('pistasId');

// Fetch audios for the playlist
function fetchPlaylistAudios() {
  if (!authToken) {
    tracksList.innerHTML = `<p>Por favor, inicia sesión para ver los audios. <a href="/inicio-de-sesion/Modulo-iniciar-sesion/login/login.html">Iniciar sesión</a></p>`;
    return;
  }

  if (!playlistId) {
    tracksList.innerHTML = `<p>Error: No se proporcionó un ID de playlist.</p>`;
    return;
  }

  fetch(`http://127.0.0.1:8000/v1/playlists/${playlistId}/audios`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${authToken}`,
    },
  })
    .then((response) => {
      if (!response.ok) {
        return response.json().then(err => {
          throw new Error(err.message || err.error || "Error en la solicitud: " + response.statusText);
        });
      }
      return response.json();
    })
    .then((data) => {
      console.log('Respuesta del servidor:', data);
      audios = data.audios || [];
      playlistNameElement.textContent = data.playlist_name || `Playlist ${playlistId}`;

      if (audios.length === 0) {
        tracksList.innerHTML = `<p>${data.message || 'No se encontraron audios en esta playlist.'}</p>`;
        return;
      }

      loadTracks();
      // Play the first track automatically
      if (audios.length > 0) {
        playTrack(0);
      }
    })
    .catch((error) => {
      console.error("Error al obtener los audios:", error);
      tracksList.innerHTML = `<p>Error al cargar los audios: ${error.message}.</p>`;
      playlistNameElement.textContent = `Error cargando playlist`;
    });
}

// Load tracks into the UI
function loadTracks() {
  tracksList.innerHTML = '';
  audios.forEach((audio, index) => {
    const trackElement = document.createElement('div');
    trackElement.classList.add('track');
    trackElement.innerHTML = `
            <img src="${audio.image_file || '/musicoterapia/Vistas1.1/images/El-piano.jpg'}" alt="${audio.title}" onerror="this.src='/musicoterapia/Vistas1.1/images/El-piano.jpg';" />
            <div class="track-info">
                <h3>${audio.title}</h3>
                <p>${audio.artist || 'Desconocido'}</p>
            </div>
            <button class="play-btn" onclick="playTrack(${index})">▶</button>
        `;
    tracksList.appendChild(trackElement);
  });
}

// Load and play an audio
function loadAudio(audioUrl, title, artist, cover, index) {
  if (!audioUrl) {
    console.error('No hay ningún audio actualmente en reproducción.');
    return;
  }

  audioPlayer.src = audioUrl;
  audioTitle.textContent = title;
  audioArtist.textContent = artist || 'Desconocido';
  albumImage.src = cover || '/musicoterapia/Vistas1.1/images/El-piano.jpg';
  audioPlayer.load();

  audioPlayer.play().catch((error) => {
    console.log('Error playing audio:', error);
  });

  playPauseBtn.innerHTML = '❚❚';
  currentTrackIndex = index;
  updateLikeButtonState();
}

// Play a specific track
function playTrack(index) {
  const track = audios[index];
  loadAudio(track.audio_file, track.title, track.artist, track.image_file, index);
}

// Update progress bar
function updateProgressBar() {
  if (!isNaN(audioPlayer.duration)) {
    const progressPercentage = (audioPlayer.currentTime / audioPlayer.duration) * 100;
    progressBar.value = progressPercentage;
    progressBar.style.background = `linear-gradient(to right, #59009A ${progressPercentage}%, #e1bee7 ${progressPercentage}%)`;
    currentTimeElement.textContent = formatTime(audioPlayer.currentTime);
    totalDurationElement.textContent = formatTime(audioPlayer.duration);
  }
}

// Format time in MM:SS
function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
}

// Update like button state
function updateLikeButtonState() {
  if (!likeButton) return;
  const currentTrack = audios[currentTrackIndex];
  const isLiked = likedAudios.some(audio => audio.id === currentTrack.id);

  if (isLiked) {
    likeButton.classList.add('active');
    likeButton.dataset.audioId = currentTrack.id;
  } else {
    likeButton.classList.remove('active');
    delete likeButton.dataset.audioId;
  }
}

// Event Listeners
playPauseBtn.addEventListener('click', function () {
  if (audioPlayer.paused) {
    audioPlayer.play();
    playPauseBtn.innerHTML = '❚❚';
  } else {
    audioPlayer.pause();
    playPauseBtn.innerHTML = '▶';
  }
});

progressBar.addEventListener('input', function () {
  const seekTime = (progressBar.value / 100) * audioPlayer.duration;
  audioPlayer.currentTime = seekTime;
});

audioPlayer.addEventListener('timeupdate', updateProgressBar);

nextBtn.addEventListener('click', function () {
  if (currentTrackIndex + 1 < audios.length) {
    playTrack(currentTrackIndex + 1);
  }
});

prevBtn.addEventListener('click', function () {
  if (currentTrackIndex - 1 >= 0) {
    playTrack(currentTrackIndex - 1);
  }
});

audioPlayer.addEventListener('ended', function () {
  if (currentTrackIndex + 1 < audios.length) {
    playTrack(currentTrackIndex + 1);
  } else {
    console.log('Fin de la lista de reproducción');
  }
});

likeButton.addEventListener('click', function (e) {
  e.preventDefault();
  this.classList.toggle('active');
  const currentTrack = audios[currentTrackIndex];
  if (this.classList.contains('active')) {
    const mockLikeId = Date.now();
    this.dataset.likeId = mockLikeId;
    this.dataset.audioId = currentTrack.id;
    likedAudios.push({ ...currentTrack, like_id: mockLikeId });
  } else {
    const audioId = parseInt(this.dataset.audioId);
    likedAudios = likedAudios.filter(audio => audio.id !== audioId);
    delete this.dataset.likeId;
  }
  localStorage.setItem('likedTracks', JSON.stringify(likedAudios));
});

// Dropdown functions (unchanged)
function toggleDropdown(id) {
  const dropdown = document.getElementById(id);
  dropdown.classList.toggle('show');
}

function toggleNestedDropdown(id) {
  const nestedDropdown = document.getElementById(id);
  nestedDropdown.classList.toggle('show');
}

function showHorizontalList() {
  const horizontalList = document.getElementById('horizontal-list');
  horizontalList.style.display = horizontalList.style.display === 'flex' ? 'none' : 'flex';
}

function copyLink() {
  navigator.clipboard.writeText(window.location.href).then(() => {
    const button = document.querySelector('.horizontal-list button');
    const originalText = button.textContent;
    button.textContent = "¡Copiado!";
    setTimeout(() => button.textContent = originalText, 2000);
  });
}

window.onclick = function (event) {
  if (!event.target.matches('.dropdown-button')) {
    const dropdowns = document.getElementsByClassName('dropdown');
    for (const dropdown of dropdowns) {
      if (dropdown.classList.contains('show')) {
        dropdown.classList.remove('show');
      }
    }
  }
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', fetchPlaylistAudios);