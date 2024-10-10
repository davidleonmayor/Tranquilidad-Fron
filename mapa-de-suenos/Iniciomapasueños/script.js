document.querySelectorAll('section').forEach(function(section) {
    section.addEventListener('click', function() {
      // Agrega la clase de animación al hacer clic
      section.classList.add('clicked-animation');
  
      // Remueve la clase de animación después de que termine
      setTimeout(function() {
        section.classList.remove('clicked-animation');
      }, 500); // Duración de la animación en milisegundos
    });
  });
  