// DOM Elements
const mainContent = document.querySelector('.main-content');
const filterButtons = document.querySelectorAll('.filtro-btn');
const gridCreaciones = document.querySelector('.grid-creaciones');

// State management
let currentFilter = 'Todos';
let creaciones = [
    {
        id: 1,
        title: 'Mi Primer Podcast',
        type: 'Podcasts',
        duration: '15:30',
        date: '15/02/2024',
        thumbnail: '/path/to/thumbnail1.jpg',
        videoUrl: '/path/to/video1.mp4', // Add video URL
        isEdited: true,
        editHistory: [
            { date: '14/02/2024', changes: 'Creación inicial' },
            { date: '15/02/2024', changes: 'Ajuste de audio' }
        ]
    },
    {
        id: 2,
        title: 'Grabación de Voz',
        type: 'Grabaciones',
        duration: '08:45',
        date: '14/02/2024',
        thumbnail: '/path/to/thumbnail2.jpg',
        videoUrl: '/path/to/video2.mp4', // Add video URL
        isEdited: false,
        editHistory: [
            { date: '14/02/2024', changes: 'Creación inicial' }
        ]
    }
];

// Filter functionality
filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Update active state
        filterButtons.forEach(btn => btn.classList.remove('activo'));
        button.classList.add('activo');
        
        // Update current filter and refresh display
        currentFilter = button.textContent;
        refreshCreaciones();
    });
});

// Refresh creaciones display
function refreshCreaciones() {
    gridCreaciones.innerHTML = '';
    
    let filteredCreaciones;
    if (currentFilter === 'Todos') {
        filteredCreaciones = creaciones;
    } else if (currentFilter === 'Editados') {
        filteredCreaciones = creaciones.filter(item => item.isEdited);
    } else {
        filteredCreaciones = creaciones.filter(item => item.type === currentFilter);
    }
    
    filteredCreaciones.forEach(item => {
        const card = createCreacionCard(item);
        gridCreaciones.appendChild(card);
    });
}

// Create card element
function createCreacionCard(item) {
    const card = document.createElement('div');
    card.className = 'tarjeta-creacion';
    
    const editedBadge = item.isEdited ? '<span class="edited-badge">Editado</span>' : '';
    
    card.innerHTML = `
        <div class="video-preview">
            ${item.thumbnail ? `<img src="${item.thumbnail}" alt="${item.title}">` : ''}
            ${editedBadge}
        </div>
        <div class="video-info">
            <h3 class="video-title">${item.title}</h3>
            <div class="video-meta">
                <span>Duración: ${item.duration}</span>
                <span>Fecha: ${item.date}</span>
            </div>
            ${item.isEdited ? `
                <div class="edit-history">
                    <small>Última edición: ${item.editHistory[item.editHistory.length - 1].date}</small>
                </div>
            ` : ''}
        </div>
        <div class="video-actions">
            <button class="action-btn edit-btn" data-id="${item.id}">
                <i class="fas fa-edit"></i> Editar
            </button>
            <button class="action-btn share-btn" data-id="${item.id}">
                <i class="fas fa-share"></i> Compartir
            </button>
        </div>
    `;
    
    // Add event listeners
    const editBtn = card.querySelector('.edit-btn');
    const shareBtn = card.querySelector('.share-btn');
    
    editBtn.addEventListener('click', () => handleEdit(item.id));
    shareBtn.addEventListener('click', () => handleShare(item.id));
    
    return card;
}

// Handle edit action
function handleEdit(id) {
    const creacion = creaciones.find(item => item.id === id);
    if (!creacion) return;
    
    // Show edit modal
    const modal = document.createElement('div');
    modal.className = 'edit-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <h3>Editar ${creacion.title}</h3>
            <form id="edit-form">
                <input type="text" value="${creacion.title}" id="edit-title">
                <textarea id="edit-changes" placeholder="Describe los cambios realizados"></textarea>
                <button type="submit">Guardar</button>
                <button type="button" class="cancel-btn">Cancelar</button>
            </form>
            ${creacion.isEdited ? `
                <div class="edit-history-list">
                    <h4>Historial de ediciones</h4>
                    <ul>
                        ${creacion.editHistory.map(edit => `
                            <li>${edit.date}: ${edit.changes}</li>
                        `).join('')}
                    </ul>
                </div>
            ` : ''}
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add modal event listeners
    const form = modal.querySelector('#edit-form');
    const cancelBtn = modal.querySelector('.cancel-btn');
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const newTitle = modal.querySelector('#edit-title').value;
        const changes = modal.querySelector('#edit-changes').value;
        
        updateCreacion(id, {
            title: newTitle,
            isEdited: true,
            editHistory: [
                ...creacion.editHistory,
                {
                    date: new Date().toLocaleDateString(),
                    changes: changes || 'Actualización de título'
                }
            ]
        });
        
        modal.remove();
    });
    
    cancelBtn.addEventListener('click', () => modal.remove());
}

