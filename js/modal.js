// js/modal.js

// --- CASE DATA FOR INDEX/PROJECTS ---
const projectCases = {
    'echoes-void': `
        <span class="code-font text-amber-500 text-xs tracking-widest uppercase">// Case Study: Echoes of the Void</span>
        <h2 class="text-3xl font-extrabold text-white mt-1">Echoes of the Void</h2>
        <div class="h-[1px] bg-white/10 my-4"></div>
        <p class="text-sm text-slate-300 leading-relaxed">
            Designed a tailored narrative routing architecture for Echoes of the Void. Built dynamic voice prioritization pools within Wwise, letting combat dialog dynamically cut off ambient chatter based on cinematic importance parameters.
        </p>
        <p class="text-sm text-slate-300 leading-relaxed mt-4">
            The localization structure was rewritten from scratch, shifting assets dynamically to reduce memory consumption on high-end dialogue trees, resulting in a 45% RAM drop during core cinematic scenes.
        </p>
    `,
    'waapi-dialogue': `
        <span class="code-font text-amber-500 text-xs tracking-widest uppercase">// Case Study: WAAPI Dialogue Batcher</span>
        <h2 class="text-3xl font-extrabold text-white mt-1">WAAPI Dialogue Batcher</h2>
        <div class="h-[1px] bg-white/10 my-4"></div>
        <p class="text-sm text-slate-300 leading-relaxed">
            Developed a specialized batching framework in Python utilizing the Wwise Authoring API (WAAPI). This automation tool bridges creative design in Reaper directly into structural metadata inside Wwise.
        </p>
        <p class="text-sm text-slate-300 leading-relaxed mt-4">
            The tool parses marker exports, slices raw WAV clips, applies target sound curves, structures virtual folders on the fly, and registers localized audio loops automatically within seconds. This saved around 80 hours of manual pipeline preparation per project phase.
        </p>
    `,
    'aura-audio': `
        <span class="code-font text-amber-500 text-xs tracking-widest uppercase">// Case Study: Aura Generative Audio</span>
        <h2 class="text-3xl font-extrabold text-white mt-1">Aura: Generative Audio App</h2>
        <div class="h-[1px] bg-white/10 my-4"></div>
        <p class="text-sm text-slate-300 leading-relaxed">
            Created an engine module within Unity linked with FMOD for a mobile soundscape companion. Implemented dynamic LFO filters, interactive distance-based attenuation structures, and procedural audio modules.
        </p>
        <p class="text-sm text-slate-300 leading-relaxed mt-4">
            To keep latency below the target threshold of 15ms, deep performance optimization of high-density DSP elements was carried out, preserving mobile battery life without losing the high quality of generative layers.
        </p>
    `
};

