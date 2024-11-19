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

// Cargar el header y footer
loadHTML('header', '../Header/header.html');
loadHTML('footer', '../Footer/inicio/inicio.html');