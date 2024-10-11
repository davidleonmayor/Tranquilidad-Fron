    // Pantalla completa
    function toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.error(`Error al intentar activar pantalla completa: ${err.message}`);
            });
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    }
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
                                img.set({
                                    left: 100,
                                    top: 100,
                                    angle: 0
                                });
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
    
                    switch (shapeClass) {
                        case 'square':
                            shape = new fabric.Rect({
                                left: 100,
                                top: 100,
                                width: 100,
                                height: 100,
                                fill: 'blue'
                            });
                            break;
                        case 'circle':
                            shape = new fabric.Circle({
                                left: 100,
                                top: 100,
                                radius: 50,
                                fill: 'red'
                            });
                            break;
                        case 'triangle':
                            shape = new fabric.Triangle({
                                left: 100,
                                top: 100,
                                width: 100,
                                height: 100,
                                fill: 'green'
                            });
                            break;
                        default:
                            shape = new fabric.Rect({
                                left: 100,
                                top: 100,
                                width: 150,
                                height: 100,
                                fill: 'gray'
                            });
                            break;
                    }
    
                    addObject(shape);
                    toggleMenu('shapesMenu');
                });
            });
    
            // Agregar evento de clic para cada sticker
            document.querySelectorAll('.popup-menu .sticker').forEach(stickerBtn => {
                stickerBtn.addEventListener('click', (e) => {
                    const stickerText = e.target.textContent;
                    const sticker = new fabric.Text(stickerText, {
                        left: 100,
                        top: 100,
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
        const textbox = new fabric.Textbox('Escribe aquí...', {
            left: 100,
            top: 100,
            width: 200,
            fontSize: 20,     // Tamaño de la fuente adecuado
            fontFamily: 'Arial',
            fill: '#000000',
            textAlign: 'left', // Alineación del texto
            padding: 10,       // Relleno para ajustar el texto dentro del cuadro
            lineHeight: 1.4,   // Ajuste de la altura de línea
            originY: 'top',    // Asegura que el cuadro de texto se alinee desde arriba
            editable: true     // Asegura que sea editable
        });
        
        canvas.add(textbox); // Añade el cuadro de texto al canvas
        canvas.setActiveObject(textbox); // Define el cuadro como el objeto activo
        canvas.renderAll(); // Actualiza el canvas
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