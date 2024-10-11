document.addEventListener('DOMContentLoaded', () => {
    const menuItems = document.querySelectorAll('.configuracion-menu .menu-item');
    const configItems = document.querySelectorAll('.config-item');

    menuItems.forEach(item => {
        item.addEventListener('click', function(event) {
            event.preventDefault(); // Evitar el desplazamiento al ancla

            // Ocultar todos los elementos de configuración
            configItems.forEach(config => {
                config.classList.remove('active');
            });

            // Mostrar el contenido correspondiente
            const targetId = this.getAttribute('href').substring(1); // Eliminar el #
            const targetContent = document.getElementById(targetId);
            targetContent.classList.add('active');
        });
    });

    // Inicializar con la primera opción activa por defecto (opcional)
    if (menuItems.length > 0) {
        menuItems[0].click();
    }
});
document.addEventListener('DOMContentLoaded', () => {
    const servicios = document.getElementById('serviciosIcon');
    const Submenu = document.getElementById('serviciosSubmenu');
    const Usuario = document.getElementById('userIcon');
    const Usuariosubmenu = document.getElementById('userSubmenu');
    // const perfil = document.getElementById('profilePic');
    // const perfilfoto = document.getElementById('profilePic1');
    // const modal = document.getElementById('modal');
    const closeModal = document.querySelector('.close');
    
    // Mostrar el formulario de edición cuando se haga clic en el botón "Editar"
    // const editar= document.getElementById('editarPerfilBtn');
    // const formulario = document.getElementById('formulario-editar-overlay'); // Overlay del formulario
    // editar.addEventListener('click', function() {
    //     formulario.style.display = 'flex'; // Mostrar el formulario de edición
    // });

    //  formulario.addEventListener('click', function() {
    //     formulario.style.display = 'none'; // Cerrar formulario al hacer clic en la 'X'
    // });

    // // Cerrar el formulario al hacer clic fuera de él
    // window.addEventListener('click', function(event) {
    //     if (event.target === formulario) {
    //         formulario.style.display = 'none';
    //     }
    // });

    // Funcionalidad para los submenús de "Servicios" y "Usuario"
    servicios.addEventListener('click', (event) => {
        event.preventDefault(); // Evitar que el enlace recargue la página
        Submenu.style.display = Submenu.style.display === 'block' ? 'none' : 'block';
    });

    Usuario.addEventListener('click', (event) => {
        event.preventDefault(); // Evitar que el enlace recargue la página
        Usuariosubmenu.style.display = Usuariosubmenu.style.display === 'block' ? 'none' : 'block';
    });

    // Ocultar submenús al hacer clic fuera de ellos
    window.addEventListener('click', (event) => {
        if (!servicios.contains(event.target)) {
            Submenu.style.display = 'none';
        }
        if (!Usuario.contains(event.target)) {
            Usuariosubmenu.style.display = 'none';
        }
      
    });

    // // Mostrar el modal al hacer clic en la imagen de perfil
    // perfil.addEventListener('click', function() {
    //     modal.style.display = 'flex'; // Mostrar modal
    // });

    // perfilfoto.addEventListener('click', function() {
    //     modal.style.display = 'flex'; // Mostrar modal
    // });

    // // Cerrar modal al hacer clic en la "X"
    // closeModal.addEventListener('click', function() {
    //     modal.style.display = 'none'; // Cerrar modal al hacer clic en la 'X'
    // });
});

