

// Cargar el header
fetch('../Header/header.html')
.then(response => response.text())
.then(data => document.getElementById('header').innerHTML = data);

// Cargar el footer
fetch('../Footer/inicio/inicio.html')
.then(response => response.text())
.then(data => document.getElementById('footer').innerHTML = data);