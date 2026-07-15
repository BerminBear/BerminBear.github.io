// js/router.js
import { scrollToProject } from './scroll.js';

let hasVisitedProjects = false;

function updateTopNavActive(activeView) {
    const homeLink = document.querySelector('nav a[href="#hero"]');
    const projectsLink = document.querySelector('nav a[href="#projects"]');
    if (!homeLink || !projectsLink) return;
    
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
    
    const portfolioView = document.getElementById('view-portfolio');
    const portfolioContent = document.getElementById('portfolio-content-wrapper');
    const projectsView = document.getElementById('view-projects');
    const projectsTrack = document.getElementById('projects-horizontal-track');
    const portfolioNav = document.getElementById('portfolio-nav');
    const projectsNav = document.getElementById('projects-nav');
    
    if (!portfolioView || !projectsView) return;

    if (hash === '#projects' || hash.startsWith('#project-')) {
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
        
        updateTopNavActive('projects');

        if (!hasVisitedProjects) {
            projectsView.classList.add('animate-fade-1s');
            hasVisitedProjects = true;
        } else {
            projectsView.classList.remove('animate-fade-1s');
        }

        if (projectsTrack) {
            projectsTrack.classList.remove('animate-intro-projects');
            void projectsTrack.offsetWidth; // Trigger reflow
            projectsTrack.classList.add('animate-intro-projects');
        }

        if (hash.startsWith('#project-')) {
            const idx = parseInt(hash.replace('#project-', ''));
            if (!isNaN(idx)) {
                // Liten fördröjning så att DOM hinner ritas upp ordentligt
                setTimeout(() => scrollToProject(idx), 100);
            }
        } else {
            window.scrollTo({ top: 0, behavior: 'instant' });
        }

    } else {
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
    // Kör direkt vid laddning
    handleRouting();
}