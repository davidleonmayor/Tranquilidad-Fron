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
function toggleLike(element) {
  element.classList.toggle("active");
}

// LLAMADA DEL API

document.addEventListener('DOMContentLoaded', function () {
    const apiUrl = 'http://tranquilidad.test/v1/audios';

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            if (data && data.length > 0) {
                const audioData = data[0];

                // Actualizamos el reproductor con el audio y la imagen
                document.getElementById('audio-source').src = audioData.audio_file;
                document.getElementById('album-cover').src = audioData.image_file;
                document.getElementById('audio-title').textContent = audioData.title;

                // Asegúrate de recargar el reproductor después de actualizar la fuente
                const audioPlayer = document.getElementById('audio-player');
                audioPlayer.load(); // Esto asegura que el nuevo archivo se cargue correctamente
            }
        })
        .catch(error => console.error('Error al obtener los audios:', error));
});