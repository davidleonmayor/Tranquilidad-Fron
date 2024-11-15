document.addEventListener('DOMContentLoaded', function() {
  const menuIcon = document.querySelector('.menu-icon');
  const dropdownMenu = document.querySelector('.dropdown-menu');
  const navbar = document.querySelector('.navbar');

  menuIcon.addEventListener('click', function(event) {
      event.stopPropagation(); // Previene que el click se propague al documento
      dropdownMenu.classList.toggle('show');
  });

  // Cerrar el menú cuando se hace clic fuera de él
  document.addEventListener('click', function(event) {
      if (!navbar.contains(event.target) && !dropdownMenu.contains(event.target)) {
          dropdownMenu.classList.remove('show');
      }
  });
});


function loadTemplate(templateId, filePath, callback) {
    fetch(filePath)
        .then(response => response.text())
        .then(data => {
            document.getElementById(templateId).innerHTML = data;
            if (callback) callback();
        })
        .catch(error => console.error('Error al cargar la plantilla:', error));
  }
  
  loadTemplate('header-placeholder', '../../../FootNav/header.html', function() {
    const servicios = document.querySelector('.servicios');
    const submenu = document.querySelector('.submenu'); 
    if (servicios) { 
        servicios.addEventListener('click', () => {
            const submenu = document.querySelector('.submenu');
            submenu.classList.toggle('active');
        });
        
    }
  
    document.addEventListener('click', function(event) {
        if (!servicios.contains(event.target) && !submenu.contains(event.target)) {
            submenu.classList.remove('active');
        }
    });
  });
  
  loadTemplate('footer-placeholder', '../../../FootNav/footer.html');
  
  
  /* INICIO ArteTerapia template */
  
  loadTemplate('explore-section-placeholder', '/arteterapia/component/explore-section/explore-section.html');