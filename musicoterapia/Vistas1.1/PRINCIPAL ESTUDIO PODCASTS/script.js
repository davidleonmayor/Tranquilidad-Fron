// Variables globales para mantener el estado de la aplicación
let grabacionesGuardadas = [];
let grabacionActual = null;
let audioContexto = null;
let analizador = null;

document.addEventListener('DOMContentLoaded', function() {
    // Inicializar el contexto de audio
    try {
        window.AudioContext = window.AudioContext || window.webkitAudioContext;
        audioContexto = new AudioContext();
    } catch (e) {
        console.warn('El navegador no soporta Web Audio API:', e);
    }

    // Cargar grabaciones desde localStorage
    cargarGrabacionesGuardadas();
    
    // Funcionalidad de cambio de pestañas
    const tabs = document.querySelectorAll('.podcast-tab');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Eliminar clase active de todas las pestañas
            tabs.forEach(t => t.classList.remove('active'));
            
            // Añadir clase active a la pestaña actual
            this.classList.add('active');
            
            // Ocultar todos los contenidos de pestañas
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Mostrar el contenido de la pestaña seleccionada
            const tabId = this.getAttribute('data-tab') + '-tab';
            document.getElementById(tabId).classList.add('active');
            
            // Si se cambia a la pestaña de biblioteca, actualizar la lista
            if (tabId === 'library-tab') {
                actualizarListaGrabaciones();
            }
        });
    });
    
    // Poblar los contenidos de las pestañas
    poblarPestañaGrabar();
    poblarPestañaEditar();
    poblarPestañaBiblioteca();
    
    // Inicializar funcionalidad de grabación
    iniciarGrabacion();
    
    // Inicializar el visualizador de forma de onda
    iniciarVisualizador();
});

// Función para cargar grabaciones guardadas
function cargarGrabacionesGuardadas() {
    const grabacionesGuardadasJSON = localStorage.getItem('grabacionesPodcast');
    if (grabacionesGuardadasJSON) {
        try {
            grabacionesGuardadas = JSON.parse(grabacionesGuardadasJSON);
        } catch (e) {
            console.error('Error al cargar grabaciones:', e);
            grabacionesGuardadas = [];
        }
    }
}

// Función para guardar grabaciones en localStorage
function guardarGrabaciones() {
    try {
        localStorage.setItem('grabacionesPodcast', JSON.stringify(grabacionesGuardadas));
    } catch (e) {
        console.error('Error al guardar grabaciones:', e);
        alert('Error al guardar grabaciones. Es posible que el espacio de almacenamiento esté lleno.');
    }
}

// Poblar la pestaña de grabación
function poblarPestañaGrabar() {
    const recordTab = document.getElementById('record-tab');
    
    recordTab.innerHTML = `
        <div class="video-preview">
            <video id="preview-video" width="100%" height="400" playsinline>
                Tu navegador no soporta el elemento de video.
            </video>
        </div>
        
        <div class="recording-controls">
            <button id="start-recording" class="control-btn">
                <i class="fas fa-circle" style="color: red;"></i> Iniciar Grabación
            </button>
            <button id="stop-recording" class="control-btn" disabled>
                <i class="fas fa-stop"></i> Detener Grabación
            </button>
            <button id="pause-recording" class="control-btn" disabled>
                <i class="fas fa-pause"></i> Pausar
            </button>
        </div>
        
        <div class="recording-settings">
            <h3 class="text-primary">Configuración</h3>
            <div style="margin: 20px 0; display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                <div>
                    <label for="audio-input" class="text-primary">Entrada de audio:</label>
                    <select id="audio-input" class="form-control" style="width: 100%; padding: 8px; border-radius: 5px; border: 1px solid #ccc;">
                        <option>Micrófono predeterminado</option>
                    </select>
                </div>
                <div>
                    <label for="video-input" class="text-primary">Entrada de video:</label>
                    <select id="video-input" class="form-control" style="width: 100%; padding: 8px; border-radius: 5px; border: 1px solid #ccc;">
                        <option>Cámara predeterminada</option>
                    </select>
                </div>
            </div>
            <div style="margin-top: 15px;">
                <label for="recording-title" class="text-primary">Título de la grabación:</label>
                <input type="text" id="recording-title" placeholder="Ingresa un título para tu grabación" 
                       style="width: 100%; padding: 8px; border-radius: 5px; border: 1px solid #ccc; margin-top: 5px;">
            </div>
        </div>
    `;
}

