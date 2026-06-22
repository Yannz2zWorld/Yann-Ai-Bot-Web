/* ─── ANTI STEAL / API BLOCK ─────────────────────────────────── */
(function () {
  const BLOCKED_REFERRERS = [
    "resellergaming.my.id",
    "getcode",
    "api.",
    "scrape",
    "tools/get",
  ];

  const BLOCKED_PARAMS = [
    "url=",
    "fetch=",
    "source=",
    "code=",
    "scrape=",
  ];

  function isBlocked() {
    const ref = document.referrer ? document.referrer.toLowerCase() : "";
    const loc = window.location.href.toLowerCase();
    const search = window.location.search.toLowerCase();

    // Cek referrer
    for (const r of BLOCKED_REFERRERS) {
      if (ref.includes(r)) return true;
    }

    // Cek jika dimuat di dalam iframe
    try {
      if (window.self !== window.top) return true;
    } catch (e) {
      return true;
    }

    // Cek query params mencurigakan
    for (const p of BLOCKED_PARAMS) {
      if (search.includes(p)) return true;
    }

    // Cek X-Frame / window name aneh
    if (window.name && window.name !== "") return true;

    return false;
  }

  if (isBlocked()) {
    // Sembunyikan semua konten
    document.documentElement.innerHTML = `
      <!DOCTYPE html>
      <html lang="id">
      <head>
        <meta charset="UTF-8"/>
        <meta name="viewport" content="width=device-width,initial-scale=1"/>
        <title>Akses Ditolak</title>
        <style>
          *{margin:0;padding:0;box-sizing:border-box}
          body{
            background:#0a0a0f;
            color:#fff;
            font-family:'Inter',sans-serif;
            display:flex;align-items:center;justify-content:center;
            min-height:100vh;text-align:center;padding:24px;
          }
          .box{max-width:400px}
          .icon{font-size:64px;margin-bottom:20px}
          h1{font-size:22px;font-weight:700;color:#ef4444;margin-bottom:12px}
          p{font-size:14px;color:#888;line-height:1.6;margin-bottom:20px}
          .badge{
            display:inline-block;
            background:rgba(239,68,68,0.15);
            border:1px solid rgba(239,68,68,0.4);
            color:#ef4444;
            padding:6px 16px;
            border-radius:99px;
            font-size:12px;
            font-weight:600;
            letter-spacing:0.05em;
          }
          .owner{margin-top:24px;font-size:12px;color:#555}
          .owner a{color:#6366f1;text-decoration:none}
        </style>
      </head>
      <body>
        <div class="box">
          <div class="icon">🚫</div>
          <h1>Akses Ditolak</h1>
          <p>Halaman ini tidak dapat diakses melalui API, iframe, atau tools pihak ketiga. Konten dilindungi oleh pemilik.</p>
          <div class="badge">PROTECTED · YANN AI MD</div>
          <div class="owner">
            Hubungi owner: <a href="https://wa.me/6285282426298" target="_blank">WhatsApp</a>
          </div>
        </div>
      </body>
      </html>
    `;
    return;
  }
})();

/* ─── DISABLE RIGHT CLICK & DEVTOOLS SHORTCUT ────────────────── */
document.addEventListener("contextmenu", function (e) {
  e.preventDefault();
});

document.addEventListener("keydown", function (e) {
  // Block F12, Ctrl+Shift+I, Ctrl+U (view source)
  if (
    e.key === "F12" ||
    (e.ctrlKey && e.shiftKey && ["I", "J", "C"].includes(e.key)) ||
    (e.ctrlKey && e.key === "u") ||
    (e.ctrlKey && e.key === "U")
  ) {
    e.preventDefault();
  }
});

/* ─── LOADER ──────────────────────────────────────────────────── */
window.addEventListener("load", function () {
  const loader = document.getElementById("loader");
  const app = document.getElementById("app");

  setTimeout(function () {
    loader.classList.add("hidden");
    app.classList.add("visible");
  }, 2000);
});

