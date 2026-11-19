// js/particles.js
export function initParticles({ count = 36, selector = '#bg-particles' } = {}) {
    const canvas = document.querySelector(selector);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let width = 0;
    let height = 0;
    let dpr = 1;

    const resize = () => {
        width = window.innerWidth;
        height = window.innerHeight;
        dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = Math.floor(width * dpr);
        canvas.height = Math.floor(height * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const makeParticle = (randomAge = false) => {
        const maxAge = 420 + Math.random() * 420;
        return {
            x: Math.random() * width,
            y: randomAge ? Math.random() * height : height * (0.35 + Math.random() * 0.65),
            r: 0.9 + Math.random() * 1.35,
            vx: (Math.random() - 0.5) * 0.14,
            vy: -0.08 - Math.random() * 0.16,
            age: randomAge ? Math.random() * maxAge : 0,
            maxAge,
            peakAlpha: 0.06 + Math.random() * 0.11
        };
    };

    resize();
    const particles = Array.from({ length: count }, () => makeParticle(true));

    const tick = () => {
        ctx.clearRect(0, 0, width, height);

        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.age += 1;

            if (p.age >= p.maxAge || p.x < -20 || p.x > width + 20 || p.y < -20 || p.y > height + 20) {
                particles[i] = makeParticle(false);
                continue;
            }

            const t = Math.min(Math.max(p.age / p.maxAge, 0), 1);
            const alpha = p.peakAlpha * Math.sin(t * Math.PI);
            if (alpha <= 0.002) continue;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${alpha.toFixed(4)})`;
            ctx.fill();
        }

        requestAnimationFrame(tick);
    };

    window.addEventListener('resize', resize, { passive: true });
    requestAnimationFrame(tick);
}