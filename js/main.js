// js/main.js
import { initModal } from './modal.js';
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
    safeRun('mediaPreviews', () => initMediaPreviews());
    safeRun('particles', () => initParticles({ count: 36 }));
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}