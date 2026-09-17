// js/media-preview.js
import { openProjectModal } from './modal.js';

let currentAudio = null;
let fadeInterval = null;

function stopCurrentPreview() {
    if (!currentAudio) return;
    clearInterval(fadeInterval);
    
    const audio = currentAudio;
    let vol = audio.volume;
    
    // Mjuk uttoning (fade out)
    fadeInterval = setInterval(() => {
        if (vol > 0.05) {
            vol -= 0.05;
            audio.volume = vol;
        } else {
            clearInterval(fadeInterval);
            audio.pause();
            audio.currentTime = 0;
        }
    }, 30);
    
    currentAudio = null;
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
        let audio = null;

        // Förladda ljudet om en länk finns
        if (audioSrc) {
            audio = new Audio(audioSrc);
            audio.loop = true;
            audio.volume = 0;
        }

        // HOVER: Spela video + ljud
        card.addEventListener('mouseenter', () => {
            hoverTimeout = setTimeout(() => {
                if (video) {
                    if (video.readyState < 2) video.load();
                    video.play().catch(() => {});
                }
                if (audio) {
                    stopCurrentPreview();
                    audio.volume = 0;
                    audio.play().catch(() => {});
                    
                    // Mjuk intoning (fade in) till max 40% volym
                    let vol = 0;
                    const fadeIn = setInterval(() => {
                        if (vol < 0.35) {
                            vol += 0.05;
                            audio.volume = vol;
                        } else {
                            clearInterval(fadeIn);
                        }
                    }, 40);
                    
                    currentAudio = audio;
                    indicator?.classList.add('is-playing');
                }
            }, 150);
        });

        // LEAVE: Pausa video + ljud
        card.addEventListener('mouseleave', () => {
            clearTimeout(hoverTimeout);
            if (video) {
                video.pause();
                video.currentTime = 0;
            }
            if (audio && currentAudio === audio) {
                stopCurrentPreview();
                indicator?.classList.remove('is-playing');
            }
        });

        // CLICK: Öppna modal
        card.addEventListener('click', (e) => {
            // Ignorera klick på länkar (ex. "View on Steam") inuti kortet
            if (e.target.closest('a, button, .card-link')) return;
            
            if (projectId) {
                openProjectModal(projectId);
            }
        });

        // Felsäkring för video
        if (video) {
            video.addEventListener('error', () => {
                if (img) img.style.opacity = '1';
                video.style.display = 'none';
            });
        }
    });
}