/* ─── LIGHTBOX + ZOOM ─────────────────────────────────────────── */
(function () {
  const overlay   = document.getElementById('lightbox');
  const imgEl     = document.getElementById('lightboxImg');
  const closeBtn  = document.getElementById('lightboxClose');

  let scale = 1, minScale = 1, maxScale = 5;
  let startDist = 0, lastScale = 1;
  let isDragging = false, startX = 0, startY = 0, translateX = 0, translateY = 0;

  function clamp(v, mn, mx) { return Math.min(Math.max(v, mn), mx); }

  function applyTransform() {
    imgEl.style.transform = `scale(${scale}) translate(${translateX}px, ${translateY}px)`;
  }

  function resetTransform() {
    scale = 1; translateX = 0; translateY = 0;
    imgEl.style.transition = 'transform .25s ease';
    applyTransform();
    setTimeout(() => imgEl.style.transition = '', 250);
  }

  // Buka lightbox
  function openLightbox(src, alt) {
    imgEl.src = src;
    imgEl.alt = alt;
    resetTransform();
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  // Tutup lightbox
  function closeLightbox() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
    setTimeout(() => { imgEl.src = ''; resetTransform(); }, 250);
  }

  // Klik gambar tutorial untuk buka lightbox
  document.querySelectorAll('.tutorial-img-wrap').forEach(function (wrap) {
    wrap.addEventListener('click', function () {
      const img = wrap.querySelector('.tutorial-img');
      if (img) openLightbox(img.src, img.alt);
    });
  });

  // Tutup via tombol atau klik overlay
  closeBtn.addEventListener('click', function (e) { e.stopPropagation(); closeLightbox(); });
  overlay.addEventListener('click', function (e) {
    if (e.target === overlay) closeLightbox();
  });

  // ESC
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeLightbox();
  });

  // ── SCROLL ZOOM (desktop) ──
  overlay.addEventListener('wheel', function (e) {
    e.preventDefault();
    const delta = e.deltaY < 0 ? 0.15 : -0.15;
    scale = clamp(scale + delta, minScale, maxScale);
    if (scale === minScale) { translateX = 0; translateY = 0; }
    applyTransform();
  }, { passive: false });

  // ── PINCH ZOOM (touch) ──
  overlay.addEventListener('touchstart', function (e) {
    if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      startDist = Math.hypot(dx, dy);
      lastScale = scale;
    } else if (e.touches.length === 1 && scale > 1) {
      isDragging = true;
      startX = e.touches[0].clientX - translateX;
      startY = e.touches[0].clientY - translateY;
    }
  }, { passive: true });

  overlay.addEventListener('touchmove', function (e) {
    if (e.touches.length === 2) {
      e.preventDefault();
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const dist = Math.hypot(dx, dy);
      scale = clamp(lastScale * (dist / startDist), minScale, maxScale);
      if (scale === minScale) { translateX = 0; translateY = 0; }
      applyTransform();
    } else if (e.touches.length === 1 && isDragging) {
      e.preventDefault();
      translateX = e.touches[0].clientX - startX;
      translateY = e.touches[0].clientY - startY;
      applyTransform();
    }
  }, { passive: false });

  overlay.addEventListener('touchend', function (e) {
    if (e.touches.length < 2) isDragging = false;
    // Double tap to reset
  });

  // ── DRAG (mouse) ──
  overlay.addEventListener('mousedown', function (e) {
    if (e.target === closeBtn) return;
    if (scale > 1) {
      isDragging = true;
      startX = e.clientX - translateX;
      startY = e.clientY - translateY;
      overlay.style.cursor = 'grabbing';
    }
  });

  window.addEventListener('mousemove', function (e) {
    if (!isDragging) return;
    translateX = e.clientX - startX;
    translateY = e.clientY - startY;
    applyTransform();
  });

  window.addEventListener('mouseup', function () {
    isDragging = false;
    overlay.style.cursor = scale > 1 ? 'grab' : 'zoom-out';
  });

  // ── DOUBLE CLICK RESET ──
  imgEl.addEventListener('dblclick', function () {
    if (scale > 1) resetTransform();
    else { scale = 2; applyTransform(); }
  });
})();

