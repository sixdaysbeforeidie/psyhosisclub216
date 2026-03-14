/* ════════════════════════
   MUSIC
════════════════════════ */
window.addEventListener('load', () => {
    const music = document.getElementById('bgMusic');
    if (!music) return;

    const savedTime = parseFloat(localStorage.getItem('musicTime') || '0');
    music.currentTime = savedTime;
    music.volume = 0.5;

    if (localStorage.getItem('musicUnlocked') === '1') {
        music.play().catch(() => {});
    }

    setInterval(() => {
        if (!music.paused) localStorage.setItem('musicTime', music.currentTime);
    }, 1000);

    const slider = document.getElementById('volumeSlider');
    if (slider) {
        slider.value = 0.5;
        slider.addEventListener('input', () => {
            music.volume = parseFloat(slider.value);
            const icon = document.getElementById('volumeIcon');
            if (icon) icon.textContent = parseFloat(slider.value) === 0 ? '×' : '♪';
        });
    }

    initLightbox();
});

function toggleVolume() {
    const vc = document.getElementById('volumeControl');
    if (vc) vc.classList.toggle('open');
}

/* ════════════════════════
   FADE OVERLAY
════════════════════════ */
const overlay = document.createElement('div');
overlay.id = 'pageOverlay';
overlay.style.cssText = `
    position: fixed; inset: 0; background: #0a0a0a;
    z-index: 9999; opacity: 0; pointer-events: none;
    transition: opacity 0.35s ease;
`;
document.body.appendChild(overlay);

function fadeOverlay(toOpacity, cb) {
    overlay.style.pointerEvents = toOpacity > 0 ? 'all' : 'none';
    overlay.style.opacity = toOpacity;
    setTimeout(cb, 360);
}

/* ════════════════════════
   SPA ROUTER
════════════════════════ */
let currentPage = null;
let isTransitioning = false;

function goTo(page) {
    if (isTransitioning) return;
    if (page === currentPage) return;
    isTransitioning = true;

    const music = document.getElementById('bgMusic');
    if (music) localStorage.setItem('musicTime', music.currentTime);

    fadeOverlay(1, () => {
        document.querySelectorAll('.page').forEach(p => p.style.display = 'none');

        const target = document.getElementById('page-' + page);
        if (!target) { isTransitioning = false; return; }

        target.style.display = 'block';
        window.scrollTo(0, 0);
        currentPage = page;

        document.querySelectorAll('nav a, .header-right a').forEach(a => {
            a.style.opacity = (a.dataset.page === page) ? '1' : '';
            a.style.borderBottom = (a.dataset.page === page)
                ? '1px solid rgba(255,255,255,0.3)' : '';
        });

        document.querySelector('header').style.display = 'flex';

        fadeOverlay(0, () => { isTransitioning = false; });
    });
}

/* ════════════════════════
   BURGER
════════════════════════ */
function toggleMenu() {
    const nav = document.getElementById('mobileNav');
    if (nav) nav.classList.toggle('open');
}

/* ════════════════════════
   ARCHIVE TABS
════════════════════════ */
function switchTab(tab) {
    document.querySelectorAll('.tab-btn').forEach((b, i) => {
        b.classList.toggle('active', (i === 0 && tab === 'art') || (i === 1 && tab === 'merch'));
    });
    document.getElementById('tab-art').classList.toggle('active', tab === 'art');
    document.getElementById('tab-merch').classList.toggle('active', tab === 'merch');
}

/* ════════════════════════
   LIGHTBOX
════════════════════════ */
let lightboxImages = [];
let lightboxIndex  = 0;

function initLightbox() {
    const items = document.querySelectorAll('.art-item img');
    const srcs  = Array.from(items).map(i => i.src);
    items.forEach((img, idx) => {
        img.parentElement.addEventListener('click', () => openLightbox(srcs, idx));
    });
}

function openLightbox(imgs, idx) {
    lightboxImages = imgs;
    lightboxIndex  = idx;
    document.getElementById('lightboxImg').src = imgs[idx];
    document.getElementById('lightbox').classList.add('open');
}

function closeLightbox() {
    document.getElementById('lightbox').classList.remove('open');
}

function lightboxNav(dir) {
    lightboxIndex = (lightboxIndex + dir + lightboxImages.length) % lightboxImages.length;
    document.getElementById('lightboxImg').src = lightboxImages[lightboxIndex];
}

document.addEventListener('keydown', (e) => {
    const lb = document.getElementById('lightbox');
    if (!lb || !lb.classList.contains('open')) return;
    if (e.key === 'ArrowLeft')  lightboxNav(-1);
    if (e.key === 'ArrowRight') lightboxNav(1);
    if (e.key === 'Escape')     closeLightbox();
});

/* ════════════════════════
   ЗАЩИТА КАРТИНОК
════════════════════════ */
document.addEventListener('contextmenu', (e) => {
    if (e.target.closest('.art-item')) e.preventDefault();
});
document.addEventListener('dragstart', (e) => {
    if (e.target.closest('.art-item')) e.preventDefault();
});

/* ════════════════════════
   INIT
════════════════════════ */
goTo('main');