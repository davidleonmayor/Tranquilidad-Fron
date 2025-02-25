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



    // configurar audios 
    let currentTrackId = null;  // Variable global para almacenar el ID de la pista actual


    const audioPlayer = new Audio(); // Inicializar el reproductor de audio
    let currentTrackIndex = 0; // Índice actual de la pista
    let audios = []; // Lista de pistas , esencial para reproducir siguiente audio
    let userLikes = {};  // Objeto para almacenar los likes del usuario

    // Función para obtener el parámetro 'genreId' de la URL
    function getQueryParam(param) {
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get(param);
    }


    document.addEventListener('DOMContentLoaded', function () {
      const genreId = getQueryParam('genreId');  // Obtener el ID del género de la URL
      const apiUrl = `http://tranquilidad.test/v1/genres/${genreId}?included=audios.album`;

      // Variables para el reproductor
      const playPauseBtn = document.getElementById('play-pause-btn');
      const prevBtn = document.getElementById('prev-btn');
      const nextBtn = document.getElementById('next-btn');
      const progressBar = document.getElementById('progress-bar');
      const albumImage = document.getElementById('album-image');
      const audioTitle = document.getElementById('audio-title');
      const audioArtist = document.getElementById('audio-artist');
      const currentTimeElement = document.getElementById('current-time');
      const totalDurationElement = document.getElementById('total-duration');
      const tracksList = document.getElementById('tracks-list');
      const likeButton = document.querySelector('.me-gusta'); // El botón de like fijo en el reproductor

      const SKIP_TIME = 10;  // Tiempo en segundos para retroceder o adelantar


      // Cargar los likes del usuario al iniciar
      fetch('http://tranquilidad.test/v1/likes')
        .then(response => response.json())
        .then(data => {
          // Guardar los likes en un objeto
          data.forEach(like => {
            userLikes[like.likeable_id] = like.id;
          });
        })
        .catch(error => console.error('Error al cargar los likes:', error));


      // Función para cargar y reproducir audios
      function loadAudio(audioUrl, title, description, image, index) {
        audioPlayer.src = audioUrl; // Establece el audio en el reproductor
        audioTitle.textContent = title; // Cambia el título
        audioArtist.textContent = description;
        albumImage.src = image; // Cambia la portada del álbum
        audioPlayer.load(); // Carga el nuevo audio
        audioPlayer.play(); // Inicia la reproducción
        playPauseBtn.textContent = '❚❚';  // Cambiar a pausa
        currentTrackIndex = index; // Actualizar el índice actual de la pista
        currentTrackId = audios[index].id;  // Guarda el ID del audio actual para los "likes"


        // Verificar si el audio tiene "like" y activar el botón
        if (userLikes[audios[index].id]) {
          likeButton.classList.add('active');
          likeButton.dataset.likeId = userLikes[audios[index].id];  // Guardar el ID del "like"
        } else {
          likeButton.classList.remove('active');
          delete likeButton.dataset.likeId;  // Limpiar el ID del "like"
        }
      }

      // Cargar los audios del género seleccionado
      fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
          const tituloGenero = document.getElementById('titulo-genero');
          tituloGenero.textContent = `Género ${data.name}`;  // Cambiar el título al nombre del género

          tracksList.innerHTML = '';  // Limpiamos la lista de audios
          audios = data.audios; // Guardar los audios para uso futuro

          if (audios && audios.length > 0) {
            audios.forEach((audio, index) => {
              const trackElement = document.createElement('div');
              trackElement.classList.add('track');

              trackElement.innerHTML = `
              <img src="${audio.image_file}" alt="${audio.title}" />
              <div class="track-info">
                <h3>${audio.title}</h3>
                <div class="track-details">
                  <p>Álbum: ${audio.album ? audio.album.title : 'Sin álbum'}</p>
                  <p>Artista: ${audio.description ? audio.description : 'Sin descripción'}</p>
                </div>  
              </div>
              <button>&#9654;</button>
            `;

              // Asociar el botón de reproducción al reproductor
              const playButton = trackElement.querySelector('button');
              playButton.addEventListener('click', function () {
                loadAudio(audio.audio_file, audio.title, audio.description, audio.image_file, index);
              });

              tracksList.appendChild(trackElement);
            });
          } else {
            tracksList.innerHTML = '<p>No hay audios disponibles para este género.</p>';
          }
        })
        .catch(error => console.error('Error al cargar los audios:', error));



      // Agregar una bandera para evitar múltiples solicitudes simultáneas



      function toggleLike() {
        const isLiked = likeButton.classList.contains('active');  // Verificar si ya está "likeado"

        const likeData = {
          likeable_type: 'App\\Models\\Audio',
          likeable_id: currentTrackId,  // ID del audio actual
          user_id: 5  // Usuario ficticio, cambiar por el ID real del usuario si es necesario
        };

        if (!currentTrackId) {
          console.error("currentTrackId no está definido. No se puede realizar la solicitud.");
          return;
        }

        // Deshabilitar el botón antes de iniciar la solicitud
        likeButton.disabled = true;

        // Si el audio ya tiene un "like", gestionar el dislike
        if (isLiked) {
          handleDislike();  // Llama a handleDislike para eliminar el like
        } else {
          // Si no tiene like, hacer la solicitud POST para agregar el like
          fetch('http://tranquilidad.test/v1/likes', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(likeData)
          })

            .then(response => response.json())
            .then(data => {
              console.log('Like agregado correctamente:', data);
              likeButton.classList.add('active');  // Iluminar el corazón
              likeButton.dataset.likeId = data.like.id;  // Guardar el ID del like en el botón

              // Llamar a una función para actualizar la vista "Tus me gustas"
              updateLikedAudiosView();
            })
            .catch(error => console.error('Error gestionando el like:', error))
            .finally(() => likeButton.disabled = false);
        }
      }


      function handleDislike() {
        return fetch(`http://tranquilidad.test/v1/likes/${likeButton.dataset.likeId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          }
        })
          .then(response => response.json())
          .then(data => {
            console.log('Like eliminado correctamente:', data);
            likeButton.classList.remove('active');
            delete likeButton.dataset.likeId;

            // Llamar a una función para actualizar la vista "Tus me gustas"
            updateLikedAudiosView();
          })
          .catch(error => console.error('Error gestionando el dislike:', error))
          .finally(() => likeButton.disabled = false);
      }


      // Asignar el evento click al botón de like

      //  debounce: asegura que si haces clics múltiples muy rápidos, 
      // solo se ejecute la última acción después del tiempo de espera (delay), 
      // que en este caso es de 500 milisegundos (medio segundo).
      // toggleLike: será invocado después de este retardo, evitando la sobrecarga 
      // del servidor o problemas de duplicación de likes/dislikes cuando el usuario 
      // interactúa demasiado rápido.

      let debounceTimeout;
      function debounce(func, delay) {
        return function (...args) {
          clearTimeout(debounceTimeout);
          debounceTimeout = setTimeout(() => func.apply(this, args), delay);
        };
      }

      // Función toggleLike con debounce
      likeButton.addEventListener('click', debounce(toggleLike, 500));
      //likeButton.addEventListener('click', toggleLike);




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

      // Al terminar una canción, pasar a la siguiente automáticamente
      audioPlayer.addEventListener('ended', function () {
        currentTrackIndex++;
        if (currentTrackIndex < audios.length) {
          const nextTrack = audios[currentTrackIndex];
          loadAudio(nextTrack.audio_file, nextTrack.title, nextTrack.description, nextTrack.image_file, currentTrackIndex);
        } else {
          currentTrackIndex = 0;  // Reiniciar al principio si es necesario
        }
      });

      // Actualizar la barra de progreso
      audioPlayer.addEventListener('timeupdate', function () {
        const progressPercentage = (audioPlayer.currentTime / audioPlayer.duration) * 100;
        progressBar.value = progressPercentage;
        currentTimeElement.textContent = formatTime(audioPlayer.currentTime);
        totalDurationElement.textContent = formatTime(audioPlayer.duration);
      });

      // Asegurar que el audio esté completamente cargado antes de usar su duración
      audioPlayer.addEventListener('loadedmetadata', function () {
        totalDurationElement.textContent = formatTime(audioPlayer.duration);
      });

      // Actualizar el progreso mientras se reproduce
      audioPlayer.addEventListener('timeupdate', function () {
        if (!isNaN(audioPlayer.duration)) {
          const progressPercentage = (audioPlayer.currentTime / audioPlayer.duration) * 100;
          progressBar.value = progressPercentage;

          // Cambiar el color dinámicamente
          progressBar.style.background = `linear-gradient(to right, #59009A ${progressPercentage}%, #e1bee7 ${progressPercentage}%)`;

          // Actualizar el tiempo actual
          currentTimeElement.textContent = formatTime(audioPlayer.currentTime);
        }

      });

      // Permitir que el usuario cambie el progreso al arrastrar la barra
      progressBar.addEventListener('input', function () {
        const seekTime = (progressBar.value / 100) * audioPlayer.duration;
        audioPlayer.currentTime = seekTime;
      });

      // Adelantar o retroceder dentro de la misma pista
      nextBtn.addEventListener('click', function () {
        audioPlayer.currentTime = Math.min(audioPlayer.currentTime + SKIP_TIME, audioPlayer.duration);
      });

      prevBtn.addEventListener('click', function () {
        audioPlayer.currentTime = Math.max(audioPlayer.currentTime - SKIP_TIME, 0);
      });

      // Función para formatear el tiempo en minutos:segundos
      function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
      }
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