/* ─── INLINE VIDEO PLAYER ─────────────────────────────────────── */
(function () {
  const overlay   = document.getElementById('inlineOverlay');
  const video     = document.getElementById('inlineVideo');
  const container = document.getElementById('inlineVideoContainer');
  const vcPlay    = document.getElementById('vcPlay');
  const vcPlayIcon= document.getElementById('vcPlayIcon');
  const vcFull    = document.getElementById('vcFull');
  const vcMute    = document.getElementById('vcMute');
  const vcMuteIcon= document.getElementById('vcMuteIcon');
  const vcFill    = document.getElementById('vcFill');
  const vcThumb2  = document.getElementById('vcThumb2');
  const vcTime    = document.getElementById('vcTime');
  const vcProgressWrap = document.getElementById('vcProgressWrap');

  if (!video || !container) return;

  /* ── Icons ── */
  const ICON_PLAY  = '<polygon points="5 3 19 12 5 21 5 3"/>';
  const ICON_PAUSE = '<rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>';
  const ICON_VOL   = '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>';
  const ICON_MUTED = '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/>';

  function svgWrap(inner, extra) {
    return '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="white" ' + (extra||'') + '>' + inner + '</svg>';
  }
  function svgStroke(inner) {
    return '<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + inner + '</svg>';
  }

  /* ── Format time ── */
  function fmtTime(s) {
    if (!isFinite(s)) return '0:00';
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return m + ':' + (sec < 10 ? '0' : '') + sec;
  }

  /* ── Start play dari overlay ── */
  function startPlay() {
    overlay.classList.add('hidden');
    container.classList.add('playing');
    video.play().catch(() => {});
  }

  if (overlay) overlay.addEventListener('click', startPlay);

  /* ── Klik video: toggle play/pause ── */
  video.addEventListener('click', function () {
    if (overlay && !overlay.classList.contains('hidden')) { startPlay(); return; }
    video.paused ? video.play().catch(() => {}) : video.pause();
  });

  /* ── Play / Pause button ── */
  if (vcPlay) vcPlay.addEventListener('click', function (e) {
    e.stopPropagation();
    video.paused ? video.play().catch(() => {}) : video.pause();
  });

  video.addEventListener('play', function () {
    if (vcPlayIcon) vcPlayIcon.innerHTML = ICON_PAUSE;
    container.classList.add('playing');
  });
  video.addEventListener('pause', function () {
    if (vcPlayIcon) vcPlayIcon.innerHTML = ICON_PLAY;
  });
  video.addEventListener('ended', function () {
    if (vcPlayIcon) vcPlayIcon.innerHTML = ICON_PLAY;
    if (overlay) { overlay.classList.remove('hidden'); container.classList.remove('playing'); }
  });

  /* ── Progress ── */
  video.addEventListener('timeupdate', function () {
    if (!video.duration) return;
    const pct = (video.currentTime / video.duration) * 100;
    if (vcFill)   vcFill.style.width   = pct + '%';
    if (vcThumb2) { vcThumb2.style.left = pct + '%'; }
    if (vcTime)   vcTime.textContent = fmtTime(video.currentTime) + ' / ' + fmtTime(video.duration);
  });

  /* ── Seek ── */
  if (vcProgressWrap) {
    function seek(e) {
      const rect = vcProgressWrap.getBoundingClientRect();
      const pct  = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      video.currentTime = pct * (video.duration || 0);
    }
    let dragging = false;
    vcProgressWrap.addEventListener('mousedown',  function (e) { dragging = true; seek(e); });
    document.addEventListener('mousemove',        function (e) { if (dragging) seek(e); });
    document.addEventListener('mouseup',          function ()  { dragging = false; });
    vcProgressWrap.addEventListener('touchstart', function (e) { seek(e.touches[0]); }, { passive: true });
    vcProgressWrap.addEventListener('touchmove',  function (e) { seek(e.touches[0]); }, { passive: true });
  }

  /* ── Mute ── */
  if (vcMute) vcMute.addEventListener('click', function (e) {
    e.stopPropagation();
    video.muted = !video.muted;
    if (vcMute) vcMute.innerHTML = svgStroke(video.muted ? ICON_MUTED : ICON_VOL);
  });

  /* ── Fullscreen ── */
  if (vcFull) vcFull.addEventListener('click', function (e) {
    e.stopPropagation();
    // iOS Safari: pakai webkitEnterFullscreen langsung di video element
    if (video.webkitEnterFullscreen) {
      video.webkitEnterFullscreen();
      return;
    }
    // Android / Desktop
    const isFS =
      document.fullscreenElement ||
      document.webkitFullscreenElement ||
      document.mozFullScreenElement ||
      document.msFullscreenElement;
    if (isFS) {
      (document.exitFullscreen ||
       document.webkitExitFullscreen ||
       document.mozCancelFullScreen ||
       document.msExitFullscreen).call(document);
    } else {
      const el  = video;
      const req = el.requestFullscreen ||
                  el.webkitRequestFullscreen ||
                  el.mozRequestFullScreen ||
                  el.msRequestFullscreen;
      if (req) req.call(el);
    }
  });

  /* ── Auto hide controls setelah 3 detik saat mobile ── */
  let hideTimer;
  container.addEventListener('touchstart', function () {
    container.classList.add('controls-visible');
    clearTimeout(hideTimer);
    hideTimer = setTimeout(function () { container.classList.remove('controls-visible'); }, 3000);
  }, { passive: true });

})();
