// js/main.js
import { initModal } from './modal.js';
import { initMediaPreviews } from './media-preview.js';
import { initAnimations } from './animations.js';
import { initParticles } from './particles.js';

function initApp() {
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