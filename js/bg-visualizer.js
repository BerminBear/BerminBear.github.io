// js/bg-visualizer.js

const PRESETS = ["horizon", "rings", "bars"];

export function initBgVisualizer({
    preset = "horizon",
    showSwitcher = true
} = {}) {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return null;

    let canvas = document.getElementById("distant-bg-visualizer");
    if (!canvas) {
        canvas = document.createElement("canvas");
        canvas.id = "distant-bg-visualizer";
        canvas.setAttribute("aria-hidden", "true");
        canvas.className = "fixed inset-0 w-full h-full pointer-events-none z-[1]";
        document.body.prepend(canvas);
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    let currentPreset = PRESETS.includes(preset) ? preset : "horizon";
    let audioCtx = null;
    let analyser = null;
    let freqData = null;
    const connectedElements = new WeakSet();
    const blockedElements = new WeakSet();

    let trackedMedia = null;
    let presence = 0;
    let smoothBass = 0;
    let smoothMid = 0;
    let smoothHigh = 0;

    function ensureAudioGraph(mediaEl) {
        if (!mediaEl || blockedElements.has(mediaEl)) return;
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (!AudioContextClass) return;

        if (!audioCtx) {
            audioCtx = new AudioContextClass();
            analyser = audioCtx.createAnalyser();
            analyser.fftSize = 256;
            analyser.smoothingTimeConstant = 0.82;
            freqData = new Uint8Array(analyser.frequencyBinCount);
            analyser.connect(audioCtx.destination);
        }

        if (audioCtx.state === "suspended") {
            audioCtx.resume().catch(() => {});
        }

        if (!connectedElements.has(mediaEl)) {
            try {
                const source = audioCtx.createMediaElementSource(mediaEl);
                source.connect(analyser);
                connectedElements.add(mediaEl);
            } catch (_) {
                blockedElements.add(mediaEl);
            }
        }
    }

    document.addEventListener(
        "play",
        (e) => {
            const target = e.target;
            if (!(target instanceof HTMLAudioElement)) return;
            trackedMedia = target;
            ensureAudioGraph(target);
        },
        true
    );

    function sampleBands(t, hasLiveAnalyser) {
        if (!hasLiveAnalyser || !analyser || !freqData) {
            const synthBass = 0.34 + 0.22 * Math.sin(t * 1.9);
            const synthMid = 0.28 + 0.2 * Math.cos(t * 2.7);
            const synthHigh = 0.22 + 0.16 * Math.sin(t * 4.1);
            smoothBass += (synthBass - smoothBass) * 0.14;
            smoothMid += (synthMid - smoothMid) * 0.14;
            smoothHigh += (synthHigh - smoothHigh) * 0.15;
            return;
        }

        analyser.getByteFrequencyData(freqData);

        const len = freqData.length;
        const bassEnd = Math.max(1, Math.floor(len * 0.14));
        const midEnd = Math.max(bassEnd + 1, Math.floor(len * 0.5));

        let bassSum = 0;
        for (let i = 0; i < bassEnd; i++) bassSum += freqData[i];

        let midSum = 0;
        for (let i = bassEnd; i < midEnd; i++) midSum += freqData[i];

        let highSum = 0;
        for (let i = midEnd; i < len; i++) highSum += freqData[i];

        const bass = bassSum / (bassEnd * 255);
        const mid = midSum / ((midEnd - bassEnd) * 255);
        const high = highSum / ((len - midEnd) * 255);

        smoothBass += (bass - smoothBass) * 0.16;
        smoothMid += (mid - smoothMid) * 0.16;
        smoothHigh += (high - smoothHigh) * 0.18;
    }

    function drawHorizon(width, height, t, hasLiveAnalyser) {
        const baseY = height * 0.62;
        const steps = 96;
        const points = [];

        for (let i = 0; i <= steps; i++) {
            const u = i / steps;
            const x = u * width;
            const edgeDamp = Math.pow(Math.sin(u * Math.PI), 0.75);

            const binIdx = hasLiveAnalyser && freqData
                ? Math.min(freqData.length - 1, Math.floor(u * (freqData.length * 0.72)))
                : 0;
            const binVal = hasLiveAnalyser && freqData
                ? freqData[binIdx] / 255
                : 0.3 + 0.22 * Math.sin(u * 12 + t * 2.4);

            const primaryWave =
                Math.sin(u * Math.PI * 3.0 + t * 0.75) * 0.65 +
                Math.cos(u * Math.PI * 5.5 - t * 0.45) * 0.35;
            const detailWave = Math.sin(u * Math.PI * 11.0 + t * 1.4) * (0.2 + smoothHigh * 0.6);

            const amp = (18 + smoothBass * 54 + binVal * 46) * edgeDamp * presence;
            const y = baseY + (primaryWave + detailWave * 0.35) * amp;
            points.push({ x, y });
        }

        // Fyllt band nedåt från huvudkurvan för mer kropp och djup
        const fillGrad = ctx.createLinearGradient(0, baseY - 80, 0, Math.min(height, baseY + 210));
        fillGrad.addColorStop(0, `rgba(231, 198, 126, ${(0.24 * presence).toFixed(4)})`);
        fillGrad.addColorStop(0.55, `rgba(214, 184, 128, ${(0.09 * presence).toFixed(4)})`);
        fillGrad.addColorStop(1, "rgba(214, 184, 128, 0)");

        ctx.beginPath();
        points.forEach((pt, idx) => {
            if (idx === 0) ctx.moveTo(pt.x, pt.y);
            else ctx.lineTo(pt.x, pt.y);
        });
        ctx.lineTo(width, height);
        ctx.lineTo(0, height);
        ctx.closePath();
        ctx.fillStyle = fillGrad;
        ctx.fill();

        // Sekundär fyllig undre våg
        ctx.beginPath();
        for (let i = 0; i <= steps; i++) {
            const u = i / steps;
            const x = u * width;
            const edgeDamp = Math.sin(u * Math.PI);
            const wave2 = Math.sin(u * Math.PI * 2.2 - t * 0.55 + 0.9) * (16 + smoothMid * 36) * edgeDamp * presence;
            const y = baseY + 28 + wave2;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = `rgba(214, 184, 128, ${(0.28 * presence).toFixed(4)})`;
        ctx.lineWidth = 1.6;
        ctx.stroke();

        // Tydlig huvudkurva med mjukt glow
        ctx.save();
        ctx.shadowColor = `rgba(231, 198, 126, ${(0.55 * presence).toFixed(3)})`;
        ctx.shadowBlur = 12;
        ctx.beginPath();
        points.forEach((pt, idx) => {
            if (idx === 0) ctx.moveTo(pt.x, pt.y);
            else ctx.lineTo(pt.x, pt.y);
        });
        ctx.strokeStyle = `rgba(231, 198, 126, ${(0.52 * presence).toFixed(4)})`;
        ctx.lineWidth = 2.2;
        ctx.stroke();
        ctx.restore();
    }

    function drawRings(width, height, t, hasLiveAnalyser) {
        const cx = width * 0.65;
        const cy = height * 0.52;
        const maxRadius = Math.min(width, height) * 0.45;
        const ringCount = 5;

        for (let r = ringCount - 1; r >= 0; r--) {
            const ratio = (r + 1) / ringCount;
            const binIdx = hasLiveAnalyser && freqData ? Math.min(freqData.length - 1, r * 8) : 0;
            const binVal = hasLiveAnalyser && freqData
                ? freqData[binIdx] / 255
                : 0.3 + 0.2 * Math.sin(t * 2.2 + r);

            const pulse = (smoothBass * 38 + binVal * 26) * (1 - ratio * 0.25) * presence;
            const drift = Math.sin(t * 0.8 + r * 1.1) * 5 * presence;
            const radius = Math.max(10, maxRadius * (0.2 + ratio * 0.75) + pulse + drift);

            ctx.beginPath();
            ctx.arc(cx, cy, radius, 0, Math.PI * 2);
            const ringAlpha = (0.38 * presence * (1 - r * 0.14)).toFixed(4);
            ctx.strokeStyle = `rgba(231, 198, 126, ${ringAlpha})`;
            ctx.lineWidth = r === 0 ? 2.2 : 1.5;
            ctx.stroke();

            if (r === 1 || r === 3) {
                ctx.fillStyle = `rgba(214, 184, 128, ${(0.055 * presence).toFixed(4)})`;
                ctx.fill();
            }
        }
    }

    function drawBars(width, height, t, hasLiveAnalyser) {
        const barCount = 48;
        const span = Math.min(width * 0.72, 920);
        const startX = width * 0.5 - span * 0.5 + (width > 900 ? width * 0.12 : 0);
        const baseY = height * 0.7;
        const step = span / barCount;
        const barW = Math.max(3, step * 0.48);

        for (let i = 0; i < barCount; i++) {
            const u = i / Math.max(1, barCount - 1);
            const edgeDamp = Math.pow(Math.sin(u * Math.PI), 0.7);
            const binIdx = hasLiveAnalyser && freqData
                ? Math.min(freqData.length - 1, Math.floor(u * (freqData.length * 0.72)))
                : 0;
            const binVal = hasLiveAnalyser && freqData
                ? freqData[binIdx] / 255
                : 0.25 + 0.25 * Math.abs(Math.sin(u * 12 + t * 2.6));

            const barH = (8 + (binVal * 135 + smoothBass * 36 + smoothMid * 24) * edgeDamp) * presence;
            const x = startX + i * step;

            const barGrad = ctx.createLinearGradient(0, baseY - barH, 0, baseY);
            barGrad.addColorStop(0, `rgba(239, 225, 195, ${(0.52 * presence * (0.5 + 0.5 * edgeDamp)).toFixed(4)})`);
            barGrad.addColorStop(1, `rgba(214, 184, 128, ${(0.18 * presence * (0.5 + 0.5 * edgeDamp)).toFixed(4)})`);

            ctx.fillStyle = barGrad;
            ctx.beginPath();
            ctx.roundRect(x, baseY - barH, barW, barH, 2);
            ctx.fill();
        }
    }

    function render(nowMs) {
        const isPlaying = Boolean(
            trackedMedia &&
            !trackedMedia.paused &&
            !trackedMedia.ended &&
            !trackedMedia.muted
        );

        const hasLiveAnalyser = Boolean(
            trackedMedia &&
            connectedElements.has(trackedMedia) &&
            analyser &&
            freqData
        );

        const targetPresence = isPlaying ? 1 : 0;
        presence += (targetPresence - presence) * 0.06;

        const width = window.innerWidth;
        const height = window.innerHeight;
        const dpr = Math.min(window.devicePixelRatio || 1, 2);

        if (canvas.width !== Math.floor(width * dpr) || canvas.height !== Math.floor(height * dpr)) {
            canvas.width = Math.floor(width * dpr);
            canvas.height = Math.floor(height * dpr);
        }

        ctx.save();
        ctx.scale(dpr, dpr);
        ctx.clearRect(0, 0, width, height);

        if (presence > 0.008) {
            const t = nowMs / 1000;
            sampleBands(t, hasLiveAnalyser);

            if (currentPreset === "rings") {
                drawRings(width, height, t, hasLiveAnalyser);
            } else if (currentPreset === "bars") {
                drawBars(width, height, t, hasLiveAnalyser);
            } else {
                drawHorizon(width, height, t, hasLiveAnalyser);
            }
        }

        ctx.restore();
        requestAnimationFrame(render);
    }

    requestAnimationFrame(render);

    let switcherEl = null;
    if (showSwitcher) {
        switcherEl = document.createElement("button");
        switcherEl.type = "button";
        switcherEl.className =
            "fixed bottom-4 right-4 z-40 inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border border-[var(--color-accent-border)] bg-[var(--color-modal-bg)]/95 text-[10px] uppercase tracking-widest text-[var(--color-muted)] hover:text-[var(--color-accent-hover)]";
        switcherEl.title = "Byt bakgrundsvisualizer";
        const updateLabel = () => {
            switcherEl.textContent = `BG Viz: ${currentPreset}`;
        };
        updateLabel();

        switcherEl.addEventListener("click", () => {
            const nextIdx = (PRESETS.indexOf(currentPreset) + 1) % PRESETS.length;
            currentPreset = PRESETS[nextIdx];
            updateLabel();
        });

        document.body.appendChild(switcherEl);
    }

    return {
        setPreset(nextPreset) {
            if (PRESETS.includes(nextPreset)) {
                currentPreset = nextPreset;
                if (switcherEl) switcherEl.textContent = `BG Viz: ${currentPreset}`;
            }
        }
    };
}