export function initPageTransitions() {
    // Kontrollera om webbläsaren stödjer View Transitions API
    if (!document.startViewTransition) return;

    document.addEventListener('click', (e) => {
        const link = e.target.closest('a');
        if (!link) return;

        const href = link.getAttribute('href');
        
        // Fånga upp interna sidbyten (t.ex. index.html <-> projects.html) men exkludera ankarlänkar (#) & externa länkar
        if (href && !href.startsWith('#') && !href.startsWith('mailto:') && !href.startsWith('http') && link.target !== '_blank') {
            e.preventDefault();
            
            document.startViewTransition(async () => {
                window.location.href = href;
            });
        }
    });
}