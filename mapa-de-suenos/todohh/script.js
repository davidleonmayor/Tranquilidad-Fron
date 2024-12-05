function toggleProfileMenu() {
    const menu = document.getElementById("profile-menu");
    menu.style.display = menu.style.display === "block" ? "none" : "block";
  }
  
  function toggleModules() {
    const overlay = document.getElementById("modules-overlay");
    overlay.style.display = overlay.style.display === "block" ? "none" : "block";
  }
  
  document.addEventListener("click", function (e) {
    if (!e.target.closest(".profile-container")) {
      document.getElementById("profile-menu").style.display = "none";
    }
    if (!e.target.closest(".modules-item")) {
      document.getElementById("modules-overlay").style.display = "none";
    }
  });
  function toggleHamburgerMenu() {
    const hamburgerMenu = document.getElementById('hamburger-menu');
    hamburgerMenu.classList.toggle('active'); // Alterna la clase 'active' para mostrar/ocultar
}
function toggleModulues() {
    const modulesContent = document.getElementById("modules-content");
    modulesContent.style.display = modulesContent.style.display === "block" ? "none" : "block";
}

 // Función para cargar el contenido del archivo HTML
 function loadHTML(elementId, fileName) {
  fetch(fileName)
    .then(response => response.text())
    .then(data => {
      document.getElementById(elementId).innerHTML = data;
    })
    .catch(error => {
      console.error("Error al cargar el archivo:", error);
    });
}
let lastScrollY = window.scrollY; // Posición inicial del scroll

// Evento de scroll
window.addEventListener('scroll', function() {
    const header = document.querySelector('header'); // Selecciona el header
    const currentScrollY = window.scrollY; // Obtén la posición actual del scroll

    // Si el scroll es hacia abajo y no está ya oculto, agrega la clase 'hidden'
    if (currentScrollY > 0 && !header.classList.contains('hidden')) {
        header.classList.add('hidden');
    } 
    // Si el scroll es hacia arriba, elimina la clase 'hidden'
    else if (currentScrollY === 0 && header.classList.contains('hidden')) {
        header.classList.remove('hidden');
    }

    // Actualiza la última posición del scroll
    lastScrollY = currentScrollY;
});

// Cargar el header y footer
loadHTML('header', '../../../mapa-de-suenos/todohh/header.html');
loadHTML('footer', '../../../mapa-de-suenos/todohh/inicio/footer.html');