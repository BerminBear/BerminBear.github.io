export function initScrollButton() {
    const btn = document.getElementById('scroll-toggle-btn');
    const icon = document.getElementById('scroll-btn-icon');
    if (!btn || !icon) return;

    let isAtBottom = false;

    // Fada in knappen automatiskt efter 2 sekunder
    setTimeout(() => {
        btn.style.opacity = '1';
        btn.style.pointerEvents = 'auto';
    }, 2000);

    // Rotera pilen beroende på scrollposition
    window.addEventListener('scroll', () => {
        const scrollPosition = window.scrollY;
        const pageHeight = document.documentElement.scrollHeight - window.innerHeight;

        if (scrollPosition > pageHeight * 0.6) {
            icon.style.transform = 'rotate(180deg)';
            isAtBottom = true;
        } else {
            icon.style.transform = 'rotate(0deg)';
            isAtBottom = false;
        }
    });

    // Mjuk anpassad scroll
    function smoothScrollTo(targetPosition, duration = 800) {
        const startPosition = window.scrollY;
        const distance = targetPosition - startPosition;
        let startTime = null;

        function easeInOutCubic(t) {
            return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
        }

        function animation(currentTime) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const progress = Math.min(timeElapsed / duration, 1);
            const easeProgress = easeInOutCubic(progress);

            window.scrollTo(0, startPosition + distance * easeProgress);

            if (timeElapsed < duration) {
                requestAnimationFrame(animation);
            }
        }

        requestAnimationFrame(animation);
    }

    btn.addEventListener('click', () => {
        const target = isAtBottom ? 0 : document.documentElement.scrollHeight - window.innerHeight;
        smoothScrollTo(target, 800);
    });
}