// js/modal.js

const aboutContent = `
    <div class="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        <div class="md:col-span-4">
            <div class="w-full rounded-xl overflow-hidden shadow-2xl shadow-amber-900/20">
                <img src="character-portrait.png" alt="Character Log: Benjamin Natalli" class="w-full h-full object-cover">
            </div>
            <div class="mt-4 pt-4 border-t border-white/5 space-y-2 text-xs code-font text-slate-400">
                <div><span class="text-slate-600 uppercase tracking-wider block text-[10px] mb-0.5">Age:</span> 25</div>
                <div><span class="text-slate-600 uppercase tracking-wider block text-[10px] mb-0.5">Race:</span> Human</div>
                <div><span class="text-slate-600 uppercase tracking-wider block text-[10px] mb-0.5">Origin:</span> Stockholm, Sweden</div>
                <div><span class="text-slate-600 uppercase tracking-wider block text-[10px] mb-0.5">Languages:</span> Swedish (Native), English (Fluent), Portuguese (Fundamentals)</div>
            </div>
        </div>
        <div class="md:col-span-8 space-y-6 max-h-[70vh] overflow-y-auto pr-2">
            <div>
                <span class="code-font text-amber-500 text-xs tracking-widest uppercase">// Character_Log.entry</span>
                <h2 class="text-3xl font-extrabold text-white mt-1">Benjamin D. Natalli</h2>
                <p class="text-xs text-slate-400 code-font mt-1">Audio Developer /Narrative Enthusiast</p>
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

import { playSound } from './sound.js';


export function openAboutModal() {
    const modal = document.getElementById('about-detail-modal');
    const body = document.getElementById('about-modal-body');
    const wrapper = document.getElementById('about-modal-wrapper');
    if (!modal || !body || !wrapper) return;
    playSound('click');
    body.innerHTML = aboutContent;


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
    playSound('close');

    modal.classList.remove('opacity-100');
    wrapper.classList.remove('scale-100');
    wrapper.classList.add('scale-95');
    document.body.style.overflow = '';

    setTimeout(() => {
        modal.classList.add('hidden');
    }, 300);
}

export function initModal() {
    window.openAboutModal = openAboutModal;
    window.closeAboutModal = closeAboutModal;

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeAboutModal();
    });

    const modal = document.getElementById('about-detail-modal');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeAboutModal();
        });
    }
}