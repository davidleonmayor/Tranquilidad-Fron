// Cargar el header
fetch('../Header/Header/header.html')
.then(response => response.text())
.then(data => document.getElementById('header-container').innerHTML = data);

// Cargar el footer
fetch('../Footer/Footer/inicio/inicio.html')
.then(response => response.text())
.then(data => document.getElementById('footer-container').innerHTML = data);

let currentIndex = 0;

function showSlide(index) {
  const slides = document.querySelectorAll(".carousel-item");
  const totalSlides = slides.length;

  slides.forEach((slide, i) => {
    slide.style.transform = `translateX(${(i - index) * 100}%)`;
  });
}

function nextSlide() {
  const slides = document.querySelectorAll(".carousel-item");
  currentIndex = (currentIndex + 1) % slides.length;
  showSlide(currentIndex);
}

function prevSlide() {
  const slides = document.querySelectorAll(".carousel-item");
  currentIndex = (currentIndex - 1 + slides.length) % slides.length;
  showSlide(currentIndex);
}

// Initialize the first slide
document.addEventListener("DOMContentLoaded", () => {
  showSlide(currentIndex);
});


const menuIcon = document.querySelector('.menu-icon');
  const navbar = document.querySelector('header');

  // Añadir un event listener para abrir/cerrar el menú
  menuIcon.addEventListener('click', () => {
    navbar.classList.toggle('menu-open');
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
  
 