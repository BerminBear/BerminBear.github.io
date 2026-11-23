// js/particles.js
// Bakgrundspartiklar som blir en guldglödande stjärnkonstellation när musik spelar.
// Bas-kickar skickar ut mini-fyrverkerier från stjärnorna. Utseendet styrs av --stars-* i style.css.
import { audio, updateAudio } from './audio-analyser.js';

const GOLD_FALLBACK = [244, 205, 120];

export function initParticles({ count = 56, selector = '#bg-particles' } = {}) {
    const canvas = document.querySelector(selector);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    /* ---------- Config från CSS ---------- */
    const rootStyle = getComputedStyle(document.documentElement);
    const cfg = {};
    let spriteKey = '';
    let sprite = null;

    const parseRgb = (str, fallback) => {
        const parts = String(str).split(',').map((s) => parseFloat(s));
        return parts.length === 3 && parts.every(Number.isFinite) ? parts : fallback;
    };

    const makeSprite = (rgb) => {
        const c = document.createElement('canvas');
        c.width = c.height = 64;
        const g = c.getContext('2d');
        const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
        grad.addColorStop(0, `rgba(${rgb.join(',')},1)`);
        grad.addColorStop(0.2, `rgba(${rgb.join(',')},0.45)`);
        grad.addColorStop(1, `rgba(${rgb.join(',')},0)`);
        g.fillStyle = grad;
        g.fillRect(0, 0, 64, 64);
        return c;
    };

    const readCfg = () => {
        const num = (name, fallback) => {
            const v = parseFloat(rootStyle.getPropertyValue(name));
            return Number.isFinite(v) ? v : fallback;
        };
        cfg.rgb = parseRgb(rootStyle.getPropertyValue('--stars-rgb'), GOLD_FALLBACK);
        cfg.reactivity = num('--stars-reactivity', 1);
        cfg.boost = num('--stars-boost', 2.4);
        cfg.glow = num('--stars-glow', 1);
        cfg.glowOpacity = num('--stars-glow-opacity', 0.5);
        cfg.lines = num('--stars-lines', 1);
        cfg.link = num('--stars-link-distance', 200);
        cfg.burstCount = num('--stars-burst-count', 14);
        cfg.burstSize = num('--stars-burst-size', 1);
        cfg.sens = num('--stars-beat-sensitivity', 1);

        const key = cfg.rgb.join(',');
        if (key !== spriteKey) {
            spriteKey = key;
            sprite = makeSprite(cfg.rgb);
        }
    };
    readCfg();

    /* ---------- Canvas ---------- */
    let width = 0, height = 0, dpr = 1;
    const resize = () => {
        width = window.innerWidth;
        height = window.innerHeight;
        dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = Math.floor(width * dpr);
        canvas.height = Math.floor(height * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    /* ---------- Stjärnor ---------- */
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
            peakAlpha: 0.06 + Math.random() * 0.11,
            phase: Math.random() * Math.PI * 2,
            flash: 0,   // tillfällig uppblixt vid fyrverkeri
            vis: 0,     // 0..1 livscykel-synlighet
            a: 0,       // slutlig alpha denna frame
            rr: 1       // slutlig radie denna frame
        };
    };

    resize();
    const particles = Array.from({ length: count }, () => makeParticle(true));

    /* ---------- Gnistor (mini-fyrverkerier) ---------- */
    const sparks = [];
    const maxSparks = () => (width < 700 ? 110 : 220);

    const burst = (strength, level, amp) => {
        const candidates = particles.filter((p) => p.vis > 0.3);
        if (!candidates.length) return;
        const origins = strength > 0.85 ? 2 : 1;

        for (let k = 0; k < origins; k++) {
            const o = candidates[(Math.random() * candidates.length) | 0];
            o.flash = 1;

            // Konstellationen "tänds" runt startstjärnan
            const reach = cfg.link * 1.1;
            for (const p of particles) {
                if (p === o) continue;
                const d = Math.hypot(p.x - o.x, p.y - o.y);
                if (d < reach) p.flash = Math.max(p.flash, 0.7 * (1 - d / reach));
            }

            const n = Math.round(cfg.burstCount * (0.55 + level * 0.9) * (0.6 + 0.4 * strength));
            for (let i = 0; i < n && sparks.length < maxSparks(); i++) {
                const ang = Math.random() * Math.PI * 2;
                const speed = (0.5 + Math.random() * 1.6) * cfg.burstSize * (0.7 + level * 0.9 + strength * 0.4) * Math.min(1.4, amp);
                sparks.push({
                    x: o.x, y: o.y,
                    vx: Math.cos(ang) * speed,
                    vy: Math.sin(ang) * speed,
                    life: 0,
                    max: 38 + Math.random() * 32,
                    w: 0.7 + Math.random() * 0.9
                });
            }
        }
    };

    /* ---------- Loop ---------- */
    let frame = 0;
    let last = performance.now();
    const WHITE = 255;

    const tick = (now) => {
        // Normalisera till 60 fps så det ser likadant ut på 120 Hz-skärmar
        const dt = Math.min(3, Math.max(0.2, (now - last) / 16.667));
        last = now;
        if (frame++ % 30 === 0) readCfg();

        updateAudio(now, cfg.sens);

        const e = audio.presence;                                   // 0..1 in/ut-tonning
        const amp = cfg.reactivity;
        const bass = Math.min(1.2, (audio.bass * 0.5 + audio.pulse * 0.8) * amp);
        const level = Math.min(1, audio.level * amp);
        const high = audio.high;
        const gold = cfg.rgb;
        const mix = Math.min(1, e * 1.3);
        const cr = Math.round(WHITE + (gold[0] - WHITE) * mix);
        const cg = Math.round(WHITE + (gold[1] - WHITE) * mix);
        const cb = Math.round(WHITE + (gold[2] - WHITE) * mix);

        ctx.globalCompositeOperation = 'source-over';
        ctx.globalAlpha = 1;
        ctx.clearRect(0, 0, width, height);

        if (audio.kick > 0 && e > 0.3) burst(audio.kick, level, amp);

        // Uppdatera stjärnor
        const speed = 1 + e * (0.4 + bass * 1.2);
        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];
            p.x += p.vx * speed * dt;
            p.y += p.vy * speed * dt;
            p.age += dt;

            if (p.age >= p.maxAge || p.x < -20 || p.x > width + 20 || p.y < -20 || p.y > height + 20) {
                particles[i] = makeParticle(false);
                continue;
            }

            const t = Math.min(Math.max(p.age / p.maxAge, 0), 1);
            p.vis = Math.sin(t * Math.PI);
            p.flash *= Math.pow(0.9, dt);

            let a = p.peakAlpha * p.vis;
            if (e > 0.002) {
                const twinkle = 1 + e * high * 0.9 * Math.sin(now * 0.008 + p.phase);
                a = a * (1 + e * cfg.boost * (0.5 + bass * 1.2 + level * 0.8)) * twinkle
                    + p.flash * 0.6 * (0.4 + 0.6 * p.vis);
            }
            p.a = Math.min(1, a);
            p.rr = p.r * (1 + e * 0.4 + e * bass * 0.7 + p.flash * 1.2);
        }

        // Konstellationslinjer + glöd + gnistor (additiv blandning)
        if (e > 0.01 || sparks.length) {
            ctx.globalCompositeOperation = 'lighter';

            if (cfg.lines > 0 && e > 0.01) {
                const D = cfg.link * (1 + bass * e * 0.35);
                const D2 = D * D;
                ctx.lineWidth = 0.7;
                for (let i = 0; i < particles.length; i++) {
                    const p = particles[i];
                    if (p.vis < 0.05) continue;
                    for (let j = i + 1; j < particles.length; j++) {
                        const q = particles[j];
                        if (q.vis < 0.05) continue;
                        const dx = p.x - q.x, dy = p.y - q.y;
                        const d2 = dx * dx + dy * dy;
                        if (d2 > D2) continue;
                        const f = 1 - Math.sqrt(d2) / D;
                        const la = (f * f * (0.1 + 0.55 * bass) * Math.min(p.vis, q.vis) * e
                            + (p.flash + q.flash) * 0.35 * f) * cfg.lines;
                        if (la < 0.01) continue;
                        ctx.strokeStyle = `rgba(${gold[0]},${gold[1]},${gold[2]},${Math.min(0.8, la).toFixed(3)})`;
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(q.x, q.y);
                        ctx.stroke();
                    }
                }
            }

            if (e > 0.01) {
                for (const p of particles) {
                    if (p.a < 0.01) continue;
                    const s = p.rr * (5 + e * 4 + p.flash * 6) * cfg.glow;
                    ctx.globalAlpha = Math.min(1, p.a * cfg.glowOpacity * e * 2);
                    ctx.drawImage(sprite, p.x - s, p.y - s, s * 2, s * 2);
                }
                ctx.globalAlpha = 1;
            }

            ctx.lineCap = 'round';
            for (let i = sparks.length - 1; i >= 0; i--) {
                const s = sparks[i];
                s.life += dt;
                if (s.life >= s.max) {
                    sparks[i] = sparks[sparks.length - 1];
                    sparks.pop();
                    continue;
                }
                s.vx *= Math.pow(0.968, dt);
                s.vy = s.vy * Math.pow(0.968, dt) + 0.012 * dt;  // lätt gravitation
                s.x += s.vx * dt;
                s.y += s.vy * dt;
                const k = 1 - s.life / s.max;
                ctx.strokeStyle = `rgba(${gold[0]},${gold[1]},${gold[2]},${(Math.pow(k, 1.5) * 0.85).toFixed(3)})`;
                ctx.lineWidth = s.w * (0.5 + k * 0.5);
                ctx.beginPath();
                ctx.moveTo(s.x - s.vx * 2.2, s.y - s.vy * 2.2);
                ctx.lineTo(s.x, s.y);
                ctx.stroke();
            }
        }

        // Stjärnornas kärnor (vit i vila, guld när musik spelar)
        ctx.globalCompositeOperation = 'source-over';
        for (const p of particles) {
            if (p.a <= 0.002) continue;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.rr, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${cr}, ${cg}, ${cb}, ${p.a.toFixed(4)})`;
            ctx.fill();
        }

        requestAnimationFrame(tick);
    };

    window.addEventListener('resize', resize, { passive: true });
    requestAnimationFrame(tick);
}