// 1. Dölj elementen blixtsnabbt innan webbläsaren hinner rita ut dem
document.head.insertAdjacentHTML("beforeend", `
    <style id="preload-hide">
        main > section, main > div, nav, .project-lane, .nav-link, .nav-link-separator { opacity: 0; }
    </style>
`);

export function initAnimations() {
    // 2. Ta bort den temporära dölj-regeln när vi är redo att animera
    const preloadStyle = document.getElementById('preload-hide');
    if (preloadStyle) preloadStyle.remove();

    const isHomePage = document.getElementById('hero') !== null;
    const isProjectsPage = document.querySelector('.lanes-wrapper') !== null;

    if (isHomePage) {
        // HOME: Fada in navbaren först med fade-up
        const navElement = document.querySelector('nav');
        if (navElement) {
            navElement.style.animationDelay = `0.05s`;
            navElement.classList.add('animate-fade-up');
        }

        // HOME: Sektioner nedifrån och upp
        const homeSections = document.querySelectorAll('main > section, main > div');
        homeSections.forEach((section, index) => {
            section.style.animationDelay = `${(index + 1) * 0.15}s`;
            section.classList.add('animate-fade-up');
        });
    }

    if (isProjectsPage) {
        // PROJECTS: Lanes — Höger till vänster
        const projectLanes = document.querySelectorAll('.project-lane');
        projectLanes.forEach((lane, index) => {
            lane.style.animationDelay = `${index * 0.2}s`;
            lane.classList.add('animate-fade-right');

            const onAnimEnd = (e) => {
                if (e.animationName === 'slideRightFade') {
                    lane.classList.remove('animate-fade-right');
                    lane.classList.add('lane-ready');
                    lane.removeEventListener('animationend', onAnimEnd);
                }
            };
            lane.addEventListener('animationend', onAnimEnd);
        });

        // Nav links — fade in from right with stagger
        const navLinks = document.querySelectorAll('.nav-link, .nav-link-separator');
        navLinks.forEach((link, index) => {
            link.style.animationDelay = `${0.3 + (index * 0.1)}s`;
            link.classList.add('animate-fade-right');

            const onAnimEnd = (e) => {
                if (e.animationName === 'slideRightFade') {
                    link.classList.remove('animate-fade-right');
                    link.classList.add('nav-link-ready');
                    link.removeEventListener('animationend', onAnimEnd);
                }
            };
            link.addEventListener('animationend', onAnimEnd);
        });
    }
}