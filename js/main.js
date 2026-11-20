// js/main.js
import { initModal } from './modal.js';
import { initProjectCards } from './project-card.js'; // <-- NY IMPORT
import { initMediaPreviews } from './media-preview.js';
import { initAnimations } from './animations.js';
import { initParticles } from './particles.js';
import { initHeaderDrawer } from './header-drawer.js';

function safeRun(label, fn) {
    try {
        fn();
    } catch (err) {
        console.error(`[init:${label}]`, err);
    }
}

function initApp() {
    safeRun('headerDrawer', () => initHeaderDrawer());
    safeRun('animations', () => initAnimations());
    safeRun('modal', () => initModal());
    safeRun('projectCards', () => initProjectCards()); // <-- KÖR DENNA FÖRST
    safeRun('mediaPreviews', () => initMediaPreviews());
    safeRun('particles', () => initParticles({ count: 36 }));
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}