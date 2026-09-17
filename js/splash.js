document.addEventListener("DOMContentLoaded", () => {
    const splashSeen = sessionStorage.getItem("splashSeen");

    // Skicka till home.html om splashen redan har setts
    if (splashSeen === "true") {
        window.location.replace("home.html");
        return;
    }

    const container = document.getElementById("splash-container");
    const text1 = document.getElementById("text-part-1");
    const text2 = document.getElementById("text-part-2");
    const buttons = document.getElementById("splash-buttons");
    
    const listenBtn = document.getElementById("listen-btn");
    const skipTopBtn = document.getElementById("skip-top-btn");
    const skipLinkBtn = document.getElementById("skip-link-btn");
    
    const videoContainer = document.getElementById("video-container");
    const splashVideo = document.getElementById("splash-video");

    // 1. Tona in "Would you like..." (efter en halv sekund)
    setTimeout(() => text1.classList.remove("opacity-0"), 850);
    
    // 2. Tona in "to listen?" på samma rad
    setTimeout(() => text2.classList.remove("opacity-0"), 2200);
    
    // 3. Tona in knapparna
    setTimeout(() => buttons.classList.remove("opacity-0"), 4000);

const proceedToHome = (e) => {
        if (e) e.preventDefault();
        sessionStorage.setItem("splashSeen", "true");
        
        // Fada ut hela sidan mjukt
        document.body.classList.add("opacity-0");

        // Vänta 1 sekund (tillsynat med transition-duration) och byt sida
        setTimeout(() => {
            window.location.href = "home.html";
        }, 1000);
    };

    skipTopBtn.addEventListener("click", proceedToHome);
    skipLinkBtn.addEventListener("click", proceedToHome);

    listenBtn.addEventListener("click", () => {
        sessionStorage.setItem("splashSeen", "true");

        // 1. Dölj hela textcontainern omedelbart (mjuk ut-fade)
        container.classList.add("opacity-0", "pointer-events-none");

        // 2. Vänta 1 sekund tills texten är helt borta, börja sen spela
        setTimeout(() => {
            videoContainer.classList.remove("opacity-0", "pointer-events-none");
            skipTopBtn.classList.remove("opacity-0", "pointer-events-none");
            skipTopBtn.classList.add("opacity-100", "pointer-events-auto");

            splashVideo.play().catch(err => {
                console.warn("Video playback prevented:", err);
                proceedToHome(); 
            });
        }, 1000);

        // 3. Fada ut och gå vidare till home när videon är klar
        splashVideo.onended = () => {
            proceedToHome();
        };
    });
});

