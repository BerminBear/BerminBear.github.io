// --- DATABAS FÖR MODALER --- //

const aboutData = `
    <div class="space-y-6 text-slate-300">
        <h2 class="text-3xl font-extrabold text-white code-font">// BENJAMIN_NATALLI.log</h2>
        <p class="text-amber-500 font-semibold code-font text-sm">Technical Audio & Dialogue Designer</p>
        <div class="h-[1px] bg-white/10 my-4"></div>
        <p class="text-base leading-relaxed">
            I bridges the gap between artistic audio direction and technical implementation in game engines. 
            Focused on robust audio architecture, automation scripts, middleware routing (Wwise & FMOD), and complex dialogue management systems.
        </p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 pt-4 border-t border-white/5 text-sm code-font">
            <div>
                <span class="code-font text-amber-500 text-xs tracking-widest uppercase">Character Entry</span>
                <h2 class="text-3xl font-extrabold text-white mt-1">Benjamin D. Natalli</h2>
                <p class="text-xs text-slate-400 code-font mt-1">Audio Developer /Narrative Enthusiast</p>
            </div>
            <div>
                <span class="text-slate-500 block">FOCUS:</span>
                <span class="text-white">System Design & Middleware Logic</span>
            </div>
        </div>
    </div>
`;

const educationData = {
    'stockholm-uni': `
        <h2 class="text-3xl font-extrabold text-white">Game Development (Audio / Programming)</h2>
        <p class="text-sm font-semibold text-amber-500 code-font mt-2">Stockholm University | 2025 — Ongoing</p>
        <div class="h-[1px] bg-white/10 my-6"></div>
        <div class="text-sm text-slate-300 space-y-4 leading-relaxed">
            <p>Studies focusing on object-oriented programming, game engine mechanics, and specialized audio systems implementation.</p>
        </div>
    `,
    'audio-prod': `
        <h2 class="text-3xl font-extrabold text-white">Game Audio & Sound Design</h2>
        <p class="text-sm font-semibold text-amber-500 code-font mt-2">Audio Production Academy | 2023 — 2025</p>
        <div class="h-[1px] bg-white/10 my-6"></div>
        <div class="text-sm text-slate-300 space-y-4 leading-relaxed">
            <p>In-depth specialization in middleware integration (Wwise & FMOD), Reaper automation, spatial audio, and interactive dialogue design.</p>
        </div>
    `,
    'umea': `
        <h2 class="text-3xl font-extrabold text-white">Music Production for Film, Theatre & Games</h2>
        <p class="text-sm font-semibold text-amber-500 code-font mt-2">Umeå University | 2020 — 2021</p>
        <div class="h-[1px] bg-white/10 my-6"></div>
        <div class="text-sm text-slate-300 space-y-4 leading-relaxed">
            <p>Composition techniques, adaptive scoring, and dramatic structuring for media applications.</p>
        </div>
    `,
    'kmh': `
        <h2 class="text-3xl font-extrabold text-white">Marketing & Entrepreneurship</h2>
        <p class="text-sm font-semibold text-amber-500 code-font mt-2">Royal College of Music (KMH) | 2020 — 2021</p>
        <div class="h-[1px] bg-white/10 my-6"></div>
        <div class="text-sm text-slate-300 space-y-4 leading-relaxed">
            <p>Project management, entrepreneurship, and industry business structures.</p>
        </div>
    `,
    'rytmus': `
        <h2 class="text-3xl font-extrabold text-white">Sound & Music Production</h2>
        <p class="text-sm font-semibold text-amber-500 code-font mt-2">Rytmus Music High School | 2017 — 2020</p>
        <div class="h-[1px] bg-white/10 my-6"></div>
        <div class="text-sm text-slate-300 space-y-4 leading-relaxed">
            <p>Foundational education in studio recording, acoustics, mixing, and music production.</p>
        </div>
    `
};

// Säkert anrop till ljudeffekter (om du har en playSound-funktion)
function safePlaySound(type) {
    if (typeof window.playSound === 'function') {
        window.playSound(type);
    }
}

// --- ABOUT MODAL FUNKTIONER ---
export function openAboutModal() {
    const modal = document.getElementById('about-detail-modal');
    const body = document.getElementById('about-modal-body');
    const wrapper = document.getElementById('about-modal-wrapper');

    if (!modal || !body || !wrapper) return;

    safePlaySound('click');
    body.innerHTML = aboutData;

    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';

    setTimeout(() => {
        modal.classList.add('opacity-100');
        wrapper.classList.remove('scale-95');
        wrapper.classList.add('scale-100');
    }, 50);
}

export function closeAboutModal() {
    const modal = document.getElementById('about-detail-modal');
    const wrapper = document.getElementById('about-modal-wrapper');

    if (!modal || !wrapper) return;

    safePlaySound('close');

    modal.classList.remove('opacity-100');
    wrapper.classList.remove('scale-100');
    wrapper.classList.add('scale-95');
    document.body.style.overflow = '';

    setTimeout(() => {
        modal.classList.add('hidden');
    }, 300);
}

// --- EDUCATION MODAL FUNKTIONER ---
export function openEduModal(eduKey) {
    const modal = document.getElementById('edu-detail-modal');
    const body = document.getElementById('edu-modal-body');
    const wrapper = document.getElementById('edu-modal-wrapper');

    if (!modal || !body || !wrapper || !educationData[eduKey]) return;

    safePlaySound('click');
    body.innerHTML = educationData[eduKey];

    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';

    setTimeout(() => {
        modal.classList.add('opacity-100');
        wrapper.classList.remove('scale-95');
        wrapper.classList.add('scale-100');
    }, 50);
}

export function closeEduModal() {
    const modal = document.getElementById('edu-detail-modal');
    const wrapper = document.getElementById('edu-modal-wrapper');

    if (!modal || !wrapper) return;

    safePlaySound('close');

    modal.classList.remove('opacity-100');
    wrapper.classList.remove('scale-100');
    wrapper.classList.add('scale-95');
    document.body.style.overflow = '';

    setTimeout(() => {
        modal.classList.add('hidden');
    }, 300);
}

// --- INITIERING OCH EVENT LISTENERS ---
export function initModal() {
    // Koppla ALLA funktioner till window för onclick-stöd i HTML
    window.openAboutModal = openAboutModal;
    window.closeAboutModal = closeAboutModal;
    window.openEduModal = openEduModal;
    window.closeEduModal = closeEduModal;

    // Stäng med ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeAboutModal();
            closeEduModal();
        }
    });

    // Stäng vid klick utanför rutorna
    const aboutModal = document.getElementById('about-detail-modal');
    if (aboutModal) {
        aboutModal.addEventListener('click', (e) => {
            if (e.target === aboutModal) closeAboutModal();
        });
    }

    const eduModal = document.getElementById('edu-detail-modal');
    if (eduModal) {
        eduModal.addEventListener('click', (e) => {
            if (e.target === eduModal) closeEduModal();
        });
    }
}

// Körs automatiskt om skriptet läses in
initModal();