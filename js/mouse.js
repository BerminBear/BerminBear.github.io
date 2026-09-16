// js/mouse.js

export function initMouseGlow() {
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const glow = document.getElementById('mouse-glow');
    const cursor = document.getElementById('custom-cursor');

    if (!glow || !cursor) return;

    let mouseX = 0;
    let mouseY = 0;
    let isMoving = false;
    let currentGlow = 'var(--color-glow)';

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        if (cursor.classList.contains('cursor-hidden')) {
            cursor.classList.remove('cursor-hidden');
        }

        if (!isMoving) {
            isMoving = true;
            requestAnimationFrame(() => {
                const radius = '125px';
                glow.style.background = `radial-gradient(${radius} at ${mouseX}px ${mouseY}px, ${currentGlow}, transparent 70%)`;
                cursor.style.left = `${mouseX}px`;
                cursor.style.top = `${mouseY}px`;
                isMoving = false;
            });
        }
    });

    // Dölj muspekaren när den lämnar fönstret
    document.addEventListener('mouseleave', () => {
        cursor.classList.add('cursor-hidden');
    });

    document.addEventListener('mouseenter', () => {
        cursor.classList.remove('cursor-hidden');
    });

    document.addEventListener('mouseover', (e) => {
        const clickable = e.target.closest('a, button, summary, .project-card, .cv-clickable-card, .cv-name-trigger, [onclick]');
        if (clickable) {
            cursor.classList.add('cursor-hidden');
        }

        const hoverableContainer = e.target.closest('.project-card, .card-surface, #about-modal-wrapper, #project-modal-wrapper');
        if (hoverableContainer) {
            currentGlow = 'var(--color-glow-hover)';
        }
    });

    document.addEventListener('mouseout', (e) => {
        const clickable = e.target.closest('a, button, summary, .project-card, .cv-clickable-card, .cv-name-trigger, [onclick]');
        if (clickable) {
            cursor.classList.remove('cursor-hidden');
        }

        const hoverableContainer = e.target.closest('.project-card, .card-surface, #about-modal-wrapper, #project-modal-wrapper');
        if (hoverableContainer && !hoverableContainer.contains(e.relatedTarget)) {
            currentGlow = 'var(--color-glow)';
        }
    });
}