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
const tracksList = document.getElementById('tracks-list');
const likeButton = document.querySelector('.me-gusta');
const playlistsContainer = document.getElementById('dropdown'); // Changed to main dropdown
const authToken = localStorage.getItem('authToken');

// Constantes y variables globales
const SKIP_TIME = 10;
let likedAudios = JSON.parse(localStorage.getItem("likedTracks")) || [];
let currentTrackIndex = 0;
let audios = [];
let playlists = [];

// Función para obtener y cargar audios por género
function fetchAudiosByGenre() {
  const urlParams = new URLSearchParams(window.location.search);
  const genreId = urlParams.get('genre_id');

  if (!genreId) {
    console.error("No se proporcionó un genre_id en la URL.");
    return;
  }

  fetch(`http://127.0.0.1:8000/v1/audios?genre_id=${genreId}`, {
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
      console.log(`Audios del género con ID ${genreId}:`, data);
      audios = data;
      const genreTitle = document.getElementById("titulo-genero");
      if (data.length > 0 && data[0].genre) {
        genreTitle.textContent = `Género ${data[0].genre.name}`;
      }
      loadTracks();
      if (audios.length > 0) {
        loadAudio(audios[0].audio_file, audios[0].title, audios[0].description, audios[0].image_file, 0);
      }
    })
    .catch((error) => {
      console.error("Error al obtener los audios:", error);
      tracksList.innerHTML = `<p>Error al cargar los audios: ${error.message}</p>`;
    });
}

// Función para cargar un audio
function loadAudio(audioUrl, title, artist, cover, index) {
  if (!audioUrl) {
    console.error('No hay ningún audio actualmente en reproducción.');
    return;
  }

  audioPlayer.src = audioUrl;
  audioTitle.textContent = title;
  audioArtist.textContent = artist || "Desconocido";
  albumImage.src = cover;
  audioPlayer.load();

  playPauseBtn.innerHTML = '▶';
  currentTrackIndex = index;
  updateLikeButtonState();
}

// Función para reproducir una pista específica
function playTrack(index) {
  const track = audios[index];
  loadAudio(track.audio_file, track.title, track.description, track.image_file, index);
  audioPlayer.play().catch(function (error) {
    console.log('Error playing audio:', error);
  });
  playPauseBtn.innerHTML = '❚❚';
}

// Función para actualizar el estado del botón de me gusta
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

