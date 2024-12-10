  // Cargar el header
  fetch('../Header/Header/header.html')
  .then(response => response.text())
  .then(data => document.getElementById('header-container').innerHTML = data);

// Cargar el footer
fetch('../Footer/Footer/inicio/inicio.html')
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



  