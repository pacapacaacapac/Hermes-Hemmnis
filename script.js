

/* =========================
   PARTICLE BACKGROUND
========================= */
function createParticles(containerId, cfg) {
  cfg = Object.assign({
    ROWS: 360, COLS: 360,
    THICKNESS: Math.pow(80, 2),
    SPACING: 1.2,
    MARGIN: 200,
    COLOR: 0,
    DRAG: 0.95,
    EASE: 0.25
  }, cfg);

  var NUM = cfg.ROWS * cfg.COLS;
  var proto = { vx: 0, vy: 0, x: 0, y: 0 };
  var container, canvas, ctx, list, tog, man, mx, my, w, h;
  var eCols = cfg.COLS;

  function init() {
    container = document.getElementById(containerId);
    if (!container) return;
    canvas = document.createElement('canvas');
    ctx = canvas.getContext('2d');
    man = false; tog = true; list = [];
    var s, marginX, marginY;
    if (cfg.FILL_VIEWPORT) {
      var section = container.closest('.section-fullscreen') || container.parentElement;
      var vw = section ? section.offsetWidth  : window.innerWidth;
      var vh = section ? section.offsetHeight : window.innerHeight;
      if (!vw || !vh) { vw = window.innerWidth; vh = window.innerHeight; }
      w = canvas.width  = vw;
      h = canvas.height = vh;
      s = cfg.SPACING;
      eCols      = Math.floor(w / s);
      var eRows  = Math.floor(h / s);
      NUM        = eCols * eRows;
      marginX    = (w - eCols * s) / 2;
      marginY    = (h - eRows * s) / 2;
    } else {
      s = cfg.SPACING;
      eCols   = cfg.COLS;
      w = canvas.width  = eCols * s + cfg.MARGIN * 2;
      h = canvas.height = cfg.ROWS * s + cfg.MARGIN * 2;
      marginX = marginY = cfg.MARGIN;
    }
    container.style.marginLeft = Math.round(w * -0.5) + 'px';
    container.style.marginTop  = Math.round(h * -0.5) + 'px';
    for (var i = 0; i < NUM; i++) {
      var p = Object.create(proto);
      var r = Math.floor(i / eCols);
      var jitter = (cfg.JITTER || 0) * s;
      p.x = p.ox = marginX + s * (i % eCols) + (Math.random() - 0.5) * jitter;
      p.y = p.oy = marginY + s * r + (Math.random() - 0.5) * jitter;
      p.phase = Math.random() * Math.PI * 2;
      list[i] = p;
    }
    container.addEventListener('mousemove', function(e) {
      var bounds = container.getBoundingClientRect();
      mx = e.clientX - bounds.left;
      my = e.clientY - bounds.top;
      man = true;
    });
    container.addEventListener('touchmove', function(e) {
      e.preventDefault();
      var bounds = container.getBoundingClientRect();
      mx = e.touches[0].clientX - bounds.left;
      my = e.touches[0].clientY - bounds.top;
      man = true;
    }, { passive: false });
    container.appendChild(canvas);
  }

  let paused = false;
  function step() {
    if (paused) return;
    if (!ctx || !w || !h) { requestAnimationFrame(step); return; }
    var i, p, dx, dy, d, f, t, a, b, px, py, n, now;
    if (tog = !tog) {
      if (!man) {
        t = +new Date() * 0.001;
        if (cfg.FILL_VIEWPORT) {
          mx = w * 0.5 + (Math.cos(t * 2.1) * Math.cos(t * 0.9) * w * 0.45);
          my = h * 0.5 + (Math.sin(t * 3.2) * Math.tan(Math.sin(t * 0.8)) * h * 0.45);
        } else {
          mx = w * 1 + (Math.cos(t * 2.1) * Math.cos(t * 0.9) * w * 0.45);
          my = h * 1 + (Math.sin(t * 3.2) * Math.tan(Math.sin(t * 0.8)) * h * 0.45);
        }
      }
      for (i = 0; i < NUM; i++) {
        p = list[i];
        d = (dx = mx - p.x) * dx + (dy = my - p.y) * dy;
        f = -cfg.THICKNESS / d;
        if (d < cfg.THICKNESS) {
          t = Math.atan2(dy, dx);
          p.vx += f * Math.cos(t);
          p.vy += f * Math.sin(t);
        }
        p.x += (p.vx *= cfg.DRAG) + (p.ox - p.x) * cfg.EASE;
        p.y += (p.vy *= cfg.DRAG) + (p.oy - p.y) * cfg.EASE;
      }
    } else {
      b = (a = ctx.createImageData(w, h)).data;
      now = +new Date() * 0.001;
      for (i = 0; i < NUM; i++) {
        p = list[i];
        px = ~~p.x; py = ~~p.y;
        if (px >= 0 && py >= 0 && px < w && py < h) {
          b[n = (px + py * w) * 4] = b[n+1] = b[n+2] = cfg.COLOR;
          b[n+3] = cfg.ALPHA !== undefined ? cfg.ALPHA : 180 + Math.sin(now * 0.8 + p.phase) * 75;
        }
      }
      ctx.putImageData(a, 0, 0);
    }
    requestAnimationFrame(step);
  }

  init();
  step();
  return {
    pause()  { paused = true; },
    resume() { if (paused) { paused = false; step(); } },
  };
}

// Instanz 1 – original
const _p1 = createParticles('container', {
  ROWS: 360, COLS: 360,
  THICKNESS: Math.pow(80, 2),
  SPACING: 1.2,
  MARGIN: 200,
  COLOR: 0,
  DRAG: 0.95,
  EASE: 0.25
});