// --- CASE DATA FOR CV ---
const cvCases = {
    'arctic-bones': `
        <span class="code-font text-amber-500 text-xs tracking-widest uppercase">// Case Study: Arctic Bones AB</span>
        <h2 class="text-3xl font-extrabold text-white mt-1">Composer & Sound Designer</h2>
        <p class="text-xs text-slate-500 code-font">March 2025 — October 2025</p>
        <div class="h-[1px] bg-white/10 my-4"></div>
        <div class="text-sm text-slate-300 space-y-4 leading-relaxed">
            <p>At Arctic Bones, production was driven with a focus on seamless audio mechanics. I was responsible for composition and dynamic arrangements that adapted intuitively to gameplay intensity.</p>
            <p>The core workload involved setting up intelligent priority trees within <strong>Wwise</strong> and <strong>FMOD</strong> for environmental transitions and combat systems, optimizing voice management and maintaining a crisp sonic profile without CPU overhead.</p>
        </div>
    `,
    'cable-nest': `
        <span class="code-font text-amber-500 text-xs tracking-widest uppercase">// Case Study: Cable Nest / Gro Play AB</span>
        <h2 class="text-3xl font-extrabold text-white mt-1">Cable Nest & Gro Play Portfolio</h2>
        <p class="text-xs text-slate-500 code-font">2024 — 2025</p>
        <div class="h-[1px] bg-white/10 my-4"></div>
        <div class="text-sm text-slate-300 space-y-4 leading-relaxed">
            <p>The emphasis here was rapid asset deployment and the development of robust workflows. Alongside producing versatile music and sound effects for the studio's titles, I built internal file schemas.</p>
            <p>By defining clear asset allocation methods and strict file naming standards for voice and SFX modules, turnaround times from DAW export to engine runtime integration were noticeably optimized.</p>
        </div>
    `,
    'freelance-audio': `
        <span class="code-font text-amber-500 text-xs tracking-widest uppercase">// Case Study: Independent Projects</span>
        <h2 class="text-3xl font-extrabold text-white mt-1">Freelance Work & Dialogue Editing</h2>
        <p class="text-xs text-slate-500 code-font">Ongoing / Independent</p>
        <div class="h-[1px] bg-white/10 my-4"></div>
        <div class="text-sm text-slate-300 space-y-4 leading-relaxed">
            <p>Through independent commissions, I have specialized in precise spectral cleaning and surgical dialogue editing routines using industry standards like iZotope RX.</p>
            <p>My scope ranges broadly across podcast production cycles, voiceover engineering arrays, and direct music mixing and mastering routines finalized for public distribution platforms.</p>
        </div>
    `,
    'about-me': `
        <div class="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            <div class="md:col-span-4 sticky top-0">
                <div class="aspect-[3/4] w-full rounded-xl overflow-hidden border border-white/10 shadow-2xl">
                    <img src="portfolio-picture.png" alt="Benjamin Natalli" class="w-full h-full object-cover">
                </div>
                <!-- Metadata under the profile image -->
                <div class="mt-4 pt-4 border-t border-white/5 space-y-2 text-xs code-font text-slate-400">
                    <div><span class="text-slate-600 uppercase tracking-wider block text-[10px] mb-0.5">Age:</span> 25</div>
                    <div><span class="text-slate-600 uppercase tracking-wider block text-[10px] mb-0.5">Race:</span> Human</div>
                    <div><span class="text-slate-600 uppercase tracking-wider block text-[10px] mb-0.5">Residence:</span> Stockholm, Sweden</div>
                    <div><span class="text-slate-600 uppercase tracking-wider block text-[10px] mb-0.5">Languages:</span> Swedish (Native), English (Fluent), Portugeuse (Funadmentals) </div>
                </div>
            </div>
            <div class="md:col-span-8 space-y-6 max-h-[70vh] overflow-y-auto pr-2">
                <div>
                    <span class="code-font text-amber-500 text-xs tracking-widest uppercase">// Terminal: Profile_History.log</span>
                    <h2 class="text-3xl font-extrabold text-white mt-1">Benjamin D. Natalli</h2>
                    <p class="text-xs text-slate-400 code-font mt-1">Audio Developer / Narrative Enthusiast</p>
                </div>
                <div class="h-[1px] bg-white/10"></div>
                <div class="text-sm text-slate-300 space-y-4 leading-relaxed">
                    <p>
                        Raised in Stockholm, Sweden in a Brazilian family, Benji was introduced to games at a very early age and it has since been a part of my everyday life.
                    </p>
                    <p>
                        It started when my brother introduced me to <strong>Baldur's Gate 1</strong>. It was the first game I fell in love with, and it left a lasting impression on the games I've later come to enjoy in life (like Planescape Torment among others). 
                    </p>
                    <p>
                        I also always had a penchant for music, sound and voice acting, and so after my high school studies, I wanted to connect these two interests together. 
                       
                    <p>
                    Today, I view games as the highest art form - a rare intersection where interactive logic and creative arts can merge into a living experience. I am currently studying game development with the purpose of specializing in audio technical implementation pipelines, with a focus on dialogue. My primary goal right now is to work within a team creating the next great, complete <strong>CRPG experience</strong>, where voice and audio systems drive the narrative forward.
                    </p>
                    <p/>
                </div>
                <div class="h-[1px] bg-white/10"></div>
                <div class="space-y-4 text-xs code-font">
                    <div>
                        <span class="text-amber-500 font-bold uppercase tracking-wider block mb-1">Favorite Games:</span>
                        <p class="text-slate-300 pl-3 border-l border-amber-500/30">Baldur's Gate Series, Planescape Torment, Disco Elysium, Witcher 3, Elden Ring</p>
                    </div>
                    <div>
                        <span class="text-amber-500 font-bold uppercase tracking-wider block mb-1">Hobbies:</span>
                        <p class="text-slate-300 pl-3 border-l border-amber-500/30">Mushroom Foraging, Woodworking, D&D, Brewery and Perfumery</p>
                    </div>
                    <div>
                        <span class="text-amber-500 font-bold uppercase tracking-wider block mb-1">Favorite Sports:</span>
                        <p class="text-slate-300 pl-3 border-l border-amber-500/30">Climbing, Kayaking, Vollyeball</p>
                    </div>
                    <div>
                        <span class="text-amber-500 font-bold uppercase tracking-wider block mb-1">Favorite Books:</span>
                        <p class="text-slate-300 pl-3 border-l border-amber-500/30">Wind-Up Chronicles (Murakami), Mort (Pratchett)</p>
                    </div>
                    <div>
                        <span class="text-amber-500 font-bold uppercase tracking-wider block mb-1">Favorite Movies:</span>
                        <p class="text-slate-300 pl-3 border-l border-amber-500/30">V for Vendetta, Watchmen, Princess Bride, Lord of the Rings</p>
                    </div>
                    <div>
                        <span class="text-amber-500 font-bold uppercase tracking-wider block mb-1">Favorite Music:</span>
                        <p class="text-slate-300 pl-3 border-l border-amber-500/30">Fleet Foxes, RY X, Laura Marling, Nils Frahm, Grupo Revelação</p>
                    </div>
                </div>
            </div>
        </div>
    `,
    'edu-su': `<span class="code-font text-amber-500 text-xs tracking-widest uppercase">// Academic Profile</span><h2 class="text-2xl font-bold text-white mt-1">Game Development (Audio / Programming)</h2><p class="text-xs text-slate-500 code-font">Stockholm University | 2025 — Ongoing</p><div class="h-[1px] bg-white/10 my-4"></div><p class="text-sm text-slate-300 leading-relaxed">Focusing heavily on runtime system programming, computer logic, data structures, and object-oriented audio integrations.</p>`,
    'edu-apa': `<span class="code-font text-amber-500 text-xs tracking-widest uppercase">// Academic Profile</span><h2 class="text-2xl font-bold text-white mt-1">Game Audio & Sound Design</h2><p class="text-xs text-slate-500 code-font">Audio Production Academy | 2023 — 2025</p><div class="h-[1px] bg-white/10 my-4"></div><p class="text-sm text-slate-300 leading-relaxed">Immersive framework studies targeting asset synthesis, advanced signal flows, and middleware pipelines.</p>`,
    'edu-umu': `<span class="code-font text-amber-500 text-xs tracking-widest uppercase">// Academic Profile</span><h2 class="text-2xl font-bold text-white mt-1">Music Production for Film, Theatre & Games</h2><p class="text-xs text-slate-500 code-font">Umeå University | 2020 — 2021</p><div class="h-[1px] bg-white/10 my-4"></div><p class="text-sm text-slate-300 leading-relaxed">Thematic analysis and orchestrational layouts focused on narrative scoring paradigms.</p>`,
    'edu-kmh': `<span class="code-font text-amber-500 text-xs tracking-widest uppercase">// Academic Profile</span><h2 class="text-2xl font-bold text-white mt-1">Marketing & Entrepreneurship</h2><p class="text-xs text-slate-500 code-font">Royal College of Music (KMH) | 2020 — 2021</p><div class="h-[1px] bg-white/10 my-4"></div><p class="text-sm text-slate-300 leading-relaxed">Business model calculations, intellectual property regulations, and contract structuring fundamentals.</p>`,
    'edu-rytmus': `<span class="code-font text-amber-500 text-xs tracking-widest uppercase">// Academic Profile</span><h2 class="text-2xl font-bold text-white mt-1">Sound & Music Production</h2><p class="text-xs text-slate-500 code-font">Rytmus Music High School | 2017 — 2020</p><div class="h-[1px] bg-white/10 my-4"></div><p class="text-sm text-slate-300 leading-relaxed">Foundational tracking layout guidelines covering tracking architectures and studio console processing.</p>`
};

