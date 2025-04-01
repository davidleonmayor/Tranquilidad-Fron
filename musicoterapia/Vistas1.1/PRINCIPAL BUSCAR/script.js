// Datos del carrusel
const images = [
  { src: "../images/GENERO CARRUSEL 1.png", link: "/musicoterapia/Vistas1.1/PRINCIPAL_GENEROS/principal_generos.html", alt: "Carrusel de géneros" },
  { src: "../images/ALBUM CARRUSEL.png", link: "/musicoterapia/Vistas1.1/PRINCIPAL_ALBUM/principal_album.html", alt: "Carrusel de álbumes" },
  { src: "../images/PODCASTS CARRUSEL.png", link: "/musicoterapia/Vistas1.1/PRINCIPAL_PODCAST/principal_podcast.html", alt: "Carrusel de podcasts" },
  { src: "../images/BINAURAL CARRUSEL 2.png", link: "/musicoterapia/Vistas1.1/SONIDOS_BINAURALES/binaurales.html", alt: "Carrusel de sonidos binaurales" },
];

let index = 0;
const imgElement = document.getElementById("carousel-image");

function changeImage() {
  index = (index + 1) % images.length;
  imgElement.style.opacity = 0;
  setTimeout(() => {
    imgElement.src = images[index].src;
    imgElement.alt = images[index].alt;
    imgElement.style.opacity = 1;
  }, 500);
}

// Cambia cada 2 segundos
setInterval(changeImage, 2000);

// Redirige al hacer clic en la imagen
imgElement.addEventListener("click", () => {
  window.location.href = images[index].link;
});

// Get DOM elements
const searchInput = document.querySelector('.search-bar input');
const tracksContainer = document.getElementById('tracks-container');

// Función para formatear la duración (de segundos a minutos:segundos)
function formatDuration(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
}

// Función para obtener todos los audios desde el backend
function fetchAllAudios() {
  fetch('http://127.0.0.1:8000/v1/audios', {
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
      console.log('Todos los audios:', data);
      if (data.length === 0) {
        tracksContainer.innerHTML = `<p>No se encontraron audios.</p>`;
        return;
      }
      displayResults(data);
    })
    .catch((error) => {
      console.error("Error al obtener los audios:", error);
      tracksContainer.innerHTML = `<p>Error al cargar los audios: ${error.message}. Asegúrate de que el servidor esté corriendo en http://127.0.0.1:8000.</p>`;
    });
}

// Función para buscar audios por nombre
function searchAudios(searchTerm) {
  fetch(`http://127.0.0.1:8000/v1/audios?title=${encodeURIComponent(searchTerm)}`, {
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
      console.log('Resultados de búsqueda:', data);
      displayResults(data);
    })
    .catch((error) => {
      console.error("Error al buscar audios:", error);
      tracksContainer.innerHTML = `<p>Error al buscar audios: ${error.message}.</p>`;
    });
}

// Función para mostrar los resultados
function displayResults(audios) {
  if (!audios || audios.length === 0) {
    tracksContainer.innerHTML = '<div class="no-results">No se encontraron resultados</div>';
    return;
  }

  tracksContainer.innerHTML = ''; // Limpiar el contenedor
  audios.forEach((audio) => {
    const trackElement = document.createElement('div');
    trackElement.classList.add('track');
    trackElement.innerHTML = `
      <img src="${audio.image_file || '/musicoterapia/Vistas1.1/img/placeholder.png'}" alt="${audio.title}" onerror="this.src='/musicoterapia/Vistas1.1/img/placeholder.png';" />
      <div>
        <span>${audio.title}</span><br />
        <span>${formatDuration(audio.duration)}</span>
      </div>
      <div>FRECUENCIA</div>
      <div>${audio.frecuencia ? audio.frecuencia + ' Hz' : 'GAMMA'}</div>
      <a href="/musicoterapia/Vistas1.1/REPRODUCCTORES/REPRO_BUSQUEDA/repro_busqueda.html?audioId=${audio.id}" class="play-button" aria-label="Reproducir ${audio.title}"></a>
    `;
    tracksContainer.appendChild(trackElement);
  });
}

// Debounce function to limit API calls
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Event listener para la búsqueda con debounce
const debouncedSearch = debounce((searchTerm) => {
  if (searchTerm.length >= 2) {
    searchAudios(searchTerm);
  } else if (searchTerm.length === 0) {
    fetchAllAudios();
  }
}, 300);

