// js/mouse.js

export function initMouseGlow() {
    const glow = document.getElementById('mouse-glow');
    if (!glow) return;

    window.addEventListener('mousemove', (e) => {
        // Uppdaterar gradientens mittpunkt till musens koordinater
        glow.style.background = `radial-gradient(400px at ${e.clientX}px ${e.clientY}px, rgba(245, 158, 11, 0.05), transparent 70%)`;
    });
}