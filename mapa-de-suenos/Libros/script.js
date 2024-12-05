document.addEventListener('DOMContentLoaded', function() {
   
    let ratings = JSON.parse(localStorage.getItem('ratings')) || [];
   
    const stars = document.querySelectorAll('.star');
    const averageRatingSpan = document.getElementById('average-rating');
    const overlay = document.getElementById('overlay');
    const confirmDelete = document.getElementById('confirm-delete');
    let commentToDeleteIndex = null;
   


  
 // Función para calcular y mostrar el promedio numérico
 function renderAverage() {
  const averageRating = ratings.length > 0 ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 0;
  averageRatingSpan.textContent = averageRating.toFixed(1); // Mostrar el promedio numérico.
}

// Función para limpiar todas las estrellas (desmarcar)
function clearStars() {
  stars.forEach(star => {
    star.classList.remove('selected');
  });
}

// Función para marcar las estrellas según la última selección
function markStars(value) {
  clearStars(); // Primero limpiamos cualquier selección previa.
  stars.forEach(star => {
    if (parseInt(star.dataset.value) <= value) {
      star.classList.add('selected'); // Marcar las estrellas según el valor seleccionado.
    }
  });
}

// Hover efecto en las estrellas para seleccionarlas temporalmente
stars.forEach(star => {
  star.addEventListener('mouseover', function() {
    const value = parseInt(this.dataset.value);
    stars.forEach(star => {
      if (parseInt(star.dataset.value) <= value) {
        star.classList.add('hovered'); // Mostrar estrellas amarillas en hover.
      } else {
        star.classList.remove('hovered');
      }
    });
  });

  star.addEventListener('mouseout', function() {
    stars.forEach(star => {
      star.classList.remove('hovered'); // Remover hover cuando el mouse salga.
    });
  });

  // Guardar la calificación al hacer clic
  star.addEventListener('click', function() {
    const value = parseInt(this.dataset.value); // Obtener el valor seleccionado.

    ratings.push(value); // Añadir la nueva calificación.
    localStorage.setItem('ratings', JSON.stringify(ratings)); // Guardar las calificaciones en localStorage.

    markStars(value); // Marcar las estrellas seleccionadas.
    renderAverage(); // Mostrar el nuevo promedio.
  });
});

// Renderizar el promedio cuando la página se carga
renderAverage();
renderComments();
});

    
  document.addEventListener('DOMContentLoaded', () => {
    const servicesToggle = document.getElementById('services-toggle');
    const submenu = document.getElementById('submenu');

    servicesToggle.addEventListener('click', () => {
      submenu.style.display = submenu.style.display === 'none' || submenu.style.display === '' ? 'flex' : 'none';
    });
  });
  document.addEventListener('DOMContentLoaded', () => {
    const formComentario = document.getElementById('formComentario');
    const comentarioInput = document.getElementById('comentarioInput');
    const listaComentarios = document.getElementById('listaComentarios');
    const cancelarBtn = document.getElementById('cancelarBtn');
    const contadorLetras = document.getElementById('contadorLetras');
    const enviarBtn = document.getElementById('enviarBtn');

    // Función para formatear fecha y hora
    function formatDate(date) {
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
        return date.toLocaleDateString('es-ES', options);
    }

    // Función para contar las letras en un texto
    function contarLetras(texto) {
        return texto.replace(/\s/g, "").length; // Eliminar espacios y contar las letras
    }

    // Función para crear un nuevo comentario
    function crearComentario(texto, likes = 0, id = Date.now(), fecha = formatDate(new Date())) {
        const comentario = document.createElement('li');
        comentario.classList.add('comentario-item');
        comentario.setAttribute('data-id', id);

        comentario.innerHTML = `
            <div class="comment-header">
                <span class="author">Usuario</span> | <span class="date">${fecha}</span>
            </div>
            <div class="comment-body">${texto}</div>
            <div class="comment-actions">
                <button class="likeBtn">👍 Me gusta <span class="likeCount">${likes}</span></button>
                <button class="deleteBtn">Eliminar</button>
            </div>
        `;

        // Botón de "Me gusta"
        comentario.querySelector('.likeBtn').addEventListener('click', () => {
            likes++;
            comentario.querySelector('.likeCount').textContent = likes;
            actualizarComentariosEnStorage();
        });

        // Botón de "Eliminar"
        comentario.querySelector('.deleteBtn').addEventListener('click', () => {
            comentario.remove();
            actualizarComentariosEnStorage();
        });

        listaComentarios.appendChild(comentario);
        actualizarComentariosEnStorage();
    }

    // Función para guardar los comentarios en localStorage
    function guardarComentariosEnStorage(comentarios) {
        localStorage.setItem('comentarios', JSON.stringify(comentarios));
    }

    // Función para recuperar los comentarios de localStorage
    function recuperarComentariosDeStorage() {
        const comentarios = localStorage.getItem('comentarios');
        return comentarios ? JSON.parse(comentarios) : [];
    }

    // Función para actualizar los comentarios en el almacenamiento local
    function actualizarComentariosEnStorage() {
        const comentarios = [];
        document.querySelectorAll('#listaComentarios li').forEach((comentario) => {
            const texto = comentario.querySelector('.comment-body').textContent;
            const likes = parseInt(comentario.querySelector('.likeCount').textContent);
            const id = comentario.getAttribute('data-id');
            const fecha = comentario.querySelector('.date').textContent;
            comentarios.push({ texto, likes, id, fecha });
        });
        comentarios.sort((a, b) => b.likes - a.likes);
        guardarComentariosEnStorage(comentarios);
    }

    // Función para renderizar los comentarios en la interfaz
    function renderizarComentarios() {
        listaComentarios.innerHTML = '';
        const comentarios = recuperarComentariosDeStorage();
        comentarios.forEach((comentario) => {
            crearComentario(comentario.texto, comentario.likes, comentario.id, comentario.fecha);
        });
    }

    // Cargar los comentarios al iniciar la página
    function cargarComentarios() {
        renderizarComentarios();
    }

    // Evento para contar letras y habilitar el botón de enviar
    comentarioInput.addEventListener('input', () => {
        const textoComentario = comentarioInput.value.trim();
        const letraCount = contarLetras(textoComentario);

        // Mostrar el contador de letras restantes
        const letrasRestantes = 500 - letraCount;
        contadorLetras.textContent = `${letrasRestantes} caracteres restantes`;

        // Deshabilitar el campo de texto y el botón de enviar si se alcanzan los 500 caracteres
        if (letrasRestantes <= 0) {
            comentarioInput.value = textoComentario.substring(0, 500); // Limitar a 500 caracteres
            contadorLetras.textContent = `0 caracteres restantes`; // El contador de letras se actualiza
            enviarBtn.disabled = false;  // Habilitar el botón de enviar cuando se llega al límite
            comentarioInput.disabled = true;  // Deshabilitar el campo de texto para no permitir más escritura
        } else {
            // Volver a habilitar el campo de texto y el botón de enviar si no se alcanza el límite
            comentarioInput.disabled = false;
            enviarBtn.disabled = false;
        }
    });

    // Evento para enviar el comentario
    formComentario.addEventListener('submit', (e) => {
        e.preventDefault();

        const textoComentario = comentarioInput.value.trim();

        // Solo agregar el comentario si no supera el límite de caracteres
        if (textoComentario !== '' && contarLetras(textoComentario) <= 500) {
            crearComentario(textoComentario);
            comentarioInput.value = '';  // Limpiar el campo de texto
            contadorLetras.textContent = `500 caracteres restantes`; // Reiniciar el contador de caracteres
            enviarBtn.disabled = true;  // Deshabilitar el botón de enviar hasta que se vuelva a escribir
        } else {
            alert("El comentario es demasiado largo, debes escribir menos de 500 caracteres.");
        }
    });

    // Evento para cancelar el comentario
    cancelarBtn.addEventListener('click', () => {
        comentarioInput.value = '';  // Limpiar el campo de texto
        contadorLetras.textContent = `500 caracteres restantes`; // Reiniciar el contador
        enviarBtn.disabled = true;  // Deshabilitar el botón de enviar
        comentarioInput.disabled = false; // Habilitar el campo de texto de nuevo
    });

    // Iniciar la carga de comentarios
    cargarComentarios();
});
