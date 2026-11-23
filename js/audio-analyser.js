// js/audio-analyser.js
// Delad ljudanalys för hela sidan. Lyssnar på alla <audio>-element och
// exponerar nivåer (bass/lowPunch/snare/mid/high/runNote/swell/level/spread) och kick-händelser i `audio`.
// Anropa updateAudio(now, sensitivity, hold) en gång per frame.

export const audio = {
    playing: false,   // spelar ett ljudspår just nu
    live: false,      // riktig analys (false = syntetisk reserv-puls)
    presence: 0,      // 0..1, mjuk in/ut-tonning vid play/pause
    bass: 0,          // 0..1 jämnad bas (40–250 Hz)
    lowPunch: 0,      // 0..1 kick-kropp (40–200 Hz)
    snare: 0,         // 0..1 snare-transient/kropp (150–500 Hz)
    mid: 0,
    high: 0,
    runNote: 0,       // 0..1 kontur för melodiska runs / legato (flöjt, stråke, brass)
    swell: 0,         // 0..1 långsamt svällande nivå för uthållna toner / french horn legato
    level: 0,         // 0..1 total ljudstyrka
    spread: 0,        // 0..1 hur brett spektrat är fyllt över bas, mid och high
    pulse: 0,         // 0..1 kort puls som skjuter i höjden vid kick och dör ut
    kick: 0           // >0 endast under den frame en kick upptäcks (styrka 0..1)
};

let ctx = null, analyser = null, data = null, tracked = null;
let lowPunchR = [1, 5], snareR = [3, 12], bassR = [1, 6], midR = [7, 46], highR = [46, 230], leadR = [7, 105], hornHighR = [58, 174], levelEnd = 256;
let prevLeadBins = null;
let bassAvg = 0, snareAvg = 0, runSmooth = 0, swellSmooth = 0, lastKick = 0, synthBar = -1;
const connected = new WeakSet();
const blocked = new WeakSet();

function ensureContext() {
    if (ctx) return ctx;
    const Ctor = window.AudioContext || window.webkitAudioContext;
    if (!Ctor) return null;
    try { ctx = new Ctor(); } catch (_) { return null; }

    analyser = ctx.createAnalyser();
    analyser.fftSize = 1024;
    analyser.smoothingTimeConstant = 0.55;
    analyser.minDecibels = -88;
    analyser.maxDecibels = -22;
    data = new Uint8Array(analyser.frequencyBinCount);
    analyser.connect(ctx.destination);

    const hz = ctx.sampleRate / analyser.fftSize;
    const idx = (f) => Math.max(1, Math.min(data.length - 1, Math.round(f / hz)));
    lowPunchR = [idx(40), idx(200) + 1];
    snareR = [idx(150), idx(500) + 1];
    bassR = [idx(40), idx(250) + 1];
    midR = [idx(250) + 1, idx(2000)];
    highR = [idx(2000), idx(10000)];
    leadR = [idx(300), idx(4500) + 1];
    hornHighR = [idx(2500), idx(7500) + 1];
    levelEnd = idx(12000);

    // iOS: låt ljudet spela även i tyst-läge
    try { if (navigator.audioSession) navigator.audioSession.type = "playback"; } catch (_) {}
    return ctx;
}

// Safari/iOS kräver att AudioContext skapas/återupptas i en användargest.
function unlock() {
    const ac = ensureContext();
    if (ac && ac.state === "suspended") ac.resume().catch(() => {});
}
["pointerdown", "keydown", "touchend"].forEach((ev) =>
    window.addEventListener(ev, unlock, { passive: true })
);

// Kopplar BARA in elementet om kontexten faktiskt kör. Annars skulle ett
// suspenderat context göra ljudet tyst (särskilt i Safari).
function tryConnect(el) {
    if (!el || connected.has(el) || blocked.has(el)) return;
    if (!ctx || ctx.state !== "running") return;
    try {
        ctx.createMediaElementSource(el).connect(analyser);
        connected.add(el);
    } catch (_) {
        blocked.add(el);
    }
}

document.addEventListener("play", (e) => {
    const el = e.target;
    if (!(el instanceof HTMLAudioElement)) return;
    tracked = el;
    const ac = ensureContext();
    if (!ac) return;
    if (ac.state === "running") {
        tryConnect(el);
    } else {
        ac.resume().then(() => { if (tracked === el) tryConnect(el); }).catch(() => {});
    }
}, true);

function avg(a, b) {
    let s = 0;
    for (let i = a; i < b; i++) s += data[i];
    return s / (Math.max(1, b - a) * 255);
}

// Mäter rörelse i leadR (300–4500 Hz) så enskilda flöjt-, stråk- och brass-toner syns
function leadFlux(a, b) {
    const len = Math.max(1, b - a);
    if (!prevLeadBins || prevLeadBins.length !== len) {
        prevLeadBins = new Float32Array(len);
    }
    let riseSum = 0;
    let peakVal = 0;
    for (let i = 0; i < len; i++) {
        const v = data[a + i] / 255;
        if (v > peakVal) peakVal = v;
        const diff = v - prevLeadBins[i];
        if (diff > 0.015) riseSum += diff;
        prevLeadBins[i] = v;
    }
    const avgRise = riseSum / len;
    return { peakVal, avgRise };
}

const ease = (cur, tgt, up, down) => cur + (tgt - cur) * (tgt > cur ? up : down);

