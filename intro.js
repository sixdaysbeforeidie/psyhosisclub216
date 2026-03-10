const flash       = document.getElementById("flash");
const charEl      = document.getElementById("char");
const music       = document.getElementById("bgMusic");
const laugh       = document.getElementById("laughSound");
const hint        = document.getElementById("hint");
const title       = document.querySelector(".intro-title");
const stars       = document.querySelectorAll(".star");
const enterScreen = document.getElementById("enterScreen");
const scene       = document.getElementById("scene");
const bg          = document.getElementById("bg");

const isMobile = window.innerWidth <= 768;

/* ── ENTER SCREEN ── */
enterScreen.addEventListener("click", startIntro);
enterScreen.addEventListener("touchend", (e) => {
    e.preventDefault();
    startIntro();
}, { passive: false });

function startIntro() {
    music.volume = 0;
    music.play().catch(() => {});
    gsap.to(music, { volume: 0.5, duration: 3 });

    setInterval(() => {
        localStorage.setItem("musicTime", music.currentTime);
    }, 1000);

    gsap.to(enterScreen, {
        opacity: 0, duration: 1, ease: "power2.inOut",
        onComplete: () => {
            enterScreen.style.display = "none";
            scene.style.display = "block";
            showIntro();
        }
    });
}

function rand(min, max) {
    return min + Math.random() * (max - min);
}

function placeStars() {
    const starSizeVw = isMobile ? 12 : 16;

    const leftZone  = isMobile
        ? { xMin: 2,  xMax: 22, yMin: 10, yMax: 65 }
        : { xMin: 16, xMax: 34, yMin: 10, yMax: 72 };

    const rightZone = isMobile
        ? { xMin: 62, xMax: 82, yMin: 10, yMax: 65 }
        : { xMin: 56, xMax: 76, yMin: 10, yMax: 72 };

    const layout = Math.random() > 0.5
        ? [leftZone, leftZone, rightZone]
        : [leftZone, rightZone, rightZone];

    layout.sort(() => Math.random() - 0.5);

    const placed = [];

    stars.forEach((star, i) => {
        const zone = layout[i];
        let x, y, attempts = 0;

        do {
            x = rand(zone.xMin, zone.xMax);
            y = rand(zone.yMin, zone.yMax);
            attempts++;
            const tooClose = placed.some(p =>
                Math.abs(p.x - x) < starSizeVw * 1.4 &&
                Math.abs(p.y - y) < starSizeVw * 1.4
            );
            if (!tooClose || attempts > 30) break;
        } while (true);

        placed.push({ x, y });
        star.style.left = `${x}vw`;
        star.style.top  = `${y}vh`;
    });
}

function showIntro() {
    placeStars();
    const exitIdx = Math.floor(Math.random() * stars.length);

    gsap.timeline()
        .set("body", { opacity: 1 })
        .to(bg,     { opacity: 0.9, duration: 1.4, ease: "power2.out" })
        .to(title,  { opacity: 1,   duration: 1.2, ease: "power2.out" }, 0.3)
        .to(charEl, { opacity: 1,   duration: 1.5, ease: "power2.out" }, 0.5)
        .to("#s1",  { opacity: 1,   duration: 0.8, ease: "power2.out" }, 1.2)
        .to("#s2",  { opacity: 1,   duration: 0.8, ease: "power2.out" }, 1.5)
        .to("#s3",  { opacity: 1,   duration: 0.8, ease: "power2.out" }, 1.8)
        .to(hint,   { opacity: 1,   duration: 1.0, ease: "power2.out" }, 2.4);

    const breathe = gsap.to(charEl, {
        scaleY: 1.018, scaleX: 0.994,
        duration: 3.8, repeat: -1, yoyo: true,
        ease: "sine.inOut", transformOrigin: "bottom center"
    });

    const floatAnims = [];
    [
        { id: "#s1", y: -14, dur: 2.7, rotDur: 22 },
        { id: "#s2", y: -12, dur: 3.1, rotDur: 26 },
        { id: "#s3", y: -16, dur: 2.5, rotDur: 20 },
    ].forEach(({ id, y, dur, rotDur }, i) => {
        floatAnims.push(
            gsap.to(id, { y, duration: dur, repeat: -1, yoyo: true, ease: "sine.inOut", delay: i * 0.4 })
        );
        gsap.to(`${id} img`, {
            rotation: 360, duration: rotDur,
            repeat: -1, ease: "none",
            transformOrigin: "center center"
        });
    });

    stars.forEach((star, i) => {
        function handleTap() {
            if (i === exitIdx) {

                breathe.kill();
                stars.forEach(s => s.style.pointerEvents = "none");

                // Звук смеха
                if (laugh) {
                    laugh.volume = 0.85;
                    laugh.play().catch(() => {});
                }

                // Лёгкое покачивание — только scaleY, никаких прыжков
                gsap.to(charEl, {
                    scaleY: 1.022, scaleX: 0.982,
                    duration: 0.35, ease: "sine.inOut",
                    repeat: 10, yoyo: true,
                    transformOrigin: "bottom center"
                });

                // Экран плавно темнеет и переходит на main
                localStorage.setItem("musicTime", music.currentTime);
                gsap.timeline({ delay: 3 })
                    .to("body", {
                        opacity: 0,
                        duration: 3,
                        ease: "power1.inOut",
                        onComplete: () => { window.location.href = "main.html"; }
                    });

            } else {
                // Неправильная — подпрыгивает и падает
                star.style.pointerEvents = "none";
                floatAnims[i] && floatAnims[i].kill();

                gsap.timeline()
                    .to(star, { y: -20, duration: 0.15, ease: "power2.out" })
                    .to(star, {
                        y: "+=320",
                        rotation: (Math.random() > 0.5 ? 1 : -1) * (35 + Math.random() * 55),
                        opacity: 0,
                        duration: 1.8,
                        ease: "power2.in"
                    });
            }
        }

        star.addEventListener("click", handleTap);
        star.addEventListener("touchend", (e) => {
            e.preventDefault();
            handleTap();
        }, { passive: false });
    });
}
