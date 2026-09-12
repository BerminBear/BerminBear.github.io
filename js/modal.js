// js/modal.js

/* =========================================================
   ABOUT MODAL
   ========================================================= */

const aboutContent = `
    <div class="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        <div class="md:col-span-4">
            <div class="w-full rounded-xl overflow-hidden shadow-2xl shadow-amber-900/20">
                <img src="portfolio-picture.jpeg" alt="Portrait of Benjamin Natalli" class="w-full h-full object-cover">
            </div>
            <div class="mt-4 pt-4 border-t border-white/5 space-y-2 text-xs code-font text-slate-400">
                <div><span class="text-slate-600 uppercase tracking-wider block text-[10px] mb-0.5">Age:</span> 25</div>
                <div><span class="text-slate-600 uppercase tracking-wider block text-[10px] mb-0.5">Origin:</span> Stockholm, Sweden</div>
                <div><span class="text-slate-600 uppercase tracking-wider block text-[10px] mb-0.5">Languages:</span> Swedish, English, Portuguese</div>
            </div>
        </div>
        <div class="md:col-span-8 space-y-6 max-h-[70vh] overflow-y-auto pr-2">
            <div>
                <span class="code-font text-amber-500 text-xs tracking-widest uppercase">Character Entry</span>
                <h2 class="text-3xl font-extrabold text-white mt-1">Benjamin D. Natalli</h2>
                <p class="text-xs text-slate-400 code-font mt-1">Audio Designer / Narrative Enthusiast</p>
            </div>
            <div class="h-[1px] bg-white/10"></div>
            <div class="text-sm text-slate-300 space-y-4 leading-relaxed">
                <p>Benjamin grew up in Stockholm to a Brazilian family with a deep love of games, introduced to the medium early enough that it became a permanent part of his life.</p>
                <p>It started when his brother handed him a copy of <strong>Baldur's Gate 1</strong> — the first game he truly fell in love with, and one that shaped his taste ever since (Planescape: Torment among the titles it led him to).</p>
                <p>He's always carried a parallel love for music, sound, and voice acting, and set out after high school to connect the two. Today he sees games as the highest art form — the rare place where interactive logic and creative expression merge into something living. He's currently studying game development, aiming to specialize in technical audio implementation pipelines with a focus on dialogue, with one clear goal: to help build the next great, complete <strong>CRPG</strong>, where voice and audio systems carry the story forward.</p>
            </div>
            <div class="h-[1px] bg-white/10"></div>
            <div class="space-y-4 text-xs code-font">
                <div>
                    <span class="text-amber-500 font-bold uppercase tracking-wider block mb-1">Favorite Games:</span>
                    <p class="text-slate-300 pl-3 border-l border-amber-500/30">Baldur's Gate Series, Planescape: Torment, Disco Elysium, Witcher 3, Elden Ring</p>
                </div>
                <div>
                    <span class="text-amber-500 font-bold uppercase tracking-wider block mb-1">Hobbies:</span>
                    <p class="text-slate-300 pl-3 border-l border-amber-500/30">Mushroom foraging, woodworking, D&D, brewing, perfumery</p>
                </div>
                <div>
                    <span class="text-amber-500 font-bold uppercase tracking-wider block mb-1">Favorite Sports:</span>
                    <p class="text-slate-300 pl-3 border-l border-amber-500/30">Volleyball, climbing, kayaking</p>
                </div>
                <div>
                    <span class="text-amber-500 font-bold uppercase tracking-wider block mb-1">Favorite Books:</span>
                    <p class="text-slate-300 pl-3 border-l border-amber-500/30">The Wind-Up Bird Chronicle (Murakami), Mort (Pratchett)</p>
                </div>
                <div>
                    <span class="text-amber-500 font-bold uppercase tracking-wider block mb-1">Favorite Movies:</span>
                    <p class="text-slate-300 pl-3 border-l border-amber-500/30">V for Vendetta, Watchmen, The Princess Bride, The Lord of the Rings</p>
                </div>
                <div>
                    <span class="text-amber-500 font-bold uppercase tracking-wider block mb-1">Favorite Music:</span>
                    <p class="text-slate-300 pl-3 border-l border-amber-500/30">Fleet Foxes, RY X, Laura Marling, Nils Frahm, Grupo Revelação</p>
                </div>
            </div>
        </div>
    </div>
`;

export function openAboutModal() {
    const modal = document.getElementById('about-detail-modal');
    const body = document.getElementById('about-modal-body');
    const wrapper = document.getElementById('about-modal-wrapper');
    if (!modal || !body || !wrapper) return;

    body.innerHTML = aboutContent;
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

    modal.classList.remove('opacity-100');
    wrapper.classList.remove('scale-100');
    wrapper.classList.add('scale-95');
    document.body.style.overflow = '';

    setTimeout(() => {
        modal.classList.add('hidden');
    }, 300);
}

