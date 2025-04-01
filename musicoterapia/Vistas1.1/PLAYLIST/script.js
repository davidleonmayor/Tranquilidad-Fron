// Get DOM elements
const playlistsContainer = document.getElementById('playlists-container');

// Function to fetch all playlists from the backend
function fetchAllPlaylists() {
    fetch('http://127.0.0.1:8000/v1/playlists', {
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
            console.log('Todas las playlists:', data);
            if (data.length === 0) {
                playlistsContainer.innerHTML = `<p>No se encontraron playlists.</p>`;
                return;
            }
            displayPlaylists(data);
        })
        .catch((error) => {
            console.error("Error al obtener las playlists:", error);
            playlistsContainer.innerHTML = `<p>Error al cargar las playlists: ${error.message}. Asegúrate de que el servidor esté corriendo en http://127.0.0.1:8000.</p>`;
        });
}

// Function to display playlists
function displayPlaylists(playlists) {
    playlistsContainer.innerHTML = ''; // Clear the container
    playlists.forEach((playlist) => {
        const playlistElement = document.createElement('div');
        playlistElement.classList.add('folder');
        playlistElement.innerHTML = `
      <a href="/musicoterapia/Vistas1.1/REPRODUCCTORES/REPRO_PISTAS/Reproductor_pistas.html?pistasId=${playlist.id}">
        <img src="${playlist.image || '/musicoterapia/Vistas1.1/imgplaylist/pl.png'}" alt="${playlist.name || 'Playlist'}" onerror="this.src='/musicoterapia/Vistas1.1/img/placeholder.png';" />
      </a>
      <p>${playlist.name || `Playlist ${playlist.id}`}</p>
    `;
        playlistsContainer.appendChild(playlistElement);
    });
}

// Load all playlists when the page loads
document.addEventListener('DOMContentLoaded', fetchAllPlaylists);