// Poblar la pestaña de edición
function poblarPestañaEditar() {
    const editTab = document.getElementById('edit-tab');
    
    editTab.innerHTML = `
        <div class="audio-editor">
            <h3 class="text-primary">Editor de Audio</h3>
            
            <div class="current-recording-info" style="margin-bottom: 15px; font-size: 16px; color: #59009A;">
                <span id="current-recording-name">Ninguna grabación seleccionada</span>
            </div>
            
            <div style="margin-bottom: 15px;">
                <audio id="audio-player" controls style="width: 100%"></audio>
            </div>
            
            <div class="waveform" id="waveform" style="background: #f0f0f0; border-radius: 10px; overflow: hidden;">
                <canvas id="visualizer-canvas" width="800" height="150"></canvas>
            </div>
            
            <div class="editor-controls" style="margin-top: 20px;">
                <button class="control-btn" id="btn-play-pause">
                    <i class="fas fa-play"></i> Reproducir
                </button>
                <button class="control-btn" id="btn-stop">
                    <i class="fas fa-stop"></i> Detener
                </button>
                <button class="control-btn" id="btn-volume-up">
                    <i class="fas fa-volume-up"></i> Subir Volumen
                </button>
                <button class="control-btn" id="btn-volume-down">
                    <i class="fas fa-volume-down"></i> Bajar Volumen
                </button>
                <button class="control-btn" id="btn-save-changes">
                    <i class="fas fa-save"></i> Guardar Cambios
                </button>
            </div>
            
            <div style="margin-top: 30px;">
                <h4 class="text-primary">Efectos de sonido</h4>
                <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 10px; margin-top: 15px;">
                    <button class="control-btn effect-btn" data-effect="reverb">Reverb</button>
                    <button class="control-btn effect-btn" data-effect="echo">Eco</button>
                    <button class="control-btn effect-btn" data-effect="compressor">Compresor</button>
                    <button class="control-btn effect-btn" data-effect="normalize">Normalizar</button>
                </div>
            </div>
        </div>
    `;
    
    // Configurar eventos para los botones del editor
    setTimeout(() => {
        configurarControlesEditor();
    }, 0);
}

// Poblar la pestaña de biblioteca
function poblarPestañaBiblioteca() {
    const libraryTab = document.getElementById('library-tab');
    
    libraryTab.innerHTML = `
        <div>
            <h3 class="text-primary">Mis Grabaciones</h3>
            
            <div class="recordings-list" id="recordings-container">
                <!-- Las grabaciones se cargarán dinámicamente -->
            </div>
        </div>
    `;
    
    // Actualizar la lista de grabaciones
    actualizarListaGrabaciones();
}

