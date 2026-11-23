// js/audio-analyser.js
// Delad ljudanalys för hela sidan. Lyssnar på alla <audio>-element och
// exponerar nivåer (bass/mid/high/level) och kick-händelser i `audio`.
// Anropa updateAudio(now) en gång per frame.

export const audio = {
    playing: false,   // spelar ett ljudspår just nu
    live: false,      // riktig analys (false = syntetisk reserv-puls)
    presence: 0,      // 0..1, mjuk in/ut-tonning vid play/pause
    bass: 0,          // 0..1 jämnad bas (40–250 Hz)
    mid: 0,
    high: 0,
    level: 0,         // 0..1 total ljudstyrka
    pulse: 0,         // 0..1 kort puls som skjuter i höjden vid kick och dör ut
    kick: 0           // >0 endast under den frame en kick upptäcks (styrka 0..1)
};

let ctx = null, analyser = null, data = null, tracked = null;
let bassR = [1, 6], midR = [7, 46], highR = [46, 230], levelEnd = 256;
let bassAvg = 0, prevBass = 0, lastKick = 0, synthBar = -1;
const connected = new WeakSet();
const blocked = new WeakSet();

function ensureContext() {
    if (ctx) return ctx;
    const Ctor = window.AudioContext || window.webkitAudioContext;
    if (!Ctor) return null;
    try { ctx = new Ctor(); } catch (_) { return null; }

    analyser = ctx.createAnalyser();
    analyser.fftSize = 1024;
    analyser.smoothingTimeConstant = 0.5;
    analyser.minDecibels = -88;
    analyser.maxDecibels = -22;
    data = new Uint8Array(analyser.frequencyBinCount);
    analyser.connect(ctx.destination);

    const hz = ctx.sampleRate / analyser.fftSize;
    const idx = (f) => Math.max(1, Math.min(data.length - 1, Math.round(f / hz)));
    bassR = [idx(40), idx(250) + 1];
    midR = [idx(250) + 1, idx(2000)];
    highR = [idx(2000), idx(10000)];
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
const ease = (cur, tgt, up, down) => cur + (tgt - cur) * (tgt > cur ? up : down);

export function updateAudio(now, sensitivity = 1) {
    const el = tracked;
    const playing = Boolean(el && !el.paused && !el.ended && !el.muted);
    const live = Boolean(playing && ctx && ctx.state === "running" && connected.has(el));
    audio.playing = playing;
    audio.live = live;
    audio.presence += ((playing ? 1 : 0) - audio.presence) * 0.05;
    audio.kick = 0;

    let rb = 0, rm = 0, rh = 0, rl = 0;

    if (live) {
        analyser.getByteFrequencyData(data);
        rb = avg(bassR[0], bassR[1]);
        rm = avg(midR[0], midR[1]);
        rh = avg(highR[0], highR[1]);
        rl = avg(1, levelEnd);

        bassAvg += (rb - bassAvg) * 0.05;
        const threshold = 0.06 / Math.max(0.2, sensitivity);
        if (rb > 0.25 && rb - bassAvg > threshold && rb > prevBass && now - lastKick > 180) {
            lastKick = now;
            audio.kick = Math.min(1, 0.45 + (rb - bassAvg) * 4);
        }
        prevBass = rb;
    } else if (playing) {
        // Reserv om analysen inte går att nå: mjuk syntetisk puls (~120 BPM)
        const t = now / 1000;
        const bar = Math.floor(t / 0.5);
        rb = 0.35 + 0.4 * Math.pow(1 - ((t % 0.5) / 0.5), 3);
        rm = 0.3 + 0.1 * Math.sin(t * 2.7);
        rh = 0.25 + 0.1 * Math.sin(t * 4.1);
        rl = 0.4;
        if (bar !== synthBar) { synthBar = bar; audio.kick = 0.7; }
    }

    audio.bass = ease(audio.bass, rb, 0.5, 0.1);
    audio.mid = ease(audio.mid, rm, 0.3, 0.1);
    audio.high = ease(audio.high, rh, 0.35, 0.12);
    audio.level = ease(audio.level, rl, 0.2, 0.06);
    audio.pulse = Math.max(audio.pulse * 0.88, audio.kick);
}