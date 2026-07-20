// js/sound.js
// Central sound manager — hover/klick/close/scroll/nav + sidambiens.
// Kräver Howler.js laddat via CDN FÖRE denna modul.

const SOUND_PREF_KEY = 'bnatalli-sound-enabled';

let sounds = {};
let ambience = null;
let enabled = localStorage.getItem(SOUND_PREF_KEY) === 'true';
let unlocked = false;

const SOUND_FILES = {
    hover:      { src: ['sounds/hover.mp3'],       volume: 0.25 },
    click:      { src: ['sounds/click.mp3'],       volume: 0.5 },
    close:      { src: ['sounds/close.mp3'],       volume: 0.5 },
    navSelect:  { src: ['sounds/nav-select.mp3'],  volume: 0.5 },
    scrollTick: { src: ['sounds/scroll-tick.mp3'], volume: 0.15 },
};

const AMBIENCE_FILES = {
    home: 'sounds/ambience-home.mp3',
    projects: 'sounds/ambience-projects.mp3',
};

function loadSounds() {
    Object.entries(SOUND_FILES).forEach(([key, def]) => {
        sounds[key] = new Howl({
            src: def.src,
            volume: def.volume,
            preload: true,
            onloaderror: () => console.warn(`[sound.js] Kunde inte ladda ljud "${key}" (${def.src[0]}) — lägg filen på plats.`),
        });
    });
}

function loadAmbience() {
    const page = document.body.dataset.page;
    const src = AMBIENCE_FILES[page];
    if (!src) return;

    ambience = new Howl({
        src: [src],
        loop: true,
        volume: 0,
        preload: true,
        onloaderror: () => console.warn(`[sound.js] Kunde inte ladda ambiens för "${page}" (${src}).`),
    });
}

function startAmbience() {
    if (!ambience || !enabled || ambience.playing()) return;
    ambience.play();
    ambience.fade(0, 0.35, 1200);
}

function stopAmbience() {
    if (!ambience || !ambience.playing()) return;
    ambience.fade(ambience.volume(), 0, 400);
    setTimeout(() => ambience.stop(), 450);
}

export function playSound(name) {
    if (!enabled || !unlocked) return;
    sounds[name]?.play();
}

function updateToggleUI() {
    const icon = document.getElementById('sound-icon');
    const btn = document.getElementById('sound-toggle');
    if (!icon || !btn) return;
    icon.textContent = enabled ? '🔊' : '🔇';
    btn.setAttribute('aria-pressed', String(enabled));
}

function unlockAudio() {
    if (unlocked) return;
    unlocked = true;
    if (enabled) startAmbience();
}

function toggleSound() {
    enabled = !enabled;
    localStorage.setItem(SOUND_PREF_KEY, String(enabled));
    updateToggleUI();

    if (!unlocked) {
        unlockAudio();
        return;
    }

    if (enabled) {
        startAmbience();
        playSound('click');
    } else {
        stopAmbience();
    }
}

function wireInteractiveSounds() {
    // Samma urval som mouse.js redan använder för att gömma pekaren.
    document.querySelectorAll(
        'a, button, summary, .project-card, .cv-clickable-card, .cv-name-trigger, [onclick]'
    ).forEach((el) => el.addEventListener('mouseenter', () => playSound('hover')));

    // Distinkt "sidbyte"-ljud, bara för huvudnavigeringen.
    document.querySelectorAll('[data-nav-sound]').forEach((el) => {
        el.addEventListener('click', () => playSound('navSelect'));
    });
}

function wireScrollTick() {
    let lastY = window.scrollY;
    let lastTick = 0;
    const MIN_DISTANCE = 90; // px mellan varje tick
    const MIN_INTERVAL = 60; // ms, skydd mot extremt snabb scroll

    window.addEventListener('scroll', () => {
        const now = performance.now();
        const currentY = window.scrollY;
        const distance = Math.abs(currentY - lastY);

        if (distance >= MIN_DISTANCE && now - lastTick >= MIN_INTERVAL) {
            playSound('scrollTick');
            lastTick = now;
            lastY = currentY;
        }
    }, { passive: true });
}

export function initSound() {
    if (typeof Howl === 'undefined') {
        console.warn('[sound.js] Howler.js hittades inte — kontrollera CDN-taggen ligger FÖRE js/main.js.');
        return;
    }

    loadSounds();
    loadAmbience();
    updateToggleUI();
    wireInteractiveSounds();
    wireScrollTick();

    document.getElementById('sound-toggle')?.addEventListener('click', toggleSound);

    // Lås upp ljud vid FÖRSTA interaktionen på sidan (Autoplay Policy-krav).
    const events = ['pointerdown', 'keydown', 'touchstart'];
    const unlockOnce = () => {
        unlockAudio();
        events.forEach(e => window.removeEventListener(e, unlockOnce));
    };
    events.forEach(e => window.addEventListener(e, unlockOnce));
}