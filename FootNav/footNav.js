function loadTemplate(templateId, filePath, callback) {
    fetch(filePath)
        .then(response => response.text())
        .then(data => {
            document.getElementById(templateId).innerHTML = data;
            if (callback) callback();  // Ejecuta el callback si está definido
        })
        .catch(error => console.error('Error al cargar la plantilla:', error));
}

// Cargar el header y luego ejecutar el código JavaScript necesario
loadTemplate('header-placeholder', '../../../FootNav/header.html', function() {
    // Una vez cargado el header, ejecuta el JavaScript necesario
    const servicios = document.querySelector('.servicios');
    const submenu = document.querySelector('.submenu'); 
    if (servicios) {  // Verificar si el elemento existe
        servicios.addEventListener('click', () => {
            const submenu = document.querySelector('.submenu');
            submenu.classList.toggle('active');  // Alternar clase 'active' para mostrar u ocultar el menu
        });
        
    }

    // Escuchar clics en cualquier parte del documento
    document.addEventListener('click', function(event) {
        // Si el clic es fuera del menu y fuera del botón "Servicios", se oculta el menu
        if (!servicios.contains(event.target) && !submenu.contains(event.target)) {
            submenu.classList.remove('active');
        }
    });
});

loadTemplate('footer-placeholder', '../../../FootNav/footer.html');