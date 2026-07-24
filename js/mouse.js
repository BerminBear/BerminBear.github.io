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

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        // Använd requestAnimationFrame så webbläsaren bara ritar om musen när den är redo (tar bort lagg)
        if (!isMoving) {
            isMoving = true;
            requestAnimationFrame(() => {
                const radius = '200px';
                const intensity = '0.08';
                
                glow.style.background = `radial-gradient(${radius} at ${mouseX}px ${mouseY}px, rgba(245, 158, 11, ${intensity}), transparent 70%)`;
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
    });

    document.addEventListener('mouseout', (e) => {
        const clickable = e.target.closest('a, button, summary, .project-card, .cv-clickable-card, .cv-name-trigger, [onclick]');
        if (clickable) {
            cursor.classList.remove('cursor-hidden');
        }
    });
}