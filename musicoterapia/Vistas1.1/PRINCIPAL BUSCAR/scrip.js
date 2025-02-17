const images = [
  { src: "../images/GENERO CARRUSEL 1.png", link: "/musicoterapia/Vistas1.1/PRINCIPAL_GENEROS/principal_generos.html" },
  { src:  "../images/ALBUM CARRUSEL.png", link: "/musicoterapia/Vistas1.1/PRINCIPAL_ALBUM/principal_album.html" },
  { src: "../images/PODCASTS CARRUSEL.png", link: "/musicoterapia/Vistas1.1/PRINCIPAL_PODCAST/principal_podcast.html"},
  { src: "../images/BINAURAL CARRUSEL 2.png", link: "/musicoterapia/Vistas1.1/SONIDOS_BINAURALES/binaurales.html" },
];

let index = 0;
const imgElement = document.getElementById("carousel-image");

function changeImage() {
  index = (index + 1) % images.length;
  imgElement.style.opacity = 0;
  setTimeout(() => {
    imgElement.src = images[index].src;
    imgElement.style.opacity = 1;
  }, 500);
}

// Cambia cada 2 segundos
setInterval(changeImage, 2000);

// Redirige al hacer click en la imagen
imgElement.addEventListener("click", () => {
  window.location.href = images[index].link;
});
const searchableContent = {
  tracks: [
    { name: 'Pista 1', type: 'track', frequency: 'GAMMA', category: 'binaural', time: '3:45', image: '/musicoterapia/Vistas1.1/img/Pista1.jpg' },
    { name: 'Pista 2', type: 'track', frequency: 'GAMMA', category: 'binaural', time: '4:20', image: '/musicoterapia/Vistas1.1/img/pista2.jpg' }
  ],
  genres: [
    { id: '1', name: 'Clásica', type: 'genre', description: 'Música clásica' },
    { id: '2', name: 'Instrumental', type: 'genre', description: 'Música instrumental' },
    { id: '3', name: 'Ambiental', type: 'genre', description: 'Música ambiental' },
    { id: '4', name: 'Electrónica', type: 'genre', description: 'Música electrónica' }
  ],
  albums: [
    { id: '1', name: 'Dormir', type: 'album', artist: 'Various Artists' },
    { id: '2', name: 'Concentrarse', type: 'album', artist: 'Focus Music' },
    { id: '3', name: 'Relajarse', type: 'album', artist: 'Relaxation' },
    { id: '4', name: 'Gamer', type: 'album', artist: 'Game Music' }
  ],
  podcasts: [
    { id: '1', name: 'Afirmaciones', type: 'podcast', author: 'Meditation Guide' },
    { id: '2', name: 'Autoestima', type: 'podcast', author: 'Self Help' },
    { id: '3', name: 'Motivación', type: 'podcast', author: 'Motivation Expert' }
  ]
};

// Get DOM elements
const searchInput = document.querySelector('.search-bar input');
const tracksContainer = document.querySelector('.tracks-container');

// Function to get the correct reproductor URL based on content type and ID
function getReproductorURL(item) {
  switch (item.type) {
    case 'track':
      return '/musicoterapia/Vistas1.1/REPRODUCCTORES/REPRO_BINAURALES/Reproducctor2.html';
    case 'genre':
      return `/musicoterapia/Vistas1.1/REPRODUCCTORES/GENERO_ELEGIDO/genero_elegido.html?genreId=${item.id}`;
    case 'album':
      return `/musicoterapia/Vistas1.1/REPRODUCCTORES/ALBUM_ELEGIDO/album_elegido.html?albumId=${item.id}`;
    case 'podcast':
      return `/musicoterapia/Vistas1.1/REPRODUCCTORES/REPRO_PODCAST/Reproductorpodcast.html?podcastId=${item.id}`;
    default:
      return '#';
  }
}

// Create HTML for a track
function createTrackHTML(item) {
  return `
    <div class="track">
      <img src="${item.image}" alt="${item.name}" />
      <div>
        <span>${item.name}</span><br />
        <span>${item.time}</span>
      </div>
      <div>${item.frequency || ''}</div>
      <div>${item.category || ''}</div>
      <a href="${getReproductorURL(item)}" class="play-button"></a>
    </div>
  `;
}

// Create HTML for other content types
function createContentHTML(item) {
  let secondaryInfo = '';
  let typeLabel = '';

  switch (item.type) {
    case 'genre':
      secondaryInfo = item.description;
      typeLabel = 'Género';
      break;
    case 'album':
      secondaryInfo = item.artist;
      typeLabel = 'Álbum';
      break;
    case 'podcast':
      secondaryInfo = item.author;
      typeLabel = 'Podcast';
      break;
  }

  return `
    <div class="track">
      <div>
        <span>${item.name}</span><br />
        <span>${typeLabel}</span>
      </div>
      <div>${secondaryInfo}</div>
      <a href="${getReproductorURL(item)}" class="play-button"></a>
    </div>
  `;
}

// Search function
function performSearch(searchTerm) {
  searchTerm = searchTerm.toLowerCase();
  let results = [];

  // Search through all content types
  for (const [category, items] of Object.entries(searchableContent)) {
    const matchingItems = items.filter(item => 
      item.name.toLowerCase().includes(searchTerm) ||
      (item.description && item.description.toLowerCase().includes(searchTerm)) ||
      (item.artist && item.artist.toLowerCase().includes(searchTerm)) ||
      (item.author && item.author.toLowerCase().includes(searchTerm))
    );
    results = results.concat(matchingItems);
  }

  // Display results
  displayResults(results);
}

// Display results function
function displayResults(results) {
  if (results.length === 0) {
    tracksContainer.innerHTML = '<div class="no-results">No se encontraron resultados</div>';
    return;
  }

  const resultsHTML = results.map(item => 
    item.type === 'track' ? createTrackHTML(item) : createContentHTML(item)
  ).join('');

  tracksContainer.innerHTML = resultsHTML;
}

// Add event listener for search input
searchInput.addEventListener('input', (e) => {
  const searchTerm = e.target.value.trim();
  if (searchTerm.length >= 2) {
    performSearch(searchTerm);
  } else if (searchTerm.length === 0) {
    // Reset to show all tracks
    displayResults(searchableContent.tracks);
  }
});

// Initialize with all tracks
document.addEventListener('DOMContentLoaded', () => {
  displayResults(searchableContent.tracks);
});
