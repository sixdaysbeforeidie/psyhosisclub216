/* ── Переходы ── */
function goTo(page) {
    const music = document.getElementById("bgMusic");
    if (music) localStorage.setItem("musicTime", music.currentTime);
    document.body.style.transition = "opacity 0.5s ease";
    document.body.style.opacity = 0;
    setTimeout(() => { window.location.href = page; }, 500);
}

/* ── Появление страницы ── */
window.addEventListener("load", () => {
    document.body.style.opacity = 0;
    setTimeout(() => {
        document.body.style.transition = "opacity 0.6s ease";
        document.body.style.opacity = 1;
    }, 50);

    // Музыка
    const music = document.getElementById("bgMusic");
    if (!music) return;
    const savedTime = parseFloat(localStorage.getItem("musicTime") || "0");
    music.currentTime = savedTime;
    music.volume = 0.5;
    if (localStorage.getItem("musicUnlocked") === "1") {
        music.play().catch(() => {});
    }
    setInterval(() => {
        if (!music.paused) localStorage.setItem("musicTime", music.currentTime);
    }, 1000);

    // Prefetch всех страниц для быстрой загрузки
    const pages = ["main.html", "artist.html", "releases.html", "archive.html", "Contact.html", "artist-beluv.html", "artist-soangry.html"];
    pages.forEach(page => {
        const link = document.createElement("link");
        link.rel = "prefetch";
        link.href = page;
        document.head.appendChild(link);
    });
});

/* ── Мобильное меню ── */
function toggleMenu() {
    const nav = document.getElementById("mobileNav");
    if (nav) nav.classList.toggle("open");
}