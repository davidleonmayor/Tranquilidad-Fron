   // Función para alternar pantalla completa
   function toggleFullscreen() {
    const elem = document.documentElement; // Elemento de la pantalla completa
    const sidebar = document.querySelector('.sidebar'); // Selector para la barra lateral
    const toolbar = document.querySelector('.toolbar'); // Selector para la barra de herramientas

    // Comprobar si ya estamos en pantalla completa
    if (!document.fullscreenElement) {
        // Entrar en pantalla completa
        if (elem.requestFullscreen) {
            elem.requestFullscreen();
        } else if (elem.mozRequestFullScreen) { // Firefox
            elem.mozRequestFullScreen();
        } else if (elem.webkitRequestFullscreen) { // Chrome, Safari y Opera
            elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) { // IE/Edge
            elem.msRequestFullscreen();
        }

        // Ocultar sidebar y toolbar
        sidebar.style.transform = 'translateX(-100%)'; // Oculta la barra lateral
        toolbar.style.transform = 'translateY(-200%)'; // Oculta la barra de herramientas
    } else {
        // Salir de pantalla completa
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.mozCancelFullScreen) { // Firefox
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) { // Chrome, Safari y Opera
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) { // IE/Edge
            document.msExitFullscreen();
        }

        // Mostrar sidebar y toolbar
        sidebar.style.transform = 'translateX(0)'; // Muestra la barra lateral
        toolbar.style.transform = 'translateY(0)'; // Muestra la barra de herramientas
    }
}

// Llama a esta función con un evento, como un clic en un botón
document.addEventListener('dblclick', toggleFullscreen); // Cambia esto según lo que necesites
// Evento para el botón de pantalla completa
document.getElementById('fullscreen-btn').addEventListener('click', toggleFullscreen);
// Evento para el botón de pantalla completa
document.getElementById('fullscreen-btn').addEventListener('click', toggleFullscreen);

// Evento para el botón de pantalla completa
document.getElementById('fullscreen-toggle').addEventListener('click', toggleFullscreen);

    
        // Inicializar el lienzo
        const canvas = new fabric.Canvas('myCanvas', {
            backgroundColor: '#ffffff'
        });

        // Función para agregar un objeto al lienzo
        function addObject(object) {
            canvas.add(object);
            canvas.renderAll();
        }

        // Mostrar u ocultar los menús emergentes
        function toggleMenu(menuId) {
            const menu = document.getElementById(menuId);
            menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
        }

       // Botón para agregar imagen
document.querySelector('.btn-image').addEventListener('click', () => {
    const imageInput = document.createElement('input');
    imageInput.type = 'file';
    imageInput.accept = 'image/*';
    imageInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                fabric.Image.fromURL(event.target.result, (img) => {
                    // Calcula el centro del lienzo
                    const canvasCenterX = canvas.getWidth() / 2;
                    const canvasCenterY = canvas.getHeight() / 2;

                    // Ajusta el tamaño de la imagen si es necesario
                    img.scaleToWidth(canvas.getWidth() / 2);  // Ajusta el tamaño (opcional)

                    // Establece la posición en el centro del lienzo
                    img.set({
                        left: canvasCenterX - (img.getScaledWidth() / 2),  // Centra horizontalmente
                        top: canvasCenterY - (img.getScaledHeight() / 2), // Centra verticalmente
                        angle: 0
                    });

                    // Añade la imagen al lienzo
                    canvas.add(img);
                    canvas.renderAll();
                });
            };
            reader.readAsDataURL(file);
        }
    });
    imageInput.click();
});

       

        // Botón para agregar formas
        document.querySelector('.btn-shape').addEventListener('click', () => {
            toggleMenu('shapesMenu');
        });

        // Botón para agregar stickers
        document.querySelector('.btn-sticker').addEventListener('click', () => {
            toggleMenu('stickersMenu');
        });

        // Agregar evento de clic para cada forma
