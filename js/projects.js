export function initProjects() {
    const tracks = document.querySelectorAll('.lane-track');
    
    tracks.forEach(track => {
        // Horisontell scroll-support med mushjulet för projektbanorna
        track.addEventListener('wheel', (e) => {
            if (e.deltaY !== 0) {
                track.scrollLeft += e.deltaY;
            }
        }, { passive: true });
    });
}