// Función para alternar el estado de me gusta
function toggleLike(element) {
  element.classList.toggle('active');
  const isLiked = element.classList.contains('active');
  const currentTrack = audios[currentTrackIndex];

  if (isLiked) {
    const mockLikeId = Date.now();
    element.dataset.likeId = mockLikeId;
    element.dataset.audioId = currentTrack.id;
    likedAudios.push({ ...currentTrack, like_id: mockLikeId });
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

// Función para cargar la lista de pistas
function loadTracks() {
  tracksList.innerHTML = '';
  audios.forEach((audio, index) => {
    const trackElement = document.createElement('div');
    trackElement.classList.add('track');
    trackElement.innerHTML = `
            <img src="${audio.image_file}" alt="${audio.title}" />
            <div class="track-info">
                <h3>${audio.title}</h3>
                <p>${audio.description || 'Sin descripción'}</p>
            </div>
            <button class="play-btn" onclick="playTrack(${index})">▶</button>
        `;
    tracksList.appendChild(trackElement);
  });
}

// Fetch playlists from backend
async function fetchAllPlaylists() {
  console.log('Fetching playlists...');
  console.log('Auth token:', authToken);

  if (!authToken) {
    console.log('No auth token found');
    playlists = [];
    return;
  }

  try {
    const response = await fetch('http://127.0.0.1:8000/v1/playlists', {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${authToken}`,
        "Accept": "application/json"
      },
    });

    console.log('Response status:', response.status);

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error response:', errorData);
      throw new Error(errorData.message || errorData.error || "Error en la solicitud: " + response.statusText);
    }

    const data = await response.json();
    console.log('Playlists data:', data);
    playlists = data.data || [];
  } catch (error) {
    console.error("Error al obtener las playlists:", error);
    playlists = [];
  }
}

function displayPlaylists() {
  console.log('Displaying playlists:', playlists);
  playlistsContainer.innerHTML = '';

  if (!authToken) {
    playlistsContainer.innerHTML = `<div class="dropdown-content">Por favor, inicia sesión</div>`;
  } else if (playlists.length === 0) {
    playlistsContainer.innerHTML = `<div class="dropdown-content">No hay playlists</div>`;
  } else {
    playlists.forEach((playlist) => {
      const playlistElement = document.createElement('div');
      playlistElement.classList.add('dropdown-content');
      playlistElement.textContent = playlist.name || `Playlist ${playlist.id}`;
      playlistElement.addEventListener('click', () => {
        console.log(`Añadiendo a playlist: ${playlist.name}`);
        toggleDropdown();
      });
      playlistsContainer.appendChild(playlistElement);
    });
  }

  // Add "Crear PlayList" at the end
  const createPlaylistElement = document.createElement('div');
  createPlaylistElement.classList.add('dropdown-content');
  createPlaylistElement.textContent = 'Crear PlayList';
  createPlaylistElement.addEventListener('click', showCreatePlaylistForm);
  playlistsContainer.appendChild(createPlaylistElement);
}

// Dropdown management
function toggleDropdown() {
  const dropdown = document.getElementById('dropdown');
  if (dropdown) {
    dropdown.classList.toggle('show');
    if (dropdown.classList.contains('show')) {
      displayPlaylists();
    }
    const form = document.getElementById('create-playlist-form');
    if (form) form.style.display = 'none';
  }
}

function showCreatePlaylistForm() {
  const form = document.getElementById('create-playlist-form');
  if (form) {
    form.style.display = 'block';
    const dropdown = document.getElementById('dropdown');
    if (dropdown) dropdown.classList.remove('show');
  }
}

function createNewPlaylist() {
  const playlistName = document.getElementById('playlist-name').value;
  if (playlistName.trim() === '') {
    alert('Por favor ingrese un nombre para la playlist');
    return;
  }

  console.log('Creando nueva playlist:', playlistName);
  alert(`Playlist "${playlistName}" creada!`);

  const form = document.getElementById('create-playlist-form');
  if (form) {
    form.style.display = 'none';
    document.getElementById('playlist-name').value = '';
  }

  // Refresh playlists after creation
  fetchAllPlaylists();
}

// Share functionality
function showHorizontalList() {
  const list = document.getElementById('horizontal-list');
  list.style.display = list.style.display === 'flex' ? 'none' : 'flex';
}

function copyLink() {
  const currentTrack = audios[currentTrackIndex];
  navigator.clipboard.writeText(currentTrack.audio_file);
  alert('Link copiado al portapapeles');
}

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
  if (currentTrackIndex + 1 < audios.length) {
    playTrack(currentTrackIndex + 1);
  } else {
    console.log('Fin de la lista de reproducción');
    playPauseBtn.innerHTML = '▶';
  }
});

if (likeButton) {
  likeButton.addEventListener('click', function (e) {
    e.preventDefault();
    toggleLike(this);
  });
}

document.querySelector('.dropdown-button').addEventListener('click', toggleDropdown);

// Ejecutar la función cuando la página esté cargada
document.addEventListener('DOMContentLoaded', async () => {
  await fetchAllPlaylists(); // Fetch playlists first
  fetchAudiosByGenre();

  document.addEventListener('click', (event) => {
    const dropdown = document.getElementById('dropdown');
    const form = document.getElementById('create-playlist-form');
    const dropdownButton = document.querySelector('.dropdown-button');

    if (dropdown && !dropdown.contains(event.target) &&
      !dropdownButton.contains(event.target) &&
      form && !form.contains(event.target)) {
      dropdown.classList.remove('show');
      form.style.display = 'none';
    }
  });
});

// // Inicialización de elementos del reproductor
// const audioPlayer = document.getElementById('audio');
// const audioTitle = document.getElementById('audio-title');
// const audioArtist = document.getElementById('audio-artist');
// const albumImage = document.getElementById('album-image');
// const playPauseBtn = document.getElementById('play-pause-btn');
// const prevBtn = document.getElementById('prev-btn');
// const nextBtn = document.getElementById('next-btn');
// const currentTimeElement = document.getElementById('current-time');
// const totalDurationElement = document.getElementById('total-duration');
// const progressBar = document.getElementById('progress-bar');
// const tracksList = document.getElementById('tracks-list');
// const likeButton = document.querySelector('.me-gusta');
// const playlistsContainer = document.getElementById('playlist-dropdown');
// const authToken = localStorage.getItem('authToken');

// // Constantes y variables globales
// const SKIP_TIME = 10;
// let likedAudios = JSON.parse(localStorage.getItem("likedTracks")) || [];
// let currentTrackIndex = 0;
// let audios = [];
// let playlists = []; // Store playlists globally

// // Función para obtener y cargar audios por género
// function fetchAudiosByGenre() {
//   const urlParams = new URLSearchParams(window.location.search);
//   const genreId = urlParams.get('genre_id');

//   if (!genreId) {
//     console.error("No se proporcionó un genre_id en la URL.");
//     return;
//   }

//   fetch(`http://127.0.0.1:8000/v1/audios?genre_id=${genreId}`, {
//     method: "GET",
//     headers: {
//       "Content-Type": "application/json",
//     },
//   })
//     .then((response) => {
//       if (!response.ok) {
//         return response.json().then(err => {
//           throw new Error(err.message || "Error en la solicitud: " + response.statusText);
//         });
//       }
//       return response.json();
//     })
//     .then((data) => {
//       console.log(`Audios del género con ID ${genreId}:`, data);
//       audios = data;
//       const genreTitle = document.getElementById("titulo-genero");
//       if (data.length > 0 && data[0].genre) {
//         genreTitle.textContent = `Género ${data[0].genre.name}`;
//       }
//       loadTracks();
//       if (audios.length > 0) {
//         loadAudio(audios[0].audio_file, audios[0].title, audios[0].description, audios[0].image_file, 0);
//       }
//     })
//     .catch((error) => {
//       console.error("Error al obtener los audios:", error);
//       tracksList.innerHTML = `<p>Error al cargar los audios: ${error.message}</p>`;
//     });
// }

// // Función para cargar un audio
// function loadAudio(audioUrl, title, artist, cover, index) {
//   if (!audioUrl) {
//     console.error('No hay ningún audio actualmente en reproducción.');
//     return;
//   }

//   audioPlayer.src = audioUrl;
//   audioTitle.textContent = title;
//   audioArtist.textContent = artist || "Desconocido";
//   albumImage.src = cover;
//   audioPlayer.load();

//   playPauseBtn.innerHTML = '▶';
//   currentTrackIndex = index;
//   updateLikeButtonState();
// }

// // Función para reproducir una pista específica
// function playTrack(index) {
//   const track = audios[index];
//   loadAudio(track.audio_file, track.title, track.description, track.image_file, index);
//   audioPlayer.play().catch(function (error) {
//     console.log('Error playing audio:', error);
//   });
//   playPauseBtn.innerHTML = '❚❚';
// }

// // Función para actualizar el estado del botón de me gusta
// function updateLikeButtonState() {
//   if (!likeButton) return;
//   const currentTrack = audios[currentTrackIndex];
//   const isLiked = likedAudios.some(audio => audio.id === currentTrack.id);

//   if (isLiked) {
//     likeButton.classList.add('active');
//     likeButton.dataset.audioId = currentTrack.id;
//   } else {
//     likeButton.classList.remove('active');
//     delete likeButton.dataset.audioId;
//   }
// }

// // Función para alternar el estado de me gusta
// function toggleLike(element) {
//   element.classList.toggle('active');
//   const isLiked = element.classList.contains('active');
//   const currentTrack = audios[currentTrackIndex];

//   if (isLiked) {
//     const mockLikeId = Date.now();
//     element.dataset.likeId = mockLikeId;
//     element.dataset.audioId = currentTrack.id;
//     likedAudios.push({ ...currentTrack, like_id: mockLikeId });
//   } else {
//     const audioId = parseInt(element.dataset.audioId);
//     const index = likedAudios.findIndex(audio => audio.id === audioId);
//     if (index !== -1) {
//       likedAudios.splice(index, 1);
//     }
//     delete element.dataset.likeId;
//   }
//   localStorage.setItem("likedTracks", JSON.stringify(likedAudios));
// }

// // Función para cargar la lista de pistas
// function loadTracks() {
//   tracksList.innerHTML = '';
//   audios.forEach((audio, index) => {
//     const trackElement = document.createElement('div');
//     trackElement.classList.add('track');
//     trackElement.innerHTML = `
//             <img src="${audio.image_file}" alt="${audio.title}" />
//             <div class="track-info">
//                 <h3>${audio.title}</h3>
//                 <p>${audio.description || 'Sin descripción'}</p>
//             </div>
//             <button class="play-btn" onclick="playTrack(${index})">▶</button>
//         `;
//     tracksList.appendChild(trackElement);
//   });
// }

// // Fetch playlists from backend
// async function fetchAllPlaylists() {
//   console.log('Fetching playlists...');
//   console.log('Auth token:', authToken);

//   if (!authToken) {
//     console.log('No auth token found');
//     playlists = [];
//     return;
//   }

//   try {
//     const response = await fetch('http://127.0.0.1:8000/v1/playlists', {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//         "Authorization": `Bearer ${authToken}`,
//         "Accept": "application/json"
//       },
//     });

//     console.log('Response status:', response.status);

//     if (!response.ok) {
//       const errorData = await response.json();
//       console.error('Error response:', errorData);
//       throw new Error(errorData.message || errorData.error || "Error en la solicitud: " + response.statusText);
//     }

//     const data = await response.json();
//     console.log('Playlists data:', data);
//     playlists = data.data || [];
//   } catch (error) {
//     console.error("Error al obtener las playlists:", error);
//     playlists = [];
//   }
// }

// function displayPlaylists() {
//   console.log('Displaying playlists:', playlists);
//   playlistsContainer.innerHTML = '';

//   if (!authToken) {
//     playlistsContainer.innerHTML = `<div class="dropdown-content">Por favor, inicia sesión</div>`;
//   } else if (playlists.length === 0) {
//     playlistsContainer.innerHTML = `<div class="dropdown-content">No hay playlists</div>`;
//   } else {
//     playlists.forEach((playlist) => {
//       const playlistElement = document.createElement('div');
//       playlistElement.classList.add('dropdown-content');
//       playlistElement.textContent = playlist.name || `Playlist ${playlist.id}`;
//       playlistElement.addEventListener('click', () => {
//         console.log(`Añadiendo a playlist: ${playlist.name}`);
//         toggleNestedDropdown();
//       });
//       playlistsContainer.appendChild(playlistElement);
//     });
//   }

//   // Add "Crear PlayList" at the end
//   const createPlaylistElement = document.createElement('div');
//   createPlaylistElement.classList.add('dropdown-content');
//   createPlaylistElement.textContent = 'Crear PlayList';
//   createPlaylistElement.addEventListener('click', showCreatePlaylistForm);
//   playlistsContainer.appendChild(createPlaylistElement);
// }

// // Dropdown management
// function toggleDropdown() {
//   const dropdown = document.getElementById('dropdown');
//   if (dropdown) {
//     dropdown.classList.toggle('show');
//     const form = document.getElementById('create-playlist-form');
//     if (form) form.style.display = 'none';
//   }
// }

// function toggleNestedDropdown() {
//   const nestedDropdown = document.getElementById('playlist-dropdown');
//   if (nestedDropdown) {
//     nestedDropdown.classList.toggle('show');
//     if (nestedDropdown.classList.contains('show')) {
//       displayPlaylists();
//     }
//   }
// }

// function showCreatePlaylistForm() {
//   const form = document.getElementById('create-playlist-form');
//   if (form) {
//     form.style.display = 'block';
//     const nestedDropdown = document.getElementById('playlist-dropdown');
//     if (nestedDropdown) nestedDropdown.classList.remove('show');
//   }
// }

// function createNewPlaylist() {
//   const playlistName = document.getElementById('playlist-name').value;
//   if (playlistName.trim() === '') {
//     alert('Por favor ingrese un nombre para la playlist');
//     return;
//   }

//   console.log('Creando nueva playlist:', playlistName);
//   alert(`Playlist "${playlistName}" creada!`);

//   const form = document.getElementById('create-playlist-form');
//   if (form) {
//     form.style.display = 'none';
//     document.getElementById('playlist-name').value = '';
//   }

//   const dropdown = document.getElementById('dropdown');
//   if (dropdown) dropdown.classList.remove('show');
// }

// // Share functionality
// function showHorizontalList() {
//   const list = document.getElementById('horizontal-list');
//   list.style.display = list.style.display === 'flex' ? 'none' : 'flex';
// }

// function copyLink() {
//   const currentTrack = audios[currentTrackIndex];
//   navigator.clipboard.writeText(currentTrack.audio_file);
//   alert('Link copiado al portapapeles');
// }

// // Event Listeners
// playPauseBtn.addEventListener('click', function () {
//   if (audioPlayer.paused) {
//     audioPlayer.play().catch(function (error) {
//       console.log('Error playing audio:', error);
//     });
//     playPauseBtn.innerHTML = '❚❚';
//   } else {
//     audioPlayer.pause();
//     playPauseBtn.innerHTML = '▶';
//   }
// });

// function updateProgressBar() {
//   if (!isNaN(audioPlayer.duration)) {
//     const progressPercentage = (audioPlayer.currentTime / audioPlayer.duration) * 100;
//     progressBar.value = progressPercentage;
//     progressBar.style.background = `linear-gradient(to right, #59009A ${progressPercentage}%, #e1bee7 ${progressPercentage}%)`;
//     currentTimeElement.textContent = formatTime(audioPlayer.currentTime);
//     totalDurationElement.textContent = formatTime(audioPlayer.duration);
//   }
// }

// progressBar.addEventListener('input', function () {
//   const seekTime = (progressBar.value / 100) * audioPlayer.duration;
//   audioPlayer.currentTime = seekTime;
// });

// audioPlayer.addEventListener('timeupdate', updateProgressBar);

// nextBtn.addEventListener('click', function () {
//   audioPlayer.currentTime = Math.min(audioPlayer.currentTime + SKIP_TIME, audioPlayer.duration);
// });

// prevBtn.addEventListener('click', function () {
//   audioPlayer.currentTime = Math.max(audioPlayer.currentTime - SKIP_TIME, 0);
// });

// function formatTime(seconds) {
//   const minutes = Math.floor(seconds / 60);
//   const remainingSeconds = Math.floor(seconds % 60);
//   return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
// }

// audioPlayer.addEventListener('ended', function () {
//   if (currentTrackIndex + 1 < audios.length) {
//     playTrack(currentTrackIndex + 1);
//   } else {
//     console.log('Fin de la lista de reproducción');
//     playPauseBtn.innerHTML = '▶';
//   }
// });

// if (likeButton) {
//   likeButton.addEventListener('click', function (e) {
//     e.preventDefault();
//     toggleLike(this);
//   });
// }

// document.querySelector('.dropdown-button').addEventListener('click', toggleDropdown);

// // Ejecutar la función cuando la página esté cargada
// document.addEventListener('DOMContentLoaded', async () => {
//   await fetchAllPlaylists(); // Fetch playlists first
//   fetchAudiosByGenre();

//   document.addEventListener('click', (event) => {
//     const dropdown = document.getElementById('dropdown');
//     const nestedDropdown = document.getElementById('playlist-dropdown');
//     const form = document.getElementById('create-playlist-form');
//     const dropdownButton = document.querySelector('.dropdown-button');

//     if (dropdown && !dropdown.contains(event.target) &&
//       !dropdownButton.contains(event.target) &&
//       form && !form.contains(event.target)) {
//       dropdown.classList.remove('show');
//       if (nestedDropdown) nestedDropdown.classList.remove('show');
//       form.style.display = 'none';
//     }
//   });
// });