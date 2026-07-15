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

export function openProjectDetail(key) {
    const modal = document.getElementById('project-detail-modal');
    const body = document.getElementById('modal-body');
    const wrapper = document.getElementById('modal-content-wrapper');
    if (!modal || !body || !wrapper) return;
    
    body.innerHTML = projectCases[key] || "Case study load error.";
    
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden'; // Frys bakgrundens scroll
    
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
    
    document.body.style.overflow = ''; // Återställ scroll
    
    setTimeout(() => {
        modal.classList.add('hidden');
    }, 300);
}

export function initModal() {
    // Exponera funktionerna till det globala fönstret för HTML-klick
    window.openProjectDetail = openProjectDetail;
    window.closeProjectDetail = closeProjectDetail;

    // Lyssna efter ESC för att stänga
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeProjectDetail();
    });

    // Klicka utanför modalen för att stänga
    const modal = document.getElementById('project-detail-modal');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeProjectDetail();
            }
        });
    }
}