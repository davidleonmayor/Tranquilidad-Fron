// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
  // Gráfica de barras
  const ctx = document.getElementById('miGrafica').getContext('2d');
  const miGrafica = new Chart(ctx, {
      type: 'bar',  // Tipo de gráfico (barras)
      data: {
          labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio'],
          datasets: [{
              label: 'Estadísticas',
              data: [12, 19, 3, 5, 2, 3],
              backgroundColor: [
                  'rgba(75, 192, 192, 0.2)',
                  'rgba(54, 162, 235, 0.2)',
                  'rgba(255, 206, 86, 0.2)',
                  'rgba(75, 192, 192, 0.2)',
                  'rgba(153, 102, 255, 0.2)',
                  'rgba(255, 159, 64, 0.2)'
              ],
              borderColor: [
                  'rgba(75, 192, 192, 1)',
                  'rgba(54, 162, 235, 1)',
                  'rgba(255, 206, 86, 1)',
                  'rgba(75, 192, 192, 1)',
                  'rgba(153, 102, 255, 1)',
                  'rgba(255, 159, 64, 1)'
              ],
              borderWidth: 1
          }]
      },
      options: {
          scales: {
              y: {
                  beginAtZero: true
              }
          }
      }
  });

  // Lógica para el menú desplegable
  const menuIcon = document.querySelector('.menu-icon');
  const navbar = document.querySelector('header');

  // Añadir un event listener para abrir/cerrar el menú
  menuIcon.addEventListener('click', () => {
      navbar.classList.toggle('menu-open');
  });
});


