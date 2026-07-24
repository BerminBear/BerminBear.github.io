// js/animations.js

// 1. Dölj elementen blixtsnabbt innan webbläsaren hinner rita ut dem
// Detta förhindrar helt "hacket" som uppstår innan animationen startar
document.head.insertAdjacentHTML("beforeend", `
    <style id="preload-hide">
        main > section, main > div, .project-lane { opacity: 0; }
    </style>
`);

document.addEventListener("DOMContentLoaded", () => {
    // 2. Ta bort den temporära dölj-regeln när vi är redo att animera
    const preloadStyle = document.getElementById('preload-hide');
    if (preloadStyle) preloadStyle.remove();

    const isHomePage = document.getElementById('hero') !== null;
    const isProjectsPage = document.querySelector('.lanes-wrapper') !== null;

    if (isHomePage) {
        // HOME: Nedifrån och upp
        const homeSections = document.querySelectorAll('main > section, main > div');
        homeSections.forEach((section, index) => {
            section.style.animationDelay = `${index * 0.15}s`;
            section.classList.add('animate-fade-up');
        });
    }

    if (isProjectsPage) {
        // PROJECTS: Höger till vänster
        const projectLanes = document.querySelectorAll('.project-lane');
        projectLanes.forEach((lane, index) => {
            lane.style.animationDelay = `${index * 0.15}s`;
            lane.classList.add('animate-fade-right');
        });
    }
});
