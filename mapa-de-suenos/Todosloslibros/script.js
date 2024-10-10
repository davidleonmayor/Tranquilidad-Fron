document.querySelectorAll('section').forEach((section) => {
    section.addEventListener('click', () => {
      // Añadir clase de animación
      section.classList.add('animate-click');
      
      // Remover la clase después de que la animación termine
      setTimeout(() => {
        section.classList.remove('animate-click');
      }, 500); // 500ms es la duración de la animación
    });
  });
// Obtenemos el identificador único para la página o vista usando el pathname del archivo HTML
const pageId = window.location.pathname; // Usamos la ruta del archivo HTML para identificar la página

// Selecciona todos los corazones
const hearts = document.querySelectorAll('.heart');

// Cargar el estado guardado al cargar la página
hearts.forEach((heart, index) => {
  // Usamos pageId + index para que cada corazón sea único para la página
  const savedState = localStorage.getItem(`${pageId}-heart${index}`); // Cambia la clave para ser única por página
  if (savedState === 'purple') {
    heart.classList.add('active');
    heart.textContent = '💜'; // Corazón morado
  } else {
    heart.textContent = '🤍'; // Corazón blanco
  }

  // Agrega el evento de clic a cada corazón
  heart.addEventListener('click', () => {
    heart.classList.toggle('active');

    if (heart.textContent === '🤍') {
      heart.textContent = '💜'; // Cambia a morado
      localStorage.setItem(`${pageId}-heart${index}`, 'purple'); // Guarda el estado como morado
    } else {
      heart.textContent = '🤍'; // Cambia a blanco
      localStorage.setItem(`${pageId}-heart${index}`, 'white'); // Guarda el estado como blanco
    }
  });
});