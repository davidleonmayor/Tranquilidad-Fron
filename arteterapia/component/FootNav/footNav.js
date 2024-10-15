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

loadTemplate('explore-section-placeholder', '/arteterapia/component/explore-section/explore-section.html');

/* class ExploreSectionComponent {
    constructor() {
        // Inicializa la carga de la sección explore
        new TemplateLoader('explore-section-placeholder', '/arteterapia/component/explore-section/explore-section.html');
    }
} */

document.addEventListener('DOMContentLoaded', () => {
    const header = new HeaderComponent();
    const sidebar = new SidebarComponent();
    const footer = new FooterComponent();
    const exploreSection = new ExploreSectionComponent();

});