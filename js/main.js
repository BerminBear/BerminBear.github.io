// js/main.js
import { initMouseGlow } from './mouse.js';
import { initWorkflow } from './workflow.js';
import { initModal } from './modal.js';
import { initScrollSystems } from './scroll.js';
import { initSound } from './sound.js';
import { initMediaPreviews } from './media-preview.js';
import { initAnimations } from './animations.js';

function initApp() {
    initAnimations();
    initMouseGlow();
    initWorkflow();
    initModal();
    initScrollSystems();
    initSound();
    initMediaPreviews();
    console.log('System initialized successfully.');
}

// Körs direkt om DOM redan är redo, annars vid DOMContentLoaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}