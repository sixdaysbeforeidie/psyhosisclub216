/* ── Табы ── */
function switchTab(tab) {
    document.querySelectorAll(".tab-btn").forEach((b, i) => {
        b.classList.toggle("active", (i === 0 && tab === "art") || (i === 1 && tab === "merch"));
    });
    document.getElementById("tab-art").classList.toggle("active", tab === "art");
    document.getElementById("tab-merch").classList.toggle("active", tab === "merch");
}

/* ── Лайтбокс ── */
let lightboxImages = [];
let lightboxIndex  = 0;

function openLightbox(imgs, idx) {
    lightboxImages = imgs;
    lightboxIndex  = idx;
    document.getElementById("lightboxImg").src = imgs[idx];
    document.getElementById("lightbox").classList.add("open");
}

function closeLightbox() {
    document.getElementById("lightbox").classList.remove("open");
}

function lightboxNav(dir) {
    lightboxIndex = (lightboxIndex + dir + lightboxImages.length) % lightboxImages.length;
    document.getElementById("lightboxImg").src = lightboxImages[lightboxIndex];
}

/* ── Инициализация ── */
window.addEventListener("load", () => {
    const items = document.querySelectorAll(".art-item img");
    const srcs  = Array.from(items).map(i => i.src);
    items.forEach((img, idx) => {
        img.parentElement.addEventListener("click", () => openLightbox(srcs, idx));
    });
});

/* ── Клавиши ── */
document.addEventListener("keydown", (e) => {
    if (!document.getElementById("lightbox").classList.contains("open")) return;
    if (e.key === "ArrowLeft")  lightboxNav(-1);
    if (e.key === "ArrowRight") lightboxNav(1);
    if (e.key === "Escape")     closeLightbox();
});