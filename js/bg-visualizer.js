// js/bg-visualizer.js
// Musik-reaktiv bakgrundsvisualizer. Allt utseende styrs från style.css via --viz-* variabler.

const STYLES = ["horizon", "rings", "bars", "mirror", "radial"];

export function initBgVisualizer({ showSwitcher = false } = {}) {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return null;

    let canvas = document.getElementById("distant-bg-visualizer");
    if (!canvas) {
        canvas = document.createElement("canvas");
        canvas.id = "distant-bg-visualizer";
        canvas.setAttribute("aria-hidden", "true");
        document.body.prepend(canvas);
    }
    // Ligger över partiklarna (z 0) men under allt innehåll (main = z 20)
    canvas.style.cssText = "position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:var(--viz-z, 1);";

    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    /* ---------- Config från CSS ---------- */
    const rootStyle = getComputedStyle(document.documentElement);
    const cfg = {};
    function readConfig() {
        const num = (name, fallback) => {
            const v = parseFloat(rootStyle.getPropertyValue(name));
            return Number.isFinite(v) ? v : fallback;
        };
        const str = (name, fallback) => {
            const v = rootStyle.getPropertyValue(name).trim().replace(/^["']|["']$/g, "");
            return v || fallback;
        };
        cfg.style = styleOverride || str("--viz-style", "horizon");
        if (!STYLES.includes(cfg.style)) cfg.style = "horizon";
        cfg.rgb = str("--viz-rgb", "231, 198, 126");
        cfg.rgb2 = str("--viz-rgb-2", "214, 184, 128");
        cfg.opacity = num("--viz-opacity", 1);
        cfg.intensity = num("--viz-intensity", 1);
        cfg.lineWidth = num("--viz-line-width", 2.2);
        cfg.glow = num("--viz-glow", 12);
        cfg.fill = num("--viz-fill-opacity", 0.24);
        cfg.bars = Math.max(8, Math.round(num("--viz-bars", 48)));
        cfg.barRadius = num("--viz-bar-radius", 2);
        cfg.barGap = Math.min(0.9, Math.max(0, num("--viz-bar-gap", 0.52)));
        cfg.span = Math.min(1, Math.max(0.1, num("--viz-span", 0.72)));
        cfg.x = num("--viz-x", 0.65);
        cfg.y = num("--viz-y", 0.62);
        cfg.size = num("--viz-size", 0.45);
        cfg.smoothing = num("--viz-smoothing", 0.16);
        cfg.fade = num("--viz-fade-speed", 0.06);
    }

    let styleOverride = null;
    readConfig();

    /* ---------- Audio ---------- */
    let audioCtx = null, analyser = null, freqData = null;
    const connected = new WeakSet();
    const blocked = new WeakSet();
    let trackedMedia = null;
    let presence = 0, bass = 0, mid = 0, high = 0;

    function ensureAudioGraph(el) {
        if (!el || blocked.has(el)) return;
        const Ctor = window.AudioContext || window.webkitAudioContext;
        if (!Ctor) return;
        if (!audioCtx) {
            audioCtx = new Ctor();
            analyser = audioCtx.createAnalyser();
            analyser.fftSize = 512;
            analyser.smoothingTimeConstant = 0.8;
            freqData = new Uint8Array(analyser.frequencyBinCount);
            analyser.connect(audioCtx.destination);
        }
        if (audioCtx.state === "suspended") audioCtx.resume().catch(() => {});
        if (!connected.has(el)) {
            try {
                audioCtx.createMediaElementSource(el).connect(analyser);
                connected.add(el);
            } catch (_) {
                blocked.add(el);
            }
        }
    }

    document.addEventListener("play", (e) => {
        if (!(e.target instanceof HTMLAudioElement)) return;
        trackedMedia = e.target;
        ensureAudioGraph(e.target);
    }, true);

    const rgba = (rgb, a) => `rgba(${rgb}, ${Math.max(0, Math.min(1, a)).toFixed(4)})`;

    // Hämtar 0..1 för position u (0..1) i spektrat, med lite basfokus
    function bin(u, live, t) {
        if (!live) return 0.28 + 0.22 * Math.abs(Math.sin(u * 11 + t * 2.4));
        const i = Math.min(freqData.length - 1, Math.floor(Math.pow(u, 1.35) * freqData.length * 0.7));
        return freqData[i] / 255;
    }

    function sampleBands(t, live) {
        const k = cfg.smoothing;
        let b, m, h;
        if (!live) {
            b = 0.34 + 0.22 * Math.sin(t * 1.9);
            m = 0.28 + 0.2 * Math.cos(t * 2.7);
            h = 0.22 + 0.16 * Math.sin(t * 4.1);
        } else {
            analyser.getByteFrequencyData(freqData);
            const len = freqData.length;
            const bEnd = Math.max(1, Math.floor(len * 0.08));
            const mEnd = Math.max(bEnd + 1, Math.floor(len * 0.35));
            const avg = (a, z) => { let s = 0; for (let i = a; i < z; i++) s += freqData[i]; return s / ((z - a) * 255); };
            b = avg(0, bEnd); m = avg(bEnd, mEnd); h = avg(mEnd, len);
        }
        bass += (b - bass) * k; mid += (m - mid) * k; high += (h - high) * k;
    }

    /* ---------- Stilar ---------- */
    function drawHorizon(w, h, t, live) {
        const baseY = h * cfg.y, steps = 120, pts = [];
        for (let i = 0; i <= steps; i++) {
            const u = i / steps;
            const edge = Math.pow(Math.sin(u * Math.PI), 0.75);
            const v = bin(u, live, t);
            const wave = Math.sin(u * Math.PI * 3 + t * 0.75) * 0.65 + Math.cos(u * Math.PI * 5.5 - t * 0.45) * 0.35;
            const detail = Math.sin(u * Math.PI * 11 + t * 1.4) * (0.2 + high * 0.6) * 0.35;
            const amp = (18 + bass * 54 + v * 46) * edge * presence * cfg.intensity;
            pts.push([u * w, baseY + (wave + detail) * amp]);
        }
        const path = () => { ctx.beginPath(); pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); };

        const g = ctx.createLinearGradient(0, baseY - 80, 0, Math.min(h, baseY + 220));
        g.addColorStop(0, rgba(cfg.rgb, cfg.fill * presence));
        g.addColorStop(0.55, rgba(cfg.rgb2, cfg.fill * 0.4 * presence));
        g.addColorStop(1, rgba(cfg.rgb2, 0));
        path(); ctx.lineTo(w, h); ctx.lineTo(0, h); ctx.closePath();
        ctx.fillStyle = g; ctx.fill();

        // Sekundär våg
        ctx.beginPath();
        for (let i = 0; i <= steps; i++) {
            const u = i / steps;
            const y = baseY + 28 + Math.sin(u * Math.PI * 2.2 - t * 0.55 + 0.9) * (16 + mid * 36) * Math.sin(u * Math.PI) * presence * cfg.intensity;
            i ? ctx.lineTo(u * w, y) : ctx.moveTo(u * w, y);
        }
        ctx.strokeStyle = rgba(cfg.rgb2, 0.28 * presence);
        ctx.lineWidth = cfg.lineWidth * 0.7;
        ctx.stroke();

        // Huvudkurva
        ctx.save();
        ctx.shadowColor = rgba(cfg.rgb, 0.55 * presence);
        ctx.shadowBlur = cfg.glow;
        path();
        ctx.strokeStyle = rgba(cfg.rgb, 0.52 * presence);
        ctx.lineWidth = cfg.lineWidth;
        ctx.stroke();
        ctx.restore();
    }

    function drawRings(w, h, t, live) {
        const cx = w * cfg.x, cy = h * cfg.y;
        const maxR = Math.min(w, h) * cfg.size;
        const n = 5;
        for (let r = n - 1; r >= 0; r--) {
            const ratio = (r + 1) / n;
            const v = live ? freqData[Math.min(freqData.length - 1, r * 8)] / 255 : 0.3 + 0.2 * Math.sin(t * 2.2 + r);
            const pulse = (bass * 38 + v * 26) * (1 - ratio * 0.25) * presence * cfg.intensity;
            const drift = Math.sin(t * 0.8 + r * 1.1) * 5 * presence;
            const radius = Math.max(10, maxR * (0.2 + ratio * 0.75) + pulse + drift);
            ctx.save();
            ctx.shadowColor = rgba(cfg.rgb, 0.5 * presence);
            ctx.shadowBlur = cfg.glow;
            ctx.beginPath();
            ctx.arc(cx, cy, radius, 0, Math.PI * 2);
            ctx.strokeStyle = rgba(cfg.rgb, 0.38 * presence * (1 - r * 0.14));
            ctx.lineWidth = r === 0 ? cfg.lineWidth : cfg.lineWidth * 0.7;
            ctx.stroke();
            ctx.restore();
            if (r === 1 || r === 3) {
                ctx.fillStyle = rgba(cfg.rgb2, cfg.fill * 0.25 * presence);
                ctx.fill();
            }
        }
    }

    function barLayout(w) {
        const span = w * cfg.span;
        const startX = w * 0.5 - span / 2;
        const step = span / cfg.bars;
        return { startX, step, barW: Math.max(2, step * cfg.barGap) };
    }

    function drawBars(w, h, t, live) {
        const { startX, step, barW } = barLayout(w);
        const baseY = h * cfg.y;
        for (let i = 0; i < cfg.bars; i++) {
            const u = i / Math.max(1, cfg.bars - 1);
            const edge = Math.pow(Math.sin(u * Math.PI), 0.7);
            const barH = (8 + (bin(u, live, t) * 135 + bass * 36 + mid * 24) * edge * cfg.intensity) * presence;
            const x = startX + i * step;
            const g = ctx.createLinearGradient(0, baseY - barH, 0, baseY);
            g.addColorStop(0, rgba(cfg.rgb, 0.52 * presence * (0.5 + 0.5 * edge)));
            g.addColorStop(1, rgba(cfg.rgb2, 0.18 * presence * (0.5 + 0.5 * edge)));
            ctx.fillStyle = g;
            ctx.beginPath();
            ctx.roundRect(x, baseY - barH, barW, barH, cfg.barRadius);
            ctx.fill();
        }
    }

    function drawMirror(w, h, t, live) {
        const { startX, step, barW } = barLayout(w);
        const cy = h * cfg.y;
        ctx.save();
        ctx.shadowColor = rgba(cfg.rgb, 0.45 * presence);
        ctx.shadowBlur = cfg.glow;
        for (let i = 0; i < cfg.bars; i++) {
            const u = i / Math.max(1, cfg.bars - 1);
            const edge = Math.pow(Math.sin(u * Math.PI), 0.6);
            const half = (4 + (bin(u, live, t) * 110 + bass * 30) * edge * cfg.intensity) * presence;
            const x = startX + i * step;
            const g = ctx.createLinearGradient(0, cy - half, 0, cy + half);
            g.addColorStop(0, rgba(cfg.rgb, 0.06 * presence));
            g.addColorStop(0.5, rgba(cfg.rgb, 0.5 * presence * (0.5 + 0.5 * edge)));
            g.addColorStop(1, rgba(cfg.rgb2, 0.06 * presence));
            ctx.fillStyle = g;
            ctx.beginPath();
            ctx.roundRect(x, cy - half, barW, half * 2, cfg.barRadius);
            ctx.fill();
        }
        ctx.restore();
    }

    function drawRadial(w, h, t, live) {
        const cx = w * cfg.x, cy = h * cfg.y;
        const inner = Math.min(w, h) * cfg.size * 0.5 + bass * 14 * presence * cfg.intensity;
        const n = cfg.bars * 2;
        ctx.save();
        ctx.lineCap = "round";
        ctx.shadowColor = rgba(cfg.rgb, 0.5 * presence);
        ctx.shadowBlur = cfg.glow;
        ctx.lineWidth = Math.max(1.5, cfg.lineWidth);
        for (let i = 0; i < n; i++) {
            const u = i / n;
            const mirrored = u < 0.5 ? u * 2 : (1 - u) * 2; // spegla så cirkeln blir symmetrisk
            const len = (6 + bin(mirrored, live, t) * 90 * cfg.intensity + bass * 20) * presence;
            const a = u * Math.PI * 2 - Math.PI / 2 + t * 0.05;
            ctx.beginPath();
            ctx.moveTo(cx + Math.cos(a) * inner, cy + Math.sin(a) * inner);
            ctx.lineTo(cx + Math.cos(a) * (inner + len), cy + Math.sin(a) * (inner + len));
            ctx.strokeStyle = rgba(i % 2 ? cfg.rgb : cfg.rgb2, 0.5 * presence);
            ctx.stroke();
        }
        ctx.restore();
    }

    const DRAW = { horizon: drawHorizon, rings: drawRings, bars: drawBars, mirror: drawMirror, radial: drawRadial };

    /* ---------- Render-loop ---------- */
    let frame = 0;
    function render(nowMs) {
        const playing = Boolean(trackedMedia && !trackedMedia.paused && !trackedMedia.ended && !trackedMedia.muted);
        const live = Boolean(trackedMedia && connected.has(trackedMedia) && analyser && freqData);

        // Läs om CSS regelbundet så ändringar i style.css/DevTools slår igenom live
        if (frame++ % 20 === 0) readConfig();

        presence += ((playing ? 1 : 0) - presence) * cfg.fade;

        const w = window.innerWidth, h = window.innerHeight;
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        if (canvas.width !== Math.floor(w * dpr) || canvas.height !== Math.floor(h * dpr)) {
            canvas.width = Math.floor(w * dpr);
            canvas.height = Math.floor(h * dpr);
        }

        ctx.save();
        ctx.scale(dpr, dpr);
        ctx.clearRect(0, 0, w, h);
        if (presence > 0.008) {
            ctx.globalAlpha = cfg.opacity;
            const t = nowMs / 1000;
            sampleBands(t, live);
            DRAW[cfg.style](w, h, t, live);
        }
        ctx.restore();
        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);

    /* ---------- Valfri stilbytare (för test) ---------- */
    let switcherEl = null;
    if (showSwitcher) {
        switcherEl = document.createElement("button");
        switcherEl.type = "button";
        switcherEl.className = "fixed bottom-4 right-4 z-40 inline-flex items-center px-2.5 py-1.5 rounded-md border border-[var(--color-accent-border)] bg-[var(--color-modal-bg)]/95 text-[10px] uppercase tracking-widest text-[var(--color-muted)] hover:text-[var(--color-accent-hover)]";
        const label = () => (switcherEl.textContent = `BG Viz: ${cfg.style}`);
        label();
        switcherEl.addEventListener("click", () => {
            styleOverride = STYLES[(STYLES.indexOf(cfg.style) + 1) % STYLES.length];
            readConfig();
            label();
        });
        document.body.appendChild(switcherEl);
    }

    return {
        setStyle(name) { if (STYLES.includes(name)) { styleOverride = name; readConfig(); } }
    };
}