// js/scroll.js
let targetScrollY = 0;
let currentScrollY = 0;
const easeFactor = 0.04;

// Återställ LERP-värden vid sidbyte så att spåret inte laggar
export function resetScrollValues() {
    targetScrollY = window.scrollY;
    currentScrollY = window.scrollY;
}

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

function smoothScrollLoop() {
    const projectsView = document.getElementById('view-projects');
    if (projectsView && !projectsView.classList.contains('hidden')) {
        currentScrollY += (targetScrollY - currentScrollY) * easeFactor;
        
        const wrapper = document.getElementById('projects-scroll-wrapper');
        const track = document.getElementById('projects-horizontal-track');
        
        if (wrapper && track) {
            const maxScroll = wrapper.offsetHeight - window.innerHeight;
            const maxTrack = track.scrollWidth - window.innerWidth;
            
            if (maxScroll > 0) {
                const percentage = currentScrollY / maxScroll;
                const translateX = -percentage * maxTrack;
                track.style.transform = `translateX(${translateX}px)`;
                
                updateProjectsSidebarNav(percentage);

                // Mjuk ut-fade av elementen när de glider mot skärmkanten
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
    }
    requestAnimationFrame(smoothScrollLoop);
}

export function initScrollSystems() {
    window.scrollToProject = scrollToProject;

    // Registrera scroll-lyssnare för LERP spåret
    window.addEventListener('scroll', () => {
        if (document.getElementById('view-projects').classList.contains('hidden')) return;
        targetScrollY = window.scrollY;
    });

    // Vänstermeny aktiv status-lyssnare (Home, Showreel, etc.)
    window.addEventListener('scroll', () => {
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
    });

    // Starta renderingsloopen
    requestAnimationFrame(smoothScrollLoop);
}