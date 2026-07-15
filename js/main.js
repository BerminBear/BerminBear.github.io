// js/main.js
import { initMouseGlow } from './mouse.js';
import { initWorkflow } from './workflow.js';
import { initModal } from './modal.js';
import { initScrollSystems } from './scroll.js';
import { initRouter } from './router.js';

document.addEventListener('DOMContentLoaded', () => {
    initMouseGlow();
    initWorkflow();
    initModal();
    initScrollSystems();
    
    // Routern startas sist eftersom den förlitar sig på att scroll-systemet är redo
    initRouter();

    console.log("System initialized successfully.");
});