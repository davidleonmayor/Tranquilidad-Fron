// Estructura de datos de prueba para simular audios
const sampleAudios = [
  {
      id: 1,
      title: "Sample Track 1",
      artist: "Artist 1",
      description: "A relaxing melody",
      audio_file: "/Vistas1.1/audio/town-10169.mp3",
      image_file: "/musicoterapia/Vistas1.1/images/El-piano.jpg",
      like_id: null
  },
  {
      id: 2,
      title: "Sample Track 2",
      artist: "Artist 2",
      description: "Calming nature sounds",
      audio_file: "/Vistas1.1/audio/town-10169.mp3",
      image_file: "/musicoterapia/Vistas1.1/images/El-piano.jpg",
      like_id: null
  },
  {
      id: 3,
      title: "Sample Track 3",
      artist: "Artist 3",
      description: "Peaceful piano",
      audio_file: "/Vistas1.1/audio/town-10169.mp3",
      image_file: "/musicoterapia/Vistas1.1/images/El-piano.jpg",
      like_id: null
  }
];

// Inicialización de elementos del reproductor de la barra
const audioPlayer = document.getElementById('audio');
const playPauseBtn = document.getElementById('play-pause-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const progressBar = document.getElementById('progress-bar');
const currentTimeElement = document.getElementById('current-time');
const totalDurationElement = document.getElementById('total-duration');

// Constantes y variables globales
const SKIP_TIME = 10;
let likedAudios = [];
let currentTrackIndex = 0;
let isPlayingLikedList = false; // Indica si se está reproduciendo la lista de Me Gusta


// Función para cargar y reproducir un audio
function loadAudio(audioUrl, title, artist, cover, index) {
  if (!audioUrl) {
      console.error('No hay ningún audio actualmente en reproducción.');
      return;
  }

  audioPlayer.src = audioUrl;
  audioTitle.textContent = title;
  audioArtist.textContent = artist;
  albumImage.src = cover;
  audioPlayer.load();
  
  audioPlayer.play().catch(function(error) {
      console.log('Error playing audio:', error);
  });
  
  playPauseBtn.innerHTML = '&#10074;&#10074;';
  currentTrackIndex = index;
  updateLikeButtonState(audioUrl);
}
// Función para alternar el estado de me gusta
function toggleLike(element) {
  element.classList.toggle('active');
  const isLiked = element.classList.contains('active');
  
  const currentTrack = sampleAudios[currentTrackIndex];
  if (!currentTrack) return;

  if (isLiked) {
      const mockLikeId = Date.now();
      element.dataset.likeId = mockLikeId;
      element.dataset.audioId = currentTrack.id;
      
      const likedAudio = { ...currentTrack, like_id: mockLikeId };
      likedAudios.push(likedAudio);
  } else {
      const audioId = parseInt(element.dataset.audioId);
      removeAudioFromList(audioId);
      delete element.dataset.likeId;
  }
}

// Función para eliminar un audio de la lista de favoritos
function removeAudioFromList(audioId) {
  const index = likedAudios.findIndex(audio => audio.id === audioId);
  if (index !== -1) {
      likedAudios.splice(index, 1);
  }
}

// Función para cargar la lista de pistas
function loadTracks() {
  tracksList.innerHTML = '';
  sampleAudios.forEach((audio, index) => {
      const trackElement = document.createElement('div');
      trackElement.classList.add('track');
      trackElement.innerHTML = `
          <img src="${audio.image_file}" alt="${audio.title}" />
          <div class="track-info">
              <h3>${audio.title}</h3>
              <p>${audio.artist}</p>
          </div>
          <button class="play-btn" onclick="playTrack(${index})">&#9654;</button>
      `;
      tracksList.appendChild(trackElement);
  });
}

// Función para reproducir una pista específica
function playTrack(index, isLiked = false) {
    isPlayingLikedList = isLiked;
    
    const track = isLiked ? likedAudios[index] : sampleAudios[index];
    
    if (!track) return;

    loadAudio(track.audio_file, track.title, track.artist, track.image_file, index);
}


// Event Listeners
playPauseBtn.addEventListener('click', function() {
  if (audioPlayer.paused) {
      audioPlayer.play();
      playPauseBtn.innerHTML = '&#10074;&#10074;';
  } else {
      audioPlayer.pause();
      playPauseBtn.innerHTML = '&#9654;';
  }
});

function playTrack(index, isLiked = false) {
    isPlayingLikedList = isLiked;
    
    const track = isLiked ? likedAudios[index] : sampleAudios[index];
    
    if (!track) return;

    loadAudio(track.audio_file, track.title, track.artist, track.image_file, index);
}


function updateProgressBar() {
  if (!isNaN(audioPlayer.duration)) {
      const progressPercentage = (audioPlayer.currentTime / audioPlayer.duration) * 100;
      progressBar.value = progressPercentage;
      progressBar.style.background = `linear-gradient(to right, #59009A ${progressPercentage}%, #e1bee7 ${progressPercentage}%)`;
      currentTimeElement.textContent = formatTime(audioPlayer.currentTime);
      totalDurationElement.textContent = formatTime(audioPlayer.duration);
  }
}

progressBar.addEventListener('input', function() {
  const seekTime = (progressBar.value / 100) * audioPlayer.duration;
  audioPlayer.currentTime = seekTime;
});

audioPlayer.addEventListener('timeupdate', updateProgressBar);

nextBtn.addEventListener('click', function() {
  audioPlayer.currentTime = Math.min(audioPlayer.currentTime + SKIP_TIME, audioPlayer.duration);
});

prevBtn.addEventListener('click', function() {
  audioPlayer.currentTime = Math.max(audioPlayer.currentTime - SKIP_TIME, 0);
});

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
}

