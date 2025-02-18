document.addEventListener('DOMContentLoaded', function() {
    const videos = document.querySelectorAll('.video-player');
    
    videos.forEach(video => {
        // Autoplay only when video is in view
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    video.play();
                } else {
                    video.pause();
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(video);
        
        // Pause other videos when one starts playing
        video.addEventListener('play', () => {
            videos.forEach(v => {
                if (v !== video) {
                    v.pause();
                }
            });
        });
    });
    
    // Interaction buttons handling
    const actionButtons = document.querySelectorAll('.action-button');
    
    actionButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            button.classList.toggle('active');
            
            // If it's a like button, update the counter
            if (button.classList.contains('like-button')) {
                const count = button.querySelector('.action-count');
                const currentCount = parseInt(count.textContent);
                count.textContent = button.classList.contains('active') ? 
                    (currentCount + 1) + 'K' : 
                    (currentCount - 1) + 'K';
            }
        });
    });

    const videoScrollWrapper = document.getElementById('videoScrollWrapper');

    videoScrollWrapper.addEventListener('scroll', () => {
        videos.forEach(video => {
            const rect = video.getBoundingClientRect();
            const isVisible = (rect.top >= 0 && rect.bottom <= videoScrollWrapper.clientHeight);

            if (isVisible) {
                video.play();
            } else {
                video.pause();
            }
        });
    });
    
    const videoCards = document.querySelectorAll('.video-card');

    videoCards.forEach(card => {
        const likeButton = card.querySelector('.like-button');
        const bookmarkButton = card.querySelector('.bookmark-button');
        const shareButton = card.querySelector('.share-button');

        // Like button
        likeButton.addEventListener('click', () => {
            likeButton.classList.toggle('liked');
            if (likeButton.classList.contains('liked')) {
                likeButton.style.color = '#59009A'; // Purple
            } else {
                likeButton.style.color = 'white'; // White
            }
        });

        // Bookmark button
        bookmarkButton.addEventListener('click', () => {
            bookmarkButton.classList.toggle('bookmarked');
            if (bookmarkButton.classList.contains('bookmarked')) {
                bookmarkButton.style.color = '#8e68a8'; // Light purple
            } else {
                bookmarkButton.style.color = 'white'; // White
            }
        });

        // Share button
        shareButton.addEventListener('click', () => {
            shareButton.classList.toggle('shared');
            if (shareButton.classList.contains('shared')) {
                shareButton.style.color = '#b2a2bd'; // Lighter purple
            } else {
                shareButton.style.color = 'white'; // White
            }
        });
    });
});