document.querySelectorAll('.popup-menu .shape').forEach(shapeBtn => {
    shapeBtn.addEventListener('click', (e) => {
        const shapeClass = e.target.classList[1];
        let shape;

        // Obtener el tamaño del lienzo
        const canvasCenterX = canvas.getWidth() / 2;
        const canvasCenterY = canvas.getHeight() / 2;

        switch (shapeClass) {
            case 'square':
                shape = new fabric.Rect({
                    left: canvasCenterX - 75,  // Restar la mitad del ancho del rectángulo
                    top: canvasCenterY - 50,   // Restar la mitad del alto del rectángulo
                    width: 100,
                    height: 100,
                    fill: 'blue'
                });
                break;
            case 'circle':
                shape = new fabric.Circle({
                    left: canvasCenterX - 50,  // Restar el radio
                    top: canvasCenterY - 50,   // Restar el radio
                    radius: 50,
                    fill: 'red'
                });
                break;
            case 'triangle':
                shape = new fabric.Triangle({
                    left: canvasCenterX - 50,  // Restar la mitad del ancho del triángulo
                    top: canvasCenterY - 50,   // Restar la mitad del alto del triángulo
                    width: 100,
                    height: 100,
                    fill: 'green'
                });
                break;
            default:
                shape = new fabric.Rect({
                    left: canvasCenterX - 75,  // Restar la mitad del ancho del rectángulo por defecto
                    top: canvasCenterY - 50,   // Restar la mitad del alto del rectángulo por defecto
                    width: 150,
                    height: 100,
                    fill: 'gray'
                });
                break;
        }

        // Añadir la forma al lienzo
        addObject(shape);
        toggleMenu('shapesMenu');
    });
}); 
// Agregar evento de clic para cada sticker
document.querySelectorAll('.popup-menu .sticker').forEach(stickerBtn => {
    stickerBtn.addEventListener('click', (e) => {
        const stickerText = e.target.textContent;

        // Obtener el tamaño del lienzo
        const canvasCenterX = canvas.getWidth() / 2;
        const canvasCenterY = canvas.getHeight() / 2;

        const sticker = new fabric.Text(stickerText, {
            left: canvasCenterX - 50, // Centrar horizontalmente (ajustar según el tamaño del texto)
            top: canvasCenterY - 20,  // Centrar verticalmente (ajustar según la altura del texto)
            fontSize: 40
        });

        addObject(sticker);
        toggleMenu('stickersMenu'); // Cierra el menú después de seleccionar un sticker
    });
});

        // Funcionalidad de zoom
        document.getElementById('zoomInBtn').addEventListener('click', () => {
            canvas.setZoom(canvas.getZoom() * 1.1);
        });

        document.getElementById('zoomOutBtn').addEventListener('click', () => {
            canvas.setZoom(canvas.getZoom() * 0.9);
        });

         // Botón para deshacer
         document.querySelector('.btn-undo').addEventListener('click', () => {
            const activeObject = canvas.getActiveObject();
            if (activeObject) {
                canvas.remove(activeObject);
            } else {
                const lastObject = canvas.getObjects().pop();
                if (lastObject) {
                    canvas.remove(lastObject);
                }
            }
            canvas.renderAll();
        });
       // Escuchar eventos de teclado
