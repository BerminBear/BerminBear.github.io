let scrollListenerAdded = false;

export function scrollToProject(index) {
    const wrapper = document.getElementById('projects-scroll-wrapper');
    const track = document.getElementById('projects-horizontal-track');

    if (!wrapper || !track) {
        console.warn('[scroll.js] scrollToProject: wrapper eller track saknas i DOM.', { wrapper, track });
        return;
    }

    const cards = track.querySelectorAll('.shrink-0');
    console.log(`[scroll.js] scrollToProject(${index}) — hittade ${cards.length} kort`);

    if (index >= 0 && index < cards.length) {
        const targetCard = cards[index];
        const progress = targetCard.offsetLeft / (track.scrollWidth - window.innerWidth);
        const targetScrollY = wrapper.offsetTop + (progress * (wrapper.offsetHeight - window.innerHeight));

        console.log('[scroll.js] scrollToProject beräkning:', {
            offsetLeft: targetCard.offsetLeft,
            trackScrollWidth: track.scrollWidth,
            progress,
            targetScrollY
        });

        window.scrollTo({ top: targetScrollY, behavior: 'smooth' });
    } else {
        console.warn(`[scroll.js] scrollToProject: index ${index} utanför intervallet 0-${cards.length - 1}`);
    }
}

export function setupHorizontalScroll() {
    if (scrollListenerAdded) {
        console.log('[scroll.js] setupHorizontalScroll: lyssnare redan aktiv, avbryter.');
        return;
    }

    const wrapper = document.getElementById('projects-scroll-wrapper');
    const track = document.getElementById('projects-horizontal-track');

    if (!wrapper || !track) {
        console.warn('[scroll.js] setupHorizontalScroll: wrapper eller track saknas i DOM.', { wrapper, track });
        return;
    }

    scrollListenerAdded = true;
    console.log('[scroll.js] setupHorizontalScroll: scroll-lyssnare registrerad.');

    window.addEventListener('scroll', () => {
        const projectsView = document.getElementById('view-projects');
        if (!projectsView || projectsView.classList.contains('hidden')) return;

        const rect = wrapper.getBoundingClientRect();
        const progress = Math.max(0, Math.min(1, -rect.top / (rect.height - window.innerHeight)));
        const translateX = -progress * (track.scrollWidth - window.innerWidth);

        track.style.transform = `translateX(${translateX}px)`;

        // Debug: logga bara ibland så konsolen inte flödas över (var 10:e frame ungefär)
        if (Math.random() < 0.02) {
            console.log('[scroll.js] scroll progress:', progress.toFixed(3), 'translateX:', translateX.toFixed(1));
        }

        updateProjectsLeftNav(progress);
    });
}

function updateProjectsLeftNav(progress) {
    const track = document.getElementById('projects-horizontal-track');
    if (!track) return;

    const cards = track.querySelectorAll('.shrink-0');
    const currentTranslate = progress * (track.scrollWidth - window.innerWidth);
    let activeIndex = 0;
    let minDistance = Infinity;

    cards.forEach((card, idx) => {
        const distance = Math.abs(card.offsetLeft - currentTranslate - (window.innerWidth / 4));
        if (distance < minDistance) {
            minDistance = distance;
            activeIndex = idx;
        }
    });

    document.querySelectorAll('.projects-nav-link').forEach((link, idx) => {
        link.classList.toggle('text-amber-500', idx === activeIndex);
        link.classList.toggle('text-slate-500', idx !== activeIndex);
    });
}

function handleHomeNavScroll() {
    const projectsView = document.getElementById('view-projects');
    if (!projectsView || !projectsView.classList.contains('hidden')) return;
    // ... din vanliga nav-scroll logik här
}

export function initScrollSystems() {
    console.log('[scroll.js] initScrollSystems: initieras.');

    window.addEventListener('scroll', handleHomeNavScroll);

    window.addEventListener('wheel', (e) => {
        const projectsHidden = document.getElementById('view-projects')?.classList.contains('hidden');
        const modalHidden = document.getElementById('project-detail-modal')?.classList.contains('hidden');

        if (!projectsHidden && modalHidden) {
            if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
                e.preventDefault();
                window.scrollBy({ top: e.deltaX, behavior: 'auto' });
            }
        }
    }, { passive: false });
}