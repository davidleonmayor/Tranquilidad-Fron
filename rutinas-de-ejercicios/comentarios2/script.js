
    // Seleccionamos los elementos
    const comentarioInput = document.getElementById('comentario');
    const enviarBtn = document.getElementById('enviar');
    const comentariosContainer = document.getElementById('comentarios-container');

    // Cargar comentarios almacenados en localStorage al iniciar la página
    window.addEventListener('load', function() {
        const comentariosGuardados = JSON.parse(localStorage.getItem('comentarios')) || [];
        comentariosGuardados.forEach(comentario => agregarComentario(comentario));
    });

    // Agregar evento al botón de enviar
    enviarBtn.addEventListener('click', function() {
        const textoComentario = comentarioInput.value.trim();
        if (textoComentario !== "") {
            agregarComentario(textoComentario);
            guardarComentario(textoComentario);
            comentarioInput.value = ''; // Limpiar el área de texto
        }
    });

    // Función para agregar el comentario al contenedor
    function agregarComentario(comentario) {
        const comentarioDiv = document.createElement('div');
        comentarioDiv.classList.add('com');
        
        comentarioDiv.innerHTML = `
            <span class="material-symbols-outlined">
                person
            </span>
            <div class="comentar">${comentario}</div>
        `;
        comentariosContainer.appendChild(comentarioDiv);
    }

    // Función para guardar el comentario en localStorage
    function guardarComentario(comentario) {
        let comentariosGuardados = JSON.parse(localStorage.getItem('comentarios')) || [];
        comentariosGuardados.push(comentario);
        localStorage.setItem('comentarios', JSON.stringify(comentariosGuardados));
    }

    document.addEventListener("DOMContentLoaded", function () {
        const favoriteIcons = document.querySelectorAll(".favorite");
    
        favoriteIcons.forEach(function (icon) {
            icon.addEventListener("click", function () {
                if (icon.style.color === "red") {
                    icon.style.color = "gray"; // Vuelve al color original
                } else {
                    icon.style.color = "red";  // Cambia a rojo
                }
            });
        });
    });
    
