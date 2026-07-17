// js/mouse.js

export function initMouseGlow() {
    const glow = document.getElementById('mouse-glow');
    const cursor = document.getElementById('custom-cursor');
    
    if (!glow || !cursor) return;

    window.addEventListener('mousemove', (e) => {
        // Fixerad radie och intensitet som förblir oförändrad vid hover
        const radius = '200px';
        const intensity = '0.08';
        
        // Uppdaterar gradienten stabilt efter musens koordinater
        glow.style.background = `radial-gradient(${radius} at ${e.clientX}px ${e.clientY}px, rgba(245, 158, 11, ${intensity}), transparent 70%)`;
        
        // Flyttar pricken
        cursor.style.left = `${e.clientX}px`;
        cursor.style.top = `${e.clientY}px`;
    });

    // --- LOGIK FÖR INTERAKTION (HOVER) ---
    // Pricken döljs fortfarande precis som förut, men bakgrundsljuset förblir orört
    const interactiveSelector = 'a, button, summary, .project-card, .cv-clickable-card, .cv-name-trigger, [onclick]';
    const clickables = document.querySelectorAll(interactiveSelector);
    
    clickables.forEach((el) => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('cursor-hidden');
        });
        
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('cursor-hidden');
        });
    });
}