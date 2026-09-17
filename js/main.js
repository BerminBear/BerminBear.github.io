// js/main.js
import { initModal } from './modal.js';
import { initMediaPreviews } from './media-preview.js';
import { initAnimations } from './animations.js';
import { initScrollButton } from './scroll-button.js';
import { initSplash } from './splash.js'; // NY IMPORT

function initApp() {
    initSplash(); // Initiera splash screen först
    initAnimations();
    initModal();
    initMediaPreviews();
    initScrollButton();
    console.log('System initialized successfully.');
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}