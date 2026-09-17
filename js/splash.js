document.addEventListener("DOMContentLoaded", () => {
    const splashSeen = sessionStorage.getItem("splashSeen");

    if (splashSeen === "true") {
        window.location.replace("index.html");
        return;
    }

    const container = document.getElementById("splash-container");
    const listenBtn = document.getElementById("listen-btn");
    const skipTopBtn = document.getElementById("skip-top-btn");
    const skipLinkBtn = document.getElementById("skip-link-btn");
    
    // Nya video-element
    const videoContainer = document.getElementById("video-container");
    const splashVideo = document.getElementById("splash-video");

    setTimeout(() => {
        container.classList.remove("opacity-0");
    }, 300);

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

        // 1. Dölj starttexten
        container.classList.add("opacity-0", "pointer-events-none");

        // 2. Visa videon och hörn-skip-knappen
        videoContainer.classList.remove("opacity-0", "pointer-events-none");
        skipTopBtn.classList.remove("opacity-0", "pointer-events-none");
        skipTopBtn.classList.add("opacity-100", "pointer-events-auto");

        // 3. Spela videon (Se till att "Good" och svart bild är inbakat i början av video-filen)
        splashVideo.play().catch(err => {
            console.warn("Video playback prevented:", err);
            proceedToIndex(); // Fallback om webbläsaren blockerar
        });

        // 4. Skicka till index.html automatiskt när videon spelat klart
        splashVideo.onended = () => {
            window.location.href = "index.html";
        };
    });
});