// --- EDUCATION MODALS --- //

// Databas för dina utbildningar. Fyll på med texten du vill visa!
const educationData = {
    'stockholm-uni': `
        <h2 class="text-3xl font-extrabold text-white">Game Development (Audio / Programming)</h2>
        <p class="text-sm font-semibold text-amber-500 code-font mt-2">Stockholm University | 2025 — Ongoing</p>
        <div class="h-[1px] bg-white/10 my-6"></div>
        <div class="text-sm text-slate-300 space-y-4 leading-relaxed">
            <p>Write your description about the Stockholm University program here. You can talk about your courses in C#, audio implementation, or system architecture.</p>
            <ul class="list-disc pl-5 marker:text-amber-500/30 space-y-2 mt-4">
                <li>Relevant Course 1</li>
                <li>Relevant Course 2</li>
            </ul>
        </div>
    `,
    'audio-prod': `
        <h2 class="text-3xl font-extrabold text-white">Game Audio & Sound Design</h2>
        <p class="text-sm font-semibold text-amber-500 code-font mt-2">Audio Production Academy | 2023 — 2025</p>
        <div class="h-[1px] bg-white/10 my-6"></div>
        <div class="text-sm text-slate-300 space-y-4 leading-relaxed">
            <p>Write about your focus at APA. Wwise, FMOD, Reaper, technical sound design, etc.</p>
        </div>
    `,
    'umea': `
        <h2 class="text-3xl font-extrabold text-white">Music Production for Film, Theatre & Games</h2>
        <p class="text-sm font-semibold text-amber-500 code-font mt-2">Umeå University | 2020 — 2021</p>
        <div class="h-[1px] bg-white/10 my-6"></div>
        <div class="text-sm text-slate-300 space-y-4 leading-relaxed">
            <p>Description of the Umeå University courses regarding media composition.</p>
        </div>
    `,
    'kmh': `
        <h2 class="text-3xl font-extrabold text-white">Marketing & Entrepreneurship</h2>
        <p class="text-sm font-semibold text-amber-500 code-font mt-2">Royal College of Music (KMH) | 2020 — 2021</p>
        <div class="h-[1px] bg-white/10 my-6"></div>
        <div class="text-sm text-slate-300 space-y-4 leading-relaxed">
            <p>Details about studying at KMH.</p>
        </div>
    `,
    'rytmus': `
        <h2 class="text-3xl font-extrabold text-white">Sound & Music Production</h2>
        <p class="text-sm font-semibold text-amber-500 code-font mt-2">Rytmus Music High School | 2017 — 2020</p>
        <div class="h-[1px] bg-white/10 my-6"></div>
        <div class="text-sm text-slate-300 space-y-4 leading-relaxed">
            <p>Details about your high school education.</p>
        </div>
    `
};

export function openEduModal(eduKey) {
    const modal = document.getElementById('edu-detail-modal');
    const body = document.getElementById('edu-modal-body');
    const wrapper = document.getElementById('edu-modal-wrapper');
    
    if (!modal || !body || !wrapper || !educationData[eduKey]) return;
    
    playSound('click'); // Använder din ljudfunktion
    
    // Injicera rätt data baserat på vad du klickade på
    body.innerHTML = educationData[eduKey];

    // Visa modal
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';

    // Animation
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
    
    playSound('close');

    // Dölj animation
    modal.classList.remove('opacity-100');
    wrapper.classList.remove('scale-100');
    wrapper.classList.add('scale-95');
    document.body.style.overflow = '';

    setTimeout(() => {
        modal.classList.add('hidden');
    }, 300);
}

// VIKTIGT: Uppdatera din befintliga initModal() så att de nya funktionerna knyts till window
// (Leta upp din initModal och uppdatera den till detta):
export function initModal() {
    // About modal
    window.openAboutModal = openAboutModal;
    window.closeAboutModal = closeAboutModal;
    
    // Education modals (Ny!)
    window.openEduModal = openEduModal;
    window.closeEduModal = closeEduModal;

    // Stäng med Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeAboutModal();
            closeEduModal();
        }
    });

    // Stäng om man klickar utanför rutan
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