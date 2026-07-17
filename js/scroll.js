// js/scroll.js

function handleHomeNavScroll() {
    const sections = ['hero', 'workflow', 'experience', 'tech-stack'];
    let activeSectionId = 'hero';
    let minDistance = Infinity;

    const scrollOffset = 200; // matchar scroll-mt-28

    sections.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            const rect = el.getBoundingClientRect();
            const distance = Math.abs(rect.top - scrollOffset);
            if (distance < minDistance) {
                minDistance = distance;
                activeSectionId = id;
            }
        }
    });

    const navLinks = document.querySelectorAll('#portfolio-nav a');
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === `#${activeSectionId}`) {
            link.classList.add('text-amber-500');
            link.classList.remove('text-slate-500', 'text-amber-500/60');
        } else {
            link.classList.add('text-slate-500');
            link.classList.remove('text-amber-500', 'text-amber-500/60');
        }
    });
}

export function initScrollSystems() {
    window.addEventListener('scroll', handleHomeNavScroll);
}