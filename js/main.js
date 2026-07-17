import { initMouseGlow } from './mouse.js';
import { initWorkflow } from './workflow.js';
import { initModal } from './modal.js';
import { initScrollSystems } from './scroll.js';

document.addEventListener('DOMContentLoaded', () => {
    initMouseGlow();
    initWorkflow();
    initModal();
    initScrollSystems();
    console.log('System initialized successfully.');
});