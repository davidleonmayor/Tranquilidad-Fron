function loadTemplate(templateId, filePath, callback) {
    fetch(filePath)
        .then(response => response.text())
        .then(data => {
            document.getElementById(templateId).innerHTML = data;
            if (callback) callback();
        })
        .catch(error => console.error('Error al cargar la plantilla:', error));
}

loadTemplate('header-placeholder', '../../../FootNav/header.html', function() {
    const servicios = document.querySelector('.servicios');
    const submenu = document.querySelector('.submenu'); 
    if (servicios) { 
        servicios.addEventListener('click', () => {
            const submenu = document.querySelector('.submenu');
            submenu.classList.toggle('active');
        });
        
    }

    document.addEventListener('click', function(event) {
        if (!servicios.contains(event.target) && !submenu.contains(event.target)) {
            submenu.classList.remove('active');
        }
    });
});

loadTemplate('footer-placeholder', '../../../FootNav/footer.html');


/* INICIO ArteTerapia template */

loadTemplate('explore-section-placeholder', '/arteterapia/component/explore-section/explore-section.html');

/* FIN ArteTerapia template */