// Función para obtener y cargar los audios binaurales
function fetchBinauralAudios() {
    const tracksContainer = document.getElementById('tracks-container');

    fetch('http://127.0.0.1:8000/v1/audios?es_binaural=true', {
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
            console.log('Audios binaurales:', data);
            if (data.length === 0) {
                tracksContainer.innerHTML = `<p>No se encontraron audios binaurales.</p>`;
                return;
            }

            // Renderizar las pistas dinámicamente
            tracksContainer.innerHTML = ''; // Limpiar el contenedor
            data.forEach((audio, index) => {
                const trackElement = document.createElement('div');
                trackElement.classList.add('track');
                trackElement.innerHTML = `
          <img src="${audio.image_file}" alt="${audio.title}" onerror="this.onerror=null;this.src='/musicoterapia/Vistas1.1/img/placeholder.png';" />
          <div>
            <span>${audio.title}</span><br />
            <span>${formatDuration(audio.duration)}</span>
          </div>
          <div>FRECUENCIA</div>
          <div>${audio.frecuencia ? audio.frecuencia + ' Hz' : 'GAMMA'}</div>
          <a href="/musicoterapia/Vistas1.1/REPRODUCCTORES/REPRO_BINAURALES/Reproducctor2.html?binauralId=${audio.id}" class="play-button" aria-label="Reproducir ${audio.title}"></a>
        `;
                tracksContainer.appendChild(trackElement);
            });
        })
        .catch((error) => {
            console.error("Error al obtener los audios binaurales:", error);
            tracksContainer.innerHTML = `<p>Error al cargar los audios: ${error.message}. Asegúrate de que el servidor esté corriendo en http://127.0.0.1:8000.</p>`;
        });
}

// Función para formatear la duración (de segundos a minutos:segundos)
function formatDuration(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
}

// Ejecutar la función cuando la página esté cargada
document.addEventListener('DOMContentLoaded', fetchBinauralAudios);