audioPlayer.addEventListener('ended', function() {
  if (currentTrackIndex + 1 < sampleAudios.length) {
      playTrack(currentTrackIndex + 1);
  } else {
      console.log('Fin de la lista de reproducción');
  }
});

// Funciones para el dropdown
function toggleDropdown(id) {
  document.getElementById(id).classList.toggle('show');
}

function toggleNestedDropdown(id) {
  document.getElementById(id).classList.toggle('show');
}

function showHorizontalList() {
  const horizontalList = document.getElementById('horizontal-list');
  horizontalList.style.display = horizontalList.style.display === 'flex' ? 'none' : 'flex';
}

function copyLink() {
  // Implementar la funcionalidad de copiar el link
  console.log('Link copiado al portapapeles');
}

// Cierra los dropdowns si el usuario hace clic fuera de ellos
window.onclick = function(event) {
  if (!event.target.matches('.dropdown-button')) {
      const dropdowns = document.getElementsByClassName('dropdown');
      for (const dropdown of dropdowns) {
          if (dropdown.classList.contains('show')) {
              dropdown.classList.remove('show');
          }
      }
  }
}

// Inicializar al cargar la página
document.addEventListener('DOMContentLoaded', function() {
  loadTracks();
  // Cargar la primera pista
  if (sampleAudios.length > 0) {
      playTrack(0);
  }
});




// Asegurarse de que el botón de me gusta esté funcionando
document.addEventListener('DOMContentLoaded', function() {
  const likeButton = document.querySelector('.me-gusta');
  
  if (likeButton) {
      // Inicializar el estado del botón
      likeButton.addEventListener('click', function(e) {
          e.preventDefault(); // Prevenir cualquier comportamiento por defecto
          
          // Toggle de la clase active
          this.classList.toggle('active');
          
          // Obtener el audio actual
          const currentTrack = sampleAudios[currentTrackIndex];
          
          if (this.classList.contains('active')) {
              // Si se activa el me gusta
              const mockLikeId = Date.now();
              this.dataset.likeId = mockLikeId;
              this.dataset.audioId = currentTrack.id;
              
              // Agregar a liked audios
              const likedAudio = { ...currentTrack, like_id: mockLikeId };
              likedAudios.push(likedAudio);
              
              console.log('Audio agregado a favoritos:', currentTrack.title);
          } else {
              // Si se quita el me gusta
              const audioId = parseInt(this.dataset.audioId);
              removeAudioFromList(audioId);
              delete this.dataset.likeId;
              
              console.log('Audio removido de favoritos:', currentTrack.title);
          }
      });
  }
  
  audioPlayer.addEventListener('loadeddata', function() {
    updateLikeButtonState(audioPlayer.src);
});

});

// Función para actualizar el estado del botón cuando cambia la canción
function updateLikeButtonState(audioUrl) {
    const likeButton = document.querySelector('.me-gusta');
    if (!likeButton) return;

    const currentTrack = isPlayingLikedList ? likedAudios[currentTrackIndex] : sampleAudios[currentTrackIndex];
    const isLiked = likedAudios.some(audio => audio.id === currentTrack.id);

    if (isLiked) {
        likeButton.classList.add('active');
    } else {
        likeButton.classList.remove('active');
    }
}






// Función que alterna la visibilidad de un menu desplegable
function toggleDropdown(elementId) {
  const dropdown = document.getElementById(elementId);
  dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
}

// Muestra la lista horizontal y oculta el menu desplegable
function showHorizontalList() {
  const dropdown = document.getElementById("dropdown");
  const horizontalList = document.getElementById("horizontal-list");
  dropdown.style.display = "none";
  horizontalList.style.display = "flex";
}

