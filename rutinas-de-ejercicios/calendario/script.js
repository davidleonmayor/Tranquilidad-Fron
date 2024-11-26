const menuIcon = document.querySelector('.menu-icon');
  const navbar = document.querySelector('header');

  // Añadir un event listener para abrir/cerrar el menú
  menuIcon.addEventListener('click', () => {
    navbar.classList.toggle('menu-open');
  });





  document.addEventListener('DOMContentLoaded', function () {
    const taskForm = document.querySelector('form');
    const taskTitleInput = document.getElementById('task-title');
    const taskDetailsInput = document.getElementById('task-details');
    const notesContainer = document.querySelector('.notes-container');
    const modal = document.getElementById('add-task-modal');
    const createTaskBtn = document.getElementById('create-task-btn');
    const closeModal = document.getElementById('close-modal');

    // Cargar tareas desde el localStorage al cargar la página
    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.forEach(task => addTask(task.title, task.details));
    }

    // Guardar las tareas en localStorage
    function saveTasks() {
        const tasks = [];
        document.querySelectorAll('.note').forEach(note => {
            const title = note.querySelector('h3').textContent;
            const details = note.querySelector('p').textContent;
            tasks.push({ title, details });
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // Función para agregar una nueva tarea
    function addTask(title, details) {
        const note = document.createElement('div');
        note.classList.add('note');

        note.innerHTML = `
            <h3>${title}</h3>
            <p>${details}</p>
            <div class="note-buttons">
                <button class="edit">Editar</button>
                <button class="delete">Eliminar</button>
            </div>
        `;

        // Añadir funcionalidad a los botones de editar y eliminar
        note.querySelector('.delete').addEventListener('click', function () {
            note.remove();
            saveTasks(); // Actualiza el localStorage al eliminar
        });

        note.querySelector('.edit').addEventListener('click', function () {
            editTask(note, title, details);
        });

        notesContainer.appendChild(note);
        saveTasks(); // Guarda en localStorage al agregar una nueva tarea
    }

    // Función para editar una tarea
    function editTask(note, oldTitle, oldDetails) {
        taskTitleInput.value = oldTitle;
        taskDetailsInput.value = oldDetails;

        openModal(); // Mostrar el modal cuando se edita

        taskForm.removeEventListener('submit', createTaskHandler);

        taskForm.addEventListener('submit', function updateTaskHandler(event) {
            event.preventDefault();
            const newTitle = taskTitleInput.value;
            const newDetails = taskDetailsInput.value;

            note.querySelector('h3').textContent = newTitle;
            note.querySelector('p').textContent = newDetails;

            taskTitleInput.value = '';
            taskDetailsInput.value = '';

            taskForm.removeEventListener('submit', updateTaskHandler);
            taskForm.addEventListener('submit', createTaskHandler);
            saveTasks(); // Actualiza el localStorage al editar
            closeModalWindow(); // Cerrar el modal después de editar
        });
    }

    // Función para manejar la creación de nuevas tareas
    function createTaskHandler(event) {
        event.preventDefault();

        const title = taskTitleInput.value;
        const details = taskDetailsInput.value;

        if (title.trim() && details.trim()) {
            addTask(title, details);
            taskTitleInput.value = '';
            taskDetailsInput.value = '';
        }
        closeModalWindow(); // Cierra el modal después de agregar la tarea
    }

    // Función para abrir el modal
    function openModal() {
        modal.style.display = 'flex';
    }

    // Función para cerrar el modal
    function closeModalWindow() {
        modal.style.display = 'none';
    }

    // Event Listener para el botón "Crear Nueva Tarea"
    createTaskBtn.addEventListener('click', () => {
        openModal(); // Mostrar el formulario cuando se hace clic en "Crear Nueva Tarea"
    });

    // Event Listener para el botón de cerrar el modal
    closeModal.addEventListener('click', closeModalWindow);

    // Cerrar el modal si se hace clic fuera de él
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeModalWindow();
        }
    });

    // Manejo de la creación de tareas al enviar el formulario
    taskForm.addEventListener('submit', createTaskHandler);

    // Cargar las tareas al inicio
    loadTasks();
});

  