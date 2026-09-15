// js/mouse.js

export function initMouseGlow() {
    // 1. MOBIL-FIX: Om användaren har en pekskärm (telefon/surfplatta), avbryt hela skriptet direkt.
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const glow = document.getElementById('mouse-glow');
    const cursor = document.getElementById('custom-cursor');

    if (!glow || !cursor) return;

    // 2. PRESTANDA-FIX: Variabler för att hålla musen silkeslen
    let mouseX = 0;
    let mouseY = 0;
    let isMoving = false;
    
    // NYTT: Håller reda på vilken färg musljuset ska ha
    let currentGlow = 'var(--color-glow)';

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        // Använd requestAnimationFrame så webbläsaren bara ritar om musen när den är redo (tar bort lagg)
        if (!isMoving) {
            isMoving = true;
            requestAnimationFrame(() => {
                const radius = '200px';
                
                // NYTT: Nu använder vi vår currentGlow istället för den hårdkodade färgen
                glow.style.background = `radial-gradient(${radius} at ${mouseX}px ${mouseY}px, ${currentGlow}, transparent 70%)`;
                cursor.style.left = `${mouseX}px`;
                cursor.style.top = `${mouseY}px`;
                
                isMoving = false;
            });
        }
    });

    // 3. ROUTER-FIX (Event Delegation): Istället för att fästa händelser på specifika knappar 
    // när sidan laddas, lyssnar vi på hela dokumentet. Då fungerar hover även när du byter sida.
    document.addEventListener('mouseover', (e) => {
        // Kolla om saken vi hovrar över (eller dess förälder) är klickbar
        const clickable = e.target.closest('a, button, summary, .project-card, .cv-clickable-card, .cv-name-trigger, [onclick]');
        if (clickable) {
            cursor.classList.add('cursor-hidden');
        }

        // NYTT: Om vi hovrar ett kort, CV-yta eller modaler -> byt till hover-ljuset
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

        // NYTT: Återställ musljuset till originalfärgen. 
        // contains(e.relatedTarget) säkerställer att vi inte återställer ljuset 
        // bara för att musen rörde sig över en text inuti själva modalen/kortet.
        const hoverableContainer = e.target.closest('.project-card, .card-surface, #about-modal-wrapper, #project-modal-wrapper');
        if (hoverableContainer && !hoverableContainer.contains(e.relatedTarget)) {
            currentGlow = 'var(--color-glow)';
        }
    });
}