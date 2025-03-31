function fetchAudiosByGenre(event) {
    // Obtener el genre_id de la URL
    const urlParams = new URLSearchParams(window.location.search);
    console.log("URL actual:", window.location.href);
    const genreId = urlParams.get('genre_id');

    if (!genreId) {
        console.error("No se proporcionó un genre_id en la URL.");
        return;
    }

    // Realizar la solicitud fetch al endpoint
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
            // Opcional: Actualizar el título del género en la página
            const genreTitle = document.getElementById("titulo-genero");
            if (data.length > 0 && data[0].genre) {
                genreTitle.textContent = `Género ${data[0].genre.name}`;
            }
        })
        .catch((error) => {
            console.error("Error al obtener los audios:", error);
        });
}

// Ejecutar la función cuando la página esté cargada
document.addEventListener('DOMContentLoaded', fetchAudiosByGenre);

// console.log("Script cargado correctamente");
// fetch("http://127.0.0.1:8000/v1/audios?genre_id=2")
//     .then(response => {
//         if (!response.ok) {
//             throw new Error('Network response was not ok');
//         }
//         return response.json();
//     })
//     .then(data => {
//         console.log("Audios del género Ambiental:", data);
//     })
//     .catch(error => {
//         console.error('Error en la petición:', error);
//     });