// Instanz 2 – anpassbar
const _p2 = createParticles('container-2', {
  ROWS: 360, COLS: 360,
  THICKNESS: Math.pow(80, 2),
  SPACING: 3,
  MARGIN: 200,
  COLOR: 0,
  DRAG: 0.95,
  EASE: 0.25,
  ALPHA: 255
});

// Instanz 3 – anpassbar
const _p3 = createParticles('container-3', {
  ROWS: 360, COLS: 360,
  THICKNESS: Math.pow(80, 2),
  SPACING: 2.5,
  MARGIN: 0,
  COLOR: 0,
  DRAG: 0.95,
  EASE: 0.25,
  ALPHA: 255,
  JITTER: 0.8,
  FILL_VIEWPORT: true
});

const allParticles = [_p1, _p2, _p3].filter(Boolean);

/* =========================
Bunny Net Einbindung
===========================*/

document.querySelectorAll('video[data-hls]').forEach(video => {
  const src = video.dataset.hls;
  if (Hls.isSupported()) {
    const hls = new Hls({
      maxBufferLength: 30,
      maxMaxBufferLength: 60,
      startLevel: -1,           // automatisch höchste Qualität wählen
      abrEwmaDefaultEstimate: 5000000,  // startet mit 5 Mbps Annahme
    });
    hls.loadSource(src);
    hls.attachMedia(video);

    hls.on(Hls.Events.MANIFEST_PARSED, function() {
      hls.currentLevel = hls.levels.length - 1; // höchste Qualität erzwingen
    });
  }
});

/* =========================
   BOTTOM PLAYER TOGGLE
========================= */
function stopPlayer(body) {
  const videoPlayer = body.querySelector('.video-player');
  const audioPlayer = body.querySelector('.audio-player');
  if (videoPlayer) {
    const video = document.getElementById(videoPlayer.dataset.video);
    if (video) { video.pause(); video.currentTime = 0; }
    const playBtn = videoPlayer.querySelector('.play');
    if (playBtn) playBtn.textContent = '▶';
    const bar = videoPlayer.querySelector('.progress-bar');
    if (bar) bar.style.width = '0%';
  }
  if (audioPlayer) {
    const audio = audioPlayer.querySelector('audio');
    if (audio) { audio.pause(); audio.currentTime = 0; }
    const playBtn = audioPlayer.querySelector('.play');
    if (playBtn) playBtn.textContent = '▶';
    const bar = audioPlayer.querySelector('.progress-bar');
    if (bar) bar.style.width = '0%';
  }
}

function startPlayer(body) {
  const videoPlayer = body.querySelector('.video-player');
  const audioPlayer = body.querySelector('.audio-player');
  if (videoPlayer) {
    const video = document.getElementById(videoPlayer.dataset.video);
    if (video) { video.play(); }
    const playBtn = videoPlayer.querySelector('.play');
    if (playBtn) playBtn.textContent = '❚❚';
  }
  if (audioPlayer) {
    const audio = audioPlayer.querySelector('audio');
    if (audio) { audio.play(); }
    const playBtn = audioPlayer.querySelector('.play');
    if (playBtn) playBtn.textContent = '❚❚';
  }
}

function toggleBottomPlayer(id, btn) {
  const body = document.getElementById(id);
  if (!btn.dataset.label) {
    btn.dataset.label = btn.textContent;
    btn.style.width = btn.offsetWidth + 'px';
  }

  // Alle anderen Player schließen und stoppen
  document.querySelectorAll('.bottom-player-body.open').forEach(other => {
    if (other !== body) {
      other.classList.remove('open');
      stopPlayer(other);
      const otherBtn = other.closest('.bottom-player-wrap').querySelector('.bottom-player-toggle');
      if (otherBtn && otherBtn.dataset.label) otherBtn.textContent = otherBtn.dataset.label;
    }
  });

  const isOpen = body.classList.toggle('open');
  btn.textContent = isOpen ? 'CLOSE' : btn.dataset.label;

  if (isOpen) {
    startPlayer(body);
  } else {
    stopPlayer(body);
  }
}

/* =========================
   SIDEBAR MOBILE TOGGLE
========================= */
const sidebarEl = document.querySelector('.sidebar');
const sidebarToggleBtn = document.getElementById('sidebar-toggle');

function collapseSidebar() {
  if (window.innerWidth > 900) return;
  sidebarEl.classList.add('collapsed');
  const label = document.getElementById('sidebar-toggle-label');
  if (label) label.textContent = '[open menu]';
}

function expandSidebar() {
  sidebarEl.classList.remove('collapsed');
  const label = document.getElementById('sidebar-toggle-label');
  if (label) label.textContent = '[close menu]';
}

if (sidebarToggleBtn) {
  sidebarToggleBtn.addEventListener('click', () => {
    sidebarEl.classList.contains('collapsed') ? expandSidebar() : collapseSidebar();
  });
}

const sidebarBrandLabel = document.querySelector('.sidebar-brand-label');
if (sidebarBrandLabel) {
  sidebarBrandLabel.addEventListener('click', (e) => {
    e.stopPropagation();
    if (window.innerWidth > 900) return;
    if (!sidebarEl.classList.contains('hermes-animate')) {
      sidebarEl.classList.add('hermes-animate');
      setTimeout(() => sidebarEl.classList.remove('hermes-animate'), 4500);
    }
  });
}

if (window.innerWidth <= 900) {
  collapseSidebar();
}

const sidebarH1 = document.querySelector('.sidebar h1');
if (sidebarH1) {
  sidebarH1.addEventListener('click', () => showPage(0));
}

/* =========================
   VARIABLEN
========================= */
const navLinks = document.querySelectorAll('.nav-link');
const contentEl = document.querySelector('.content');
const pages = Array.from(contentEl.children);

