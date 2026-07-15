import { initMouseGlow } from './mouse.js';
import { initWorkflow } from './workflow.js';
import { initModal } from './modal.js';
import { initScrollSystems } from './scroll.js';
import { initRouter } from './router.js';

document.addEventListener('DOMContentLoaded', () => {
    console.log('[main.js] DOMContentLoaded — startar moduler i ordning...');

    initMouseGlow();
    console.log('[main.js] ✓ initMouseGlow klar');

    initWorkflow();
    console.log('[main.js] ✓ initWorkflow klar');

    initModal();
    console.log('[main.js] ✓ initModal klar');

    initScrollSystems();
    console.log('[main.js] ✓ initScrollSystems klar');

    initRouter();
    console.log('[main.js] ✓ initRouter klar');

    console.log('System initialized successfully.');
});