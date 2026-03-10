
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

/* ── Музыка на main.html ── */
window.addEventListener("load", () => {
    const music = document.getElementById("bgMusic");
    if (!music) return;

    const savedTime = parseFloat(localStorage.getItem("musicTime") || "0");

    function playMusic() {
        music.currentTime = savedTime;
        music.volume = 0;
        music.play().then(() => {
            let v = 0;
            const fade = setInterval(() => {
                v += 0.05;
                if (v >= 0.5) { music.volume = 0.5; clearInterval(fade); }
                else music.volume = v;
            }, 80);
        }).catch(() => {});
    }

    playMusic();

    const unlock = () => {
        playMusic();
        document.removeEventListener("click",    unlock);
        document.removeEventListener("touchend", unlock);
    };
    document.addEventListener("click",    unlock);
    document.addEventListener("touchend", unlock);

    setInterval(() => {
        localStorage.setItem("musicTime", music.currentTime);
    }, 1000);
});