// js/media-preview.js
import { isSoundEnabled, isSoundUnlocked, playSound } from './sound.js';
import { openProjectModal } from './modal.js';

let currentPreview = null;

function stopCurrentPreview() {
    if (!currentPreview) return;
    const howl = currentPreview;
    howl.fade(howl.volume(), 0, 250);
    setTimeout(() => howl.stop(), 260);
    currentPreview = null;
}

export function initMediaPreviews() {
    const cards = document.querySelectorAll('.project-card');

    cards.forEach((card) => {
        const video = card.querySelector('.media-video');
        const img = card.querySelector('.media-img');
        const indicator = card.querySelector('.media-indicator');
        const audioSrc = card.dataset.audioPreview;
        const projectId = card.dataset.projectId;

        let hoverTimeout;
        let howl = null;

        if (audioSrc && typeof Howl !== 'undefined') {
            howl = new Howl({
                src: [audioSrc],
                volume: 0,
                loop: true,
                preload: true,
                onloaderror: () => console.warn(`[media-preview.js] Kunde inte ladda: ${audioSrc}`),
            });
        }

        // HOVER: video + ljud
        card.addEventListener('mouseenter', () => {
            hoverTimeout = setTimeout(() => {
                if (video) {
                    if (video.readyState < 2) video.load();
                    video.play().catch(() => {});
                }
                if (howl && isSoundEnabled() && isSoundUnlocked()) {
                    stopCurrentPreview();
                    howl.play();
                    howl.fade(0, 0.4, 400);
                    currentPreview = howl;
                    indicator?.classList.add('is-playing');
                }
            }, 150);
        });

        card.addEventListener('mouseleave', () => {
            clearTimeout(hoverTimeout);
            if (video) {
                video.pause();
                video.currentTime = 0;
            }
            if (howl && currentPreview === howl) {
                stopCurrentPreview();
                indicator?.classList.remove('is-playing');
            }
        });

        // CLICK: öppna modal (om man inte klickade på länken)
        card.addEventListener('click', (e) => {
            // Om klicket var på en länk eller knapp inuti kortet, öppna INTE modalen
            if (e.target.closest('a, button, .card-link')) return;
            
            if (projectId) {
                playSound('click');
                openProjectModal(projectId);
            }
        });

        if (video) {
            video.addEventListener('error', () => {
                if (img) img.style.opacity = '1';
                video.style.display = 'none';
            });
        }
    });
}