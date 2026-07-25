// js/media-preview.js
import { isSoundEnabled, isSoundUnlocked, playSound } from './sound.js';

let currentPreview = null; // Håller koll på EN aktiv ljud-preview i taget

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

        let hoverTimeout;
        let howl = null;

        // Skapa Howl-instansen en gång per kort, bara om kortet faktiskt har ljud angivet
        if (audioSrc && typeof Howl !== 'undefined') {
            howl = new Howl({
                src: [audioSrc],
                volume: 0,
                loop: true,
                preload: true,
                onloaderror: () => console.warn(`[media-preview.js] Kunde inte ladda audio-preview: ${audioSrc}`),
            });
        }

        card.addEventListener('mouseenter', () => {
            hoverTimeout = setTimeout(() => {
                // Video (valfri — bara om kortet har en <video class="media-video">)
                if (video) {
                    if (video.readyState < 2) video.load();
                    video.play().catch(() => {
                        // Autoplay blockerad — bilden ligger redan kvar synlig, inget att göra
                    });
                }

                // Ljud (bara om sidans globala ljud är påslaget OCH upplåst)
                if (howl && isSoundEnabled() && isSoundUnlocked()) {
                    stopCurrentPreview(); // Se till att bara ETT kort ljuder åt gången
                    howl.play();
                    howl.fade(0, 0.4, 400);
                    currentPreview = howl;
                    indicator?.classList.add('is-playing');
                }
            }, 150); // Samma korta fördröjning som Kimi föreslog — skydd mot snabb scroll-through
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

        if (video) {
            video.addEventListener('error', () => {
                if (img) img.style.opacity = '1';
                video.style.display = 'none';
            });
        }
    });
}