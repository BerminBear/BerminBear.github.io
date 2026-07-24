export function initAnimations() {
    const animatedElements = document.querySelectorAll('.fade-up, .fade-right, .fade-left, .fade-down');

    if (animatedElements.length === 0) return;

    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -50px 0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                obs.unobserve(entry.target); // Triggas enbart en gång
            }
        });
    }, observerOptions);

    animatedElements.forEach(el => observer.observe(el));
}