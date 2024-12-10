// Cargar el header
fetch('../Header/header.html')
.then(response => response.text())
.then(data => document.getElementById('header-container').innerHTML = data);

// Cargar el footer
fetch('../Footer/inicio/inicio.html')
.then(response => response.text())
.then(data => document.getElementById('footer-container').innerHTML = data);

let currentIndex = 0;

function showSlide(index) {
  const slides = document.querySelectorAll(".carousel-item");
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

// Cambiar automáticamente cada 3 segundos
setInterval(nextSlide, 3000);

// Mostrar la primera diapositiva al cargar la página
document.addEventListener("DOMContentLoaded", () => {
  showSlide(currentIndex);
});

// Initialize the first slide
document.addEventListener("DOMContentLoaded", () => {
  showSlide(currentIndex);
});


const menuIcon = document.querySelector('.menu-icon');
  const navbar = document.querySelector('header');

  


  
 