/* =========================================================
   PROJECT MODAL
   ========================================================= */

const projectsData = {
    'tentacle-tango': {
        title: 'Tentacle Tango',
        studio: 'Cable Nest',
        role: 'Composer & Sound Designer',
        genre: 'Platformer, Puzzle Co-Op',
        console: 'PC, Nintendo Switch',
        engine: 'Unity',
        daw: 'Reaper',
        comms: 'Slack, Trello, Git',
        time: '~6 months',
        description: 'Composition and sound effect construction optimized for mobile deployment architectures along with structural development, trailers, and streaming assets.',
        image: 'images/cards/tentacle-tango-card.png',
        video: 'videos/tentacle-tango-preview.mp4',
        audioPreview: 'sounds/previews/tentacle-tango.mp3',
        platform: {
            name: 'View on Switch',
            url: 'https://www.nintendo.com/us/store/products/tentacle-tango-switch/',
            logo: 'images/logos/nintendo-switch-logo.png',
            bg: '#E60012',
            hoverBg: '#ff1a2b'
        },
        spotifyEmbed: 'https://open.spotify.com/embed/playlist/XXXXXXXXXXXXXXXX?utm_source=generator&theme=0',
        tags: ['Sound Design', 'Media Support']
    },
    'skeletons': {
        title: 'What Do You Call a Group of Skeletons',
        studio: 'Arctic Bones',
        role: 'Composer & Technical Sound Designer',
        genre: 'Adventure, Narrative',
        console: 'PC',
        engine: 'Unreal Engine 5',
        daw: 'Reaper',
        comms: 'Discord, Perforce, Jira, Confluence',
        time: '~4 months',
        description: 'Music production and systematic sound design across the project\'s runtime content. Focused on clean technical runtime audio support, sound asset structural implementation, and middleware balancing.',
        image: 'images/cards/skeletons-card.jpg',
        video: null,
        audioPreview: 'sounds/previews/skeletons.mp3',
        platform: {
            name: 'View on Steam',
            url: 'https://store.steampowered.com/app/3747520/What_do_You_Call_a_Group_of_Skeletons__Pilot/',
            logo: 'images/logos/Steam_icon_logo.svg.png',
            bg: '#1b2838',
            hoverBg: '#2a475e'
        },
        spotifyEmbed: 'https://open.spotify.com/embed/playlist/XXXXXXXXXXXXXXXX?utm_source=generator&theme=0',
        tags: ['Composer', 'Sound Designer']
    },
    'aura-farmers': {
        title: 'Aura Farmers (Into the Zone)',
        studio: 'Cable Nest',
        role: 'Sound Designer',
        genre: 'Simulation, Strategy',
        console: 'PC',
        engine: 'Unity',
        daw: 'Reaper',
        comms: 'Slack, Trello',
        time: '~3 months',
        description: 'Focused entirely on external sound design, delivering tailored audio assets and establishing an immersive sonic palette for the title.',
        image: 'images/cards/aura-farmers-card.png',
        video: 'videos/aura-farmers-preview.mp4',
        audioPreview: 'sounds/previews/aura-farmers.mp3',
        platform: {
            name: 'View on Steam',
            url: 'https://store.steampowered.com/app/3270900/Aura_Farmers/',
            logo: 'images/logos/Steam_icon_logo.svg.png',
            bg: '#1b2838',
            hoverBg: '#2a475e'
        },
        spotifyEmbed: 'https://open.spotify.com/embed/playlist/XXXXXXXXXXXXXXXX?utm_source=generator&theme=0',
        tags: ['Sound Design']
    },
    'rubik-road': {
        title: 'Rubik Road',
        studio: 'Indie Project',
        role: 'Developer & Audio',
        genre: 'Puzzle, Arcade',
        console: 'Android, iOS',
        engine: 'Unity',
        daw: 'Reaper',
        comms: 'Solo',
        time: '~8 months',
        description: 'A personal project developed for mobile platforms. Handled all aspects of game design, programming, and audio integration.',
        image: 'images/cards/rubik-road-card.png',
        video: null,
        audioPreview: 'sounds/previews/rubik-road.mp3',
        platform: {
            name: 'Available on Playstore',
            url: '#',
            logo: 'images/logos/Google_Play_2022_icon.svg.png',
            bg: 'rgba(255,255,255,0.1)',
            hoverBg: 'rgba(255,255,255,0.2)',
            textColor: '#e7e5e4',
            border: '1px solid rgba(255,255,255,0.2)'
        },
        spotifyEmbed: 'https://open.spotify.com/embed/playlist/XXXXXXXXXXXXXXXX?utm_source=generator&theme=0',
        tags: ['Developer', 'Mobile Release']
    },
    'crocodine': {
        title: 'CrocoDine',
        studio: 'Indie Project',
        role: 'Developer & Audio',
        genre: 'Arcade, Casual',
        console: 'Android, iOS',
        engine: 'Unity',
        daw: 'Reaper',
        comms: 'Solo',
        time: '~5 months',
        description: 'Independent mobile game title featuring custom audio architecture and full technical development pipeline from concept to release.',
        image: 'images/cards/crocodine-card.png',
        video: null,
        audioPreview: 'sounds/previews/crocodine.mp3',
        platform: {
            name: 'Available on Playstore',
            url: '#',
            logo: 'images/logos/Google_Play_2022_icon.svg.png',
            bg: 'rgba(255,255,255,0.1)',
            hoverBg: 'rgba(255,255,255,0.2)',
            textColor: '#e7e5e4',
            border: '1px solid rgba(255,255,255,0.2)'
        },
        spotifyEmbed: 'https://open.spotify.com/embed/playlist/XXXXXXXXXXXXXXXX?utm_source=generator&theme=0',
        tags: ['Developer', 'Mobile Release']
    },
    'huldr': {
        title: 'HULDR',
        studio: 'Animation',
        role: 'Composer & Sound Designer',
        genre: 'Animation, Fantasy',
        console: 'Theatrical',
        engine: 'N/A',
        daw: 'Reaper, Pro Tools',
        comms: 'Email, Frame.io',
        time: '~2 months',
        description: 'Full music composition and sound design for this cinematic release, building the atmosphere and narrative through extensive audio post-production.',
        image: 'images/cards/huldr-card.png',
        video: null,
        audioPreview: 'sounds/previews/huldr.mp3',
        platform: null,
        spotifyEmbed: 'https://open.spotify.com/embed/playlist/XXXXXXXXXXXXXXXX?utm_source=generator&theme=0',
        tags: ['Composition', 'Sound Design']
    },
    'retusch': {
        title: 'Retusch',
        studio: 'Short-film',
        role: 'Music & Sound (Specific Scene)',
        genre: 'Drama, Short-film',
        console: 'Theatrical',
        engine: 'N/A',
        daw: 'Reaper, Pro Tools',
        comms: 'Email',
        time: '~2 weeks',
        description: 'Provided highly targeted music and sound design for a pivotal scene within the film, enhancing the emotional and narrative impact.',
        image: 'images/cards/retusch-card.png',
        video: null,
        audioPreview: 'sounds/previews/retusch.mp3',
        platform: null,
        spotifyEmbed: 'https://open.spotify.com/embed/playlist/XXXXXXXXXXXXXXXX?utm_source=generator&theme=0',
        tags: ['Music & Sound']
    }
};