let currentRelease  = 'oap';
let currentPerson   = null;
let currentPageIdx  = 0;
let wheelLocked     = false;
let wheelAccum      = 0;
let wheelResetTimer = null;

/* =========================
   CROSSFADE: SEITE WECHSELN
========================= */
function showPage(idx) {
  idx = Math.max(0, Math.min(idx, pages.length - 1));
  if (idx === currentPageIdx && pages[currentPageIdx].classList.contains('active')) return;

  const outgoing = pages[currentPageIdx];
  const incoming = pages[idx];

  // Particle-Player und Animationen pausieren beim Verlassen
  const particleAudio = document.getElementById('particle-audio');
  const particleWrap2 = document.querySelector('#work')?.closest('.section-wrap');
  if (particleAudio && outgoing === particleWrap2 && !particleAudio.paused) {
    particleAudio.pause();
    const pBtn = document.getElementById('particle-play-btn');
    if (pBtn) pBtn.textContent = '▶';
  }
  if (outgoing === particleWrap2) allParticles.forEach(p => p.pause());
  if (incoming === particleWrap2) allParticles.forEach(p => p.resume());

  // Alles in der verlassenen Section zuklappen
  outgoing.querySelectorAll('.overlay-header-body.open').forEach(el => {
    el.classList.remove('open');
    el.closest('.section-fullscreen')?.querySelector('.overlay-header')?.classList.remove('open');
  });
  outgoing.querySelectorAll('.release-body.open').forEach(el => {
    el.classList.remove('open');
    const id = el.id.replace('body-', '');
    const btn = document.getElementById('btn-' + id);
    if (btn) btn.textContent = '+';
  });
  outgoing.querySelectorAll('.about-body.open').forEach(el => {
    el.classList.remove('open');
    const id = el.id.replace('body-', '');
    const btn = document.getElementById('btn-' + id);
    if (btn) btn.textContent = '+';
  });

  // Scroll-Transition nur zwischen Dates und Particle-Pattern
  const datesWrap    = document.querySelector('#dates-all')?.closest('.section-wrap');
  const particleWrap = document.querySelector('#work')?.closest('.section-wrap');
  const isScrollTrans = (outgoing === datesWrap && incoming === particleWrap) ||
                        (outgoing === particleWrap && incoming === datesWrap);

  if (isScrollTrans) {
    const dir = idx > currentPageIdx ? 1 : -1;
    outgoing.classList.remove('active');
    Object.assign(outgoing.style, { opacity: '1', zIndex: '1' });
    Object.assign(incoming.style, {
      opacity: '1', zIndex: '2', pointerEvents: 'none',
      transform: `translateY(${dir > 0 ? '100%' : '-100%'})`,
      transition: 'none',
    });
    requestAnimationFrame(() => requestAnimationFrame(() => {
      Object.assign(outgoing.style, {
        transform: `translateY(${dir > 0 ? '-100%' : '100%'})`,
        transition: 'transform 0.7s ease',
      });
      Object.assign(incoming.style, {
        transform: 'translateY(0)',
        transition: 'transform 0.7s ease',
        pointerEvents: 'auto',
      });
      setTimeout(() => {
        incoming.classList.add('active');
        outgoing.style.cssText = '';
        incoming.style.cssText = '';
      }, 710);
    }));
  } else {
    // Normaler Crossfade
    outgoing.classList.remove('active');
    outgoing.classList.add('leaving');
    incoming.classList.add('active');
    setTimeout(() => outgoing.classList.remove('leaving'), 700);
  }

  currentPageIdx = idx;

  // Sidebar-Aktivierung
  const section = incoming.querySelector('section[id]') || incoming;
  const id = section.id;
  document.body.classList.toggle('about-page-active', id === 'about');
  navLinks.forEach(l => {
    l.closest('.tree-item').classList.remove('active');
    l.closest('.tree-item').classList.remove('person-selected');
    l.closest('.tree-item').classList.remove('release-selected');
  });
  if (id === 'releases') {
    document.querySelectorAll('.nav-link[href="#releases"]').forEach(l =>
      l.closest('.tree-item').classList.add('active'));
  } else if (id === 'about') {
    document.querySelectorAll('.nav-link[href="#about"]').forEach(l =>
      l.closest('.tree-item').classList.add('active'));
  } else {
    const activeLink = document.querySelector(`.nav-link[href="#${id}"]`);
    if (activeLink) activeLink.closest('.tree-item').classList.add('active');
  }
}

// Mausrad-Navigation
let datesTopConfirmed    = false;
let datesBottomConfirmed = false;
contentEl.addEventListener('wheel', e => {
  const list = document.querySelector('.dates-all-list');
  if (list && list.contains(e.target)) {
    const atTop    = list.scrollTop <= 0;
    const atBottom = list.scrollTop + list.clientHeight >= list.scrollHeight - 1;
    if (e.deltaY > 0 && !atBottom) { datesTopConfirmed = false; datesBottomConfirmed = false; return; }
    if (e.deltaY < 0 && !atTop)    { datesTopConfirmed = false; datesBottomConfirmed = false; return; }
    if (e.deltaY < 0 && atTop) {
      if (!datesTopConfirmed) { datesTopConfirmed = true; return; }
      datesTopConfirmed = false;
    }
    if (e.deltaY > 0 && atBottom) {
      if (!datesBottomConfirmed) { datesBottomConfirmed = true; return; }
      datesBottomConfirmed = false;
    }
  }
  e.preventDefault();
  if (wheelLocked) return;

  clearTimeout(wheelResetTimer);
  wheelAccum += e.deltaY;
  wheelResetTimer = setTimeout(() => { wheelAccum = 0; }, 200);
  if (Math.abs(wheelAccum) < 50) return;

  const dir = wheelAccum > 0 ? 1 : -1;
  wheelAccum = 0;
  clearTimeout(wheelResetTimer);

  wheelLocked = true;
  collapseSidebar();
  showPage(currentPageIdx + dir);
  setTimeout(() => { wheelLocked = false; }, 1100);
}, { passive: false });

