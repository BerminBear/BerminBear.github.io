// js/workflow.js
const steps = {
    architecture: {
        title: "01 Architecture & Logic",
        subtitle: "// Foundation Planning",
        desc: "Creating solid logic designs before audio production. This involves structuring event systems, dialogue hierarchies and global variables in Wwise/FMOD to ensure they are robust and scalable.",
        media: "[ Architecture blueprint loading... ]"
    },
    automation: {
        title: "02 Automated Delivery Pipelines",
        subtitle: "// Fast Iteration Pipelines",
        desc: "Replacing repetitive export routines with streamlined scripts. Using Python and custom DAWs setups (Reaper APIs) to automatically trim, rename, level, and inject raw speech files into the engine.",
        media: "[ Running pipeline_sync_v4.py... ]"
    },
    systems: {
        title: "03 Dynamic & Systemic Audio",
        subtitle: "// Deep Game Integration",
        desc: "Constructing reactive dialogue trees and state-driven soundscapes that adapt to real-time gameplay. This bridges structural scripting directly with immersive world-building.",
        media: "[ Real-time systemic event debugger: ACTIVE ]"
    },
    optimization: {
        title: "04 Profiling & Optimization",
        subtitle: "// Profiling & Budgets",
        desc: "Rigorous profiling of audio threads to keep CPU, RAM, and disk storage optimal on all platforms. Using advanced compression matrices and prioritizing dynamic memory pooling.",
        media: "[ Memory allocation layout: OK (45% compressed) ]"
    }
};

export function changeStep(stepNum, stepKey) {
    const content = document.getElementById('pipeline-content');
    const media = document.getElementById('pipeline-media');
    const progress = document.getElementById('pipeline-progress');
    if (!content || !media || !progress) return;
    
    content.style.opacity = '0';
    media.style.opacity = '0';
    
    setTimeout(() => {
        const data = steps[stepKey];
        content.innerHTML = `
            <span class="code-font text-amber-500 text-[10px] tracking-widest uppercase block">${data.subtitle}</span>
            <h4 class="text-xl font-bold text-white">${data.title}</h4>
            <p class="text-xs text-slate-400 leading-relaxed">${data.desc}</p>
        `;
        media.innerHTML = data.media;
        
        content.style.opacity = '1';
        media.style.opacity = '1';
    }, 300);

    progress.style.height = `${(stepNum / 4) * 100}%`;

    document.querySelectorAll('.pipeline-node').forEach((node, i) => {
        const dot = node.querySelector('.node-dot');
        const label = node.querySelector('span');
        if (i + 1 === stepNum) {
            dot.className = "node-dot w-8 h-8 rounded-full bg-amber-500 text-black font-bold flex items-center justify-center text-xs transition-all code-font";
            label.className = "text-xs uppercase tracking-widest code-font text-white transition-colors";
        } else {
            dot.className = "node-dot w-8 h-8 rounded-full bg-slate-900 border border-slate-700 text-slate-400 font-bold flex items-center justify-center text-xs transition-all code-font";
            label.className = "text-xs uppercase tracking-widest code-font text-slate-500 hover:text-amber-400 transition-colors";
        }
    });
}

export function initWorkflow() {
    // Gör funktionen tillgänglig för HTML-klick
    window.changeStep = changeStep;
    // Sätt första steget som aktivt vid start
    changeStep(1, 'architecture');
    window.changeStep = changeStep;
}