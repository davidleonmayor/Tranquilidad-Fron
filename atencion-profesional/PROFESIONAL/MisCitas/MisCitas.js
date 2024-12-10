// Función para confirmar la acción de aceptar o denegar la cita
function confirmAction(action) {
    if (action === 'ingresar') {
        alert('Has ingresado a la cita.');
    } else if (action === 'denegar') {
        if (confirm('¿Estás seguro de que deseas denegar la cita?')) {
            alert('Cita denegada.');
        }
    }
}

// Función para mostrar el mes y año actual dinámicamente en el calendario
function loadCalendar() {
    const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    const currentDate = new Date();
    const currentMonth = monthNames[currentDate.getMonth()] + " " + currentDate.getFullYear();
    document.getElementById("current-month").textContent = currentMonth;

    // Generar días del mes (ejemplo para mayo)
    let calendarHTML = '';
    for (let i = 1; i <= 31; i++) {
        calendarHTML += `<button class="date">${i}</button>`;
    }
    document.getElementById("calendar").innerHTML = calendarHTML;
}

// Cargar el calendario al inicio
document.addEventListener('DOMContentLoaded', loadCalendar);

window.onload = function() {
    const boton = document.getElementById('dropdown-button');
    const contenedor = document.getElementById('appointment');
    
    // Posiciona el botón en la esquina inferior derecha
    boton.style.position = 'absolute';
    boton.style.bottom = '10px'; // A 10 píxeles del borde inferior
    boton.style.right = '10px';  // A 10 píxeles del borde derecho
  };
  // Función para mostrar/ocultar el calendario al hacer clic en "Editar"
  function mostrarFormulario(btn) {
    const form = btn.nextElementSibling; // Encuentra el formulario justo después del botón "Editar"
    if (form.style.display === "none") {
        form.style.display = "block"; // Muestra el formulario
    } else {
        form.style.display = "none"; // Oculta el formulario si ya está visible
    }
}

  // Cargar el header
  fetch('../Header/header.html')
  .then(response => response.text())
  .then(data => document.getElementById('header-container').innerHTML = data);

// Cargar el footer
fetch('../Footer/inicio/inicio.html')
  .then(response => response.text())
  .then(data => document.getElementById('footer-container').innerHTML = data);