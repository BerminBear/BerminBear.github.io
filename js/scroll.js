let scrollListenerAdded = false;

// Hoppa dynamiskt till rätt projekt baserat på kortets faktiska offset
export function scrollToProject(index) {
    const wrapper = document.getElementById('projects-scroll-wrapper');
    const track = document.getElementById('projects-horizontal-track');
    if (!wrapper || !track) return;
    
    const cards = track.querySelectorAll('.project-card');
    
    if (index >= 0 && index < cards.length) {
        const targetCard = cards[index];
        const cardLeft = targetCard.offsetLeft;
        const maxTranslate = track.scrollWidth - window.innerWidth;
        
        const progress = cardLeft / maxTranslate;
        const totalHeight = wrapper.offsetHeight - window.innerHeight;
        const targetScrollY = wrapper.offsetTop + (progress * totalHeight);
        
        window.scrollTo({
            top: targetScrollY,
            behavior: 'smooth'
        });
    }
}

// Starta den horisontella scroll-motorn (körs först när projektsvyn är synlig!)
export function setupHorizontalScroll() {
    if (scrollListenerAdded) return;
    
    const wrapper = document.getElementById('projects-scroll-wrapper');
    const track = document.getElementById('projects-horizontal-track');
    if (!wrapper || !track) return;

    scrollListenerAdded = true;

    window.addEventListener('scroll', () => {
        const projectsView = document.getElementById('view-projects');
        if (!projectsView || projectsView.classList.contains('hidden')) return;
        
        const rect = wrapper.getBoundingClientRect();
        const totalHeight = rect.height - window.innerHeight;
        
        // Räkna ut exakt progress (0 till 1) baserat på stickyns position mot viewporten
        let progress = -rect.top / totalHeight;
        progress = Math.max(0, Math.min(1, progress));
        
        const maxTranslate = track.scrollWidth - window.innerWidth;
        const translateX = progress * maxTranslate;
        
        track.style.transform = `translateX(${-translateX}px)`;
        
        updateProjectsLeftNav(progress);
    });
}

// Uppdatera sidomenyn under horisontell scroll
function updateProjectsLeftNav(progress) {
    const track = document.getElementById('projects-horizontal-track');
    if (!track) return;
    
    const cards = track.querySelectorAll('.project-card');
    const maxTranslate = track.scrollWidth - window.innerWidth;
    const currentTranslate = progress * maxTranslate;
    
    let activeIndex = 0;
    let minDistance = Infinity;
    
    cards.forEach((card, idx) => {
        const distance = Math.abs(card.offsetLeft - currentTranslate - (window.innerWidth / 4));
        if (distance < minDistance) {
            minDistance = distance;
            activeIndex = idx;
        }
    });
    
    const navLinks = document.querySelectorAll('.projects-nav-link');
    navLinks.forEach((link, idx) => {
        if (idx === activeIndex) {
            link.classList.remove('text-slate-500');
            link.classList.add('text-amber-500');
        } else {
            link.classList.remove('text-amber-500');
            link.classList.add('text-slate-500');
        }
    });
}

// Hantera sidomenyn på vanliga landningssidan (Hero, Showreel, etc.)
function handleHomeNavScroll() {
    const projectsView = document.getElementById('view-projects');
    if (!projectsView || !projectsView.classList.contains('hidden')) return;

    const sections = ['hero', 'showreel', 'workflow', 'tech-stack'];
    const navLinks = document.querySelectorAll('#portfolio-nav a');
    
    let currentSection = 'hero';
    const scrolledToBottom = (window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight - 100;
    
    if (scrolledToBottom) {
        currentSection = 'tech-stack';
    } else {
        sections.forEach(id => {
            const el = document.getElementById(id);
            if (el && window.scrollY >= el.offsetTop - 150) {
                currentSection = id;
            }
        });
    }

    navLinks.forEach((link, i) => {
        if (sections[i] === currentSection) {
            link.classList.remove('text-slate-500');
            link.classList.add('text-amber-500');
        } else {
            link.classList.remove('text-amber-500');
            link.classList.add('text-slate-500');
        }
    });
}

export function initScrollSystems() {
    window.scrollToProject = scrollToProject;

    // Lyssnare för vanliga landningssidan
    window.addEventListener('scroll', handleHomeNavScroll);

    // Aktivera mushjuls-scroll i sidled på projektsidan
    window.addEventListener('wheel', (e) => {
        const projectsView = document.getElementById('view-projects');
        if (!projectsView || projectsView.classList.contains('hidden')) return;

        const modal = document.getElementById('project-detail-modal');
        if (modal && !modal.classList.contains('hidden')) return;

        if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
            e.preventDefault();
            window.scrollBy({
                top: e.deltaX,
                behavior: 'auto'
            });
        }
    }, { passive: false });
}