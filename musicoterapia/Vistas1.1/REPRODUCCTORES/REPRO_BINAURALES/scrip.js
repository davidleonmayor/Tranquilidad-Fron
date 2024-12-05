 
    // Funcion que alterna la visibilidad de un menu desplegable
    function toggleDropdown(elementId) {
        const dropdown = document.getElementById(elementId);
        dropdown.style.display =
          dropdown.style.display === "block" ? "none" : "block";
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
        alert("Link copied to clipboard!");
      }
  
      // Alterna la visibilidad del menú desplegable anidado
      function toggleNestedDropdown(elementId) {
        const nestedDropdown = document.getElementById(elementId);
        nestedDropdown.style.display =
          nestedDropdown.style.display === "block" ? "none" : "block";
      }
  
      // Cierra todos los menús desplegables si se hace clic fuera de ellos
      window.onclick = function (event) {
        if (
          !event.target.matches(
            ".dropdown-button, .dropdown-content, .horizontal-list img, .horizontal-list button"
          )
        ) {
          closeDropdownsAndLists();
        }
      };
  
      // Cierra todos los menús desplegables y listas horizontales
      function closeDropdownsAndLists() {
        const dropdowns = document.getElementsByClassName("dropdown");
        for (let i = 0; i < dropdowns.length; i++) {
          const openDropdown = dropdowns[i];
          if (openDropdown.style.display === "block") {
            openDropdown.style.display = "none";
          }
        }
        const horizontalList = document.getElementById("horizontal-list");
        if (horizontalList.style.display === "flex") {
          horizontalList.style.display = "none";
        }
      }
      // CORAZON LIKE l
  
  
  
      // Definir las variables del reproductor y el contenedor
      const audioPlayer = new Audio(); // Reproductor de audio
      const audioTitle = document.getElementById('audio-title');
      const albumImage = document.getElementById('album-image');
      const playPauseBtn = document.getElementById('play-pause-btn');
      const prevBtn = document.getElementById('prev-btn'); // Botón de retroceder
      const nextBtn = document.getElementById('next-btn'); // Botón de adelantar
      const currentTimeElement = document.getElementById('current-time'); // Elemento que muestra el tiempo actual
      const totalDurationElement = document.getElementById('total-duration'); // Elemento que muestra la duración total del audio
  
      const progressBar = document.getElementById('progress-bar');
      const likedTracksList = document.getElementById('liked-tracks-list');
      const likeButton = document.querySelector('.me-gusta'); // Corazón en el reproductor
  
      const SKIP_TIME = 10;  // Tiempo en segundos para retroceder o avanzar
  
      let likedAudios = []; // Mantener los audios "me gusta" cargados
      let currentTrackIndex = 0; // Índice de la pista actual en la lista de likedAudios
  
      // Cargar los audios que han sido marcados como "me gusta"
  
  
  
      // Función para cargar y reproducir el audio
      function loadAudio(audioUrl, title, cover, index) {
        if (!audioUrl) {
          console.error('No hay ningún audio actualmente en reproducción.');
          return;
        }
  
        audioPlayer.src = audioUrl;
        audioTitle.textContent = title;
        albumImage.src = cover;
        audioPlayer.load();
        audioPlayer.play();
        playPauseBtn.innerHTML = '❚❚';  // Cambiar a pausa
  
        // Actualizar el índice actual y el estado del botón de me gusta
        currentTrackIndex = index;
        console.log(`Reproduciendo: ${title} en índice: ${currentTrackIndex}`);
  
        // Actualizar el estado del botón "me gusta" en el reproductor
        updateLikeButtonState(audioUrl);
        // Actualizar la duración total del audio cuando se cargue el archivo
        audioPlayer.addEventListener('loadedmetadata', function () {
          totalDurationElement.textContent = formatTime(audioPlayer.duration);
        });
        // Actualizar la barra de progreso mientras se reproduce
        audioPlayer.addEventListener('timeupdate', updateProgressBar);
      }
  
      // Actualizar el estado del botón "Me gusta" basado en el audio actual
  
      function updateLikeButtonState(audioUrl) {
        const likeButton = document.querySelector('.me-gusta'); // Seleccionar el botón del reproductor
        if (!likeButton) return; // Salir si no hay un botón de like
  
        // Verificar si el audio está en la lista de likes cargados desde la API
        const likedAudio = likedAudios.find(audio => audio.audio_file === audioUrl);
  
        if (likedAudio) {
          likeButton.classList.add('active');  // Iluminar el corazón
          likeButton.dataset.likeId = likedAudio.like_id; // Guardar el ID del like en el botón
          likeButton.dataset.audioId = likedAudio.id; // Guardar el ID del audio en el botón
  
        } else {
          likeButton.classList.remove('active');  // Desiluminar el corazón
          delete likeButton.dataset.likeId; // Eliminar el ID del like del botón
          delete likeButton.dataset.audioId; // Eliminar el ID del audio del botón
  
        }
      }
  
      // Función para alternar el estado de "me gusta"
  
  
      // Función para alternar el estado de "Me gusta" en el botón del reproductor
      async function toggleLike(element) {
        const likeButton = element;
        likeButton.classList.toggle('active');
  
        const isLiked = likeButton.classList.contains('active');
        const audioUrl = audioPlayer.src; // Obtener la URL del audio en reproducción
        const audio = likedAudios[currentTrackIndex]; // Obtener el audio actual en la lista de `likedAudios`
        const audioId = audio ? audio.id : likeButton.dataset.audioId; // Usar el ID del audio desde `likedAudios` o `dataset`
        const userId = 5; // ID ficticio por ahora
  
        if (!audioUrl || !audioId || isNaN(audioId)) {
          console.error('No hay ningún audio en reproducción o ID de audio inválido para dar "Me gusta".');
          return;
        }
  
        try {
          if (isLiked) {
            const likeData = {
              likeable_type: 'App\\Models\\Audio',
              likeable_id: audioId, // Usar el ID real del audio, no el índice
              user_id: userId
            };
  
            const response = await fetch('http://tranquilidad.test/v1/likes', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(likeData)
            });
  
            if (!response.ok) throw new Error(`Error en la solicitud POST. Status: ${response.status}`);
            const data = await response.json();
  
            console.log('Like agregado correctamente:', data);
            likeButton.dataset.likeId = data.like.id; // Guardar el ID del like en el botón
            likeButton.dataset.audioId = audioId; // Mantener el ID del audio en el dataset del botón
  
          } else {
            // Eliminar el "Me gusta"
            const likeId = likeButton.dataset.likeId;
  
            if (!likeId) {
              console.error('No se encontró el likeId para eliminar el like.');
              return;
            }
  
            const response = await fetch(`http://tranquilidad.test/v1/likes/${likeId}`, {
              method: 'DELETE',
              headers: { 'Content-Type': 'application/json' }
            });
  
            if (!response.ok) throw new Error(`Error en la solicitud DELETE. Status: ${response.status}`);
  
            console.log('Like eliminado correctamente');
            likeButton.classList.remove('active'); // Desiluminar el corazón
            delete likeButton.dataset.likeId; // Eliminar el ID del like del botón
            removeAudioFromView(audioId); // Eliminar el audio de la vista "Tus me gustas"
            removeAudioFromList(audioId); // Eliminar el audio de `likedAudios`
          }
        } catch (error) {
          console.error('Error gestionando el like:', error);
        }
      }
  
      // Función para eliminar el audio de la vista "Tus me gustas"
      function removeAudioFromView(audioId) {
        const likedTracksList = document.getElementById('liked-tracks-list');
        const trackElements = likedTracksList.querySelectorAll('.track');
  
        trackElements.forEach(track => {
          // Verificar si el atributo 'data-id' coincide con el audio a eliminar
          if (track.getAttribute('data-id') === String(audioId)) {
            likedTracksList.removeChild(track); // Eliminar el contenedor del DOM
            console.log(`Audio eliminado de la vista: ${audioId}`);
          }
        });
      }
  
  
      // Función para eliminar el audio de la lista `likedAudios`
      function removeAudioFromList(audioId) {
        const index = likedAudios.findIndex(audio => audio.id === audioId);
        if (index !== -1) {
          likedAudios.splice(index, 1); // Eliminar el audio de la lista
          console.log(`Audio eliminado de la lista: ${audioId}. Índice: ${index}`);
  
          // Ajustar el índice de la pista actual si es necesario
          if (index <= currentTrackIndex && currentTrackIndex > 0) {
            currentTrackIndex--; // Ajustar el índice si el audio eliminado estaba antes de la pista actual
          }
          console.log(`Nuevo índice de pista actual: ${currentTrackIndex}`);
        }
      }
  
      // Cargar y gestionar la lista de audios "Me gusta"
      function loadLikedAudios() {
        const userId = 5; // Usuario ficticio por ahora
        fetch(`http://tranquilidad.test/v1/likes?user_id=${userId}`)
          .then(response => response.json())
          .then(data => {
            if (data.length === 0) {
              console.log('No hay audios guardados en "Me gusta".');
              return;
            }
  
            likedAudios = []; // Limpiar la lista de likedAudios global
            data.forEach(like => {
              const audioId = like.likeable_id;
              fetch(`http://tranquilidad.test/v1/audios/${audioId}`)
                .then(response => response.json())
                .then(audioData => {
                  if (audioData) {
                    likedAudios.push({
                      ...audioData,
                      like_id: like.id // Agregar el ID del like al objeto de audio
                    });
  
                    // Llamar a la función para agregar el audio a la vista
                    addLikedAudioToView(audioData, likedAudios.length - 1); // Índice basado en la longitud actual de la lista
                  }
                })
                .catch(error => console.error(`Error al cargar el audio con ID ${audioId}:`, error));
            });
          })
          .catch(error => console.error('Error al cargar los likes:', error));
      }
  
      // Ejecutar la carga de audios "Me gusta" al iniciar la vista
      document.addEventListener('DOMContentLoaded', loadLikedAudios);
  
      // Función para agregar un audio a la vista de "Tus me gustas"
      function addLikedAudioToView(audio, index) {
        const likedTracksList = document.getElementById('liked-tracks-list');
        const existingTrack = likedTracksList.querySelector(`[data-id="${audio.id}"]`);
  
        if (!existingTrack) {
          const trackElement = document.createElement('div');
          trackElement.classList.add('track');
          trackElement.setAttribute('data-id', audio.id);
  
          trackElement.innerHTML = `
        <img src="${audio.image_file}" alt="${audio.title}" />
        <div class="track-info">
            <h3>${audio.title}</h3>
            <p>${audio.description}</p>
        </div>
        <button class="play-btn">&#9654;</button>
      `;
  
          // Asociar el botón de reproducción al reproductor
          const playButton = trackElement.querySelector('.play-btn');
          playButton.addEventListener('click', function () {
            // Obtener el índice del audio en `likedAudios` utilizando el ID del audio
            const trackIndex = likedAudios.findIndex(a => a.id === audio.id);
            if (trackIndex !== -1) { // Si se encontró el índice, reproducir
              loadAudio(audio.audio_file, audio.title, audio.image_file, trackIndex);
            } else {
              console.error('No se encontró el índice del audio en likedAudios.');
            }
          });
  
          likedTracksList.appendChild(trackElement);
        }
      }
  
  
  
  
  
      // Controlar el botón de play/pausa
      playPauseBtn.addEventListener('click', function () {
        if (audioPlayer.paused) {
          audioPlayer.play();
          playPauseBtn.innerHTML = '&#10074;&#10074;';  // Cambiar a pausa (❚❚)
        } else {
          audioPlayer.pause();
          playPauseBtn.innerHTML = '&#9654;';  // Cambiar a play (▶️)
        }
      });
  
      // Función para actualizar la barra de progreso y el tiempo actual del reproductor
      function updateProgressBar() {
        if (!isNaN(audioPlayer.duration)) {
          const progressPercentage = (audioPlayer.currentTime / audioPlayer.duration) * 100;
          progressBar.value = progressPercentage;
  
          // Cambiar el color dinámicamente según el progreso
          progressBar.style.background = `linear-gradient(to right, #59009A ${progressPercentage}%, #e1bee7 ${progressPercentage}%)`;
  
          // Actualizar el tiempo actual y la duración total
          currentTimeElement.textContent = formatTime(audioPlayer.currentTime);
          totalDurationElement.textContent = formatTime(audioPlayer.duration);
        }
      }
  
      // Permitir que el usuario cambie el progreso al arrastrar la barra
      progressBar.addEventListener('input', function () {
        const seekTime = (progressBar.value / 100) * audioPlayer.duration;
        audioPlayer.currentTime = seekTime;
      });
  
      // Función para avanzar la pista en 10 segundos
      nextBtn.addEventListener('click', function () {
        audioPlayer.currentTime = Math.min(audioPlayer.currentTime + SKIP_TIME, audioPlayer.duration);
      });
  
      // Función para retroceder la pista en 10 segundos
      prevBtn.addEventListener('click', function () {
        audioPlayer.currentTime = Math.max(audioPlayer.currentTime - SKIP_TIME, 0);
      });
  
      // Función para formatear el tiempo en minutos y segundos
      function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
      }
      // Al terminar la pista, pasar a la siguiente automáticamente
      audioPlayer.addEventListener('ended', function () {
        console.log(`Pista actual (índice): ${currentTrackIndex}, Total de pistas: ${likedAudios.length}`);
  
        // Verificar si hay más pistas en la lista para reproducir
        if (currentTrackIndex + 1 < likedAudios.length) {
          currentTrackIndex++; // Incrementar el índice para la siguiente pista
          const nextTrack = likedAudios[currentTrackIndex];
          console.log(`Reproduciendo la siguiente pista: ${nextTrack.title} (Índice: ${currentTrackIndex})`);
          loadAudio(nextTrack.audio_file, nextTrack.title, nextTrack.image_file, currentTrackIndex);
        } else {
          console.warn('Fin de la lista de reproducción. No hay más pistas para reproducir.');
        }
      });
  
  
      function loadTemplate(templateId, filePath, callback) {
      fetch(filePath)
          .then(response => response.text())
          .then(data => {
              document.getElementById(templateId).innerHTML = data;
              if (callback) callback();
          })
          .catch(error => console.error('Error al cargar la plantilla:', error));
  }
  
  loadTemplate('header-placeholder', '../../../FootNav/header.html', function() {
      const servicios = document.querySelector('.servicios');
      const submenu = document.querySelector('.submenu'); 
      if (servicios) { 
          servicios.addEventListener('click', () => {
              const submenu = document.querySelector('.submenu');
              submenu.classList.toggle('active');
          });
          
      }
  
      document.addEventListener('click', function(event) {
          if (!servicios.contains(event.target) && !submenu.contains(event.target)) {
              submenu.classList.remove('active');
          }
      });
  });
  
  loadTemplate('footer-placeholder', '../../../FootNav/footer.html');
  
  
  document.addEventListener('DOMContentLoaded', function() {
      const menuToggle = document.getElementById('menu-toggle');
      const servicesSubmenu = document.getElementById('services-submenu');
  
      menuToggle.addEventListener('click', function(e) {
          e.stopPropagation();
          servicesSubmenu.classList.toggle('active');
      });
  
      // Cerrar el menú al hacer clic fuera de él
      document.addEventListener('click', function(event) {
          if (!menuToggle.contains(event.target) && !servicesSubmenu.contains(event.target)) {
              servicesSubmenu.classList.remove('active');
          }
      });
  
      // Prevenir que los clics dentro del menú lo cierren
      servicesSubmenu.addEventListener('click', function(e) {
          e.stopPropagation();
      });
  });