const menuIcon = document.querySelector('.menu-icon');
  const navbar = document.querySelector('header');

  // Añadir un event listener para abrir/cerrar el menú
  menuIcon.addEventListener('click', () => {
    navbar.classList.toggle('menu-open');
  });

  // JavaScript para redirigir al hacer clic en una fila
  document.querySelectorAll('.clickable-row').forEach(row => {
    row.addEventListener('click', () => {
        const url = row.getAttribute('data-url');
        if (url) {
            window.location.href = url;
        }
    });
});