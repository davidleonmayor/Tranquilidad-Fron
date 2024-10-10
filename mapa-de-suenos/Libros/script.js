document.addEventListener('DOMContentLoaded', function() {
    const comments = JSON.parse(localStorage.getItem('comments')) || [];
    let ratings = JSON.parse(localStorage.getItem('ratings')) || [];
    const commentList = document.getElementById('comment-list');
    const commentText = document.getElementById('comment-text');
    const addCommentBtn = document.getElementById('add-comment-btn');
    const stars = document.querySelectorAll('.star');
    const averageRatingSpan = document.getElementById('average-rating');
    const overlay = document.getElementById('overlay');
    const confirmDelete = document.getElementById('confirm-delete');
    let commentToDeleteIndex = null;
   


    // Mostrar comentarios guardados
    function renderComments() {
commentList.innerHTML = '';
comments.forEach((comment, index) => {
  const div = document.createElement('div');
  div.classList.add('comment-item');
  div.innerHTML = `<p><strong>Usuario:</strong> ${comment}</p>
                   <button class="delete-btn" data-index="${index}"></button>`;
  
  // Añadimos el botón de eliminación al final del div
  div.appendChild(createDeleteButton(index)); 
  commentList.appendChild(div);
});

// Agregar evento a los botones de eliminación
document.querySelectorAll('.delete-btn').forEach(btn => {
  btn.addEventListener('click', function() {
    commentToDeleteIndex = this.dataset.index;
    overlay.style.display = 'block';
    confirmDelete.style.display = 'block';
  });
});
}

function createDeleteButton(index) {
const btn = document.createElement('button');
btn.classList.add('delete-btn');
btn.setAttribute('data-index', index);
btn.style.float = 'right'; // Asegura que el botón flote a la derecha
return btn;
}

    // Guardar comentario y recargar la lista
    addCommentBtn.addEventListener('click', function() {
      const comment = commentText.value.trim();
      if (comment) {
        comments.push(comment);
        localStorage.setItem('comments', JSON.stringify(comments));
        commentText.value = '';
        renderComments();
      }
    });

    // Confirmar eliminación de comentario
    document.getElementById('confirm-yes').addEventListener('click', function() {
      if (commentToDeleteIndex !== null) {
        comments.splice(commentToDeleteIndex, 1);
        localStorage.setItem('comments', JSON.stringify(comments));
        renderComments();
      }
      overlay.style.display = 'none';
      confirmDelete.style.display = 'none';
      commentToDeleteIndex = null;
    });

    document.getElementById('confirm-no').addEventListener('click', function() {
      overlay.style.display = 'none';
      confirmDelete.style.display = 'none';
      commentToDeleteIndex = null;
    });

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