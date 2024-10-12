function loadTemplate(templateId, filePath) {
    fetch(filePath)
        .then(response => response.text())
        .then(data => {
            document.getElementById(templateId).innerHTML = data;
        })
        .catch(error => console.error('Error al cargar la plantilla:', error));
}

loadTemplate('header-placeholder', '../../../FootNav/header.html');
loadTemplate('footer-placeholder', '../../../FootNav/footer.html');
