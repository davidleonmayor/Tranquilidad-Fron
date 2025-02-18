// Estructura de datos de prueba para simular audios
const sampleAudios = [
  {
      id: 1,
      title: "After work",
      artist: "Piano_Music",
      description: "A relaxing melody",
      audio_file: "/musicoterapia/Vistas1.1/audio/genero-audio/CLASICA/after-work-142608.mp3",
      image_file: "/musicoterapia/Vistas1.1/images/El-piano.jpg",
      like_id: null
  },
  {
      id: 2,
      title: "Emotional Piano Background Music",
      artist: "DELOSound",
      description: "Calming nature sounds",
      audio_file: "/musicoterapia/Vistas1.1/audio/genero-audio/CLASICA/emotional-piano-background-music-298069.mp3",
      image_file: "/musicoterapia/Vistas1.1/images/El-piano.jpg",
      like_id: null
  },
  {
      id: 3,
      title: "Perfect Beauty",
      artist: "Good_B_Music",
      description: "Peaceful piano",
      audio_file: "/musicoterapia/Vistas1.1/audio/genero-audio/CLASICA/fur-elise-by-ludwig-van-beethoven-classic-guitar-ahmad-mousavipour-13870.mp3",
      image_file: "/musicoterapia/Vistas1.1/images/El-piano.jpg",
      like_id: null
  }
  
];

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

// Constantes y variables globales
const SKIP_TIME = 10;
let likedAudios = [];
let currentTrackIndex = 0;

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

// Función para actualizar el estado del botón de me gusta
function updateLikeButtonState(audioUrl) {
  if (!likeButton) return;
  const likedAudio = likedAudios.find(audio => audio.audio_file === audioUrl);

  if (likedAudio) {
      likeButton.classList.add('active');
      likeButton.dataset.likeId = likedAudio.like_id;
      likeButton.dataset.audioId = likedAudio.id;
  } else {
      likeButton.classList.remove('active');
      delete likeButton.dataset.likeId;
      delete likeButton.dataset.audioId;
  }
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
function playTrack(index) {
  const track = sampleAudios[index];
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
  
  // Actualizar el estado del botón cuando cambia la canción
  audioPlayer.addEventListener('loadeddata', function() {
      updateLikeButtonState(this.src);
  });
});

// Función para actualizar el estado del botón cuando cambia la canción
function updateLikeButtonState(audioUrl) {
  const likeButton = document.querySelector('.me-gusta');
  if (!likeButton) return;
  
  const currentTrack = sampleAudios[currentTrackIndex];
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
  const likeButton = document.querySelector(".me-gusta");
  const audioTitle = document.getElementById("audio-title").textContent;
  const audioArtist = document.getElementById("audio-artist").textContent;
  const albumImage = document.getElementById("album-image").src;

  let likedTracks = JSON.parse(localStorage.getItem("likedTracks")) || [];

  // Verificar si la pista ya está en favoritos y actualizar el icono
  const isLiked = likedTracks.some(track => track.title === audioTitle);
  if (isLiked) {
      likeButton.style.color = "#59009A"; // Marcar como favorito
  }

  likeButton.addEventListener("click", function () {
      let track = {
          title: audioTitle,
          artist: audioArtist,
          image: albumImage,
          src: document.getElementById("audio").src
      };

      // Buscar si la pista ya está en favoritos
      const index = likedTracks.findIndex(t => t.title === track.title);

      if (index === -1) {
          likedTracks.push(track);
          likeButton.style.color = ""; // Marcar como favorito
      } else {
          likedTracks.splice(index, 1);
          likeButton.style.color = "black"; // Quitar favorito
      }

      localStorage.setItem("likedTracks", JSON.stringify(likedTracks));
  });
});
// Función para actualizar el estado del botón de "me gusta" cuando cambia la canción
function updateLikeButtonState() {
  const likeButton = document.querySelector('.me-gusta');
  if (!likeButton) return;

  const currentTrack = sampleAudios[currentTrackIndex];
  const isLiked = likedAudios.some(audio => audio.id === currentTrack.id);

  if (isLiked) {
      likeButton.classList.add('active');
      likeButton.dataset.audioId = currentTrack.id;
  } else {
      likeButton.classList.remove('active');
      delete likeButton.dataset.audioId;
  }
}

// Modificar la función loadAudio para actualizar el botón de "me gusta" cuando cambie la canción
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
  
  // Asegurar que el estado del botón de "me gusta" se actualiza correctamente
  updateLikeButtonState();
}

// Modificar playTrack para asegurar la actualización del botón
function playTrack(index) {
  const track = sampleAudios[index];
  loadAudio(track.audio_file, track.title, track.artist, track.image_file, index);
  updateLikeButtonState();
}

// Event listener para actualizar cuando la pista cambia
audioPlayer.addEventListener('ended', function() {
  if (currentTrackIndex + 1 < sampleAudios.length) {
      playTrack(currentTrackIndex + 1);
  } else {
      console.log('Fin de la lista de reproducción');
  }
});