document.addEventListener('keydown', (e) => {
    const activeObject = canvas.getActiveObject();
    if (e.key === 'Delete' || e.key === 'Backspace') {
        if (activeObject && activeObject.type === 'textbox') {
            // Si el objeto activo es un cuadro de texto, borra su contenido
            activeObject.text = ''; // Limpia el texto
            activeObject.set({ dirty: true }); // Marca el objeto como sucio para que se renderice correctamente
            canvas.renderAll(); // Actualiza el lienzo
        } else if (activeObject) {
            // Si no es un cuadro de texto, elimina el objeto activo
            canvas.remove(activeObject);
            canvas.renderAll(); // Actualiza el lienzo
        }
    }
});
// Función para agregar el cuadro de texto
function addTextbox() {
    if (!canvas) {
        console.error('El objeto canvas no está inicializado.');
        return;
    }

    const canvasWidth = canvas.getWidth();
    const canvasHeight = canvas.getHeight();
    
    const textbox = new fabric.Textbox('Escribe aquí...', {
        left: canvasWidth / 2 - 100,  // Centrar horizontalmente (restar la mitad del ancho del cuadro de texto)
        top: canvasHeight / 2 - 50,   // Centrar verticalmente (restar la mitad de la altura esperada del texto)
        width: 200, 
        fontSize: 20,     // Tamaño de la fuente adecuado
        fontFamily: 'Arial',
        fill: '#000000',
        textAlign: 'center', // Alineación del texto centrada
        padding: 10,       // Relleno para ajustar el texto dentro del cuadro
        lineHeight: 1.4,   // Ajuste de la altura de línea
        originY: 'top',    // Asegura que el cuadro de texto se alinee desde arriba
        editable: true     // Asegura que sea editable
    });

    // Añadir el cuadro de texto al lienzo
    canvas.add(textbox);
    canvas.renderAll();
}



    // Función para alternar el estilo negrita
    function toggleBold() {
        const activeObject = canvas.getActiveObject();
        if (activeObject && activeObject.type === 'textbox') {
            const isBold = activeObject.fontWeight === 'bold';
            activeObject.set({ fontWeight: isBold ? 'normal' : 'bold' });
            canvas.renderAll();
        }
    }

    // Función para alternar el estilo cursiva
    function toggleItalic() {
        const activeObject = canvas.getActiveObject();
        if (activeObject && activeObject.type === 'textbox') {
            const isItalic = activeObject.fontStyle === 'italic';
            activeObject.set({ fontStyle: isItalic ? 'normal' : 'italic' });
            canvas.renderAll();
        }
    }
//color 
    // Función para cambiar el color del texto
    function changeTextColor() {
        const activeObject = canvas.getActiveObject();
        if (activeObject && activeObject.type === 'textbox') {
            const newColor = prompt('Introduce el color del texto (en formato hex o nombre):', '#000000');
            activeObject.set({ fill: newColor });
            canvas.renderAll();
        }
    }

    // Función para alinear el texto
    function alignText(alignment) {
        const activeObject = canvas.getActiveObject();
        if (activeObject && activeObject.type === 'textbox') {
            activeObject.set({ textAlign: alignment });
            canvas.renderAll();
        }
    }

    // Manejo de eliminación del objeto con tecla "Delete" o "Backspace"
    document.addEventListener('keydown', (e) => {
        const activeObject = canvas.getActiveObject();
        if (e.key === 'Delete' || e.key === 'Backspace') {
            if (activeObject && activeObject.type === 'textbox') {
                // Si el objeto activo es un cuadro de texto, borra su contenido
                activeObject.text = ''; // Limpia el texto
                activeObject.set({ dirty: true }); // Marca el objeto como sucio para que se renderice correctamente
                canvas.renderAll(); // Actualiza el lienzo
            } else if (activeObject) {
                // Si no es un cuadro de texto, elimina el objeto activo
                canvas.remove(activeObject);
                canvas.renderAll(); // Actualiza el lienzo
            }
        }
    });


       // Inicializa Spectrum con una paleta de colores
$(document).ready(function() {
    $("#colorPicker").spectrum({
        color: "#000000", // Color inicial
        showInput: true, // Permitir ingreso de color
        showPalette: true, // Mostrar la paleta
        palette: [
            ["#000000", "#FF0000", "#00FF00", "#0000FF", "#FFFF00"],
            ["#FF00FF", "#00FFFF", "#FFFFFF", "#C0C0C0", "#808080"],
            ["#800000", "#008000", "#000080", "#808000", "#800080"],
            ["#FFA500", "#FFD700", "#A52A2A", "#D2691E", "#F08080"]
        ],
        change: function(color) {
            const activeObject = canvas.getActiveObject();
            if (activeObject && activeObject.type === 'textbox') {
                // Cambia el color del texto automáticamente al seleccionar un color
                activeObject.set('fill', color.toHexString());
                canvas.renderAll(); // Actualiza el lienzo
            }
        }
    });
});

// Función para mostrar el selector de color
function showColorPicker() {
    const activeObject = canvas.getActiveObject();
    if (activeObject && activeObject.type === 'textbox') {
        // Muestra el selector de color
        $("#colorPicker").spectrum("show");
    } else {
        alert("Por favor, selecciona un texto primero.");
    }
}