// Pfeil-Tasten-Navigation
document.addEventListener('keydown', e => {
  if (e.key === 'ArrowDown' || e.key === 'ArrowRight') showPage(currentPageIdx + 1);
  if (e.key === 'ArrowUp'   || e.key === 'ArrowLeft')  showPage(currentPageIdx - 1);
});

// Touch/Swipe-Navigation
let touchStartX = 0;
let touchStartY = 0;

contentEl.addEventListener('touchstart', e => {
  touchStartX = e.touches[0].clientX;
  touchStartY = e.touches[0].clientY;
}, { passive: true });

contentEl.addEventListener('touchend', e => {
  const dx = touchStartX - e.changedTouches[0].clientX;
  const dy = touchStartY - e.changedTouches[0].clientY;
  // Nur vertikale Swipes auswerten (mind. 50px, mehr vertikal als horizontal)
  if (Math.abs(dy) < 50 || Math.abs(dy) < Math.abs(dx)) return;
  if (wheelLocked) return;
  wheelLocked = true;
  collapseSidebar();
  showPage(dy > 0 ? currentPageIdx + 1 : currentPageIdx - 1);
  setTimeout(() => { wheelLocked = false; }, 900);
}, { passive: true });

/* =========================
   NAVIGATION: CLICK → CROSSFADE
========================= */
navLinks.forEach(link => {
  link.addEventListener('click', function(e) {
    e.preventDefault();
    const href = this.getAttribute('href').replace('#', '');
    const target = document.getElementById(href);
    if (target) {
      const page = target.closest('.section-wrap') || target;
      const idx = pages.indexOf(page);
      if (idx !== -1) { showPage(idx); collapseSidebar(); }
    }
    const scrollTo = this.dataset.scrollTo;
    if (scrollTo) {
      const scrollTarget = document.getElementById(scrollTo);
      if (scrollTarget) {
        setTimeout(() => {
          const list = scrollTarget.closest('.dates-all-list');
          if (list) {
            const firstLabel = list.querySelector('.dates-all-label');
            const offset = firstLabel ? firstLabel.offsetTop : 0;
            list.scrollTop = scrollTarget.offsetTop - offset;
          }
        }, 50);
      }
    } else if (href === 'dates-all') {
      setTimeout(() => {
        const list = document.querySelector('#dates-all .dates-all-list');
        if (list) list.scrollTop = 0;
      }, 50);
    }
    const release = this.dataset.release;
    if (release === '1') setRelease('oap');
    if (release === '2') setRelease('noch');
    if (release) {
      document.querySelectorAll('.tree-item.release-selected').forEach(el => el.classList.remove('release-selected'));
      this.closest('.tree-item').classList.add('release-selected');
    }

    const person = this.dataset.person;
    if (person) handleAbout(person);

  });
});

/* =========================
   TOGGLE INFO BOX
========================= */
document.querySelectorAll('.toggle-info').forEach(btn => {
  btn.addEventListener('click', () => {
    const more = btn.previousElementSibling.querySelector('.info-more');
    if (!more) return;
    more.classList.toggle('open');
    btn.textContent = more.classList.contains('open') ? 'weniger' : 'mehr';
  });
});

/* =========================
   AUDIO PLAYER
========================= */
document.querySelectorAll('.audio-player').forEach(player => {
  const audio = player.querySelector('audio');
  const playBtn = player.querySelector('.play');
  const progressBar = player.querySelector('.progress-bar');
  const progress = player.querySelector('.progress');

  if (!audio || !playBtn) return;

  playBtn.addEventListener('click', () => {
    if (audio.paused) { audio.play(); playBtn.textContent = '❚❚'; }
    else { audio.pause(); playBtn.textContent = '▶'; }
  });

  audio.addEventListener('timeupdate', () => {
    if (audio.duration) {
      progressBar.style.width = (audio.currentTime / audio.duration * 100) + '%';
    }
  });

  progress.addEventListener('click', e => {
    const rect = progress.getBoundingClientRect();
    audio.currentTime = ((e.clientX - rect.left) / rect.width) * audio.duration;
  });
});

/* =========================
   CAROUSEL
========================= */
/* =========================
   CAROUSEL
========================= */
document.querySelectorAll('.carousel img, .intro-carousel-track img').forEach(img => {
  const pre = new Image();
  pre.src = img.src;
});

