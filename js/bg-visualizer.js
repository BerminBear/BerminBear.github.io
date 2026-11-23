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
        canvas.style.filter = "blur(0.6px)";
        document.body.prepend(canvas);
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    let currentPreset = PRESETS.includes(preset) ? preset : "horizon";
    let audioCtx = null;
    let analyser = null;
    let freqData = null;
    let timeData = null;
    const connectedElements = new WeakSet();

    let trackedMedia = null;
    let presence = 0; // 0 = helt osynlig, 1 = aktiv i bakgrunden
    let smoothBass = 0;
    let smoothMid = 0;
    let smoothHigh = 0;

    function ensureAudioGraph(mediaEl) {
        if (!mediaEl) return;
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (!AudioContextClass) return;

        if (!audioCtx) {
            audioCtx = new AudioContextClass();
            analyser = audioCtx.createAnalyser();
            analyser.fftSize = 256;
            analyser.smoothingTimeConstant = 0.86;
            freqData = new Uint8Array(analyser.frequencyBinCount);
            timeData = new Uint8Array(analyser.fftSize);
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
                // Elementet kan redan vara kopplat till en annan AudioContext
            }
        }
    }

    // Fångar automatiskt upp alla <audio>-element på sidan när de börjar spela
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

    function sampleBands() {
        if (!analyser || !freqData) {
            smoothBass *= 0.92;
            smoothMid *= 0.92;
            smoothHigh *= 0.92;
            return;
        }

        analyser.getByteFrequencyData(freqData);
        if (timeData) analyser.getByteTimeDomainData(timeData);

        const len = freqData.length;
        const bassEnd = Math.max(1, Math.floor(len * 0.12));
        const midEnd = Math.max(bassEnd + 1, Math.floor(len * 0.48));

        let bassSum = 0;
        for (let i = 0; i < bassEnd; i++) bassSum += freqData[i];

        let midSum = 0;
        for (let i = bassEnd; i < midEnd; i++) midSum += freqData[i];

        let highSum = 0;
        for (let i = midEnd; i < len; i++) highSum += freqData[i];

        const bass = bassSum / (bassEnd * 255);
        const mid = midSum / ((midEnd - bassEnd) * 255);
        const high = highSum / ((len - midEnd) * 255);

        smoothBass += (bass - smoothBass) * 0.14;
        smoothMid += (mid - smoothMid) * 0.14;
        smoothHigh += (high - smoothHigh) * 0.16;
    }

    function drawHorizon(width, height, t) {
        const baseY = height * 0.64;
        const layers = 3;

        for (let l = 0; l < layers; l++) {
            ctx.beginPath();
            const steps = 80;
            const layerFade = 1 - l * 0.28;

            for (let i = 0; i <= steps; i++) {
                const u = i / steps;
                const x = u * width;
                const edgeDamp = Math.sin(u * Math.PI); // dämpa ut mot skärmkanterna

                const binIdx = freqData
                    ? Math.min(freqData.length - 1, Math.floor(u * (freqData.length * 0.65)))
                    : 0;
                const binVal = freqData ? freqData[binIdx] / 255 : 0;

                const waveA = Math.sin(u * Math.PI * (2.5 + l * 0.9) + t * (0.55 + l * 0.22));
                const waveB = Math.cos(u * Math.PI * (5.0 - l * 0.6) - t * 0.35);

                const amplitude = (10 + smoothBass * 36 + binVal * 28) * edgeDamp * presence * layerFade;
                const y = baseY + l * 22 + (waveA * 0.7 + waveB * 0.3) * amplitude;

                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }

            const alpha = (0.11 * presence * layerFade).toFixed(4);
            ctx.strokeStyle = `rgba(214, 184, 128, ${alpha})`;
            ctx.lineWidth = l === 0 ? 1.5 : 1;
            ctx.stroke();
        }
    }

    function drawRings(width, height, t) {
        const cx = width * 0.68;
        const cy = height * 0.5;
        const maxRadius = Math.min(width, height) * 0.44;
        const ringCount = 5;

        for (let r = 0; r < ringCount; r++) {
            const ratio = (r + 1) / ringCount;
            const binIdx = freqData ? Math.min(freqData.length - 1, r * 7) : 0;
            const binVal = freqData ? freqData[binIdx] / 255 : 0;

            const pulse = (smoothBass * 28 + binVal * 18) * (1 - ratio * 0.35) * presence;
            const drift = Math.sin(t * 0.6 + r * 1.1) * 4 * presence;
            const radius = maxRadius * (0.22 + ratio * 0.72) + pulse + drift;

            ctx.beginPath();
            ctx.arc(cx, cy, Math.max(8, radius), 0, Math.PI * 2);
            const alpha = (0.105 * presence * (1 - r * 0.15)).toFixed(4);
            ctx.strokeStyle = `rgba(214, 184, 128, ${alpha})`;
            ctx.lineWidth = r === 0 ? 1.4 : 1;
            ctx.stroke();
        }
    }

    function drawBars(width, height) {
        const barCount = 42;
        const span = Math.min(width * 0.62, 860);
        const startX = width * 0.68 - span * 0.5;
        const baseY = height * 0.72;
        const step = span / barCount;
        const barW = Math.max(2, step * 0.34);

        for (let i = 0; i < barCount; i++) {
            const u = i / Math.max(1, barCount - 1);
            const edgeDamp = Math.sin(u * Math.PI);
            const binIdx = freqData
                ? Math.min(freqData.length - 1, Math.floor(u * (freqData.length * 0.65)))
                : 0;
            const binVal = freqData ? freqData[binIdx] / 255 : 0;

            const barH = (4 + (binVal * 105 + smoothMid * 25) * edgeDamp) * presence;
            const x = startX + i * step;
            const alpha = (0.095 * presence * (0.4 + 0.6 * edgeDamp)).toFixed(4);

            ctx.fillStyle = `rgba(214, 184, 128, ${alpha})`;
            ctx.beginPath();
            ctx.roundRect(x, baseY - barH, barW, barH, 1.5);
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

        const targetPresence = isPlaying ? 1 : 0;
        presence += (targetPresence - presence) * 0.04;

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
            if (isPlaying) sampleBands();
            const t = nowMs / 1000;

            if (currentPreset === "rings") {
                drawRings(width, height, t);
            } else if (currentPreset === "bars") {
                drawBars(width, height);
            } else {
                drawHorizon(width, height, t);
            }
        }

        ctx.restore();
        requestAnimationFrame(render);
    }

    requestAnimationFrame(render);

    // Liten diskret preset-växlare i nedre högra hörnet så du kan testa alla 3 lägen
    let switcherEl = null;
    if (showSwitcher) {
        switcherEl = document.createElement("button");
        switcherEl.type = "button";
        switcherEl.className =
            "fixed bottom-4 right-4 z-40 hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border border-[var(--color-accent-border)] bg-[var(--color-modal-bg)]/90 text-[10px] uppercase tracking-widest text-[var(--color-muted)] hover:text-[var(--color-accent-hover)]";
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