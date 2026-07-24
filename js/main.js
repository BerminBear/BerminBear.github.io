import { initCursor } from './mouse.js';
import { initAnimations } from './animations.js';
import { initPageTransitions } from './pageTransitions.js';
import { initWorkflow } from './workflow.js';
import { initProjects } from './projects.js';
import { initModal } from './modal.js';
import { initSound } from './sound.js';
import { initScrollSystems } from './scroll.js';
import './animations.js';

document.addEventListener('DOMContentLoaded', () => {
    initCursor();
    initAnimations();
    initPageTransitions();
    initWorkflow();
    initProjects();
    initModal();
    initSound();
    initScrollSystems();
    
    console.log('[System initialized]: AAA Game-UI Architecture Active.');
});