document.querySelectorAll('.carousel').forEach(carousel => {
  const track = carousel.querySelector('.carousel-track');
  const imgs = Array.from(track.querySelectorAll('img'));
  const leftZone  = carousel.querySelector('.carousel-left');
  const rightZone = carousel.querySelector('.carousel-right');

  if (!imgs.length) return;

  const total = imgs.length;

  const firstClone = imgs[0].cloneNode(true);
  const lastClone  = imgs[imgs.length - 1].cloneNode(true);
  track.appendChild(firstClone);
  track.insertBefore(lastClone, track.firstChild);

  let index = 1;
  track.style.transform = `translateX(-${index * 100}%)`;

  const counter = document.createElement('div');
  counter.className = 'carousel-counter';
  carousel.appendChild(counter);

  function getDisplayIndex() {
    const allCount = track.querySelectorAll('img').length;
    if (index <= 0) return total;
    if (index >= allCount - 1) return 1;
    return index;
  }

  function updateCounter() {
    counter.textContent = `${getDisplayIndex()}/${total}`;
  }

  function goTo(i) {
    track.style.transition = 'transform 0.4s ease';
    track.style.transform = `translateX(-${i * 100}%)`;
    updateCounter();
  }

  rightZone.addEventListener('click', () => goTo(++index));
  leftZone.addEventListener('click',  () => goTo(--index));

  let swipeStartX = 0;
  carousel.addEventListener('touchstart', e => {
    swipeStartX = e.touches[0].clientX;
  }, { passive: true });
  carousel.addEventListener('touchend', e => {
    const dx = swipeStartX - e.changedTouches[0].clientX;
    if (Math.abs(dx) < 40) return;
    if (dx > 0) goTo(++index);
    else goTo(--index);
  }, { passive: true });

  track.addEventListener('transitionend', () => {
    const all = track.querySelectorAll('img');
    if (index >= all.length - 1) {
      track.style.transition = 'none';
      index = 1;
      track.style.transform = `translateX(-${index * 100}%)`;
    }
    if (index <= 0) {
      track.style.transition = 'none';
      index = all.length - 2;
      track.style.transform = `translateX(-${index * 100}%)`;
    }
    updateCounter();
  });

  updateCounter();
});

/* =========================
   VIDEO PLAYER
========================= */
document.querySelectorAll('.video-player').forEach(player => {
  const video = document.getElementById(player.dataset.video);
  const playBtn = player.querySelector('.play');
  const progressBar = player.querySelector('.progress-bar');
  const progress = player.querySelector('.progress');

  if (!video || !playBtn) return;

  playBtn.addEventListener('click', () => {
    if (video.paused) { video.play(); playBtn.textContent = '❚❚'; }
    else { video.pause(); playBtn.textContent = '▶'; }
  });

  video.addEventListener('timeupdate', () => {
    if (video.duration) {
      progressBar.style.width = (video.currentTime / video.duration * 100) + '%';
    }
  });

  progress.addEventListener('click', e => {
    const rect = progress.getBoundingClientRect();
    video.currentTime = ((e.clientX - rect.left) / rect.width) * video.duration;
  });
});


// ── Releases Section Logic ──────────────────────────────────────

function setRelease(id) {
  currentRelease = id;
  const bgOap  = document.getElementById('bg-oap');
  const bgNoch = document.getElementById('bg-noch');
  const cassOap  = document.getElementById('cass-oap');
  const cassNoch = document.getElementById('cass-noch');
  const creditNoch = document.getElementById('credit-noch');

  if (id === 'oap') {
    bgOap.style.opacity  = '1';
    bgNoch.style.opacity = '0';
    cassOap.style.zIndex     = '10';
    cassOap.style.transform  = 'scale(1.0)';
    cassNoch.style.zIndex    = '5';
    cassNoch.style.transform = 'scale(1)';
    if (creditNoch) creditNoch.style.opacity = '0';
  } else {
    bgOap.style.opacity  = '0';
    bgNoch.style.opacity = '1';
    cassNoch.style.zIndex    = '10';
    cassNoch.style.transform = 'translateX(-10px) scale(1)';
    cassOap.style.zIndex     = '5';
    cassOap.style.transform  = 'scale(1) translateX(5px)';
    if (creditNoch) creditNoch.style.opacity = '1';
  }
}

function handleHeader(id) {
  const body = document.getElementById('body-' + id);
  const btn  = document.getElementById('btn-' + id);
  const isOpen = body.classList.contains('open');

  // Alle schließen
  document.querySelectorAll('.release-body').forEach(b => b.classList.remove('open'));
  document.querySelectorAll('.toggle-btn').forEach(b => b.textContent = '+');

  // Angeklicktes öffnen, falls es vorher zu war
  if (!isOpen) {
    body.classList.add('open');
    btn.textContent = '-';
  }

  // Release immer aktivieren (auch beim Zuklappen bleibt das aktive Release)
  setRelease(id);
}

// Initialzustand
setRelease('oap');
showPage(0);

// Pixel-Cache für Kassetten-Bilder
const pixelCache = new WeakMap();

function getCanvas(img) {
  if (pixelCache.has(img)) return pixelCache.get(img);
  try {
    const c = document.createElement('canvas');
    c.width = img.naturalWidth;
    c.height = img.naturalHeight;
    c.getContext('2d').drawImage(img, 0, 0);
    c.getContext('2d').getImageData(0, 0, 1, 1); // taint-check
    pixelCache.set(img, c);
    return c;
  } catch (_) {
    pixelCache.set(img, null);
    return null;
  }
}

function alphaAt(img, clientX, clientY) {
  const rect = img.getBoundingClientRect();
  if (clientX < rect.left || clientX > rect.right ||
      clientY < rect.top  || clientY > rect.bottom) return 0;
  const c = getCanvas(img);
  if (!c) return 255; // kein Canvas → als opak behandeln
  const x = Math.floor((clientX - rect.left) / rect.width  * c.width);
  const y = Math.floor((clientY - rect.top)  / rect.height * c.height);
  try { return c.getContext('2d').getImageData(x, y, 1, 1).data[3]; }
  catch (_) { return 255; }
}

