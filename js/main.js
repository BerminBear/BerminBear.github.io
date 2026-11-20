// js/main.js
import { initModal } from './modal.js';
import { initMediaPreviews } from './media-preview.js';
import { initAnimations } from './animations.js';
import { initParticles } from './particles.js';
import { initHeaderDrawer } from './header-drawer.js';

function initApp() {
    initHeaderDrawer();
    initAnimations();
    initModal();
    initMediaPreviews();
    initParticles({ count: 36 });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}