// js/project-card.js
import { projectsData } from './modal.js';

export function renderProjectCard(projectId, { compact = false, mediaClass = 'aspect-video', cardClass = '' } = {}) {
    const p = projectsData[projectId];
    if (!p) return '';

    const platformBtn = p.platform
        ? `
            <a href="${p.platform.url}" target="_blank" rel="noopener noreferrer"
               class="card-link no-gold-hover inline-flex items-center justify-center gap-2 font-sans font-bold text-[11px] tracking-wider rounded-md transition-colors w-full ${compact ? 'px-2.5 py-1.5' : 'px-4 py-2.5'}"
               style="background-color: ${p.platform.bg}; color: ${p.platform.textColor || '#ffffff'}; ${p.platform.border ? `border: ${p.platform.border};` : ''}"
               onmouseover="this.style.backgroundColor='${p.platform.hoverBg}'"
               onmouseout="this.style.backgroundColor='${p.platform.bg}'"
               onclick="event.stopPropagation();">
                <img src="${p.platform.logo}" alt="${p.platform.name}" class="${compact ? 'w-3.5 h-3.5' : 'w-4 h-4'} object-contain ${p.platform.name.includes('Switch') ? 'brightness-0 invert' : ''}">
                ${p.platform.name}
            </a>
        `
        : `
            <span class="inline-flex items-center justify-center gap-2 bg-amber-500/10 text-amber-400 border border-amber-500/20 font-sans font-bold text-[11px] tracking-wider px-4 py-2.5 rounded-md w-full cursor-default">
                Theatrical Release
            </span>
        `;

    const videoEl = p.video
        ? `
            <video class="media-video absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500" muted loop playsinline preload="metadata" poster="${p.image}">
                <source src="${p.video}" type="video/mp4">
            </video>
        `
        : '';

    const tagsHtml = p.tags
        .map((tag) => `
            <span class="card-tag px-2.5 py-0.5 bg-[var(--color-secondary)] rounded text-[11px] font-semibold border border-[var(--color-accent-border)] text-white/85">
                ${tag}
            </span>
        `)
        .join('');

    return `
        <article class="project-card group text-center flex flex-col relative ${compact ? 'card-surface' : 'snap-start shrink-0 bg-[#111114] border-white/5'} ${cardClass}"
                 data-project-id="${projectId}"
                 ${p.audioPreview ? `data-audio-preview="${p.audioPreview}"` : ''}>

            <div class="media-preview relative w-full overflow-hidden bg-[var(--color-secondary)] border-b border-[var(--color-accent-border)] ${mediaClass}">
                <img src="${p.image}" alt="${p.title}" class="media-img absolute inset-0 w-full h-full object-cover" ${compact ? '' : 'loading="lazy"'}>
                ${videoEl}
            </div>

            <div class="${compact ? 'p-3.5' : 'p-5'} flex flex-col flex-1 items-center justify-center">
                ${compact ? '' : `<h4 class="card-studio-label text-[11px] mb-1">${p.studio}</h4>`}
                <h2 class="project-card-title ${compact ? 'text-sm leading-snug line-clamp-1 mb-2' : 'text-lg sm:text-xl mb-3 leading-snug'}">
                    ${p.title}
                </h2>
                <div class="flex flex-wrap justify-center gap-1.5 ${compact ? 'mb-2.5' : 'mb-4'}">
                    ${tagsHtml}
                </div>
                <div class="mt-auto w-full">
                    ${platformBtn}
                </div>
            </div>

            <div class="card-more-expand" aria-hidden="true">
                <span class="card-more-label">More</span>
            </div>
        </article>
    `;
}

function initLaneCarousels() {
    const lanes = document.querySelectorAll('.project-lane');
    lanes.forEach((lane) => {
        const track = lane.querySelector('.lane-track');
        const prevBtn = lane.querySelector('.carousel-prev');
        const nextBtn = lane.querySelector('.carousel-next');
        if (!track) return;

        const getStep = () => {
            const firstCard = track.querySelector('.project-card');
            if (!firstCard) return 380;
            const gap = parseFloat(getComputedStyle(track).gap) || 24;
            return firstCard.getBoundingClientRect().width + gap;
        };

        prevBtn?.addEventListener('click', () => {
            track.scrollBy({ left: -getStep(), behavior: 'smooth' });
        });

        nextBtn?.addEventListener('click', () => {
            track.scrollBy({ left: getStep(), behavior: 'smooth' });
        });
    });
}

export function initProjectCards() {
    const highlightsEl = document.getElementById('highlights');
    if (highlightsEl) {
        const highlightIds = ['skeletons', 'tentacle-tango'];
        const mediaClass = highlightsEl.dataset.mediaClass || 'aspect-video';
        const cardClass = highlightsEl.dataset.cardClass || '';
        const html = highlightIds
            .map((id) => renderProjectCard(id, { compact: true, mediaClass, cardClass }))
            .join('');
        if (html) highlightsEl.innerHTML = html;
    }

    const lanes = document.querySelectorAll('.lane-track[data-project-ids]');
    lanes.forEach((lane) => {
        const ids = (lane.dataset.projectIds || '')
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean);

        const mediaClass = lane.dataset.mediaClass || 'aspect-video';
        const cardClass = lane.dataset.cardClass || '';
        const html = ids
            .map((id) => renderProjectCard(id, { compact: false, mediaClass, cardClass }))
            .join('');
        if (html) lane.innerHTML = html;
    });

    initLaneCarousels();
}