// Ein gemeinsamer Listener auf dem Container —
// prüft beide Bilder und aktiviert die Kassette mit dem opakenPixel
document.querySelector('.cassettes-container').addEventListener('click', function(e) {
  const imgOap  = document.querySelector('#cass-oap img');
  const imgNoch = document.querySelector('#cass-noch img');
  const aOap  = alphaAt(imgOap,  e.clientX, e.clientY);
  const aNoch = alphaAt(imgNoch, e.clientX, e.clientY);

  if (aOap === 0 && aNoch === 0) return; // transparente Fläche

  let winner;
  if (aOap > 0 && aNoch > 0) {
    // Überlappung: Kassette mit höherem z-index gewinnt
    const zOap  = parseInt(document.getElementById('cass-oap').style.zIndex)  || 0;
    const zNoch = parseInt(document.getElementById('cass-noch').style.zIndex) || 0;
    winner = zOap >= zNoch ? 'oap' : 'noch';
  } else {
    winner = aOap > 0 ? 'oap' : 'noch';
  }

  setRelease(winner);
  const other = winner === 'oap' ? 'noch' : 'oap';
  const body = document.getElementById('body-' + other);
  if (body.classList.contains('open')) {
    body.classList.remove('open');
    document.getElementById('btn-' + other).textContent = '+';
  }
});

// Cursor nur über opaken Kassetten-Pixeln als Pointer
document.querySelector('.cassettes-container').addEventListener('mousemove', function(e) {
  const imgOap  = document.querySelector('#cass-oap img');
  const imgNoch = document.querySelector('#cass-noch img');
  const hit = alphaAt(imgOap, e.clientX, e.clientY) > 0 ||
              alphaAt(imgNoch, e.clientX, e.clientY) > 0;
  this.style.cursor = hit ? 'pointer' : 'default';
});

// ── Hover-Previews (Position & Größe via CSS, JS nur .visible) ───
[
  ['arrow-schi',    'preview-schi'],
  ['view-longing',  'preview-longing'],
  ['dot-skateland', 'preview-skateland'],
  ['dot-organ',     'preview-organ'],
  ['more-frank',    'preview-frank'],
].forEach(([triggerId, previewId]) => {
  const trigger = document.getElementById(triggerId);
  const preview = document.getElementById(previewId);
  if (!trigger || !preview) return;
  trigger.addEventListener('mouseenter', () => preview.classList.add('visible'));
  trigger.addEventListener('mouseleave', () => preview.classList.remove('visible'));
});

// ── Fullscreen-Preview auf Mobile (Touch) ───────────────────────
if (window.innerWidth <= 900) {
  const fsCloseBtn = document.createElement('button');
  fsCloseBtn.className = 'preview-fullscreen-close';
  fsCloseBtn.textContent = '[close]';
  document.body.appendChild(fsCloseBtn);

  let fsOverlay = null;

  function openPreviewFullscreen(imgSrc) {
    if (fsOverlay) fsOverlay.remove();
    fsOverlay = document.createElement('div');
    fsOverlay.className = 'preview-fs-overlay';
    const track = document.createElement('div');
    track.className = 'preview-fs-track';
    const img1 = document.createElement('img');
    img1.src = imgSrc;
    img1.className = 'preview-fs-layer';
    const img2 = document.createElement('img');
    img2.src = imgSrc;
    img2.className = 'preview-fs-layer';
    track.appendChild(img1);
    track.appendChild(img2);
    fsOverlay.appendChild(track);
    document.body.appendChild(fsOverlay);
    fsCloseBtn.classList.add('visible');
  }

  function closePreviewFullscreen() {
    if (fsOverlay) { fsOverlay.remove(); fsOverlay = null; }
    fsCloseBtn.classList.remove('visible');
  }

  fsCloseBtn.addEventListener('click', closePreviewFullscreen);

  document.addEventListener('touchstart', (e) => {
    if (!fsOverlay) return;
    if (fsOverlay.contains(e.target) || fsCloseBtn.contains(e.target)) return;
    closePreviewFullscreen();
  }, { passive: true });

  [
    ['arrow-schi',    'preview-schi'],
    ['view-longing',  'preview-longing'],
    ['dot-skateland', 'preview-skateland'],
    ['dot-organ',     'preview-organ'],
    ['more-frank',    'preview-frank'],
  ].forEach(([triggerId, previewId]) => {
    const trigger = document.getElementById(triggerId);
    const preview = document.getElementById(previewId);
    if (!trigger || !preview) return;
    trigger.addEventListener('touchend', (e) => {
      e.preventDefault();
      const img = preview.querySelector('img');
      if (img) openPreviewFullscreen(img.src);
    });
  });
}

// ── About Section Logic ──────────────────────────────────────────

function handleAbout(id) {
  const body = document.getElementById('body-' + id);
  if (!body) return;
  const isOpen = body.classList.contains('open');

  // Alle schließen
  document.querySelectorAll('.about-body').forEach(b => {
    b.classList.remove('open');
    b.style.removeProperty('max-height');
  });

  // Sidebar-Aktivierung zurücksetzen
  document.querySelectorAll('.nav-link[data-person]').forEach(l => {
    l.closest('.tree-item').classList.remove('active');
    l.closest('.tree-item').classList.remove('person-selected');
  });

  // Angeklicktes öffnen, falls es vorher zu war
  if (!isOpen) {
    body.classList.add('open');
    currentPerson = id;
    const sidebarLink = document.querySelector(`.nav-link[data-person="${id}"]`);
    if (sidebarLink) {
      sidebarLink.closest('.tree-item').classList.add('active');
      sidebarLink.closest('.tree-item').classList.add('person-selected');
    }
  } else {
    currentPerson = null;
  }
}

document.addEventListener('touchstart', (e) => {
  if (window.innerWidth > 900) return;
  const openAboutBody = document.querySelector('.about-body.open');
  if (!openAboutBody) return;
  if (openAboutBody.contains(e.target)) return;
  if (e.target.closest('.about-name-triggers')) return;
  document.querySelectorAll('.about-body').forEach(b => {
    b.classList.remove('open');
    b.style.removeProperty('max-height');
  });
}, { passive: true });

