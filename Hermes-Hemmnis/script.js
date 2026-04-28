

/* =========================
   PARTICLE BACKGROUND
========================= */
var NUM_PARTICLES = ( ( ROWS = 360 ) * ( COLS = 360 ) ),
    THICKNESS = Math.pow( 80, 2 ),
    SPACING = 1.2,
    MARGIN = 200,
    COLOR = 0,
    DRAG = 0.95,
    EASE = 0.25,
    container,
    particle,
    canvas,
    mouse,
    stats,
    list,
    ctx,
    tog,
    man,
    dx, dy,
    mx, my,
    d, t, f,
    a, b,
    i, n,
    w, h,
    p, s,
    r, c
    ;

particle = {
  vx: 0,
  vy: 0,
  x: 0,
  y: 0
};

function init() {
  container = document.getElementById( 'container' );
  canvas = document.createElement( 'canvas' );

  ctx = canvas.getContext( '2d' );
  man = false;
  tog = true;

  list = [];

  w = canvas.width  = COLS * SPACING + MARGIN * 2;
  h = canvas.height = ROWS * SPACING + MARGIN * 2;

  container.style.marginLeft = Math.round( w * -0.5 ) + 'px';
  container.style.marginTop  = Math.round( h * -0.5 ) + 'px';

  for ( i = 0; i < NUM_PARTICLES; i++ ) {
    p = Object.create( particle );
    s = ( i % COLS ) / COLS;
    r = Math.floor( i / COLS );
    n = Math.max( 0, Math.round(
      ( 117
        - Math.sin( s * Math.PI * 2.3 ) * 50
        - Math.sin( s * Math.PI * 5.1 ) * 25
        - Math.sin( s * Math.PI * 11.7 ) * 12
        - Math.sin( s * Math.PI * 0.7 ) * 30
      ) / ( SPACING * 2 )
    ) );
    p.x = p.ox = MARGIN + SPACING * ( i % COLS );
    p.y = p.oy = r < n ? -MARGIN : MARGIN + SPACING * r;
    p.phase = Math.random() * Math.PI * 2;
    list[i] = p;
  }

  container.addEventListener( 'mousemove', function(e) {
    bounds = container.getBoundingClientRect();
    mx = e.clientX - bounds.left;
    my = e.clientY - bounds.top;
    man = true;
  });

  if ( typeof Stats === 'function' ) {
    document.body.appendChild( ( stats = new Stats() ).domElement );
  }

  container.appendChild( canvas );
}

function step() {
  if ( stats ) stats.begin();

  if ( tog = !tog ) {
    if ( !man ) {
      t = +new Date() * 0.001;
      mx = w * 1 + ( Math.cos( t * 2.1 ) * Math.cos( t * 0.9 ) * w * 0.45 );
      my = h * 1 + ( Math.sin( t * 3.2 ) * Math.tan( Math.sin( t * 0.8 ) ) * h * 0.45 );
    }
      
    for ( i = 0; i < NUM_PARTICLES; i++ ) {
      p = list[i];
      d = ( dx = mx - p.x ) * dx + ( dy = my - p.y ) * dy;
      f = -THICKNESS / d;
      if ( d < THICKNESS ) {
        t = Math.atan2( dy, dx );
        p.vx += f * Math.cos(t);
        p.vy += f * Math.sin(t);
      }
      p.x += ( p.vx *= DRAG ) + (p.ox - p.x) * EASE;
      p.y += ( p.vy *= DRAG ) + (p.oy - p.y) * EASE;
    }

  } else {
    b = ( a = ctx.createImageData( w, h ) ).data;
    var now = +new Date() * 0.001;
    for ( i = 0; i < NUM_PARTICLES; i++ ) {
      p = list[i];
      var px = ~~p.x, py = ~~p.y;
      if ( px >= 0 && py >= 0 && px < w && py < h ) {
        b[n = ( px + py * w ) * 4] = b[n+1] = b[n+2] = COLOR;
        b[n+3] = 180 + Math.sin( now * 0.8 + p.phase ) * 75;
      }
    }
    ctx.putImageData( a, 0, 0 );
  }

  if ( stats ) stats.end();
  requestAnimationFrame( step );
}

init();
step();

/* =========================
Bunny Net Einbindung
===========================*/

