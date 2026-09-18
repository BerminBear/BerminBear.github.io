document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const isReplay = urlParams.get('replay') === 'true';
    
    const splashSeen = sessionStorage.getItem("splashSeen");

    // Skicka till home.html om splashen redan har setts OCH det inte är en replay
    if (splashSeen === "true" && !isReplay) {
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
    const pipBtn = document.getElementById("pip-btn");

    const proceedToHome = (e) => {
        if (e) e.preventDefault();
        sessionStorage.setItem("splashSeen", "true");
        
        document.body.classList.add("opacity-0");
        setTimeout(() => {
            window.location.href = "home.html";
        }, 1000);
    };

    if (skipTopBtn) skipTopBtn.addEventListener("click", proceedToHome);
    if (skipLinkBtn) skipLinkBtn.addEventListener("click", proceedToHome);

    const startVideo = () => {
        sessionStorage.setItem("splashSeen", "true");

        container.classList.add("opacity-0", "pointer-events-none");

        const delay = isReplay ? 100 : 1000;

        setTimeout(() => {
            videoContainer.classList.remove("opacity-0", "pointer-events-none");
            
            [skipTopBtn, pipBtn].forEach(btn => {
                if (btn) {
                    btn.classList.remove("opacity-0", "pointer-events-none");
                    btn.classList.add("opacity-100", "pointer-events-auto");
                }
            });

            splashVideo.play().catch(err => {
                console.warn("Video playback prevented:", err);
                // Om autospelning blockeras vid replay, visa knappen direkt istället för att skicka tillbaka
                if (isReplay) {
                    videoContainer.classList.add("opacity-0", "pointer-events-none");
                    container.style.display = "flex";
                    container.classList.remove("opacity-0", "pointer-events-none");
                    text1.classList.remove("opacity-0");
                    text2.classList.remove("opacity-0");
                    buttons.classList.remove("opacity-0");
                } else {
                    proceedToHome();
                }
            });
        }, delay);
    };

    if (pipBtn) {
        pipBtn.addEventListener("click", async () => {
            try {
                if (document.pictureInPictureElement) {
                    await document.exitPictureInPicture();
                } else if (splashVideo !== document.pictureInPictureElement) {
                    await splashVideo.requestPictureInPicture();
                }
            } catch (error) {
                console.error("PiP failed:", error);
            }
        });
    }

    splashVideo.onended = () => proceedToHome();

    if (listenBtn) listenBtn.addEventListener("click", startVideo);

    if (isReplay) {
        container.style.display = "none";
        startVideo();
    } else {
        setTimeout(() => text1.classList.remove("opacity-0"), 850);
        setTimeout(() => text2.classList.remove("opacity-0"), 2500);
        setTimeout(() => buttons.classList.remove("opacity-0"), 4000);
    }
});