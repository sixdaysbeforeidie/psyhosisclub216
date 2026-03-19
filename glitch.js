/* ════════════════════════
   GLITCH ENGINE
════════════════════════ */

let glitchCanvas, glitchCtx, glitchInterval;
let glitchIntensity = 0; // 0 = тихий, 1 = максимум

function initGlitch() {
    glitchCanvas = document.createElement('canvas');
    glitchCanvas.id = 'glitchCanvas';
    glitchCanvas.style.cssText = `
        position: fixed; inset: 0;
        width: 100%; height: 100%;
        z-index: 600; pointer-events: none;
        will-change: transform;
        transform: translateZ(0);
        opacity: 1;
    `;
    document.body.appendChild(glitchCanvas);
    glitchCtx = glitchCanvas.getContext('2d');
    resizeGlitch();
    window.addEventListener('resize', resizeGlitch);

    // Тихий фоновый глитч
    startAmbientGlitch();
}

function resizeGlitch() {
    if (!glitchCanvas) return;
    glitchCanvas.width  = window.innerWidth;
    glitchCanvas.height = window.innerHeight;
}

/* ── Фоновый тихий глитч ── */
function startAmbientGlitch() {
    let tick = 0;
    glitchInterval = setInterval(() => {
        tick++;
        glitchCtx.clearRect(0, 0, glitchCanvas.width, glitchCanvas.height);

        // Редкие горизонтальные полосы
        if (Math.random() < 0.15 + glitchIntensity * 0.6) {
            const count = Math.floor(1 + glitchIntensity * 8);
            for (let i = 0; i < count; i++) {
                const y = Math.random() * glitchCanvas.height;
                const h = Math.random() * (2 + glitchIntensity * 12);
                const alpha = Math.random() * (0.04 + glitchIntensity * 0.25);
                const hue = Math.random() > 0.5 ? '255,0,50' : '0,200,255';
                glitchCtx.fillStyle = `rgba(${hue},${alpha})`;
                glitchCtx.fillRect(0, y, glitchCanvas.width, h);
            }
        }

        // RGB сдвиг
        if (Math.random() < 0.08 + glitchIntensity * 0.5) {
            const y = Math.random() * glitchCanvas.height;
            const h = Math.random() * (4 + glitchIntensity * 30);
            const shift = (Math.random() - 0.5) * (6 + glitchIntensity * 40);
            glitchCtx.fillStyle = `rgba(255,0,0,${0.03 + glitchIntensity * 0.1})`;
            glitchCtx.fillRect(shift, y, glitchCanvas.width, h);
            glitchCtx.fillStyle = `rgba(0,255,255,${0.03 + glitchIntensity * 0.1})`;
            glitchCtx.fillRect(-shift, y, glitchCanvas.width, h);
        }

        // Мерцание блоков при высокой интенсивности
        if (glitchIntensity > 0.3 && Math.random() < glitchIntensity * 0.7) {
            const count = Math.floor(glitchIntensity * 15);
            for (let i = 0; i < count; i++) {
                const x = Math.random() * glitchCanvas.width;
                const y = Math.random() * glitchCanvas.height;
                const w = Math.random() * (glitchCanvas.width * 0.4);
                const h = Math.random() * 20;
                glitchCtx.fillStyle = `rgba(0,0,0,${Math.random() * 0.8})`;
                glitchCtx.fillRect(x - w/2, y, w, h);
            }
        }

        // Белая вспышка при максимуме
        if (glitchIntensity > 0.7 && Math.random() < (glitchIntensity - 0.7) * 2) {
            glitchCtx.fillStyle = `rgba(255,255,255,${Math.random() * 0.15})`;
            glitchCtx.fillRect(0, 0, glitchCanvas.width, glitchCanvas.height);
        }

    }, 150);
}

/* ── Запуск взрыва при правильной звезде ── */
function triggerGlitchExplode(onComplete) {
    let progress = 0;
    const explode = setInterval(() => {
        progress += 0.06;
        glitchIntensity = Math.min(progress, 1);
        if (progress >= 1) {
            clearInterval(explode);
            // Финальная белая вспышка
            glitchCtx.fillStyle = 'rgba(255,255,255,0.9)';
            glitchCtx.fillRect(0, 0, glitchCanvas.width, glitchCanvas.height);
            setTimeout(() => {
                if (onComplete) onComplete();
            }, 200);
        }
    }, 150);
}

/* ── Стоп ── */
function stopGlitch() {
    if (glitchInterval) clearInterval(glitchInterval);
    if (glitchCanvas) glitchCanvas.remove();
}