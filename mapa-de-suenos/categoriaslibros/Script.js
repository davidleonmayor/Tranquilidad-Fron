document.querySelectorAll('section a img').forEach(img => {
    img.addEventListener('click', () => {
      img.style.animation = 'clickedEffect 0.5s ease-out'; // Aplica la animación
  
      // Elimina la animación después de completarla para que se pueda aplicar de nuevo si se hace clic otra vez
      setTimeout(() => {
        img.style.animation = '';
      }, 500); // Duración de la animación en milisegundos
    });
  });