export function updateAudio(now, sensitivity = 0.05, hold = 1.0) {
    const el = tracked;
    const playing = Boolean(el && !el.paused && !el.ended && !el.muted);
    const live = Boolean(playing && ctx && ctx.state === "running" && connected.has(el));
    audio.playing = playing;
    audio.live = live;
    audio.presence += ((playing ? 1 : 0) - audio.presence) * 0.05;
    audio.kick = 0;

    let rb = 0, rlp = 0, rsnare = 0, rm = 0, rh = 0, rrun = 0, rswell = 0, rl = 0, rspread = 0;

    if (live) {
        analyser.getByteFrequencyData(data);
        rlp = avg(lowPunchR[0], lowPunchR[1]); // 40-200 Hz (Kick/Punch)
        rb = avg(bassR[0], bassR[1]);          // 40-250 Hz (Bass)
        rm = avg(midR[0], midR[1]);            // 250-2000 Hz (Mids)
        const rawHigh = avg(highR[0], highR[1]);
        const rawHornHigh = avg(hornHighR[0], hornHighR[1]); // 2500-7500 Hz (French horn övertoner)
        rh = Math.min(1, rawHigh * 1.35);      // 2000+ Hz (Highs)
        rl = avg(1, levelEnd);                 // Total volym

        // Flöjt, stråke och brass: kombinerar spektral topp, mjukt lyft och rörelse i 300–4500 Hz
        const { peakVal, avgRise } = leadFlux(leadR[0], leadR[1]);
        const softPeak = Math.pow(Math.min(1, peakVal * 1.45), 0.55);
        const motion = Math.min(1, avgRise * 14);
        const targetRun = Math.min(1, softPeak * 0.55 + motion * 0.75);
        runSmooth = ease(runSmooth, targetRun, 0.35, 0.065);
        rrun = runSmooth;

        // Swell / uthållen legato (inkl. valthornets höga övertoner): långsam uppgång och långsam uttoning
        const hornBlend = Math.pow(Math.min(1, (rawHornHigh * 1.65 + rm * 0.65 + rawHigh * 0.8) / 2.2), 0.68);
        const holdFactor = Math.max(0.45, Math.min(2.2, hold));
        swellSmooth = ease(swellSmooth, hornBlend, 0.075, 0.022 / holdFactor);
        rswell = swellSmooth;

        const activeBands =
            (rlp > 0.14 ? 1 : 0) +
            (rm > 0.14 ? 1 : 0) +
            (rh > 0.12 ? 1 : 0);
        const minBand = Math.min(rlp, rm, rh);
        rspread = Math.min(1, (activeBands / 3) * 0.65 + minBand * 1.6);

        // Relativ tröskel för Kick (40-200 Hz)
        bassAvg += (rlp - bassAvg) * 0.07;
        const bassDelta = Math.max(0, rlp - bassAvg);
        const kickThreshold = Math.max(0.015, sensitivity);

        if (rlp > 0.16 && bassDelta > kickThreshold && now - lastKick > 210) {
            lastKick = now;
            audio.kick = Math.min(0.85, 0.35 + bassDelta * 3.5);
        }

        // Relativ tröskel för Snare (150-500 Hz)
        const rawSnare = avg(snareR[0], snareR[1]);
        snareAvg += (rawSnare - snareAvg) * 0.07;
        const snareDelta = Math.max(0, rawSnare - snareAvg);
        const snareThreshold = kickThreshold * 0.85;

        if (rawSnare > 0.12 && snareDelta > snareThreshold) {
            rsnare = Math.min(0.8, snareDelta * 4.5);
        }
    } else if (playing) {
        const t = now / 1000;
        const bar = Math.floor(t / 0.5);
        rlp = 0.35 + 0.4 * Math.pow(1 - ((t % 0.5) / 0.5), 3);
        rb = rlp;
        rsnare = Math.floor(t / 0.25) % 2 === 1 ? Math.pow(1 - ((t % 0.25) / 0.25), 2.5) * 0.55 : 0;
        rm = 0.25 + 0.1 * Math.sin(t * 2.7);
        rh = Math.min(1, (0.25 + 0.15 * Math.sin(t * 4.1)) * 1.15);
        rrun = 0.4 + 0.4 * (0.5 + 0.5 * Math.sin(t * 4.2));
        rswell = 0.35 + 0.35 * (0.5 + 0.5 * Math.sin(t * 0.9));
        rl = 0.4;
        rspread = 0.55 + 0.25 * Math.sin(t * 1.3);
        if (bar !== synthBar) { synthBar = bar; audio.kick = 0.6; }
    }

    const holdFactor = Math.max(0.45, Math.min(2.2, hold));
    const downScale = 1 / holdFactor;

    audio.bass = ease(audio.bass, rb, 0.45, 0.065 * downScale);
    audio.lowPunch = ease(audio.lowPunch, rlp, 0.45, 0.065 * downScale);
    audio.snare = ease(audio.snare, rsnare, 0.5, 0.075 * downScale);
    audio.mid = ease(audio.mid, rm, 0.35, 0.07 * downScale);
    audio.high = ease(audio.high, rh, 0.42, 0.075 * downScale);
    audio.runNote = rrun;
    audio.swell = rswell;
    audio.level = ease(audio.level, rl, 0.28, 0.06 * downScale);
    audio.spread = ease(audio.spread, rspread, 0.22, 0.065 * downScale);
    audio.pulse = Math.max(audio.pulse * Math.pow(0.9, holdFactor), audio.kick);
}