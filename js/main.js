import { initMouseGlow } from './mouse.js';
import { initWorkflow } from './workflow.js';
import { initModal } from './modal.js';
import { initScrollSystems } from './scroll.js';
import { initSound } from './sound.js';

document.addEventListener('DOMContentLoaded', () => {
    initMouseGlow();
    initWorkflow();
    initModal();
    initScrollSystems();
    initSound();
    console.log('System initialized successfully.');
});