searchInput.addEventListener('input', (e) => {
  const searchTerm = e.target.value.trim();
  debouncedSearch(searchTerm);
});

// Cargar todos los audios al inicio
document.addEventListener('DOMContentLoaded', fetchAllAudios);

// // Datos del carrusel (unchanged)
// const images = [
//   { src: "../images/GENERO CARRUSEL 1.png", link: "/musicoterapia/Vistas1.1/PRINCIPAL_GENEROS/principal_generos.html", alt: "Carrusel de géneros" },
//   { src: "../images/ALBUM CARRUSEL.png", link: "/musicoterapia/Vistas1.1/PRINCIPAL_ALBUM/principal_album.html", alt: "Carrusel de álbumes" },
//   { src: "../images/PODCASTS CARRUSEL.png", link: "/musicoterapia/Vistas1.1/PRINCIPAL_PODCAST/principal_podcast.html", alt: "Carrusel de podcasts" },
//   { src: "../images/BINAURAL CARRUSEL 2.png", link: "/musicoterapia/Vistas1.1/SONIDOS_BINAURALES/binaurales.html", alt: "Carrusel de sonidos binaurales" },
// ];

// let index = 0;
// const imgElement = document.getElementById("carousel-image");

// function changeImage() {
//   index = (index + 1) % images.length;
//   imgElement.style.opacity = 0;
//   setTimeout(() => {
//     imgElement.src = images[index].src;
//     imgElement.alt = images[index].alt;
//     imgElement.style.opacity = 1;
//   }, 500);
// }

// setInterval(changeImage, 2000);

// imgElement.addEventListener("click", () => {
//   window.location.href = images[index].link;
// });

// // ... (carousel code remains unchanged)

// // Get DOM elements
// const searchInput = document.querySelector('.search-bar input');
// const tracksContainer = document.getElementById('tracks-container');

// // Función para formatear la duración
// function formatDuration(seconds) {
//   const minutes = Math.floor(seconds / 60);
//   const remainingSeconds = Math.floor(seconds % 60);
//   return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
// }

// // Función para obtener todos los audios desde el backend
// function fetchAllAudios() {
//   fetch('http://127.0.0.1:8000/v1/audios', {
//     method: 'GET',
//     headers: {
//       "Content-Type": "application/json",
//     },
//   })
//     .then(response => {
//       if (!response.ok) {
//         return response.json().then(err => {
//           throw new Error(err.message || "Error en la solicitud: " + response.statusText);
//         });
//       }
//       return response.json();
//     })
//     .then(data => {
//       console.log('Todos los audios:', data);
//       if (data.length === 0) {
//         tracksContainer.innerHTML = `<p>No se encontraron audios.</p>`;
//         return;
//       }
//       displayResults(data);
//     })
//     .catch(error => {
//       console.error("Error al obtener los audios:", error);
//       tracksContainer.innerHTML = `<p>Error al cargar los audios: ${error.message}. Asegúrate de que el servidor esté corriendo en http://127.0.0.1:8000.</p>`;
//     });
// }

// // Función para buscar audios por nombre
// function searchAudios(searchTerm) {
//   fetch(`http://127.0.0.1:8000/v1/audios?title=${encodeURIComponent(searchTerm)}`, {
//     method: "GET",
//     headers: {
//       "Content-Type": "application/json",
//     },
//   })
//     .then(response => {
//       if (!response.ok) {
//         return response.json().then(err => {
//           throw new Error(err.message || "Error en la solicitud: " + response.statusText);
//         });
//       }
//       return response.json();
//     })
//     .then(data => {
//       console.log('Resultados de búsqueda:', data);
//       displayResults(data);
//     })
//     .catch(error => {
//       console.error("Error al buscar audios:", error);
//       tracksContainer.innerHTML = `<p>Error al buscar audios: ${error.message}.</p>`;
//     });
// }

// // ... (displayResults and debounce functions remain the same)

// // Event listener para la búsqueda con debounce
// const debouncedSearch = debounce((searchTerm) => {
//   if (searchTerm.length >= 2) {
//     searchAudios(searchTerm);
//   } else if (searchTerm.length === 0) {
//     fetchAllAudios();
//   }
// }, 300);

// searchInput.addEventListener('input', (e) => {
//   const searchTerm = e.target.value.trim();
//   debouncedSearch(searchTerm);
// });

// document.addEventListener('DOMContentLoaded', fetchAllAudios);