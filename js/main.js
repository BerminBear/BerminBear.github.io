// js/main.js
import { initMouseGlow } from './mouse.js';
import { initModal } from './modal.js';
import { initSound } from './sound.js';
import { initMediaPreviews } from './media-preview.js';
import { initAnimations } from './animations.js';
import { initThemes } from './theme.js'; 

function initApp() {
    initAnimations();
    initMouseGlow();
    initModal();
    initSound();
    initMediaPreviews();
    initThemes();
    console.log('System initialized successfully.');
}

// Körs direkt om DOM redan är redo, annars vid DOMContentLoaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}