// Actualizar la lista de grabaciones en la biblioteca
function actualizarListaGrabaciones() {
    const container = document.getElementById('recordings-container');
    if (!container) return;
    
    if (grabacionesGuardadas.length === 0) {
        container.innerHTML = '<p>No hay grabaciones guardadas.</p>';
        return;
    }
    
    let html = '';
    grabacionesGuardadas.forEach((grabacion, index) => {
        html += `
            <div class="recording-item" data-index="${index}">
                <div class="recording-info">
                    <h4 style="color: #59009A; margin-bottom: 5px;">${grabacion.titulo}</h4>
                    <p style="color: #666; font-size: 14px;">${grabacion.fecha} • ${grabacion.duracion || 'N/A'}</p>
                </div>
                <div class="recording-actions">
                    <button class="control-btn btn-play-recording" data-index="${index}" style="padding: 8px 12px;">
                        <i class="fas fa-play"></i> Reproducir
                    </button>
                    <button class="control-btn btn-edit-recording" data-index="${index}" style="padding: 8px 12px;">
                        <i class="fas fa-edit"></i> Editar
                    </button>
                    <button class="control-btn btn-delete-recording" data-index="${index}" style="padding: 8px 12px; background: #ff5555;">
                        <i class="fas fa-trash"></i> Eliminar
                    </button>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
    
    // Añadir event listeners
    document.querySelectorAll('.btn-play-recording').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const index = parseInt(this.getAttribute('data-index'));
            reproducirGrabacion(index);
        });
    });
    
    document.querySelectorAll('.btn-edit-recording').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const index = parseInt(this.getAttribute('data-index'));
            editarGrabacion(index);
        });
    });
    
    document.querySelectorAll('.btn-delete-recording').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const index = parseInt(this.getAttribute('data-index'));
            eliminarGrabacion(index);
        });
    });
}

// Reproducir una grabación desde la biblioteca
function reproducirGrabacion(index) {
    const grabacion = grabacionesGuardadas[index];
    if (!grabacion || !grabacion.blobURL) {
        alert('No se puede reproducir esta grabación');
        return;
    }
    
    // Ir a la pestaña de grabación
    document.querySelector('.podcast-tab[data-tab="record"]').click();
    
    // Establecer la fuente del video
    const videoElement = document.getElementById('preview-video');
    if (videoElement) {
        videoElement.src = grabacion.blobURL;
        videoElement.play()
            .catch(err => {
                console.error('Error al reproducir:', err);
                alert('Error al reproducir el video. Puede que el formato no sea compatible.');
            });
    }
}

// Editar una grabación
function editarGrabacion(index) {
    const grabacion = grabacionesGuardadas[index];
    if (!grabacion) {
        alert('No se puede editar esta grabación');
        return;
    }
    
    grabacionActual = grabacion;
    
    // Ir a la pestaña de edición
    document.querySelector('.podcast-tab[data-tab="edit"]').click();
    
    // Actualizar la información de la grabación actual
    const nombreElement = document.getElementById('current-recording-name');
    if (nombreElement) {
        nombreElement.textContent = `Editando: ${grabacion.titulo}`;
    }
    
    // Cargar el audio en el reproductor
    const audioPlayer = document.getElementById('audio-player');
    if (audioPlayer && grabacion.blobURL) {
        audioPlayer.src = grabacion.blobURL;
        
        // Actualizar el visualizador si existe
        actualizarVisualizador(audioPlayer);
    }
}

// Eliminar una grabación
function eliminarGrabacion(index) {
    if (confirm('¿Estás seguro de que deseas eliminar esta grabación?')) {
        grabacionesGuardadas.splice(index, 1);
        guardarGrabaciones();
        actualizarListaGrabaciones();
    }
}

// Inicializar funcionalidad de grabación
function iniciarGrabacion() {
    const botonIniciar = document.getElementById('start-recording');
    const botonDetener = document.getElementById('stop-recording');
    const botonPausar = document.getElementById('pause-recording');
    const elementoVideo = document.getElementById('preview-video');
    const campoTitulo = document.getElementById('recording-title');
    
    // Variables para almacenar objetos de stream y grabación
    let flujoMedia = null;
    let grabadorMedia = null;
    let fragmentosGrabados = [];
    let tiempoInicio = null;
    let tiempoPausa = 0;
    let estaGrabando = false;
    
    // Poblar selectores de dispositivos
    poblarSelectoresDispositivos();
    
    // Iniciar grabación
    botonIniciar.addEventListener('click', async function() {
        try {
            if (!campoTitulo.value.trim()) {
                alert('Por favor, ingresa un título para tu grabación');
                campoTitulo.focus();
                return;
            }
            
            const restricciones = {
                audio: true,
                video: true
            };
            
            // Usar el dispositivo seleccionado si está disponible
            const audioInput = document.getElementById('audio-input');
            const videoInput = document.getElementById('video-input');
            
            if (audioInput.value) {
                restricciones.audio = { deviceId: { exact: audioInput.value } };
            }
            
            if (videoInput.value) {
                restricciones.video = { deviceId: { exact: videoInput.value } };
            }
            
            flujoMedia = await navigator.mediaDevices.getUserMedia(restricciones);
            elementoVideo.srcObject = flujoMedia;
            
            try {
                await elementoVideo.play();
            } catch (e) {
                console.warn('Error al reproducir video:', e);
                alert('No se pudo iniciar la vista previa. Por favor, verifica los permisos de cámara.');
                return;
            }
            
            // Limpiar fragmentos anteriores
            fragmentosGrabados = [];
            
            // Crear MediaRecorder
            grabadorMedia = new MediaRecorder(flujoMedia, { mimeType: 'video/webm;codecs=vp9,opus' });
            
            grabadorMedia.ondataavailable = function(e) {
                if (e.data.size > 0) {
                    fragmentosGrabados.push(e.data);
                }
            };
            
            grabadorMedia.onstop = function() {
                // Crear blob a partir de fragmentos grabados
                const blob = new Blob(fragmentosGrabados, {
                    type: 'video/webm'
                });
                
                // Crear URL para el blob
                const blobURL = URL.createObjectURL(blob);
                
                // Establecer la fuente del video al blob grabado
                elementoVideo.srcObject = null;
                elementoVideo.src = blobURL;
                elementoVideo.play()
                    .catch(err => console.error('Error al reproducir grabación:', err));
                
                // Calcular duración
                const duracionMs = Date.now() - tiempoInicio - tiempoPausa;
                const duracionSeg = Math.floor(duracionMs / 1000);
                const minutos = Math.floor(duracionSeg / 60);
                const segundos = duracionSeg % 60;
                const duracionFormateada = `${minutos}:${segundos.toString().padStart(2, '0')}`;
                
                // Guardar la grabación
                const nuevaGrabacion = {
                    titulo: campoTitulo.value.trim(),
                    fecha: new Date().toLocaleDateString(),
                    duracion: duracionFormateada,
                    blobURL: blobURL,
                    timestamp: Date.now()
                };
                
                grabacionesGuardadas.push(nuevaGrabacion);
                guardarGrabaciones();
                
                // Habilitar/deshabilitar botones
                botonIniciar.disabled = false;
                botonDetener.disabled = true;
                botonPausar.disabled = true;
                
                // Restablecer variables
                estaGrabando = false;
                tiempoInicio = null;
                tiempoPausa = 0;
                
                // Mostrar mensaje de éxito
                alert(`Grabación "${nuevaGrabacion.titulo}" guardada con éxito!`);
                
                // Resetear el título
                campoTitulo.value = '';
            };
            
            // Iniciar grabación
            grabadorMedia.start(1000); // Capturar datos cada segundo
            estaGrabando = true;
            tiempoInicio = Date.now();
            
            // Habilitar/deshabilitar botones
            botonIniciar.disabled = true;
            botonDetener.disabled = false;
            botonPausar.disabled = false;
            
        } catch (err) {
            console.error('Error al acceder a dispositivos multimedia:', err);
            alert('Error al acceder a la cámara o micrófono. Por favor, asegúrate de que tienen permisos.');
        }
    });
    
    // Detener grabación
    botonDetener.addEventListener('click', function() {
        if (grabadorMedia && estaGrabando) {
            grabadorMedia.stop();
            
            // Detener todas las pistas
            if (flujoMedia) {
                flujoMedia.getTracks().forEach(pista => pista.stop());
            }
        }
    });
    
    // Pausar/reanudar grabación
    botonPausar.addEventListener('click', function() {
        if (!grabadorMedia) return;
        
        if (grabadorMedia.state === 'recording') {
            grabadorMedia.pause();
            this.innerHTML = '<i class="fas fa-play"></i> Reanudar';
            tiempoPausa -= Date.now(); // Guardar tiempo de pausa (negativo)
        } else if (grabadorMedia.state === 'paused') {
            grabadorMedia.resume();
            this.innerHTML = '<i class="fas fa-pause"></i> Pausar';
            tiempoPausa += Date.now(); // Actualizar tiempo de pausa
        }
    });
}

// Poblar selectores de dispositivos
async function poblarSelectoresDispositivos() {
    try {
        const dispositivos = await navigator.mediaDevices.enumerateDevices();
        
        const entradaAudio = document.getElementById('audio-input');
        const entradaVideo = document.getElementById('video-input');
        
        if (!entradaAudio || !entradaVideo) return;
        
        // Limpiar opciones existentes
        entradaAudio.innerHTML = '';
        entradaVideo.innerHTML = '';
        
        // Opción predeterminada para audio
        const opcionDefaultAudio = document.createElement('option');
        opcionDefaultAudio.value = '';
        opcionDefaultAudio.text = 'Micrófono predeterminado';
        entradaAudio.appendChild(opcionDefaultAudio);
        
        // Opción predeterminada para video
        const opcionDefaultVideo = document.createElement('option');
        opcionDefaultVideo.value = '';
        opcionDefaultVideo.text = 'Cámara predeterminada';
        entradaVideo.appendChild(opcionDefaultVideo);
        
        // Añadir dispositivos de entrada de audio
        dispositivos.filter(device => device.kind === 'audioinput').forEach(device => {
            const opcion = document.createElement('option');
            opcion.value = device.deviceId;
            opcion.text = device.label || `Micrófono ${entradaAudio.length}`;
            entradaAudio.appendChild(opcion);
        });
        
        // Añadir dispositivos de entrada de video
        dispositivos.filter(device => device.kind === 'videoinput').forEach(device => {
            const opcion = document.createElement('option');
            opcion.value = device.deviceId;
            opcion.text = device.label || `Cámara ${entradaVideo.length}`;
            entradaVideo.appendChild(opcion);
        });
        
        // Si no hay etiquetas, es posible que necesitemos solicitar permisos primero
        if (!dispositivos.some(d => d.label)) {
            console.log('Solicitando permisos para obtener etiquetas de dispositivos...');
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
                stream.getTracks().forEach(track => track.stop());
                
                // Intentar enumerar dispositivos nuevamente
                const newDevices = await navigator.mediaDevices.enumerateDevices();
                
                // Actualizar listas con etiquetas
                entradaAudio.innerHTML = '';
                entradaVideo.innerHTML = '';
                entradaAudio.appendChild(opcionDefaultAudio);
                entradaVideo.appendChild(opcionDefaultVideo);
                
                newDevices.filter(device => device.kind === 'audioinput').forEach(device => {
                    const opcion = document.createElement('option');
                    opcion.value = device.deviceId;
                    opcion.text = device.label || `Micrófono ${entradaAudio.length}`;
                    entradaAudio.appendChild(opcion);
                });
                
                newDevices.filter(device => device.kind === 'videoinput').forEach(device => {
                    const opcion = document.createElement('option');
                    opcion.value = device.deviceId;
                    opcion.text = device.label || `Cámara ${entradaVideo.length}`;
                    entradaVideo.appendChild(opcion);
                });
            } catch (e) {
                console.warn('No se pudieron obtener permisos para listar dispositivos:', e);
            }
        }
    } catch (err) {
        console.error('Error al enumerar dispositivos:', err);
    }
}

// Inicializar el visualizador de audio
function iniciarVisualizador() {
    if (!audioContexto) return;
    
    // Crear analizador
    analizador = audioContexto.createAnalyser();
    analizador.fftSize = 256;
}

// Actualizar visualizador con una fuente de audio
function actualizarVisualizador(audioElement) {
    if (!audioContexto || !analizador || !audioElement) return;
    
    const canvas = document.getElementById('visualizer-canvas');
    if (!canvas) return;
    
    const canvasCtx = canvas.getContext('2d');
    const WIDTH = canvas.width;
    const HEIGHT = canvas.height;
    
    // Conectar el elemento de audio al analizador
    let source;
    try {
        source = audioContexto.createMediaElementSource(audioElement);
        source.connect(analizador);
        analizador.connect(audioContexto.destination);
    } catch (e) {
        console.warn('Error al conectar fuente de audio:', e);
        return;
    }
    
    // Tamaño del búfer
    const bufferLength = analizador.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    
    // Limpiar canvas
    canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);
    
    // Función para dibujar
    function draw() {
        requestAnimationFrame(draw);
        
        analizador.getByteFrequencyData(dataArray);
        
        canvasCtx.fillStyle = '#f8f8f8';
        canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);
        
        const barWidth = (WIDTH / bufferLength) * 2.5;
        let barHeight;
        let x = 0;
        
        for (let i = 0; i < bufferLength; i++) {
            barHeight = dataArray[i] / 2;
            
            const r = 186; // ba
            const g = 127; // 7f
            const b = 231; // e7
            
            canvasCtx.fillStyle = `rgb(${r},${g},${b})`;
            canvasCtx.fillRect(x, HEIGHT - barHeight, barWidth, barHeight);
            
            x += barWidth + 1;
        }
    }
    
    draw();
}

// Configurar controles del editor
function configurarControlesEditor() {
    const audioPlayer = document.getElementById('audio-player');
    if (!audioPlayer) return;
    
    const btnPlayPause = document.getElementById('btn-play-pause');
    const btnStop = document.getElementById('btn-stop');
    const btnVolumeUp = document.getElementById('btn-volume-up');
    const btnVolumeDown = document.getElementById('btn-volume-down');
    const btnSaveChanges = document.getElementById('btn-save-changes');
    
    // Botón de reproducir/pausar
    if (btnPlayPause) {
        btnPlayPause.addEventListener('click', function() {
            if (audioPlayer.paused) {
                audioPlayer.play();
                this.innerHTML = '<i class="fas fa-pause"></i> Pausar';
            } else {
                audioPlayer.pause();
                this.innerHTML = '<i class="fas fa-play"></i> Reproducir';
            }
        });
    }
    
    // Botón de detener
    if (btnStop) {
        btnStop.addEventListener('click', function() {
            audioPlayer.pause();
            audioPlayer.currentTime = 0;
            if (btnPlayPause) {
                btnPlayPause.innerHTML = '<i class="fas fa-play"></i> Reproducir';
            }
        });
    }
    
    // Botón de subir volumen
    if (btnVolumeUp) {
        btnVolumeUp.addEventListener('click', function() {
            if (audioPlayer.volume < 0.9) {
                audioPlayer.volume += 0.1;
            } else {
                audioPlayer.volume = 1;
            }
        });
    }
    
    // Botón de bajar volumen
    if (btnVolumeDown) {
        btnVolumeDown.addEventListener('click', function() {
            if (audioPlayer.volume > 0.1) {
                audioPlayer.volume -= 0.1;
            } else {
                audioPlayer.volume = 0;
            }
        });
    }
    
    // Botón de guardar cambios
    if (btnSaveChanges) {
        btnSaveChanges.addEventListener('click', function() {
            if (!grabacionActual) {
                alert('No hay ninguna grabación seleccionada para guardar');
                return;
            }
            
            // Aquí normalmente guardarías los cambios aplicados
            // En esta versión simplificada, solo actualizamos la fecha
            grabacionActual.fecha = new Date().toLocaleDateString() + ' (editado)';
            
            guardarGrabaciones();
            alert('Cambios guardados correctamente');
            
            // Actualizar la lista de grabaciones
            actualizarListaGrabaciones();
        });
    }
    
    // Botones de efectos
    document.querySelectorAll('.effect-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const effect = this.getAttribute('data-effect');
            aplicarEfecto(effect);
        });
    });
}

// Aplicar un efecto de audio (simulado)
function aplicarEfecto(effect) {
    if (!grabacionActual) {
        alert('No hay ninguna grabación seleccionada para aplicar efectos');
        return;
    }
    
    // En una implementación real, aquí se procesaría el audio
    alert(`Efecto "${effect}" aplicado a la grabación (simulado)`);
}



// Modificar la función configurarControlesEditor para manejar la nueva funcionalidad
function configurarControlesEditor() {
    const audioPlayer = document.getElementById('audio-player');
    if (!audioPlayer) return;
    
    const btnPlayPause = document.getElementById('btn-play-pause');
    const btnStop = document.getElementById('btn-stop');
    const btnVolumeUp = document.getElementById('btn-volume-up');
    const btnVolumeDown = document.getElementById('btn-volume-down');
    const btnSaveChanges = document.getElementById('btn-save-changes');
    
    if (btnPlayPause) {
        btnPlayPause.addEventListener('click', function() {
            if (audioPlayer.paused) {
                audioPlayer.play();
                this.innerHTML = '<i class="fas fa-pause"></i> Pausar';
            } else {
                audioPlayer.pause();
                this.innerHTML = '<i class="fas fa-play"></i> Reproducir';
            }
        });
    }
    
    if (btnStop) {
        btnStop.addEventListener('click', function() {
            audioPlayer.pause();
            audioPlayer.currentTime = 0;
            if (btnPlayPause) {
                btnPlayPause.innerHTML = '<i class="fas fa-play"></i> Reproducir';
            }
        });
    }
    
    if (btnVolumeUp) {
        btnVolumeUp.addEventListener('click', function() {
            if (audioPlayer.volume < 0.9) {
                audioPlayer.volume += 0.1;
            } else {
                audioPlayer.volume = 1;
            }
        });
    }
    
    if (btnVolumeDown) {
        btnVolumeDown.addEventListener('click', function() {
            if (audioPlayer.volume > 0.1) {
                audioPlayer.volume -= 0.1;
            } else {
                audioPlayer.volume = 0;
            }
        });
    }
    
    if (btnSaveChanges) {
        btnSaveChanges.addEventListener('click', function() {
            if (!grabacionActual) {
                alert('No hay ninguna grabación seleccionada para guardar');
                return;
            }
            
            grabacionActual.fecha = new Date().toLocaleDateString() + ' (editado)';
            guardarGrabaciones();
            alert('Cambios guardados correctamente');
            actualizarListaGrabaciones();
        });
    }
    
    // Configurar efectos
    document.querySelectorAll('.effect-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const effect = this.getAttribute('data-effect');
            aplicarEfecto(effect);
        });
    });
    
    // Evento para actualizar visualizador cuando se carga audio
    audioPlayer.addEventListener('loadedmetadata', () => {
        actualizarVisualizador(audioPlayer);
    });
}

// Modificación de la función configurarGrabacionAudio()
function configurarGrabacionAudio() {
    const startButton = document.getElementById('start-audio-recording');
    const stopButton = document.getElementById('stop-audio-recording');
    const pauseButton = document.getElementById('pause-audio-recording');
    const audioPlayer = document.getElementById('audio-player');
    
    let mediaRecorder = null;
    let audioChunks = [];
    let isRecording = false;
    let startTime = null;
    let pauseTime = 0;
    let stream = null;
    
    // Asegurarse de que el contexto de audio esté inicializado
    if (!audioContexto) {
        try {
            window.AudioContext = window.AudioContext || window.webkitAudioContext;
            audioContexto = new AudioContext();
        } catch (e) {
            console.warn('El navegador no soporta Web Audio API:', e);
        }
    }
    
    startButton.addEventListener('click', async () => {
        try {
            // Solicitar permisos y obtener stream de audio con configuración de calidad
            stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    sampleRate: 44100,
                    channelCount: 2
                }
            });
            
            // Crear nuevo MediaRecorder con configuración optimizada
            const options = {
                mimeType: 'audio/webm;codecs=opus',
                audioBitsPerSecond: 128000
            };
            
            mediaRecorder = new MediaRecorder(stream, options);
            audioChunks = [];
            
            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunks.push(event.data);
                }
            };
            
            mediaRecorder.onstop = async () => {
                // Crear blob de audio con el tipo correcto
                const audioBlob = new Blob(audioChunks, { type: 'audio/webm;codecs=opus' });
                const audioUrl = URL.createObjectURL(audioBlob);
                
                // Calcular duración
                const duration = Date.now() - startTime - pauseTime;
                const seconds = Math.floor(duration / 1000);
                const minutes = Math.floor(seconds / 60);
                const remainingSeconds = seconds % 60;
                const formattedDuration = `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
                
                // Actualizar reproductor de audio y asegurarse de que esté listo
                audioPlayer.src = audioUrl;
                audioPlayer.load(); // Forzar la carga del audio
                
                // Crear nueva grabación
                const newRecording = {
                    titulo: `Grabación de Audio ${new Date().toLocaleString()}`,
                    fecha: new Date().toLocaleDateString(),
                    duracion: formattedDuration,
                    blobURL: audioUrl,
                    timestamp: Date.now(),
                    tipo: 'audio' // Identificador para diferenciar tipos de grabación
                };
                
                // Guardar grabación
                grabacionesGuardadas.push(newRecording);
                guardarGrabaciones();
                
                // Actualizar UI
                document.getElementById('current-recording-name').textContent = 
                    `Grabación actual: ${newRecording.titulo}`;
                
                // Detener todas las pistas
                stream.getTracks().forEach(track => track.stop());
                
                // Configurar el visualizador después de que el audio esté listo
                audioPlayer.addEventListener('canplaythrough', () => {
                    actualizarVisualizador(audioPlayer);
                }, { once: true });
                
                // Habilitar reproducción automática
                try {
                    await audioPlayer.play();
                    console.log('Reproducción automática iniciada');
                } catch (error) {
                    console.warn('No se pudo iniciar la reproducción automática:', error);
                }
                
                // Mostrar mensaje de éxito
                alert('Grabación de audio guardada con éxito! Ya puedes reproducirla.');
            };
            
            // Iniciar grabación
            mediaRecorder.start(1000);
            isRecording = true;
            startTime = Date.now();
            
            // Actualizar botones
            startButton.disabled = true;
            stopButton.disabled = false;
            pauseButton.disabled = false;
            
        } catch (error) {
            console.error('Error al iniciar la grabación:', error);
            alert('Error al acceder al micrófono. Por favor, verifica los permisos.');
        }
    });
    
    stopButton.addEventListener('click', () => {
        if (mediaRecorder && isRecording) {
            mediaRecorder.stop();
            isRecording = false;
            
            // Actualizar botones
            startButton.disabled = false;
            stopButton.disabled = true;
            pauseButton.disabled = true;
            pauseButton.innerHTML = '<i class="fas fa-pause"></i> Pausar Grabación';
        }
    });
    
    pauseButton.addEventListener('click', () => {
        if (!mediaRecorder) return;
        
        if (mediaRecorder.state === 'recording') {
            mediaRecorder.pause();
            pauseButton.innerHTML = '<i class="fas fa-play"></i> Reanudar Grabación';
            pauseTime -= Date.now();
        } else if (mediaRecorder.state === 'paused') {
            mediaRecorder.resume();
            pauseButton.innerHTML = '<i class="fas fa-pause"></i> Pausar Grabación';
            pauseTime += Date.now();
        }
    });
    
    // Mejorar la reproducción del audio
    audioPlayer.addEventListener('play', () => {
        if (audioContexto.state === 'suspended') {
            audioContexto.resume();
        }
    });
}