// --- PROJECT MODAL FUNCTIONS ---
export function openProjectDetail(key) {
    const modal = document.getElementById('project-detail-modal');
    const body = document.getElementById('modal-body');
    const wrapper = document.getElementById('modal-content-wrapper');
    if (!modal || !body || !wrapper) return;

    body.innerHTML = projectCases[key] || "Case study load error.";
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';

    setTimeout(() => {
        modal.classList.add('opacity-100');
        wrapper.classList.remove('scale-95');
        wrapper.classList.add('scale-100');
    }, 50);
}

export function closeProjectDetail() {
    const modal = document.getElementById('project-detail-modal');
    const wrapper = document.getElementById('modal-content-wrapper');
    if (!modal || !wrapper) return;

    modal.classList.remove('opacity-100');
    wrapper.classList.remove('scale-100');
    wrapper.classList.add('scale-95');
    document.body.style.overflow = '';

    setTimeout(() => {
        modal.classList.add('hidden');
    }, 300);
}

// --- CV MODAL FUNCTIONS ---
export function openCvModal(key) {
    const modal = document.getElementById('cv-detail-modal');
    const body = document.getElementById('cv-modal-body');
    const wrapper = document.getElementById('cv-modal-wrapper');
    if (!modal || !body || !wrapper) return;

    body.innerHTML = cvCases[key] || "Content load error.";

    if (key === 'about-me') {
        wrapper.classList.remove('max-w-2xl');
        wrapper.classList.add('max-w-5xl');
    } else {
        wrapper.classList.remove('max-w-5xl');
        wrapper.classList.add('max-w-2xl');
    }

    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';

    setTimeout(() => {
        modal.classList.add('opacity-100');
        wrapper.classList.remove('scale-95');
        wrapper.classList.add('scale-100');
    }, 50);
}

export function closeCvModal() {
    const modal = document.getElementById('cv-detail-modal');
    const wrapper = document.getElementById('cv-modal-wrapper');
    if (!modal || !wrapper) return;

    modal.classList.remove('opacity-100');
    wrapper.classList.remove('scale-100');
    wrapper.classList.add('scale-95');
    document.body.style.overflow = '';

    setTimeout(() => {
        modal.classList.add('hidden');
    }, 300);
}

// --- GLOBAL INIT ---
export function initModal() {
    window.openProjectDetail = openProjectDetail;
    window.closeProjectDetail = closeProjectDetail;
    window.openCvModal = openCvModal;
    window.closeCvModal = closeCvModal;

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeProjectDetail();
            closeCvModal();
        }
    });

    const projectModal = document.getElementById('project-detail-modal');
    if (projectModal) {
        projectModal.addEventListener('click', (e) => {
            if (e.target === projectModal) closeProjectDetail();
        });
    }

    const cvModal = document.getElementById('cv-detail-modal');
    if (cvModal) {
        cvModal.addEventListener('click', (e) => {
            if (e.target === cvModal) closeCvModal();
        });
    }
}