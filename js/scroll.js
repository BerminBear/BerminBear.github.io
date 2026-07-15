// js/scroll.js

let hasLoggedHeightError = false;
let hasLoggedWidthError = false;

export function scrollToProject(index) {
    const wrapper = document.getElementById('projects-scroll-wrapper');
    if (!wrapper) return;
    const maxScroll = wrapper.offsetHeight - window.innerHeight;
    let scrollTarget = 0;
    
    if (index === 1) scrollTarget = maxScroll * 0.33;
    else if (index === 2) scrollTarget = maxScroll * 0.64;
    else if (index === 3) scrollTarget = maxScroll * 1.0;
    
    window.scrollTo({
        top: scrollTarget,
        behavior: 'smooth' 
    });
}

function updateProjectsSidebarNav(percentage) {
    const navLinks = document.querySelectorAll('#projects-nav a');
    let activeIdx = 0;
    if (percentage > 0.15 && percentage <= 0.48) activeIdx = 1;
    else if (percentage > 0.48 && percentage <= 0.8) activeIdx = 2;
    else if (percentage > 0.8) activeIdx = 3;

    navLinks.forEach((link, i) => {
        if (i === activeIdx) {
            link.classList.remove('text-slate-500');
            link.classList.add('text-amber-500');
        } else {
            link.classList.remove('text-amber-500');
            link.classList.add('text-slate-500');
        }
    });
}

function handleDirectScroll() {
    const projectsView = document.getElementById('view-projects');
    if (!projectsView || projectsView.classList.contains('hidden')) return;
    
    const wrapper = document.getElementById('projects-scroll-wrapper');
    const track = document.getElementById('projects-horizontal-track');
    
    if (!wrapper || !track) {
        console.error("[Scroll System] Kunde inte hitta '#projects-scroll-wrapper' eller '#projects-horizontal-track' i DOM:en!");
        return;
    }

    const maxScroll = wrapper.offsetHeight - window.innerHeight;
    const maxTrack = track.scrollWidth - window.innerWidth;
    
    // --- SJÄLVDIAGNOSTIK (Kollar din CSS i realtid) ---
    if (maxScroll <= 0 && !hasLoggedHeightError) {
        console.warn(
            `%c[Scroll System FEL]%c '#projects-scroll-wrapper' är för kort (${wrapper.offsetHeight}px). ` +
            `Du måste ge den en stor höjd i din HTML, t.ex. klassen 'h-[300vh]'. Annars kan man inte scrolla!`,
            "background: #ef4444; color: white; padding: 2px 5px; border-radius: 3px;", "color: #f59e0b;"
        );
        hasLoggedHeightError = true;
    }
    if (maxTrack <= 0 && !hasLoggedWidthError) {
        console.warn(
            `%c[Scroll System FEL]%c '#projects-horizontal-track' är för smal (${track.scrollWidth}px). ` +
            `Dina projektkort radbryts troligen. Se till att containern har klasserna 'flex flex-row flex-nowrap w-max' i din HTML!`,
            "background: #ef4444; color: white; padding: 2px 5px; border-radius: 3px;", "color: #f59e0b;"
        );
        hasLoggedWidthError = true;
    }
    // --------------------------------------------------

    if (maxScroll > 0) {
        const percentage = Math.max(0, Math.min(1, window.scrollY / maxScroll));
        const translateX = -percentage * maxTrack;
        track.style.transform = `translateX(${translateX}px)`;
        
        updateProjectsSidebarNav(percentage);

        // Din behållna mjuk ut-fade/scale av elementen nära skärmkanterna
        const cards = track.querySelectorAll('.project-card');
        cards.forEach(card => {
            const rect = card.getBoundingClientRect();
            const cardCenter = rect.left + rect.width / 2;
            const screenCenter = window.innerWidth / 2;
            const dist = Math.abs(cardCenter - screenCenter);
            
            const maxDist = window.innerWidth * 0.6;
            let opacity = 1 - (dist / maxDist);
            opacity = Math.max(0.15, Math.min(1, opacity));
            
            let scale = 1 - (dist / (window.innerWidth * 2));
            scale = Math.max(0.9, Math.min(1.05, scale));
            
            card.style.opacity = opacity;
            card.style.transform = `scale(${scale})`;
        });
    }
}

export function initScrollSystems() {
    window.scrollToProject = scrollToProject;

    window.addEventListener('scroll', () => {
        handleDirectScroll();
        handleHomeNavScroll();
        window.scrollToProject = scrollToProject;
    });

    window.addEventListener('wheel', (e) => {
        const projectsView = document.getElementById('view-projects');
        if (!projectsView || projectsView.classList.contains('hidden')) return;

        const modal = document.getElementById('project-detail-modal');
        if (modal && !modal.classList.contains('hidden')) return;

        if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
            e.preventDefault();
            window.scrollBy({
                top: e.deltaX,
                behavior: 'auto'
            });
        }
    }, { passive: false });
    
    // Kör direkt för att återställa fel-flaggor vid sidbyte
    const observer = new MutationObserver(() => {
        hasLoggedHeightError = false;
        hasLoggedWidthError = false;
        handleDirectScroll();
    });
    
    const projectsView = document.getElementById('view-projects');
    if (projectsView) {
        observer.observe(projectsView, { attributes: true, attributeFilter: ['class'] });
    }

    handleDirectScroll();
}

function handleHomeNavScroll() {
    if (!document.getElementById('view-projects').classList.contains('hidden')) return;

    const sections = ['hero', 'showreel', 'workflow', 'tech-stack'];
    const navLinks = document.querySelectorAll('#portfolio-nav a');
    
    let currentSection = 'hero';
    const scrolledToBottom = (window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight - 100;
    
    if (scrolledToBottom) {
        currentSection = 'tech-stack';
    } else {
        sections.forEach(id => {
            const el = document.getElementById(id);
            if (el && window.scrollY >= el.offsetTop - 150) {
                currentSection = id;
            }
        });
    }

    navLinks.forEach((link, i) => {
        if (sections[i] === currentSection) {
            link.classList.remove('text-slate-500');
            link.classList.add('text-amber-500');
        } else {
            link.classList.remove('text-amber-500');
            link.classList.add('text-slate-500');
        }
    });
}