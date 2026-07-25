import { initMouseGlow } from './mouse.js';
import { initWorkflow } from './workflow.js';
import { initModal } from './modal.js';
import { initScrollSystems } from './scroll.js';
import { initSound } from './sound.js';
import { initMediaPreviews } from './media-preview.js';
import './animations.js';

document.addEventListener('DOMContentLoaded', () => {
    initMouseGlow();
    initWorkflow();
    initModal();
    initScrollSystems();
    initSound();
    initMediaPreviews();
    console.log('System initialized successfully.');
});