// Other functions remain the same...

// Add styles for edited badge and history
const style = document.createElement('style');
style.textContent = `
    .edited-badge {
        position: absolute;
        top: 10px;
        right: 10px;
        background: #ba7fe7;
        color: white;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 12px;
    }
    
    .edit-history {
        margin-top: 5px;
        font-size: 12px;
        color: #666;
    }
    
    .edit-history-list {
        margin-top: 20px;
        padding-top: 20px;
        border-top: 1px solid #eee;
    }
    
    .edit-history-list ul {
        list-style: none;
        padding: 0;
        margin: 10px 0;
    }
    
    .edit-history-list li {
        padding: 5px 0;
        font-size: 14px;
        color: #666;
    }
    
    .modal-content textarea {
        width: 100%;
        min-height: 100px;
        padding: 8px;
        border: 1px solid #ddd;
        border-radius: 4px;
        margin: 10px 0;
    }
`;

document.head.appendChild(style);

// Initialize display
document.addEventListener('DOMContentLoaded', () => {
    refreshCreaciones();
});
// Previous code remains the same until handleShare function...

// Handle share action
function handleShare(id) {
    const creacion = creaciones.find(item => item.id === id);
    if (!creacion) return;
    
    // Create and show share modal
    const modal = document.createElement('div');
    modal.className = 'share-modal';
    modal.innerHTML = `
        <div class="modal-content share-content">
            <h3>Compartir "${creacion.title}"</h3>
            <div class="share-options">
                <button class="share-option whatsapp">
                    <i class="fab fa-whatsapp"></i>
                    WhatsApp
                </button>
                <button class="share-option facebook">
                    <i class="fab fa-facebook"></i>
                    Facebook
                </button>
                <button class="share-option twitter">
                    <i class="fab fa-twitter"></i>
                    Twitter
                </button>
                <button class="share-option telegram">
                    <i class="fab fa-telegram"></i>
                    Telegram
                </button>
                <button class="share-option copy-link">
                    <i class="fas fa-link"></i>
                    Copiar enlace
                </button>
                <button class="share-option email">
                    <i class="fas fa-envelope"></i>
                    Email
                </button>
            </div>
            <div class="share-link-container">
                <input type="text" readonly value="${window.location.origin}/share/${creacion.id}" class="share-link-input">
                <button class="copy-button">
                    <i class="fas fa-copy"></i>
                </button>
            </div>
            <div class="share-status"></div>
            <button class="close-modal">Cerrar</button>
        </div>
    `;
    
    document.body.appendChild(modal);

    // Add event listeners for share options
    const shareOptions = {
        whatsapp: () => {
            const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(`¡Mira mi creación "${creacion.title}"! ${window.location.origin}/share/${creacion.id}`)}`;
            window.open(url, '_blank');
        },
        facebook: () => {
            const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`${window.location.origin}/share/${creacion.id}`)}`;
            window.open(url, '_blank');
        },
        twitter: () => {
            const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(`¡Mira mi creación "${creacion.title}"!`)}&url=${encodeURIComponent(`${window.location.origin}/share/${creacion.id}`)}`;
            window.open(url, '_blank');
        },
        telegram: () => {
            const url = `https://t.me/share/url?url=${encodeURIComponent(`${window.location.origin}/share/${creacion.id}`)}&text=${encodeURIComponent(`¡Mira mi creación "${creacion.title}"!`)}`;
            window.open(url, '_blank');
        },
        email: () => {
            const subject = encodeURIComponent(`Compartiendo: ${creacion.title}`);
            const body = encodeURIComponent(`¡Hola!\n\nQuiero compartir contigo mi creación "${creacion.title}".\n\nPuedes verla aquí: ${window.location.origin}/share/${creacion.id}`);
            window.location.href = `mailto:?subject=${subject}&body=${body}`;
        }
    };

    // Handle share button clicks
    modal.querySelectorAll('.share-option').forEach(button => {
        button.addEventListener('click', () => {
            const platform = button.classList[1];
            if (shareOptions[platform]) {
                shareOptions[platform]();
            } else if (platform === 'copy-link') {
                copyToClipboard(`${window.location.origin}/share/${creacion.id}`);
                showShareStatus('¡Enlace copiado!');
            }
        });
    });

    // Handle copy link button
    const copyButton = modal.querySelector('.copy-button');
    const shareInput = modal.querySelector('.share-link-input');
    copyButton.addEventListener('click', () => {
        copyToClipboard(shareInput.value);
        showShareStatus('¡Enlace copiado!');
    });

    // Handle close button
    const closeButton = modal.querySelector('.close-modal');
    closeButton.addEventListener('click', () => {
        modal.remove();
    });

    // Close on outside click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// Helper function to copy to clipboard
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).catch(err => {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
    });
}

