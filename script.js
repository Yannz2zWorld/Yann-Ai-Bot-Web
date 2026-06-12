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