// Modificar la función actualizarVisualizador para mejorar la visualización del audio
function actualizarVisualizador(audioElement) {
    if (!audioContexto || !audioElement) return;
    
    const canvas = document.getElementById('visualizer-canvas');
    if (!canvas) return;
    
    // Crear nuevo analizador si no existe
    if (!analizador) {
        analizador = audioContexto.createAnalyser();
        analizador.fftSize = 2048; // Aumentar la resolución
        analizador.smoothingTimeConstant = 0.8; // Suavizar la visualización
    }
    
    const canvasCtx = canvas.getContext('2d');
    const WIDTH = canvas.width;
    const HEIGHT = canvas.height;
    
    // Conectar el elemento de audio al analizador
    let source;
    try {
        source = audioContexto.createMediaElementSource(audioElement);
        source.connect(analizador);
        analizador.connect(audioContexto.destination);
    } catch (e) {
        console.warn('El elemento de audio ya está conectado al contexto:', e);
        return;
    }
    
    const bufferLength = analizador.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    
    function draw() {
        requestAnimationFrame(draw);
        
        analizador.getByteTimeDomainData(dataArray);
        
        canvasCtx.fillStyle = '#f8f8f8';
        canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);
        
        canvasCtx.lineWidth = 2;
        canvasCtx.strokeStyle = '#BA7FE7';
        canvasCtx.beginPath();
        
        const sliceWidth = WIDTH / bufferLength;
        let x = 0;
        
        for (let i = 0; i < bufferLength; i++) {
            const v = dataArray[i] / 128.0;
            const y = v * HEIGHT / 2;
            
            if (i === 0) {
                canvasCtx.moveTo(x, y);
            } else {
                canvasCtx.lineTo(x, y);
            }
            
            x += sliceWidth;
        }
        
        canvasCtx.lineTo(WIDTH, HEIGHT / 2);
        canvasCtx.stroke();
    }
    
    draw();
}
// Modificar la función poblarPestañaEditar() para incluir la sección de publicación
function poblarPestañaEditar() {
    const editTab = document.getElementById('edit-tab');
    
    editTab.innerHTML = `
        <div class="audio-editor">
            <h3 class="text-primary">Editor de Audio</h3>
            
            <div class="current-recording-info" style="margin-bottom: 15px; font-size: 16px; color: #59009A;">
                <span id="current-recording-name">Ninguna grabación seleccionada</span>
            </div>
            
            <div class="recording-controls" style="margin-bottom: 20px;">
                <button class="control-btn" id="start-audio-recording">
                    <i class="fas fa-microphone"></i> Iniciar Grabación
                </button>
                <button class="control-btn" id="stop-audio-recording" disabled>
                    <i class="fas fa-stop"></i> Detener Grabación
                </button>
                <button class="control-btn" id="pause-audio-recording" disabled>
                    <i class="fas fa-pause"></i> Pausar Grabación
                </button>
            </div>
            
            <div style="margin-bottom: 15px;">
                <audio id="audio-player" controls style="width: 100%"></audio>
            </div>
            
            <div class="waveform" id="waveform" style="background: #f0f0f0; border-radius: 10px; overflow: hidden;">
                <canvas id="visualizer-canvas" width="800" height="150"></canvas>
            </div>
            
            <div class="editor-controls" style="margin-top: 20px;">
                <button class="control-btn" id="btn-play-pause">
                    <i class="fas fa-play"></i> Reproducir
                </button>
                <button class="control-btn" id="btn-stop">
                    <i class="fas fa-stop"></i> Detener
                </button>
                <button class="control-btn" id="btn-volume-up">
                    <i class="fas fa-volume-up"></i> Subir Volumen
                </button>
                <button class="control-btn" id="btn-volume-down">
                    <i class="fas fa-volume-down"></i> Bajar Volumen
                </button>
                <button class="control-btn" id="btn-save-changes">
                    <i class="fas fa-save"></i> Guardar Cambios
                </button>
            </div>
            
            <div style="margin-top: 30px;">
                <h4 class="text-primary">Efectos de sonido</h4>
                <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 10px; margin-top: 15px;">
                    <button class="control-btn effect-btn" data-effect="reverb">Reverb</button>
                    <button class="control-btn effect-btn" data-effect="echo">Eco</button>
                    <button class="control-btn effect-btn" data-effect="compressor">Compresor</button>
                    <button class="control-btn effect-btn" data-effect="normalize">Normalizar</button>
                </div>
            </div>

            <!-- Nueva sección de publicación -->
            <div style="margin-top: 40px; padding: 20px; background: #f8f8f8; border-radius: 10px;">
                <div class="title small-title" style="margin-bottom: 15px;">
                    <span style="font-size: 18px; color: #59009A; font-weight: bold;">Elige Categoría</span>
                </div>
                
                <form id="publish-form" style="display: flex; flex-direction: column; gap: 15px;">
                    <div style="display: flex; gap: 20px; flex-wrap: wrap;">
                        <label style="display: flex; align-items: center; gap: 5px; cursor: pointer;">
                            <input type="radio" name="category" value="atracciones">
                            <span>Atracciones</span>
                        </label>
                        <label style="display: flex; align-items: center; gap: 5px; cursor: pointer;">
                            <input type="radio" name="category" value="motivacional">
                            <span>Motivacional</span>
                        </label>
                        <label style="display: flex; align-items: center; gap: 5px; cursor: pointer;">
                            <input type="radio" name="category" value="autoestima">
                            <span>Autoestima</span>
                        </label>
                    </div>
                    
                    <div class="input-group" style="display: flex; gap: 10px; align-items: center;">
                        <input type="text" placeholder="Nombre" 
                               style="padding: 8px; border: 1px solid #ccc; border-radius: 5px; flex: 1;">
                        <button type="button" id="btn-publish" class="control-btn" 
                                style="background: #59009A; color: white;">
                                
                            <i class="fas fa-upload"></i> Publicar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    // Configurar eventos
    setTimeout(() => {
        configurarControlesEditor();
        configurarGrabacionAudio();
        configurarPublicacion();
    }, 0);
}

// ... (tu código existente de "Estudio Podcast")

function configurarPublicacion() {
    const publishForm = document.getElementById('publish-form');
    const publishButton = document.getElementById('btn-publish');
    
    if (publishButton) {
        publishButton.addEventListener('click', () => {
            const category = publishForm.querySelector('input[name="category"]:checked');
            const name = publishForm.querySelector('input[type="text"]').value;
            
            if (!category) {
                alert('Por favor, selecciona una categoría');
                return;
            }
            
            if (!name.trim()) {
                alert('Por favor, ingresa un nombre');
                return;
            }
            
            if (!grabacionActual) {
                alert('No hay ninguna grabación para publicar');
                return;
            }
            
            // Aquí puedes agregar la lógica para publicar la grabación
            const publicacionData = {
                categoria: category.value,
                nombre: name,
                grabacion: grabacionActual,
                fechaPublicacion: new Date().toISOString()
            };
            
            // Simular publicación exitosa
            console.log('Publicando:', publicacionData);
            alert('¡Grabación publicada con éxito!');

            // Limpiar el formulario
            publishForm.reset();

            // Redirigir a la vista de "Mis Creaciones"
            window.location.href = '/musicoterapia/Vistas1.1/MIS _CREACIONES/Mis craciones.html'; // Ajusta la ruta según tu configuración
        });
    }
}
