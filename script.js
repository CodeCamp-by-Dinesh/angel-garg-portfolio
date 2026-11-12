(() => {
  const menuButton = document.querySelector('.menu-toggle');
  const nav = document.querySelector('nav');

  if (menuButton && nav) {
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('open');
      menuButton.setAttribute('aria-expanded', String(isOpen));
      menuButton.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
    });
    nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
      nav.classList.remove('open');
      menuButton.setAttribute('aria-expanded', 'false');
      menuButton.setAttribute('aria-label', 'Open menu');
    }));
  }

  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  // Enforce the selected 3-minute excerpt in the embedded YouTube player.
  const frame = document.getElementById('performance-player');
  if (frame) {
    const startSeconds = 755; // 12:35
    const endSeconds = 935;   // 15:35
    let player;
    let monitor;
    window.onYouTubeIframeAPIReady = () => {
      player = new YT.Player('performance-player', {
        events: {
          onReady: (event) => event.target.seekTo(startSeconds, true),
          onStateChange: (event) => {
            if (event.data === YT.PlayerState.PLAYING && !monitor) {
              monitor = window.setInterval(() => {
                if (!player || typeof player.getCurrentTime !== 'function') return;
                const current = player.getCurrentTime();
                if (current < startSeconds - 1) player.seekTo(startSeconds, true);
                if (current >= endSeconds) {
                  player.pauseVideo();
                  player.seekTo(endSeconds, true);
                  window.clearInterval(monitor);
                  monitor = null;
                }
              }, 250);
            }
            if (event.data === YT.PlayerState.ENDED && monitor) {
              window.clearInterval(monitor);
              monitor = null;
            }
          }
        }
      });
    };
    const api = document.createElement('script');
    api.src = 'https://www.youtube.com/iframe_api';
    document.head.appendChild(api);
  }
})();
