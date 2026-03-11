/* ── script.js — для страниц внутри iframe ── */

function goTo(page) {
    // Если мы внутри shell — используем его навигацию
    if (window.parent && window.parent.shellNavigate) {
        window.parent.shellNavigate(page);
    } else {
        // Fallback — прямой переход
        document.body.style.transition = "opacity 0.5s ease";
        document.body.style.opacity = 0;
        setTimeout(() => { window.location.href = page; }, 500);
    }
}

function toggleMenu() {
    if (window.parent && window.parent.toggleMenu) {
        window.parent.toggleMenu();
    }
}

/* ── Появление страницы ── */
window.addEventListener("load", () => {
    document.body.style.opacity = 0;
    // Убираем шапку внутри iframe — она в shell
    const header = document.querySelector("header");
    const burger = document.querySelector(".burger");
    const mobileNav = document.querySelector(".mobile-nav");
    const audio = document.querySelector("audio");
    if (header) header.style.display = "none";
    if (burger) burger.style.display = "none";
    if (mobileNav) mobileNav.style.display = "none";
    if (audio) audio.style.display = "none"; // музыка в shell

    setTimeout(() => {
        document.body.style.transition = "opacity 0.5s ease";
        document.body.style.opacity = 1;
    }, 50);
});