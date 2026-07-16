// js/mouse.js

export function initMouseGlow() {
    const glow = document.getElementById('mouse-glow');
    const cursor = document.getElementById('custom-cursor');
    
    // Om något av elementen saknas, avbryt
    if (!glow || !cursor) return;

    window.addEventListener('mousemove', (e) => {
        // Uppdaterar gradientens mittpunkt till musens koordinater (befintlig kod)
        glow.style.background = `radial-gradient(400px at ${e.clientX}px ${e.clientY}px, rgba(245, 158, 11, 0.05), transparent 70%)`;
        
        // Flyttar custom cursor-pricken till musens koordinater
        cursor.style.left = `${e.clientX}px`;
        cursor.style.top = `${e.clientY}px`;
    });

    // --- LOGIK FÖR ATT DÖLJA MUSEN VID HOVER ---
    
    // Samla in alla klickbara element på sidan
    const clickables = document.querySelectorAll('a, button, .project-card, [onclick]');
    
    clickables.forEach((el) => {
        // När musen går in över ett klickbart element, lägg till klassen som döljer pricken
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('cursor-hidden');
        });
        
        // När musen lämnar det klickbara elementet, ta bort klassen så pricken syns igen
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('cursor-hidden');
        });
    });
}