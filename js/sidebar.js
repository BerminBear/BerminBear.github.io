// js/sidebar.js

export function initSidebarObserver() {
    const sections = document.querySelectorAll('section[id]');
    const navItems = document.querySelectorAll('.side-nav-item');

    if (!sections.length || !navItems.length) return;

    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -20% 0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const currentId = entry.target.getAttribute('id');
                navItems.forEach(item => {
                    // Mappar 'tech-stack' till highlights om man scrollar längre ner
                    const targetSection = item.getAttribute('data-section');
                    if (targetSection === currentId || (currentId === 'tech-stack' && targetSection === 'highlights')) {
                        item.classList.add('active');
                    } else {
                        item.classList.remove('active');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));
}

document.addEventListener('DOMContentLoaded', initSidebarObserver);