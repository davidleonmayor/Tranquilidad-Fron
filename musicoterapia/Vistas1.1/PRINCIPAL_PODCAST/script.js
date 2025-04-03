document.addEventListener('DOMContentLoaded', function () {
  let userInteracted = false;

  document.addEventListener('click', () => {
    userInteracted = true;
    console.log('Usuario ha interactuado'); // Verifica cuándo ocurre el clic
  });

  const videos = document.querySelectorAll('.video-player');
  console.log('Videos encontrados:', videos.length); // Verifica cuántos videos se detectan

  videos.forEach(video => {
    video.muted = true; // Silenciar para permitir reproducción automática
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          video.play().catch(err => console.error('Error:', err));
        } else {
          video.pause();
        }
      });
    }, { threshold: 0.5 });
    observer.observe(video);
  });

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
      console.log(`Podcasts en la categoría "${category}":`, data);
      const podcasts = data.data || data;
      if (podcasts && podcasts.length > 0) {
        podcasts.forEach(podcast => {
          console.log(`- ${podcast.title || 'Sin título'} (ID: ${podcast.id})`);
        });
      } else {
        console.log(`No se encontraron podcasts en la categoría "${category}".`);
      }
    } catch (error) {
      console.error('Error al obtener los podcasts:', error.message);
    }
  }

  fetchPodcastsByCategory('Afirmaciones');
});