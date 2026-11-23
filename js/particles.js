// js/particles.js
// Bakgrundspartiklar som blir en guldglödande stjärnkonstellation när musik spelar.
// Utseendet styrs av --stars-* i style.css och ljuddata från audio-analyser.js.
import { audio, updateAudio } from './audio-analyser.js';

const GOLD_FALLBACK = [244, 205, 120];

// Enkel faktor för livslängd: lägre = kortare livslängd, högre = längre livslängd.
const PARTICLE_LIFE_SCALE = 0.72;

export function initParticles({ count = 56, selector = '#bg-particles' } = {}) {
    const canvas = document.querySelector(selector);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    /* ---------- Knapp-kontroller (Particles + Hide UI) ---------- */
    let particlesEnabled = true;
    const particleBtn = document.querySelector('#toggle-particles-btn');
    const hideUiBtn = document.querySelector('#toggle-ui-btn');

    const syncParticleBtn = () => {
        if (!particleBtn) return;
        particleBtn.textContent = particlesEnabled ? 'Stars: On' : 'Stars: Off';
        particleBtn.setAttribute('aria-pressed', String(particlesEnabled));
        particleBtn.classList.toggle('is-off', !particlesEnabled);
    };

    const setParticlesEnabled = (enabled) => {
        particlesEnabled = Boolean(enabled);
        syncParticleBtn();
        if (!particlesEnabled) {
            sparks.length = 0;
            ctx.clearRect(0, 0, width, height);
        }
    };

    if (particleBtn) {
        syncParticleBtn();
        particleBtn.addEventListener('click', () => setParticlesEnabled(!particlesEnabled));
    }

    const syncUiBtn = () => {
        if (!hideUiBtn) return;
        const hidden = document.body.classList.contains('is-ui-hidden');
        hideUiBtn.textContent = hidden ? 'Show UI' : 'Hide UI';
        hideUiBtn.setAttribute('aria-pressed', String(hidden));
    };

    const setUiHidden = (hidden) => {
        document.body.classList.toggle('is-ui-hidden', Boolean(hidden));
        syncUiBtn();
    };

    if (hideUiBtn) {
        syncUiBtn();
        hideUiBtn.addEventListener('click', () => setUiHidden(!document.body.classList.contains('is-ui-hidden')));
    }

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
        cfg.reactivity = num('--stars-reactivity', 1.0);
        cfg.boost = num('--stars-boost', 2.0);
        cfg.hold = Math.max(0.4, num('--stars-hold', 1.0));
        cfg.leadSens = Math.max(0.2, num('--stars-lead-sensitivity', 1.3));
        cfg.swellSens = Math.max(0, num('--stars-swell-sensitivity', 1.1));
        cfg.highSens = Math.max(0.2, num('--stars-high-sensitivity', 1.45));
        cfg.highDecay = Math.min(0.992, Math.max(0.85, num('--stars-high-decay', 0.962)));
        cfg.glow = num('--stars-glow', 1.2);
        cfg.glowOpacity = num('--stars-glow-opacity', 0.4);
        cfg.lines = num('--stars-lines', 0.6);
        cfg.link = num('--stars-link-distance', 200);
        cfg.burstCount = num('--stars-burst-count', 14);
        cfg.burstSize = num('--stars-burst-size', 1.2);
        cfg.sens = num('--stars-beat-sensitivity', 0.05);

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
        const maxAge = (780 + Math.random() * 760) * PARTICLE_LIFE_SCALE;
        return {
            x: Math.random() * width,
            y: randomAge ? Math.random() * height : height * (0.45 + Math.random() * 0.55),
            r: 0.9 + Math.random() * 1.35,
            vx: (Math.random() - 0.5) * 0.14,
            vy: -0.08 - Math.random() * 0.16,
            age: randomAge ? Math.random() * maxAge : 0,
            maxAge,
            peakAlpha: 0.06 + Math.random() * 0.11,
            phase: Math.random() * Math.PI * 2,
            swellOffset: Math.random() * Math.PI * 2,
            flash: 0,   // transient-uppblixt
            sustain: 0, // långsammare efterklang / fullt spektrum-hållning
            solo: 0,    // mjuk highlight på en enskild stjärna vid runs (flöjt, stråke, brass)
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

    let lastSoloTime = 0;
    let lastLowClusterTime = 0;
    let lastSparkTime = 0;
    let lastChorusTime = 0;
    let highSustained = 0;

    // Stafett-tillstånd för runs: hoppar till närmsta länkade granne, sedan vidare till närmsta konstellation bredvid
    let activeRunStar = null;
    const visitedInChain = new Set();

    const pickStartStar = (candidates) => {
        const rightSide = candidates.filter((p) => p.x > width * 0.55);
        const pool = rightSide.length > 0 ? rightSide : candidates;
        return pool[(Math.random() * pool.length) | 0];
    };

    const spawnSparksAt = (origin, strength, level, amp) => {
        const countSparks = Math.max(6, Math.min(16, Math.round(cfg.burstCount * (0.55 + level * 0.55))));
        for (let i = 0; i < countSparks && sparks.length < maxSparks(); i++) {
            const ang = Math.random() * Math.PI * 2;
            const speed = (0.5 + Math.random() * 1.6) * cfg.burstSize * (0.7 + level * 0.9 + strength * 0.4) * Math.min(1.4, amp);
            sparks.push({
                x: origin.x,
                y: origin.y,
                vx: Math.cos(ang) * speed,
                vy: Math.sin(ang) * speed,
                life: 0,
                max: 38 + Math.random() * 32,
                w: 0.7 + Math.random() * 0.9
            });
        }
    };

    // Runs triggas bara när de är relativt ensamma (låg bas och låg mid), så de inte överbelastar vid tät mix
    const triggerSoloLead = (now, runNote, high, mid, bass, amp, linkReach) => {
        const densityLoad = bass * 0.75 + mid * 0.65;
        const isolation = Math.max(0.12, Math.min(1, 1 - densityLoad));
        const leadSignal = (runNote * 1.2 + high * 0.25) * cfg.leadSens * isolation * (0.7 + amp * 0.3);

        if (leadSignal < 0.14 || isolation < 0.28) {
            if (now - lastSoloTime > 260) {
                visitedInChain.clear();
                activeRunStar = null;
            }
            return;
        }

        if (now - lastSoloTime < 145) return;
        lastSoloTime = now;

        const candidates = particles.filter((p) => p.vis > 0.25);
        if (!candidates.length) return;

        for (const st of visitedInChain) {
            if (st.vis <= 0.25) visitedInChain.delete(st);
        }

        let nextStar = null;

        if (!activeRunStar || activeRunStar.vis <= 0.25) {
            nextStar = pickStartStar(candidates);
            visitedInChain.clear();
        } else {
            let bestLinked = null;
            let bestLinkedDist = Infinity;

            for (const p of candidates) {
                if (p === activeRunStar || visitedInChain.has(p)) continue;
                const d = Math.hypot(p.x - activeRunStar.x, p.y - activeRunStar.y);
                if (d <= linkReach && d < bestLinkedDist) {
                    bestLinkedDist = d;
                    bestLinked = p;
                }
            }

            if (bestLinked) {
                nextStar = bestLinked;
            } else {
                let bestNextClusterStar = null;
                let bestClusterDist = Infinity;

                for (const p of candidates) {
                    if (p === activeRunStar || visitedInChain.has(p)) continue;
                    const d = Math.hypot(p.x - activeRunStar.x, p.y - activeRunStar.y);
                    if (d < bestClusterDist) {
                        bestClusterDist = d;
                        bestNextClusterStar = p;
                    }
                }

                if (bestNextClusterStar) {
                    nextStar = bestNextClusterStar;
                    visitedInChain.clear();
                } else {
                    visitedInChain.clear();
                    nextStar = pickStartStar(candidates);
                }
            }
        }

        activeRunStar = nextStar;
        visitedInChain.add(nextStar);

        const softStrength = Math.min(0.85, 0.24 + leadSignal * 0.58);
        nextStar.solo = Math.max(nextStar.solo, softStrength);
    };

    // Cymbaler / rides vid chorus: tänder alla stjärnor + 1–2 slumpmässiga fyrverkerier
    const triggerChorusCymbals = (now, highVal, level, amp) => {
        if (highVal < 0.72 || now - lastChorusTime < 520) return;
        lastChorusTime = now;

        const visible = particles.filter((p) => p.vis > 0.15);
        if (!visible.length) return;

        const holdBoost = Math.min(1.4, 0.8 + cfg.hold * 0.35);
        for (const p of visible) {
            p.flash = Math.max(p.flash, Math.min(0.8, 0.45 + highVal * 0.3));
            p.sustain = Math.max(p.sustain, Math.min(0.95, (0.52 + highVal * 0.3) * holdBoost));
        }

        const fireworksCount = 1 + Math.round(Math.random()); // 1 eller 2 slumpmässiga fyrverkerier
        for (let f = 0; f < fireworksCount; f++) {
            const origin = visible[(Math.random() * visible.length) | 0];
            spawnSparksAt(origin, Math.min(1, highVal), level, amp);
        }
    };

    // Kicks & Mids -> Mjukare transient-flash + längre sustain när det blir tystare eller spektrat är fullt
    const triggerClusterAndBurst = (now, strength, level, amp, lowPunch, spread, fullSpectrum, isKick) => {
        const candidates = particles.filter((p) => p.vis > 0.25);
        if (!candidates.length) return;

        const clusterCount = fullSpectrum ? (strength > 0.8 ? 3 : 2) : 1;
        const reach = cfg.link * (0.9 + lowPunch * 0.55 + (fullSpectrum ? 0.2 : 0));

        const canSpawnSparks = isKick && (now - lastSparkTime > 320) && spread > 0.35;
        if (canSpawnSparks) {
            lastSparkTime = now;
        }

        const sparksPerCluster = canSpawnSparks ? Math.floor(Math.min(15, Math.round(cfg.burstCount * (0.5 + level * 0.5))) / clusterCount) : 0;
        const holdBoost = Math.min(1.4, 0.75 + cfg.hold * 0.35);

        for (let k = 0; k < clusterCount; k++) {
            const o = candidates[(Math.random() * candidates.length) | 0];
            o.flash = Math.max(o.flash, Math.min(0.75, 0.45 + strength * 0.3));
            o.sustain = Math.max(o.sustain, Math.min(0.9, (0.42 + strength * 0.3 + (fullSpectrum ? 0.18 : 0)) * holdBoost));

            const clusterAmt = Math.min(0.7, 0.35 + lowPunch * 0.35 + (fullSpectrum ? 0.12 : 0));

            for (const p of particles) {
                if (p === o) continue;
                const d = Math.hypot(p.x - o.x, p.y - o.y);

                if (d < reach) {
                    let spatialWeight = 1;
                    if (fullSpectrum && !isKick) {
                        const distFromCenter = Math.abs(p.x - width / 2) / (width / 2);
                        spatialWeight = Math.max(0, 1 - distFromCenter);
                    }
                    const falloff = 1 - d / reach;
                    const amt = clusterAmt * falloff * (0.5 + spatialWeight * 0.5);
                    p.flash = Math.max(p.flash, amt * 0.7);
                    p.sustain = Math.max(p.sustain, amt * holdBoost);
                }
            }

            if (sparksPerCluster > 0) {
                for (let i = 0; i < sparksPerCluster && sparks.length < maxSparks(); i++) {
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
        }
    };

    /* ---------- Loop ---------- */
    let frame = 0;
    let last = performance.now();
    const WHITE = 255;

    const tick = (now) => {
        const dt = Math.min(3, Math.max(0.2, (now - last) / 16.667));
        last = now;
        if (frame++ % 30 === 0) readCfg();

        updateAudio(now, cfg.sens, cfg.hold);

        if (!particlesEnabled) {
            requestAnimationFrame(tick);
            return;
        }

        const e = audio.presence;
        const amp = cfg.reactivity;
        const lowPunch = Math.min(1.2, audio.lowPunch * amp);
        const bass = Math.min(1.1, (audio.bass * 0.5 + audio.pulse * 0.65) * amp);

        // Highs med egen känslighet och decay
        const rawHighSens = Math.min(1.5, audio.high * cfg.highSens * (0.75 + amp * 0.35));
        highSustained = Math.max(rawHighSens, highSustained * Math.pow(cfg.highDecay, dt));
        const high = Math.min(1.35, highSustained);

        const runNote = Math.min(1, audio.runNote * cfg.leadSens);
        const swell = Math.min(1.2, audio.swell * cfg.swellSens * (0.7 + amp * 0.3));
        const level = Math.min(1, (audio.level * 0.8 + high * 0.25) * amp);
        const spread = Math.min(1, audio.spread * (0.8 + amp * 0.25));
        const fullSpectrum = spread > 0.62 && level > 0.32;

        const linkReach = cfg.link * (1 + (lowPunch * 0.3 + bass * 0.2) * e);

        const spectrumSustainBonus = fullSpectrum ? (0.18 + spread * 0.16) * Math.min(1.5, cfg.hold) : 0;
        const sustainDecay = Math.pow(0.955, dt / Math.max(0.5, cfg.hold * (fullSpectrum ? 1.25 : 1)));
        const flashDecay = Math.pow(0.91, dt / Math.max(0.65, Math.sqrt(cfg.hold)));

        const gold = cfg.rgb;
        const mix = Math.min(1, e * 1.3);
        const cr = Math.round(WHITE + (gold[0] - WHITE) * mix);
        const cg = Math.round(WHITE + (gold[1] - WHITE) * mix);
        const cb = Math.round(WHITE + (gold[2] - WHITE) * mix);

        ctx.globalCompositeOperation = 'source-over';
        ctx.globalAlpha = 1;
        ctx.clearRect(0, 0, width, height);

        if (e > 0.25) {
            triggerSoloLead(now, runNote, high, audio.mid, bass, amp, linkReach);
            triggerChorusCymbals(now, high, level, amp);

            const lowPunchTrigger = lowPunch > 0.55 && now - lastLowClusterTime > 380;
            if (audio.kick > 0 || lowPunchTrigger) {
                if (lowPunchTrigger) lastLowClusterTime = now;
                const kickStrength = Math.max(audio.kick, Math.min(1, lowPunch * 0.85));
                triggerClusterAndBurst(
                    now,
                    kickStrength,
                    level,
                    amp,
                    lowPunch,
                    spread,
                    fullSpectrum,
                    audio.kick > 0
                );
            }
        }

        // Uppdatera stjärnor
        const speed = 1 + e * (0.35 + bass * 0.95 + runNote * 0.15 + swell * 0.12);
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

            if (fullSpectrum && e > 0.2) {
                p.sustain = Math.max(p.sustain, spectrumSustainBonus * 0.45);
            }

            p.flash *= flashDecay;
            p.sustain *= sustainDecay;
            p.solo *= Math.pow(0.95, dt);

            const slowWave = 0.65 + 0.35 * Math.sin(now * 0.0014 + p.swellOffset);
            const swellAmt = e > 0.01 ? swell * slowWave : 0;

            let a = p.peakAlpha * p.vis;
            if (e > 0.002) {
                const gentleShimmer = 1 + e * Math.min(0.32, high * 0.24) * Math.sin(now * 0.0045 + p.phase);
                const fullBoost = fullSpectrum ? (1 + spread * 0.22 * Math.min(1.5, cfg.hold)) : 1;
                a = a * (1 + e * cfg.boost * (0.4 + bass * 0.8 + level * 0.55 + high * 0.35 + runNote * 0.25 + swellAmt * 0.65) * fullBoost) * gentleShimmer
                    + p.flash * 0.42 * (0.4 + 0.6 * p.vis)
                    + p.sustain * 0.48 * (0.45 + 0.55 * p.vis)
                    + swellAmt * 0.28 * (0.45 + 0.55 * p.vis)
                    + p.solo * 0.62 * (0.5 + 0.5 * p.vis);
            }
            p.a = Math.min(1, a);
            p.rr = p.r * (1 + e * 0.3 + e * lowPunch * 0.35 + p.flash * 0.85 + p.sustain * 0.65 + swellAmt * 0.35 + p.solo * 0.68);
        }

        // Konstellationslinjer + glöd + gnistor (additiv blandning)
        if (e > 0.01 || sparks.length) {
            ctx.globalCompositeOperation = 'lighter';

            if (cfg.lines > 0 && e > 0.01) {
                const D = linkReach;
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
                        const accent = Math.max(p.flash * 0.7, q.flash * 0.7, p.sustain, q.sustain);
                        const la = (f * f * (0.09 + 0.42 * bass + 0.18 * lowPunch + 0.12 * swell) * Math.min(p.vis, q.vis) * e
                            + accent * 0.32 * f) * cfg.lines;
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
                    const s = p.rr * (4.8 + e * 3.4 + p.flash * 4.5 + p.sustain * 4.2 + swell * 2.2 + p.solo * 4.4) * cfg.glow;
                    ctx.globalAlpha = Math.min(1, p.a * cfg.glowOpacity * e * (1.8 + p.solo * 0.5));
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
                s.vy = s.vy * Math.pow(0.968, dt) + 0.012 * dt;
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