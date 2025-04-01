const authToken = localStorage.getItem('authToken');
const playlistsContainer = document.getElementById('playlists-container');

function fetchAllPlaylists() {
    // Check if token exists
    if (!authToken) {
        playlistsContainer.innerHTML = `<p>Por favor, inicia sesión para ver tus playlists. <a href="/inicio-de-sesion/Modulo-iniciar-sesion/login/login.html">Iniciar sesión</a></p>`;
        return;
    }

    fetch('http://127.0.0.1:8000/v1/playlists', {
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

            // Check if data.data exists (based on new response structure)
            const playlists = data.data || [];

            if (playlists.length === 0) {
                playlistsContainer.innerHTML = `<p>${data.message || 'No tienes playlists aún.'}</p>`;
                return;
            }

            displayPlaylists(playlists);
        })
        .catch((error) => {
            console.error("Error al obtener las playlists:", error);
            playlistsContainer.innerHTML = `<p>Error al cargar las playlists: ${error.message}. Asegúrate de que el servidor esté corriendo y estés autenticado.</p>`;
        });
}

function displayPlaylists(playlists) {
    playlistsContainer.innerHTML = '';
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

document.addEventListener('DOMContentLoaded', fetchAllPlaylists);