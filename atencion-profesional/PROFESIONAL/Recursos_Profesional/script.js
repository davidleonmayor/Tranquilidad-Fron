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

// Cargar el header
fetch('../Header/Header/header.html')
.then(response => response.text())
.then(data => document.getElementById('header-container').innerHTML = data);

// Cargar el footer
fetch('../Footer/Footer/inicio/inicio.html')
.then(response => response.text())
.then(data => document.getElementById('footer-container').innerHTML = data);