document.querySelectorAll('video[data-hls]').forEach(video => {
  const src = video.dataset.hls;
  if (Hls.isSupported()) {
    const hls = new Hls();
    hls.loadSource(src);
    hls.attachMedia(video);
  } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
    video.src = src;
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
  if (sidebarToggleBtn) sidebarToggleBtn.querySelector('.sidebar-toggle-icon').textContent = '+';
}

function expandSidebar() {
  sidebarEl.classList.remove('collapsed');
  if (sidebarToggleBtn) sidebarToggleBtn.querySelector('.sidebar-toggle-icon').textContent = '−';
}

if (sidebarToggleBtn) {
  sidebarToggleBtn.addEventListener('click', () => {
    sidebarEl.classList.contains('collapsed') ? expandSidebar() : collapseSidebar();
  });
}

if (window.innerWidth <= 900) collapseSidebar();

/* =========================
   VARIABLEN
========================= */
const navLinks = document.querySelectorAll('.nav-link');
const contentEl = document.querySelector('.content');
const pages = Array.from(contentEl.children);

let currentRelease = 'oap';
let currentPerson  = null;
let currentPageIdx = 0;
let wheelLocked    = false;

/* =========================
   CROSSFADE: SEITE WECHSELN
========================= */
function showPage(idx) {
  idx = Math.max(0, Math.min(idx, pages.length - 1));
  if (idx === currentPageIdx && pages[currentPageIdx].classList.contains('active')) return;

  const outgoing = pages[currentPageIdx];
  const incoming = pages[idx];

  // Alles in der verlassenen Section zuklappen
  outgoing.querySelectorAll('.overlay-header-body.open').forEach(el => {
    el.classList.remove('open');
    const btn = el.closest('.section-fullscreen')?.querySelector('.overlay-header-toggle');
    if (btn) btn.textContent = '+';
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

  // Alte Section bleibt sichtbar (darunter), neue blendet darüber ein
  outgoing.classList.remove('active');
  outgoing.classList.add('leaving');
  incoming.classList.add('active');

  setTimeout(() => outgoing.classList.remove('leaving'), 700);

  currentPageIdx = idx;

  // Sidebar-Aktivierung
  const section = incoming.querySelector('section[id]') || incoming;
  const id = section.id;
  navLinks.forEach(l => l.closest('.tree-item').classList.remove('active'));
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
contentEl.addEventListener('wheel', e => {
  e.preventDefault();
  if (wheelLocked) return;
  wheelLocked = true;
  collapseSidebar();
  showPage(e.deltaY > 0 ? currentPageIdx + 1 : currentPageIdx - 1);
  setTimeout(() => { wheelLocked = false; }, 900);
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
    const release = this.dataset.release;
    if (release === '1') setRelease('oap');
    if (release === '2') setRelease('noch');

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

  const firstClone = imgs[0].cloneNode(true);
  const lastClone  = imgs[imgs.length - 1].cloneNode(true);
  track.appendChild(firstClone);
  track.insertBefore(lastClone, track.firstChild);

  let index = 1;
  track.style.transform = `translateX(-${index * 100}%)`;

  function goTo(i) {
    track.style.transition = 'transform 0.4s ease';
    track.style.transform = `translateX(-${i * 100}%)`;
  }

  rightZone.addEventListener('click', () => goTo(++index));
  leftZone.addEventListener('click',  () => goTo(--index));

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
  });
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
    cassOap.style.transform  = 'scale(1.07)';
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

// ── About Section Logic ──────────────────────────────────────────

function handleAbout(id) {
  const body = document.getElementById('body-' + id);
  const btn  = document.getElementById('btn-' + id);
  const isOpen = body.classList.contains('open');

  // Alle schließen
  document.querySelectorAll('.about-body').forEach(b => b.classList.remove('open'));
  document.querySelectorAll('[id^="btn-till"], [id^="btn-lennart"]').forEach(b => b.textContent = '+');

  // Sidebar-Aktivierung zurücksetzen
  document.querySelectorAll('.nav-link[data-person]').forEach(l => l.closest('.tree-item').classList.remove('active'));

  // Angeklicktes öffnen, falls es vorher zu war
  if (!isOpen) {
    body.classList.add('open');
    btn.textContent = '-';
    currentPerson = id;
    // Zugehörigen Sidebar-Eintrag aktivieren
    const sidebarLink = document.querySelector(`.nav-link[data-person="${id}"]`);
    if (sidebarLink) sidebarLink.closest('.tree-item').classList.add('active');
  } else {
    currentPerson = null;
  }
}

/* =========================
   OVERLAY HEADER TOGGLE
========================= */
function toggleHeader(el) {
  const section = el.closest('.section-fullscreen');
  const body = section.querySelector('.overlay-header-body');
  const btn  = section.querySelector('.overlay-header-toggle');
  const isOpen = body.classList.contains('open');
  body.classList.toggle('open', !isOpen);
  btn.textContent = isOpen ? '+' : '-';
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

  const first = imgs[0].cloneNode(true);
  const last  = imgs[imgs.length - 1].cloneNode(true);
  track.appendChild(first);
  track.insertBefore(last, track.firstChild);

  let idx = 1;
  track.style.transform = `translateX(-${idx * 100}%)`;

  function goTo(i) {
    track.style.transition = 'transform 0.4s ease';
    track.style.transform  = `translateX(-${i * 100}%)`;
  }

  right.addEventListener('click', () => goTo(++idx));
  left.addEventListener('click',  () => goTo(--idx));

  track.addEventListener('transitionend', () => {
    const all = track.querySelectorAll('img');
    if (idx >= all.length - 1) { track.style.transition = 'none'; idx = 1; track.style.transform = `translateX(-${idx * 100}%)`; }
    if (idx <= 0)               { track.style.transition = 'none'; idx = all.length - 2; track.style.transform = `translateX(-${idx * 100}%)`; }
  });
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
      const btn = b.closest('.section-fullscreen')?.querySelector('.overlay-header-toggle');
      if (btn) btn.textContent = '+';
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
  });
});
