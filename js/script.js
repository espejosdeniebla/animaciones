(() => {
  "use strict";

  const videos = document.querySelectorAll("video[data-video-src]");

  function startVideo(video) {
    // La fuente se asigna una sola vez: desplazarse por la página no reinicia el video.
    if (!video.dataset.loaded) {
      video.src = video.dataset.videoSrc;
      video.dataset.loaded = "true";
      video.load();
    }

    video.muted = true;
    video.defaultMuted = true;

    const attemptPlayback = () => {
      const playback = video.play();
      if (playback && typeof playback.catch === "function") {
        playback.catch(() => {
          // Algunos navegadores pueden aplazar autoplay hasta que permitan reproducir.
        });
      }
    };

    if (video.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA) {
      attemptPlayback();
    } else {
      video.addEventListener("canplay", attemptPlayback, { once: true });
    }
  }

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          startVideo(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      rootMargin: "150% 0px",
      threshold: 0
    });

    videos.forEach((video) => observer.observe(video));
  } else {
    // Compatibilidad para navegadores sin IntersectionObserver.
    videos.forEach(startVideo);
  }
})();
