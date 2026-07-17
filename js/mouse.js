// js/mouse.js

export function initMouseGlow() {
    const glow = document.getElementById('mouse-glow');
    const cursor = document.getElementById('custom-cursor');
    
    if (!glow || !cursor) return;

    let isHoveringInteractive = false;

    window.addEventListener('mousemove', (e) => {
        // Justera radie och opacitet baserat på om musen hovrar över något klickbart
        const radius = isHoveringInteractive ? '120px' : '200px';
        const intensity = isHoveringInteractive ? '0.16' : '0.08';
        
        // Uppdaterar gradienten dynamiskt
        glow.style.background = `radial-gradient(${radius} at ${e.clientX}px ${e.clientY}px, rgba(245, 158, 11, ${intensity}), transparent 70%)`;
        
        // Flyttar pricken
        cursor.style.left = `${e.clientX}px`;
        cursor.style.top = `${e.clientY}px`;
    });

    // --- LOGIK FÖR INTERAKTION (HOVER) ---
    // Inkluderar klasser och element från både index.html och cv.html
    const interactiveSelector = 'a, button, summary, .project-card, .cv-clickable-card, .cv-name-trigger, [onclick]';
    const clickables = document.querySelectorAll(interactiveSelector);
    
    clickables.forEach((el) => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('cursor-hidden');
            isHoveringInteractive = true;
        });
        
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('cursor-hidden');
            isHoveringInteractive = false;
        });
    });
}