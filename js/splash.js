document.addEventListener("DOMContentLoaded", () => {
    const splashSeen = sessionStorage.getItem("splashSeen");

    // Om besökaren redan klickat igenom sig under samma session, hoppa direkt till index.html
    if (splashSeen === "true") {
        window.location.href = "index.html";
        return;
    }

    const container = document.getElementById("splash-container");
    const listenBtn = document.getElementById("listen-btn");
    const skipTopBtn = document.getElementById("skip-top-btn");
    const skipLinkBtn = document.getElementById("skip-link-btn");

    // Fada in elementet mjukt vid laddning
    setTimeout(() => {
        container.classList.remove("opacity-0");
    }, 100);

    // Funktion för att registrera att splashen är klar och navigera vidare
    const proceedToIndex = (e) => {
        if (e) e.preventDefault();
        sessionStorage.setItem("splashSeen", "true");
        window.location.href = "index.html";
    };

    skipTopBtn.addEventListener("click", proceedToIndex);
    skipLinkBtn.addEventListener("click", proceedToIndex);

    // Klick på [ Listen ]
    listenBtn.addEventListener("click", () => {
        sessionStorage.setItem("splashSeen", "true");

        // Fada ut texten lite snyggt medan ljudet spelas
        container.classList.add("opacity-0");

        // Spela upp ditt ljudklipp (ersätt sökvägen med din fil)
        const audio = new Audio("audio/splash-voice.mp3"); 
        audio.volume = 1.0;

        audio.play().catch(err => {
            console.log("Audio playback prevented or failed:", err);
        });

        // När ljudet spelat klart (eller efter en säkerhets-timer på 3.5 sekunder), gå till index.html
        audio.onended = () => {
            window.location.href = "index.html";
        };

        setTimeout(() => {
            window.location.href = "index.html";
        }, 3500);
    });
});