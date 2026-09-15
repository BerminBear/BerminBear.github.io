// En lista med dina nya teman (plus en tom sträng för ditt standard-tema)
const themes = [
    '', // Standard (Grey Chroma)
    'theme-neon-sunset',
    'theme-toxic-forest',
    'theme-deep-abyss',
    'theme-amethyst-dream',
    'theme-blood-moon',
    'theme-golden-hour'
];

let currentThemeIndex = 0;

export function initThemes() {
    // Lyssna på tangenttryck ('T' för Theme)
    document.addEventListener('keydown', (e) => {
        // Om användaren trycker på 'T' (ignorera om de skriver i ett textfält)
        if (e.key.toLowerCase() === 't' && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
            
            // Hoppa ett steg framåt i listan (och börja om från början om vi når slutet)
            currentThemeIndex = (currentThemeIndex + 1) % themes.length;
            
            // 1. Ta bort alla gamla teman från <body>
            themes.forEach(t => { 
                if(t) document.body.classList.remove(t); 
            });
            
            // 2. Lägg till det nya temat (om det inte är standardtemat)
            const newTheme = themes[currentThemeIndex];
            if (newTheme) {
                document.body.classList.add(newTheme);
            }
            
            // Optional: Skriv ut i konsolen vilket tema som är aktivt, så du har koll!
            console.log('Aktivt tema:', newTheme || 'Standard (Cyan/Violett)');
        }
    });
}