// Copia el link actual al portapapeles
function copyLink() {
  const dummy = document.createElement("textarea");
  document.body.appendChild(dummy);
  dummy.value = window.location.href;
  dummy.select();
  document.execCommand("copy");
  document.body.removeChild(dummy);
  
  // Cambiar el texto del botón temporalmente para dar feedback
  const button = document.querySelector('.horizontal-list button');
  const originalText = button.textContent;
  button.textContent = "¡Copiado!";
  setTimeout(() => {
      button.textContent = originalText;
  }, 2000);
}

// Alterna la visibilidad del menú desplegable anidado
function toggleNestedDropdown(elementId) {
  const nestedDropdown = document.getElementById(elementId);
  if (nestedDropdown.style.display === "block") {
      nestedDropdown.style.display = "none";
  } else {
      // Cerrar otros dropdowns anidados primero
      const allNested = document.getElementsByClassName('nested-dropdown');
      for (let nested of allNested) {
          nested.style.display = "none";
      }
      nestedDropdown.style.display = "block";
  }
  event.stopPropagation(); // Prevenir que el click se propague
}

// Cierra todos los menús desplegables y listas horizontales
function closeDropdownsAndLists() {
  const dropdowns = document.getElementsByClassName("dropdown");
  for (let i = 0; i < dropdowns.length; i++) {
      const openDropdown = dropdowns[i];
      if (openDropdown.style.display === "block") {
          openDropdown.style.display = "none";
      }
  }
  
  const nestedDropdowns = document.getElementsByClassName("nested-dropdown");
  for (let i = 0; i < nestedDropdowns.length; i++) {
      nestedDropdowns[i].style.display = "none";
  }
  
  const horizontalList = document.getElementById("horizontal-list");
  if (horizontalList.style.display === "flex") {
      horizontalList.style.display = "none";
  }
}

// Cierra los menús cuando se hace clic fuera
window.onclick = function(event) {
  if (!event.target.matches('.dropdown-button, .dropdown-content, .horizontal-list img, .horizontal-list button')) {
      closeDropdownsAndLists();
  }
};


document.addEventListener("DOMContentLoaded", function () {
  const tracksList = document.getElementById("tracks-list");
  let likedTracks = JSON.parse(localStorage.getItem("likedTracks")) || [];
  
  // Referencias al reproductor
  const audioPlayer = document.getElementById("audio");
  const audioTitle = document.getElementById("audio-title");
  const audioArtist = document.getElementById("audio-artist");
  const albumImage = document.getElementById("album-image");
  const playPauseBtn = document.getElementById("play-pause-btn");
  
  let currentTrackIndex = null; // Índice de la canción actual

  if (likedTracks.length === 0) {
      tracksList.innerHTML = "<p>No tienes canciones en tu lista de Me Gusta.</p>";
      return;
  }

  likedTracks.forEach((track, index) => {
      let trackElement = document.createElement("div");
      trackElement.classList.add("track");

      trackElement.innerHTML = `
          <img src="${track.image}" alt="Cover" class="track-image">
          <div class="track-info">
              <h3>${track.title}</h3>
              <p>${track.artist}</p>
          </div>
          <button class="play-track" data-index="${index}">▶</button>
      `;

      // Evento de clic para reproducir la canción en el reproductor
      trackElement.querySelector(".play-track").addEventListener("click", function () {
          let trackIndex = parseInt(this.dataset.index);
          
          if (currentTrackIndex === trackIndex) {
              // Si la misma canción está sonando, alternar entre play y pausa
              if (audioPlayer.paused) {
                  audioPlayer.play();
                  this.textContent = "⏸";
                  playPauseBtn.innerHTML = "⏸"; // Sincronizar con el botón principal
              } else {
                  audioPlayer.pause();
                  this.textContent = "▶";
                  playPauseBtn.innerHTML = "▶";
              }
          } else {
              // Si es una nueva canción, cambiar el reproductor
              currentTrackIndex = trackIndex;
              loadAudio(likedTracks[trackIndex], this);
          }
      });

      tracksList.appendChild(trackElement);
  });

  function loadAudio(track, playButton) {
      audioPlayer.src = track.audio;
      audioTitle.textContent = track.title;
      audioArtist.textContent = track.artist;
      albumImage.src = track.image;
      audioPlayer.load();
      audioPlayer.play();

      // Actualizar todos los botones a ▶ y cambiar el de la canción actual
      document.querySelectorAll(".play-track").forEach(btn => btn.textContent = "▶");
      playButton.textContent = "⏸";
      playPauseBtn.innerHTML = "⏸";
  }

  // Sincronizar el botón principal con el estado del audio
  playPauseBtn.addEventListener("click", function () {
      if (audioPlayer.paused) {
          audioPlayer.play();
          this.innerHTML = "⏸";
          document.querySelector(`.play-track[data-index="${currentTrackIndex}"]`).textContent = "⏸";
      } else {
          audioPlayer.pause();
          this.innerHTML = "▶";
          document.querySelector(`.play-track[data-index="${currentTrackIndex}"]`).textContent = "▶";
      }
  });

  // Cuando la canción termina, actualizar el botón
  audioPlayer.addEventListener("ended", function () {
      playPauseBtn.innerHTML = "▶";
      if (currentTrackIndex !== null) {
          document.querySelector(`.play-track[data-index="${currentTrackIndex}"]`).textContent = "▶";
      }
  });
});
// Función para cargar una canción en el reproductor
function loadAudio(index) {
  if (index < 0 || index >= sampleAudios.length) return;

  const track = sampleAudios[index];
  audioPlayer.src = track.audio_file;
  audioPlayer.load();
  audioPlayer.play().then(() => {
      playPauseBtn.innerHTML = '⏸';
  }).catch(err => console.log('Error al reproducir:', err));

  currentTrackIndex = index;
}


