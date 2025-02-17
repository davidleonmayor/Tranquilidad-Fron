const images = [
    "/musicoterapia/Vistas1.1/images/CARRUSEL PODCAST 1.png",
    "/musicoterapia/Vistas1.1/images/CARRUSEL PODCASTS 2.png",
    "/musicoterapia/Vistas1.1/images/CARRUSEL PODCASTS 3.png",
    "/musicoterapia/Vistas1.1/images/CARRUSEL PODCASTS 4.png",
    "/musicoterapia/Vistas1.1/images/CARRUSEL PODCASTS 5.png",
  ];
  
  let index = 0;
const imgElement = document.getElementById("carousel-image");

function changeImage() {
  index = (index + 1) % images.length;
  imgElement.style.opacity = 0;
  setTimeout(() => {
    imgElement.src = images[index];
    imgElement.style.opacity = 1;
  }, 500);
}

setInterval(changeImage, 2000); // Ahora cambia cada 2 segundos