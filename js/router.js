import { scrollToProject, setupHorizontalScroll } from './scroll.js';

let hasVisitedProjects = false;

function updateTopNavActive(activeView) {
    const homeLink = document.querySelector('nav a[href="#hero"]');
    const projectsLink = document.querySelector('nav a[href="#projects"]');

    if (!homeLink || !projectsLink) {
        console.warn('[router.js] updateTopNavActive: nav-länkar saknas.');
        return;
    }

    if (activeView === 'projects') {
        homeLink.classList.remove('text-amber-500');
        homeLink.classList.add('text-slate-400');
        projectsLink.classList.remove('text-slate-400');
        projectsLink.classList.add('text-amber-500');
    } else {
        projectsLink.classList.remove('text-amber-500');
        projectsLink.classList.add('text-slate-400');
        homeLink.classList.remove('text-slate-400');
        homeLink.classList.add('text-amber-500');
    }
}

export function handleRouting() {
    const hash = window.location.hash || '#hero';
    console.log('[router.js] handleRouting: hash =', hash);

    const portfolioView = document.getElementById('view-portfolio');
    const portfolioContent = document.getElementById('portfolio-content-wrapper');
    const projectsView = document.getElementById('view-projects');
    const projectsIntroWrapper = document.getElementById('projects-intro-wrapper');
    const portfolioNav = document.getElementById('portfolio-nav');
    const projectsNav = document.getElementById('projects-nav');

    if (!portfolioView || !projectsView) {
        console.error('[router.js] handleRouting: view-portfolio eller view-projects saknas i DOM.');
        return;
    }

    if (hash === '#projects' || hash.startsWith('#project-')) {
        // --- KLASS-HANTERING FÖR LOGO OCH FLIKAR ---
        // Gör att body signalerar "projects-view". CSS sköter därefter loggans gråtoning
        // samt visar "Overview" och döljer "Projects" automatiskt.
        document.body.classList.add('on-projects-view');
        document.body.classList.remove('on-portfolio-view');

        // 1. Visa sektionen först!
        portfolioView.classList.add('hidden');
        projectsView.classList.remove('hidden');

        if (portfolioNav) {
            portfolioNav.classList.add('xl:hidden');
            portfolioNav.classList.remove('xl:flex');
        }
        if (projectsNav) {
            projectsNav.classList.add('xl:flex');
            projectsNav.classList.remove('xl:hidden');
        }

        // 2. Starta scroll-lyssnaren nu när elementen faktiskt är synliga och har mätbar höjd/bredd!
        setupHorizontalScroll();
        updateTopNavActive('projects');

        if (!hasVisitedProjects) {
            projectsView.classList.add('animate-fade-1s');
            hasVisitedProjects = true;
        } else {
            projectsView.classList.remove('animate-fade-1s');
        }

        // FIX: intro-animationen triggas nu på wrappern, INTE på #projects-horizontal-track,
        // så den krockar aldrig med JS:ens transform-styrning av scrollpositionen.
        if (projectsIntroWrapper) {
            projectsIntroWrapper.classList.remove('animate-intro-projects');
            void projectsIntroWrapper.offsetWidth; // Trigger reflow
            projectsIntroWrapper.classList.add('animate-intro-projects');
            console.log('[router.js] intro-animation triggad på #projects-intro-wrapper.');
        } else {
            console.warn('[router.js] #projects-intro-wrapper saknas — glömde du lägga till wrappern i index.html?');
        }

        if (hash.startsWith('#project-')) {
            const idx = parseInt(hash.replace('#project-', ''));
            if (!isNaN(idx)) {
                setTimeout(() => scrollToProject(idx), 100);
            }
        } else {
            window.scrollTo({ top: 0, behavior: 'instant' });
        }

    } else {
        // --- KLASS-HANTERING FÖR LOGO OCH FLIKAR ---
        // Återställer body till "portfolio-view" vilket gör loggan orange/vit,
        // döljer fliken "Overview" och återställer dropdownen "Projects".
        document.body.classList.add('on-portfolio-view');
        document.body.classList.remove('on-projects-view');

        projectsView.classList.add('hidden');
        portfolioView.classList.remove('hidden');

        if (projectsNav) {
            projectsNav.classList.add('xl:hidden');
            projectsNav.classList.remove('xl:flex');
        }
        if (portfolioNav) {
            portfolioNav.classList.add('xl:flex');
            portfolioNav.classList.remove('xl:hidden');
        }
        updateTopNavActive('home');

        if (portfolioContent) {
            portfolioContent.classList.remove('animate-intro-home');
            void portfolioContent.offsetWidth; // Trigger reflow
            portfolioContent.classList.add('animate-intro-home');
        }

        const targetId = hash.replace('#', '');
        const targetEl = document.getElementById(targetId);
        if (targetEl) {
            setTimeout(() => {
                targetEl.scrollIntoView({ behavior: 'smooth' });
            }, 50);
        } else if (hash === '#hero') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }
}

export function initRouter() {
    window.addEventListener('hashchange', handleRouting);
    handleRouting();
    console.log('[router.js] initRouter: router initierad, hashchange-lyssnare registrerad.');
}