/* =========================
   OVERLAY HEADER TOGGLE
========================= */
function toggleHeader(el) {
  const section = el.closest('.section-fullscreen');
  const body   = section.querySelector('.overlay-header-body');
  const header = section.querySelector('.overlay-header');
  const isOpen = body.classList.contains('open');
  body.classList.toggle('open', !isOpen);
  header.classList.toggle('open', !isOpen);
  const icon = section.querySelector('.overlay-toggle-btn .overlay-toggle-icon');
  if (icon) icon.textContent = isOpen ? '+' : '−';
}

/* =========================
   INTRO CAROUSEL OVERLAY
========================= */
(function () {
  const overlay = document.getElementById('intro-carousel-overlay');
  const track   = overlay.querySelector('.intro-carousel-track');
  const left    = overlay.querySelector('.intro-carousel-left');
  const right   = overlay.querySelector('.intro-carousel-right');
  const imgs    = Array.from(track.querySelectorAll('img'));

  const total = imgs.length;

  const first = imgs[0].cloneNode(true);
  const last  = imgs[imgs.length - 1].cloneNode(true);
  track.appendChild(first);
  track.insertBefore(last, track.firstChild);

  let idx = 1;
  track.style.transform = `translateX(-${idx * 100}%)`;

  const counter = document.createElement('div');
  counter.className = 'intro-carousel-counter';
  overlay.appendChild(counter);

  function getDisplayIndex() {
    const allCount = track.querySelectorAll('img').length;
    if (idx <= 0) return total;
    if (idx >= allCount - 1) return 1;
    return idx;
  }

  function updateCounter() {
    counter.textContent = `${getDisplayIndex()}/${total}`;
  }

  function goTo(i) {
    track.style.transition = 'transform 0.4s ease';
    track.style.transform  = `translateX(-${i * 100}%)`;
    updateCounter();
  }

  right.addEventListener('click', () => goTo(++idx));
  left.addEventListener('click',  () => goTo(--idx));

  let swipeStartX = 0;
  overlay.addEventListener('touchstart', e => {
    swipeStartX = e.touches[0].clientX;
  }, { passive: true });
  overlay.addEventListener('touchend', e => {
    const dx = swipeStartX - e.changedTouches[0].clientX;
    if (Math.abs(dx) < 40) return;
    if (dx > 0) goTo(++idx);
    else goTo(--idx);
  }, { passive: true });

  track.addEventListener('transitionend', () => {
    const all = track.querySelectorAll('img');
    if (idx >= all.length - 1) { track.style.transition = 'none'; idx = 1; track.style.transform = `translateX(-${idx * 100}%)`; }
    if (idx <= 0)               { track.style.transition = 'none'; idx = all.length - 2; track.style.transform = `translateX(-${idx * 100}%)`; }
    updateCounter();
  });

  updateCounter();
})();

function openIntroCarousel() {
  document.getElementById('intro-carousel-overlay').classList.add('open');
}

function closeIntroCarousel() {
  document.getElementById('intro-carousel-overlay').classList.remove('open');
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeIntroCarousel();
});

contentEl.addEventListener('wheel', () => closeIntroCarousel(), { passive: true });
document.getElementById('intro-carousel-overlay').addEventListener('wheel', e => {
  if (e.deltaY <= 0) return;
  // Snap page 1 into view instantly while the overlay still covers the screen,
  // so there is no flash of page 0 as the overlay fades out.
  pages.forEach(p => p.classList.remove('active', 'leaving'));
  pages[1].style.transition = 'none';
  pages[1].classList.add('active');
  requestAnimationFrame(() => { pages[1].style.transition = ''; });
  currentPageIdx = 1;
  wheelLocked = true;
  setTimeout(() => { wheelLocked = false; }, 900);
  navLinks.forEach(l => l.closest('.tree-item').classList.remove('active'));
  const lnk = document.querySelector('.nav-link[href="#work-1"]');
  if (lnk) lnk.closest('.tree-item').classList.add('active');
  closeIntroCarousel();
}, { passive: true });

document.querySelector('.sidebar').addEventListener('click', e => {
  if (!e.target.closest('.intro')) closeIntroCarousel();
});

/* =========================
   PARTICLE PLAYER
========================= */
const particleTracks = [
  { title: 'Track Title 1', src: './audio/track1.mp3' },
  { title: 'Track Title 2', src: './audio/track2.mp3' },
  { title: 'Track Title 3', src: './audio/track3.mp3' },
];

(function () {
  const audio   = document.getElementById('particle-audio');
  const btn     = document.getElementById('particle-play-btn');
  const titleEl = document.getElementById('particle-track-title');
  const player  = document.getElementById('particle-player');
  if (!audio || !btn || !titleEl || !particleTracks.length) return;

  let lastIdx = -1;

  function pickRandom() {
    if (particleTracks.length === 1) return 0;
    let idx;
    do { idx = Math.floor(Math.random() * particleTracks.length); } while (idx === lastIdx);
    return idx;
  }

  function playRandom() {
    const idx = pickRandom();
    lastIdx = idx;
    const track = particleTracks[idx];
    audio.src = track.src;
    audio.play();
    titleEl.textContent = track.title;
    titleEl.classList.add('visible');
    btn.textContent = '❚❚';
  }

  player.addEventListener('click', () => {
    if (audio.paused) {
      playRandom();
    } else {
      audio.pause();
      btn.textContent = '▶';
    }
  });

  audio.addEventListener('ended', playRandom);
})();

/* =========================
   IMPRINT OVERLAY
========================= */
function openImprint() {
  document.getElementById('imprint-overlay').classList.add('open');
}

