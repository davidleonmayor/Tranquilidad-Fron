  // Cargar el header
  fetch('/rutinas-de-ejercicios/includes/Header/header.html')
  .then(response => response.text())
  .then(data => document.getElementById('header-container').innerHTML = data);

// Cargar el footer
fetch('/rutinas-de-ejercicios/includes/inicio/inicio.html')
  .then(response => response.text())
  .then(data => document.getElementById('footer-container').innerHTML = data);
  
  
  
  // Extraer el ID del parámetro en la URL
  const urlParams = new URLSearchParams(window.location.search);
  const recommendationId = parseInt(urlParams.get('id'));

  // Mostrar los datos del tip correspondiente
  const recommendation = tips[recommendationId];
  document.getElementById('recommendation-title').textContent = recommendation.title;
  document.getElementById('recommendation-img').src = recommendation.img;
  document.getElementById('recommendation-img').alt = recommendation.title;
  document.getElementById('recommendation-text').textContent = recommendation.recommendation;

  const carousel = document.querySelector('.video-carousel');

// Agrega un evento para manejar el scroll horizontal con el mouse
carousel.addEventListener('wheel', (event) => {
event.preventDefault(); // Previene el scroll vertical
carousel.scrollLeft += event.deltaY; // Ajusta el desplazamiento horizontal
});



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
