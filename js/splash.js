// js/splash.js
import { playSound } from './sound.js';

export function initSplash() {
    const splash = document.getElementById('splash-screen');
    const t1 = document.getElementById('splash-text-1');
    const t2 = document.getElementById('splash-text-2');
    const btn = document.getElementById('splash-btn');
    const heroVideo = document.getElementById('hero-showcase');

    if (!splash) return;

    // Lås scroll medan splash-skärmen är aktiv
    document.body.style.overflow = 'hidden';

    // Cinematiskt intonande av texten (styrs via Tailwind opacity-klasser)
    setTimeout(() => t1.classList.remove('opacity-0'), 800);
    setTimeout(() => t2.classList.remove('opacity-0'), 2500);
    setTimeout(() => btn.classList.remove('opacity-0'), 4500);

    // Klick-interaktionen: Låser upp ljud, startar video och tar bort skärmen
    btn.addEventListener('click', () => {
        // sound_5.js fångar automatiskt detta klick via 'pointerdown' för att låsa upp Howler.js
        playSound('click'); // Eller ett eget UI-ljud

        // Tona ut den svarta skärmen
        splash.classList.add('opacity-0');
        document.body.style.overflow = ''; // Tillåt scroll igen

        // Starta videon exakt när övergången börjar
        if (heroVideo) {
            heroVideo.volume = 0.8; // Balansera volymen
            heroVideo.play().catch(err => console.warn('Autoplay blocked:', err));
        }

        // Ta bort elementet från DOM när CSS-transitionen (1000ms) är klar
        setTimeout(() => {
            splash.style.display = 'none';
            splash.remove();
        }, 1000); 
    });
}