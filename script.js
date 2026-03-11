/* ── Переходы ── */
function goTo(page) {
    const music = document.getElementById("bgMusic");
    if (music) localStorage.setItem("musicTime", music.currentTime);
    document.body.style.transition = "opacity 0.6s ease";
    document.body.style.opacity = 0;
    setTimeout(() => { window.location.href = page; }, 600);
}

/* ── Появление страницы ── */
window.addEventListener("load", () => {
    document.body.style.opacity = 0;
    setTimeout(() => {
        document.body.style.transition = "opacity 0.8s ease";
        document.body.style.opacity = 1;
    }, 80);
});

/* ── Мобильное меню ── */
function toggleMenu() {
    const nav = document.getElementById("mobileNav");
    if (nav) nav.classList.toggle("open");
}

/* ── Музыка ── */
window.addEventListener("load", () => {
    const music = document.getElementById("bgMusic");
    if (!music) return;

    const savedTime = parseFloat(localStorage.getItem("musicTime") || "0");
    const unlocked  = localStorage.getItem("musicUnlocked") === "1";

    music.currentTime = savedTime;
    music.volume = 0.5;

    if (unlocked) {
        // пользователь уже кликал на интро — можно играть
        music.play().catch(() => {});
    }

    // сохраняем позицию каждую секунду
    setInterval(() => {
        if (!music.paused) localStorage.setItem("musicTime", music.currentTime);
    }, 1000);
});