// Función para agregar nuevas canciones dinámicamente
function addTrack(title, file) {
    const trackId = tracks.length; // Índice basado en el tamaño actual

    // Crear un nuevo elemento en la lista de canciones
    const trackElement = document.createElement('div');
    trackElement.classList.add('track');
    trackElement.innerHTML = `
        <button class="play-track" data-index="${trackId}">▶</button>
        <span>${title}</span>
    `;

    // Agregar la pista al contenedor
    trackContainer.appendChild(trackElement);

    // Agregar la canción a la lista de reproducción
    tracks.push({ title, file });

    // Asignar evento de reproducción
    trackElement.querySelector('.play-track').addEventListener('click', function() {
        loadAudio(trackId);
    });
}

// Función para cargar y reproducir una pista
function loadAudio(index) {
    if (index < 0 || index >= tracks.length) return;

    const track = tracks[index];
    audioPlayer.src = track.file;
    audioPlayer.load();
    audioPlayer.play().then(() => {
        updatePlayButtons(index);
        playPauseBtn.innerHTML = '⏸';
    }).catch(err => console.log('Error al reproducir:', err));

    currentTrackIndex = index;
}

// Función para actualizar botones de reproducción
function updatePlayButtons(activeIndex) {
    document.querySelectorAll('.play-track').forEach((btn, index) => {
        btn.innerHTML = index === activeIndex ? '⏸' : '▶';
    });
}

// Botón de pausa/reproducción global
playPauseBtn.addEventListener('click', function() {
    if (audioPlayer.paused) {
        audioPlayer.play();
        playPauseBtn.innerHTML = '⏸';
        updatePlayButtons(currentTrackIndex);
    } else {
        audioPlayer.pause();
        playPauseBtn.innerHTML = '▶';
        updatePlayButtons(-1);
    }
});

// Adelantar y retroceder en la pista
nextBtn.addEventListener('click', function() {
    audioPlayer.currentTime = Math.min(audioPlayer.currentTime + 10, audioPlayer.duration);
});

prevBtn.addEventListener('click', function() {
    audioPlayer.currentTime = Math.max(audioPlayer.currentTime - 10, 0);
});

// Sincronizar la barra de progreso con el audio
audioPlayer.addEventListener('timeupdate', function() {
    if (!isNaN(audioPlayer.duration)) {
        const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
        progressBar.value = progress;
        currentTimeElement.textContent = formatTime(audioPlayer.currentTime);
        totalDurationElement.textContent = formatTime(audioPlayer.duration);
    }
});

// Permitir adelantar manualmente con la barra de progreso
progressBar.addEventListener('input', function() {
    const seekTime = (progressBar.value / 100) * audioPlayer.duration;
    audioPlayer.currentTime = seekTime;
});

// Cuando termina una canción, pasar a la siguiente
audioPlayer.addEventListener('ended', function() {
    if (isPlayingLikedList) {
        // Si estamos en la lista de Me Gusta
        if (currentTrackIndex + 1 < likedAudios.length) {
            playTrack(currentTrackIndex + 1, true);
        } else {
            console.log('Fin de la lista de Me Gusta');
        }
    } else {
        // Si estamos en la lista normal
        if (currentTrackIndex + 1 < sampleAudios.length) {
            playTrack(currentTrackIndex + 1);
        } else {
            console.log('Fin de la lista de reproducción');
        }
    }
});


// Formatear tiempo en minutos y segundos
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
}

// Agregar canciones de ejemplo al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    addTrack('Canción 1', 'audio1.mp3');
    addTrack('Canción 2', 'audio2.mp3');
    addTrack('Canción 3', 'audio3.mp3');
});

