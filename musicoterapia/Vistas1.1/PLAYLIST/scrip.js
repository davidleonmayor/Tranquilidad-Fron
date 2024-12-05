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
  
  
  document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.getElementById('menu-toggle');
    const servicesSubmenu = document.getElementById('services-submenu');
  
    menuToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        servicesSubmenu.classList.toggle('active');
    });
  
    // Cerrar el menú al hacer clic fuera de él
    document.addEventListener('click', function(event) {
        if (!menuToggle.contains(event.target) && !servicesSubmenu.contains(event.target)) {
            servicesSubmenu.classList.remove('active');
        }
    });
  
    // Prevenir que los clics dentro del menú lo cierren
    servicesSubmenu.addEventListener('click', function(e) {
        e.stopPropagation();
    });
  });