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


const menuIcon = document.querySelector('.menu-icon');
  const navbar = document.querySelector('header');

  // Añadir un event listener para abrir/cerrar el menú
  menuIcon.addEventListener('click', () => {
    navbar.classList.toggle('menu-open');
  });