function buildProjectModalHTML(id) {
    const p = projectsData[id];
    if (!p) return '';

    const platformBtn = p.platform ? `
        <a href="${p.platform.url}" target="_blank" rel="noopener"
           class="inline-flex items-center justify-center gap-3 font-mono font-bold text-xs uppercase tracking-widest px-6 py-3 rounded-md transition-colors shadow-lg"
           style="background-color: ${p.platform.bg}; color: ${p.platform.textColor || '#fff'}; ${p.platform.border ? 'border: ' + p.platform.border : ''}"
           onmouseover="this.style.backgroundColor='${p.platform.hoverBg}'"
           onmouseout="this.style.backgroundColor='${p.platform.bg}'">
            <img src="${p.platform.logo}" alt="" class="w-5 h-5 object-contain ${p.platform.name.includes('Switch') ? 'brightness-0 invert' : ''}">
            ${p.platform.name}
        </a>
    ` : `
        <span class="inline-flex items-center justify-center gap-2 bg-amber-500/10 text-amber-400 border border-amber-500/20 font-mono font-bold text-xs uppercase tracking-widest px-6 py-3 rounded-md">
            Theatrical Release
        </span>
    `;

    const spotifySection = p.spotifyEmbed ? `
        <div class="pt-4 border-t border-white/10">
            <span class="text-amber-500 font-bold uppercase tracking-wider block mb-3 text-xs code-font">Project Soundtrack</span>
            <iframe style="border-radius:12px" src="${p.spotifyEmbed}" width="100%" height="152" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy" class="opacity-90 hover:opacity-100 transition-opacity"></iframe>
        </div>
    ` : '';

    return `
        <div class="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            <div class="md:col-span-5">
                <div class="w-full rounded-xl overflow-hidden border border-white/5 bg-[#0a0a0c] aspect-video relative group">
                    <img src="${p.image}" alt="${p.title}" class="w-full h-full object-cover">
                    ${p.video ? `
                        <video class="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500" muted loop playsinline preload="metadata">
                            <source src="${p.video}" type="video/mp4">
                        </video>
                    ` : ''}
                </div>
                <div class="mt-4 grid grid-cols-2 gap-2 text-xs code-font">
                    <div class="bg-white/5 rounded-lg p-3 border border-white/5">
                        <span class="text-slate-500 uppercase tracking-wider block text-[10px] mb-1">Engine</span>
                        <span class="text-white font-medium">${p.engine}</span>
                    </div>
                    <div class="bg-white/5 rounded-lg p-3 border border-white/5">
                        <span class="text-slate-500 uppercase tracking-wider block text-[10px] mb-1">DAW</span>
                        <span class="text-white font-medium">${p.daw}</span>
                    </div>
                    <div class="bg-white/5 rounded-lg p-3 border border-white/5">
                        <span class="text-slate-500 uppercase tracking-wider block text-[10px] mb-1">Time</span>
                        <span class="text-white font-medium">${p.time}</span>
                    </div>
                    <div class="bg-white/5 rounded-lg p-3 border border-white/5">
                        <span class="text-slate-500 uppercase tracking-wider block text-[10px] mb-1">Studio</span>
                        <span class="text-white font-medium">${p.studio}</span>
                    </div>
                </div>
            </div>
            <div class="md:col-span-7 space-y-6 max-h-[75vh] overflow-y-auto pr-2">
                <div>
                    <span class="code-font text-amber-500 text-xs tracking-widest uppercase">${p.studio}</span>
                    <h2 class="text-3xl font-extrabold text-white mt-1 leading-tight">${p.title}</h2>
                    <p class="text-sm text-slate-400 code-font mt-1">${p.role}</p>
                </div>
                <div class="flex flex-wrap gap-2">
                    ${p.tags.map(t => `<span class="px-3 py-1.5 bg-white/5 rounded-md border border-white/10 font-mono text-[10px] font-bold uppercase text-white/50">${t}</span>`).join('')}
                </div>
                <div class="h-[1px] bg-white/10"></div>
                <div class="space-y-3 text-sm">
                    <div class="flex gap-4">
                        <span class="text-slate-500 code-font text-xs uppercase w-20 shrink-0">Genre</span>
                        <span class="text-slate-200">${p.genre}</span>
                    </div>
                    <div class="flex gap-4">
                        <span class="text-slate-500 code-font text-xs uppercase w-20 shrink-0">Console</span>
                        <span class="text-slate-200">${p.console}</span>
                    </div>
                    <div class="flex gap-4">
                        <span class="text-slate-500 code-font text-xs uppercase w-20 shrink-0">Comms</span>
                        <span class="text-slate-200">${p.comms}</span>
                    </div>
                </div>
                <div class="h-[1px] bg-white/10"></div>
                <div class="text-sm text-slate-300 leading-relaxed">
                    <p>${p.description}</p>
                </div>
                ${spotifySection}
                <div class="pt-2">
                    ${platformBtn}
                </div>
            </div>
        </div>
    `;
}

