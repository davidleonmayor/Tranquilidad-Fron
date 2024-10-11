// Seleccionamos las secciones de las cajas
const dreamMapBox = document.querySelector('.dream-map');
const booksBox = document.querySelector('.books');

// Al hacer clic, puedes ejecutar algo adicional (esto es opcional)
dreamMapBox.addEventListener('click', () => {
  console.log('Mapa de sueños fue clicado');
});

booksBox.addEventListener('click', () => {
  console.log('Se hizo clic en Libros');
});