const menuIcon = document.querySelector('.menu-icon');
  const navbar = document.querySelector('header');
const abrir = document.getElementsByClassName('boton')

  // Añadir un event listener para abrir/cerrar el menú
  menuIcon.addEventListener('click', () => {
    navbar.classList.toggle('menu-open');
  });

  
  const carousel = document.querySelector('.video-carousel');

// Agrega un evento para manejar el scroll horizontal con el mouse
carousel.addEventListener('wheel', (event) => {
event.preventDefault(); // Previene el scroll vertical
carousel.scrollLeft += event.deltaY; // Ajusta el desplazamiento horizontal
});
function openModal() {
  instrucciones.style.display = 'flex';
}
abrir.addEventListener('click', () => {
  openModal(); // Mostrar el formulario cuando se hace clic en "Crear Nueva Tarea"
})

function toggleInstrucciones() {
  const contenedor = document.querySelector('.contenedor');
  contenedor.classList.toggle('show-instrucciones');
}