// Helper function to show share status
function showShareStatus(message) {
    const status = document.querySelector('.share-status');
    status.textContent = message;
    status.style.opacity = '1';
    setTimeout(() => {
        status.style.opacity = '0';
    }, 2000);
}

// Add styles for share modal
const shareStyles = document.createElement('style');
shareStyles.textContent = `
    .share-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    }
    
    .share-content {
        width: 90%;
        max-width: 500px;
        padding: 25px;
    }
    
    .share-options {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
        gap: 10px;
        margin: 20px 0;
    }
    
    .share-option {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        padding: 12px;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-size: 14px;
        transition: all 0.3s ease;
    }
    
    .share-option i {
        font-size: 18px;
    }
    
    .whatsapp { background: #25D366; color: white; }
    .facebook { background: #1877F2; color: white; }
    .twitter { background: #1DA1F2; color: white; }
    .telegram { background: #0088cc; color: white; }
    .copy-link { background: #6c757d; color: white; }
    .email { background: #EA4335; color: white; }
    
    .share-link-container {
        display: flex;
        gap: 10px;
        margin: 20px 0;
    }
    
    .share-link-input {
        flex: 1;
        padding: 10px;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-size: 14px;
    }
    
    .copy-button {
        padding: 10px 15px;
        border: none;
        border-radius: 4px;
        background: #ba7fe7;
        color: white;
        cursor: pointer;
    }
    
    .share-status {
        text-align: center;
        color: #28a745;
        font-size: 14px;
        height: 20px;
        opacity: 0;
        transition: opacity 0.3s ease;
    }
    
    .close-modal {
        width: 100%;
        padding: 10px;
        border: none;
        border-radius: 4px;
        background: #ba7fe7;
        color: white;
        cursor: pointer;
        margin-top: 15px;
    }
    
    .share-option:hover, .copy-button:hover, .close-modal:hover {
        opacity: 0.9;
        transform: translateY(-2px);
    }
`;

document.head.appendChild(shareStyles);


// Modify the createCreacionCard function to include video
function createCreacionCard(item) {
    const card = document.createElement('div');
    card.className = 'tarjeta-creacion';
    
    const editedBadge = item.isEdited ? '<span class="edited-badge">Editado</span>' : '';
    
    card.innerHTML = `
        <div class="video-preview">
            <video
                class="video-player"
                src="${item.videoUrl}"
                poster="${item.thumbnail}"
                style="width: 100%; height: 100%; object-fit: cover;"
            >
                Your browser does not support the video tag.
            </video>
            <button class="play-pause-btn">
                <i class="fas fa-play"></i>
            </button>
            ${editedBadge}
        </div>
        <div class="video-info">
            <h3 class="video-title">${item.title}</h3>
            <div class="video-meta">
                <span>Duración: ${item.duration}</span>
                <span>Fecha: ${item.date}</span>
            </div>
            ${item.isEdited ? `
                <div class="edit-history">
                    <small>Última edición: ${item.editHistory[item.editHistory.length - 1].date}</small>
                </div>
            ` : ''}
        </div>
        <div class="video-actions">
            <button class="action-btn edit-btn" data-id="${item.id}">
                <i class="fas fa-edit"></i> Editar
            </button>
            <button class="action-btn share-btn" data-id="${item.id}">
                <i class="fas fa-share"></i> Compartir
            </button>
        </div>
    `;
    
    // Add video control event listeners
    const video = card.querySelector('.video-player');
    const playPauseBtn = card.querySelector('.play-pause-btn');
    
    playPauseBtn.addEventListener('click', () => {
        if (video.paused) {
            video.play();
            playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
        } else {
            video.pause();
            playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
        }
    });
    
    // Add edit and share event listeners
    const editBtn = card.querySelector('.edit-btn');
    const shareBtn = card.querySelector('.share-btn');
    
    editBtn.addEventListener('click', () => handleEdit(item.id));
    shareBtn.addEventListener('click', () => handleShare(item.id));
    
    return card;
}

// Add these styles to your existing styles
const videoStyles = document.createElement('style');
videoStyles.textContent = `
    .video-preview {
        position: relative;
        width: 100%;
        height: 200px;
        overflow: hidden;
        border-radius: 8px;
    }
    
    .play-pause-btn {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0, 0, 0, 0.6);
        border: none;
        border-radius: 50%;
        width: 50px;
        height: 50px;
        color: white;
        cursor: pointer;
        transition: all 0.3s ease;
    }
    
    .play-pause-btn:hover {
        background: rgba(0, 0, 0, 0.8);
        transform: translate(-50%, -50%) scale(1.1);
    }
    
    .video-player {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
`;

document.head.appendChild(videoStyles);