function closeImprint() {
  document.getElementById('imprint-overlay').classList.remove('open');
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeImprint();
});

document.addEventListener('click', e => {
  const overlay = document.getElementById('imprint-overlay');
  if (!overlay.classList.contains('open')) return;
  if (overlay.contains(e.target)) return;
  if (e.target.closest('.imprint-link')) return;
  closeImprint();
});

/* =========================
   DATES HOVER BACKGROUNDS
========================= */
document.querySelectorAll('.dates-box[data-bg]').forEach(box => {
  const img = document.createElement('img');
  img.src = box.dataset.bg;
  img.className = 'bg-media bg-dates-hover';
  box.closest('.section-fullscreen').appendChild(img);

  box.addEventListener('mouseenter', () => img.style.opacity = '1');
  box.addEventListener('mouseleave', () => img.style.opacity = '0');
});

document.querySelectorAll('.dates-all-item[data-bg]').forEach(item => {
  const section = item.closest('.dates-all-section');
  const img = document.createElement('img');
  img.src = item.dataset.bg;
  img.className = 'bg-media bg-dates-hover';
  section.appendChild(img);

  const creditText = item.dataset.credit;
  const creditEl = creditText ? document.createElement('div') : null;
  if (creditEl) {
    creditEl.className = 'dates-bg-credit';
    creditEl.textContent = creditText;
    section.appendChild(creditEl);
  }

  function showBg() {
    img.style.opacity = '1';
    if (creditEl) creditEl.classList.add('visible');
  }
  function hideBg() {
    img.style.opacity = '0';
    if (creditEl) creditEl.classList.remove('visible');
  }

  if (section.classList.contains('dates-all-v2-section')) {
    const dot = item.querySelector('.dates-dot');
    if (dot) {
      dot.addEventListener('mouseenter', showBg);
      dot.addEventListener('mouseleave', hideBg);
    }
  } else {
    item.querySelectorAll('span').forEach(span => {
      span.addEventListener('mouseenter', showBg);
      span.addEventListener('mouseleave', e => {
        if (!item.contains(e.relatedTarget)) hideBg();
      });
    });
  }
});

/* =========================
   ABOUT HOVER ZONES
========================= */
(function () {
  const aboutEl  = document.getElementById('about');
  const bodyTill = document.getElementById('body-till');
  const bodyLenn = document.getElementById('body-lennart');
  if (!aboutEl || !bodyTill || !bodyLenn) return;

  const navTill = document.querySelector('.nav-link[data-person="till"]');
  const navLenn = document.querySelector('.nav-link[data-person="lennart"]');

  function forceClose(b) {
    b.classList.remove('open');
    b.style.removeProperty('max-height');
    document.querySelectorAll('.nav-link[data-person]').forEach(l => {
      if (document.getElementById('body-' + l.dataset.person) === b)
        l.closest('.tree-item').classList.remove('active', 'person-selected');
    });
  }
  function openBody(b) {
    [bodyTill, bodyLenn].forEach(other => { if (other !== b) forceClose(other); });
    b.style.setProperty('max-height', '400px');
  }
  function closeBody(b) { if (!b.classList.contains('open')) b.style.removeProperty('max-height'); }

  function setDot(person) {
    if (navTill) navTill.classList.toggle('person-active', person === 'till');
    if (navLenn) navLenn.classList.toggle('person-active', person === 'lennart');
  }

  let active = null;

  document.addEventListener('mousemove', e => {
    if (window.innerWidth <= 900) return;
    if (!aboutEl.classList.contains('active')) return;

    const rect = aboutEl.getBoundingClientRect();
    const rx = (e.clientX - rect.left) / rect.width;
    const ry = (e.clientY - rect.top)  / rect.height;

    const inTill    = ry >= 0.5 && rx >= 0.25 && rx <= 0.45;
    const inLennart = ry >= 0.5 && rx >= 0.60 && rx <= 0.75;

    const side = inTill ? 'till' : inLennart ? 'lennart' : null;
    if (side === active) return;
    active = side;
    setDot(side);
    if (side === 'till')         { openBody(bodyTill); closeBody(bodyLenn); }
    else if (side === 'lennart') { openBody(bodyLenn); closeBody(bodyTill); }
    else                         { closeBody(bodyTill); closeBody(bodyLenn); }
  });
})();

/* =========================
   MENU-TITLE-BOX NAVIGATION
========================= */
document.querySelectorAll('.menu-title-box[data-nav]').forEach(box => {
  box.addEventListener('click', () => {
    // Alles einklappen
    document.querySelectorAll('.release-body.open').forEach(b => {
      b.classList.remove('open');
      const id = b.id.replace('body-', '');
      const btn = document.getElementById('btn-' + id);
      if (btn) btn.textContent = '+';
    });
    document.querySelectorAll('.about-body.open').forEach(b => {
      b.classList.remove('open');
      const id = b.id.replace('body-', '');
      const btn = document.getElementById('btn-' + id);
      if (btn) btn.textContent = '+';
    });
    document.querySelectorAll('.overlay-header-body.open').forEach(b => {
      b.classList.remove('open');
      b.closest('.section-fullscreen')?.querySelector('.overlay-header')?.classList.remove('open');
    });
    currentPerson = null;

    // Navigieren
    const targetId = box.dataset.nav;
    const target = document.getElementById(targetId);
    if (target) {
      const page = target.closest('.section-wrap') || target;
      const idx = pages.indexOf(page);
      if (idx !== -1) { showPage(idx); collapseSidebar(); }
    }
    if (targetId === 'dates-all') {
      setTimeout(() => {
        const list = document.querySelector('#dates-all .dates-all-list');
        if (list) list.scrollTop = 0;
      }, 50);
    }
  });
});


