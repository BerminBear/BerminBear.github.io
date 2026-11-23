// js/main.js
import { initModal } from './modal.js';
import { initProjectCards } from './project-card.js';
import { initMediaPreviews } from './media-preview.js';
import { initAnimations } from './animations.js';
import { initParticles } from './particles.js';
import { initHeaderDrawer } from './header-drawer.js';
import { initStackIcons } from './stack-icons.js';
import { initShowcaseStage } from './showcase-stage.js';

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
    safeRun('projectCards', () => initProjectCards());
    safeRun('mediaPreviews', () => initMediaPreviews());
    safeRun('particles', () => initParticles({ count: 56 }));
    safeRun('stackIcons', () => initStackIcons());
    safeRun('showcaseStage', () => initShowcaseStage());
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}