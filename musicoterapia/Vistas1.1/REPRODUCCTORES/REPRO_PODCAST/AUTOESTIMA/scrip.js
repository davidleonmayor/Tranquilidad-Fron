document.addEventListener('DOMContentLoaded', function () {
    let userInteracted = false;

    // Detectar la primera interacción del usuario
    document.addEventListener('click', () => {
        userInteracted = true;
        console.log('Usuario ha interactuado');
    });

    // Función para obtener podcasts del backend filtrados por categoría
    async function fetchPodcastsByCategory(category) {
        try {
            const url = `http://127.0.0.1:8000/v1/podcasts?filter[category]=${encodeURIComponent(category)}`;
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            const podcasts = data.data || data; // Ajusta según la estructura de la respuesta
            console.log(`Podcasts en la categoría "${category}":`, podcasts);
            return podcasts;
        } catch (error) {
            console.error('Error al obtener los podcasts:', error.message);
            return [];
        }
    }

    // Cargar y mostrar los podcasts de "Autoestima"
    fetchPodcastsByCategory('Autoestima').then(podcasts => {
        const videoScrollWrapper = document.getElementById('videoScrollWrapper');
        if (!videoScrollWrapper) {
            console.error('Contenedor #videoScrollWrapper no encontrado');
            return;
        }

        // Limpiar el contenedor para mostrar solo los podcasts dinámicos
        videoScrollWrapper.innerHTML = '';

        // Filtrar explícitamente solo los podcasts de "Autoestima"
        const autoestimaPodcasts = podcasts.filter(podcast => podcast.category === 'Autoestima');
        console.log('Podcasts filtrados (solo Autoestima):', autoestimaPodcasts);

        if (autoestimaPodcasts.length > 0) {
            autoestimaPodcasts.forEach(podcast => {
                // Crear la tarjeta de video
                const videoCard = document.createElement('div');
                videoCard.className = 'video-card';

                // Crear el elemento de video
                const video = document.createElement('video');
                video.className = 'video-player';
                video.loop = true;
                video.controls = true;
                video.innerHTML = `
                    <source src="${podcast.video_file}" type="video/mp4">
                    Your browser does not support the video tag.
                `;
                video.onerror = () => {
                    console.error(`Error al cargar el video para ${podcast.title}`);
                    videoCard.innerHTML += '<div class="error-message">Video Not Available</div>';
                };

                // Crear los botones de acción
                const videoActions = document.createElement('div');
                videoActions.className = 'video-actions';
                videoActions.innerHTML = `
                    <button class="action-button like-button">
                        <i class="fas fa-heart"></i>
                        <span class="action-count">0</span>
                    </button>
                    <button class="action-button bookmark-button">
                        <i class="fas fa-bookmark"></i>
                        <span class="action-count">0</span>
                    </button>
                    <button class="action-button share-button">
                        <i class="fas fa-share"></i>
                        <span class="action-count">0</span>
                    </button>
                `;

                // Ensamblar la tarjeta
                videoCard.appendChild(video);
                videoCard.appendChild(videoActions);
                videoScrollWrapper.appendChild(videoCard);

                // Configurar el IntersectionObserver
                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting && userInteracted) {
                            video.play()
                                .then(() => console.log(`Reproduciendo: ${podcast.title}`))
                                .catch(err => console.error('Error al reproducir:', err));
                        } else {
                            video.pause();
                        }
                    });
                }, { threshold: 0.5 });
                observer.observe(video);

                // Pausar otros videos cuando este empieza
                video.addEventListener('play', () => {
                    document.querySelectorAll('.video-player').forEach(v => {
                        if (v !== video) {
                            v.pause();
                        }
                    });
                });

                // Mostrar en consola
                console.log(`- ${podcast.title || 'Sin título'} (ID: ${podcast.id})`);
            });

            // Configurar botones y tarjetas después de agregar los podcasts
            setupActionButtons();
            setupVideoCards();
        } else {
            console.log('No se encontraron podcasts en la categoría "Autoestima".');
            videoScrollWrapper.innerHTML = '<p>No hay podcasts disponibles en esta categoría.</p>';
        }
    });

    // Manejo del scroll
    const videoScrollWrapper = document.getElementById('videoScrollWrapper');
    if (videoScrollWrapper) {
        videoScrollWrapper.addEventListener('scroll', () => {
            document.querySelectorAll('.video-player').forEach(video => {
                const rect = video.getBoundingClientRect();
                const isVisible = (rect.top >= 0 && rect.bottom <= videoScrollWrapper.clientHeight);
                if (isVisible && userInteracted) {
                    video.play()
                        .then(() => console.log('Video reproduciéndose por scroll'))
                        .catch(err => console.error('Error al reproducir:', err));
                } else {
                    video.pause();
                }
            });
        });
    }

    // Manejo de botones de interacción
    function setupActionButtons() {
        const actionButtons = document.querySelectorAll('.action-button');
        actionButtons.forEach(button => {
            if (!button.hasAttribute('data-listener')) {
                button.setAttribute('data-listener', 'true');
                button.addEventListener('click', (e) => {
                    e.stopPropagation();
                    button.classList.toggle('active');
                    if (button.classList.contains('like-button')) {
                        const count = button.querySelector('.action-count');
                        const currentCount = parseInt(count.textContent);
                        count.textContent = button.classList.contains('active') ? (currentCount + 1) : (currentCount - 1);
                    }
                });
            }
        });
    }

    // Manejo de tarjetas de video
    function setupVideoCards() {
        const videoCards = document.querySelectorAll('.video-card');
        videoCards.forEach(card => {
            const likeButton = card.querySelector('.like-button');
            const bookmarkButton = card.querySelector('.bookmark-button');
            const shareButton = card.querySelector('.share-button');

            if (!likeButton.hasAttribute('data-listener')) {
                likeButton.setAttribute('data-listener', 'true');
                likeButton.addEventListener('click', () => {
                    likeButton.classList.toggle('liked');
                    likeButton.style.color = likeButton.classList.contains('liked') ? '#59009A' : 'white';
                });
            }

            if (!bookmarkButton.hasAttribute('data-listener')) {
                bookmarkButton.setAttribute('data-listener', 'true');
                bookmarkButton.addEventListener('click', () => {
                    bookmarkButton.classList.toggle('bookmarked');
                    bookmarkButton.style.color = bookmarkButton.classList.contains('bookmarked') ? '#8e68a8' : 'white';
                });
            }

            if (!shareButton.hasAttribute('data-listener')) {
                shareButton.setAttribute('data-listener', 'true');
                shareButton.addEventListener('click', () => {
                    shareButton.classList.toggle('shared');
                    shareButton.style.color = shareButton.classList.contains('shared') ? '#b2a2bd' : 'white';
                });
            }
        });
    }

    // Configurar botones y tarjetas estáticas al inicio
    setupActionButtons();
    setupVideoCards();
});