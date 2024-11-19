document.addEventListener('DOMContentLoaded', function() {
    const metodoPagoElements = document.querySelectorAll('.metodo-pago');
    
    metodoPagoElements.forEach(element => {
        element.addEventListener('click', function() {
            const detalles = JSON.parse(this.getAttribute('data-detalles'));
            document.getElementById('detalle-fecha').textContent = detalles.fecha;
            document.getElementById('detalle-descripcion').textContent = detalles.descripcion;
            document.getElementById('detalle-metodo').textContent = detalles.metodo;
            document.getElementById('detalle-nombre').textContent = detalles.nombre;
            document.getElementById('detalle-telefono').textContent = detalles.telefono;
            document.getElementById('detalle-monto').textContent = detalles.monto;

            document.getElementById('detalle-factura').style.display = 'block';
        });
    });
});

function cerrarDetalle() {
    document.getElementById('detalle-factura').style.display = 'none';
}

 // Cargar el header
 fetch('../Header/Header/header.html')
 .then(response => response.text())
 .then(data => document.getElementById('header-container').innerHTML = data);

// Cargar el footer
fetch('../Footer/Footer/inicio/inicio.html')
 .then(response => response.text())
 .then(data => document.getElementById('footer-container').innerHTML = data);


const menuIcon = document.querySelector('.menu-icon');
  const navbar = document.querySelector('header');

  // Añadir un event listener para abrir/cerrar el menú
  menuIcon.addEventListener('click', () => {
    navbar.classList.toggle('menu-open');
  });



  function toggleProfileMenu() {
    const menu = document.getElementById("profile-menu");
    menu.style.display = menu.style.display === "block" ? "none" : "block";
  }
  
  function toggleModules() {
    const overlay = document.getElementById("modules-overlay");
    overlay.style.display = overlay.style.display === "block" ? "none" : "block";
  }
  
  document.addEventListener("click", function (e) {
    if (!e.target.closest(".profile-container")) {
      document.getElementById("profile-menu").style.display = "none";
    }
    if (!e.target.closest(".modules-item")) {
      document.getElementById("modules-overlay").style.display = "none";
    }
  });
  function toggleHamburgerMenu() {
    const hamburgerMenu = document.getElementById('hamburger-menu');
    hamburgerMenu.classList.toggle('active'); // Alterna la clase 'active' para mostrar/ocultar
  }
  function toggleModulues() {
    const modulesContent = document.getElementById("modules-content");
    modulesContent.style.display = modulesContent.style.display === "block" ? "none" : "block";
  }
  
 