export function openProjectModal(projectId) {
    const modal = document.getElementById('project-detail-modal');
    const body = document.getElementById('project-modal-body');
    const wrapper = document.getElementById('project-modal-wrapper');
    if (!modal || !body || !wrapper) return;

    body.innerHTML = buildProjectModalHTML(projectId);
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';

    setTimeout(() => {
        modal.classList.add('opacity-100');
        wrapper.classList.remove('scale-95');
        wrapper.classList.add('scale-100');
    }, 50);
}

export function closeProjectModal() {
    const modal = document.getElementById('project-detail-modal');
    const wrapper = document.getElementById('project-modal-wrapper');
    if (!modal || !wrapper) return;

    modal.classList.remove('opacity-100');
    wrapper.classList.remove('scale-100');
    wrapper.classList.add('scale-95');
    document.body.style.overflow = '';

    setTimeout(() => {
        modal.classList.add('hidden');
    }, 300);
}



/* =========================================================
   INIT
   ========================================================= */

export function initModal() {
    window.openAboutModal = openAboutModal;
    window.closeAboutModal = closeAboutModal;
    window.openProjectModal = openProjectModal;
    window.closeProjectModal = closeProjectModal;

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeAboutModal();
            closeProjectModal();
        }
    });

    const aboutModal = document.getElementById('about-detail-modal');
    if (aboutModal) {
        aboutModal.addEventListener('click', (e) => {
            if (e.target === aboutModal) closeAboutModal();
        });
    }

    const projectModal = document.getElementById('project-detail-modal');
    if (projectModal) {
        projectModal.addEventListener('click', (e) => {
            if (e.target === projectModal) closeProjectModal();
        });
    }
}