const UI_FONT = "font-family: 'Plus Jakarta Sans', sans-serif; letter-spacing: normal;";

const PLAY_ICON_SVG = `
    <svg viewBox="0 0 24 24" class="w-3.5 h-3.5 fill-current translate-x-[0.5px]" aria-hidden="true">
        <polygon points="8,5 19,12 8,19" />
    </svg>
`;

const PAUSE_ICON_SVG = `
    <svg viewBox="0 0 24 24" class="w-3.5 h-3.5 fill-current" aria-hidden="true">
        <rect x="7" y="5" width="3.5" height="14" rx="1" />
        <rect x="13.5" y="5" width="3.5" height="14" rx="1" />
    </svg>
`;

const TRACK_LISTS = {
    music: {
        headerLeft: "Selected Tracks",
        headerRight: "Audio Reel",
        items: [
            { label: "Fire Emblem Inspired", src: "sounds/tracks/track-01.mp3" },
            { label: "Tentacle Tango Boss 3", src: "sounds/tracks/track-02.mp3" },
            { label: "Tentacle Tango Menu Music", src: "sounds/tracks/track-03.mp3" },
            { label: "Tentacle Tango Map Overview", src: "sounds/tracks/track-04.mp3" }
        ]
    },
    dialogue: {
        headerLeft: "Dialogue & VO Pipeline",
        headerRight: "Routing & Edit",
        items: [
            { label: "VO Cleanup & Bus Routing", src: "sounds/dialogue/vo-routing.mp3" },
            { label: "Dynamic / Contextual Dialogue", src: "sounds/dialogue/contextual-vo.mp3" }
        ]
    },
    sound: {
        headerLeft: "Sound Design",
        headerRight: "Game & Film",
        items: [
            { label: "Combat & Creature Layering", src: "sounds/sfx/combat-creature.mp3" },
            { label: "World / Foley Transitions", src: "sounds/sfx/world-foley.mp3" }
        ]
    }
};

function renderAudioPanel(mode, { headerLeft, headerRight, items }) {
    return `
        <div data-panel="${mode}" class="audio-panel w-full h-full flex-col justify-center gap-1 animate-fade-up" style="animation-duration: 0.65s;">
            <div class="flex items-center justify-between text-xs font-medium text-[var(--color-muted)] pb-2.5 mb-1 border-b border-[var(--color-accent-border)]" style="${UI_FONT}">
                <span>${headerLeft}</span>
                <span>${headerRight}</span>
            </div>
            <div class="flex flex-col divide-y divide-[var(--color-accent-border)]">
                ${items.map(({ label, src }, idx) => `
                    <div
                        data-audio-row
                        data-track-label="${label}"
                        class="audio-row flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-3.5 px-2 cursor-pointer select-none"
                    >
                        <span class="audio-row-title text-base sm:text-[17px] font-semibold leading-relaxed text-[var(--color-text)]" style="${UI_FONT}">
                            ${label}
                        </span>
                        <div class="flex flex-col sm:flex-row sm:items-center gap-3 w-full sm:w-auto" data-controls-wrap>
                            <audio id="audio-${mode}-${idx}" controls preload="metadata" src="${src}" class="h-9 w-full sm:w-56"></audio>
                            <label class="flex items-center gap-2 text-xs text-[var(--color-muted)] shrink-0" style="${UI_FONT}">
                                <span>Vol</span>
                                <input
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.01"
                                    value="0.8"
                                    data-audio-target="audio-${mode}-${idx}"
                                    aria-label="Volym för ${label}"
                                    class="w-24 accent-[var(--playing-gold)] cursor-pointer"
                                />
                            </label>
                        </div>
                    </div>
                `).join("")}
            </div>
        </div>
    `;
}

function renderToolsPanel() {
    return `
        <div data-panel="tools" class="audio-panel w-full h-full flex-col justify-center gap-5 text-center animate-fade-up" style="animation-duration: 0.65s;">
            <div class="text-xs font-medium text-[var(--color-muted)] pb-2.5 border-b border-[var(--color-accent-border)]" style="${UI_FONT}">Frameworks, Scripting & Middleware</div>
            <h3 class="text-xl sm:text-2xl font-semibold leading-relaxed" style="${UI_FONT}">
                Technical Audio Systems & Workflow Automation
            </h3>
            <p class="text-base text-[var(--color-muted)] leading-relaxed max-w-2xl mx-auto" style="${UI_FONT}">
                Automation frameworks, batch/validation scripts and middleware implementation across Unreal Engine, Unity, Wwise, FMOD Studio and Reaper.
            </p>
            <div class="flex flex-wrap justify-center gap-2.5 pt-2 font-mono text-xs font-medium">
                <span class="px-3 py-1.5 rounded bg-[var(--color-secondary)] border border-[var(--color-accent-border)]">Lua</span>
                <span class="px-3 py-1.5 rounded bg-[var(--color-secondary)] border border-[var(--color-accent-border)]">Python</span>
                <span class="px-3 py-1.5 rounded bg-[var(--color-secondary)] border border-[var(--color-accent-border)]">C / C++ / C# / Java</span>
                <span class="px-3 py-1.5 rounded bg-[var(--color-secondary)] border border-[var(--color-accent-border)]">Wwise & FMOD</span>
            </div>
        </div>
    `;
}

export function initShowcaseStage() {
    const stage = document.getElementById("showcase-stage");
    const tabs = document.querySelectorAll(".stage-tab");
    if (!stage || !tabs.length) return;

    const miniBar = document.getElementById("mini-audio-bar");
    const miniToggle = document.getElementById("mini-play-toggle");
    const miniTitle = document.getElementById("mini-track-title");
    const miniSlider = document.getElementById("mini-volume-slider");

    let activeAudio = null;
    let activeLabel = "";

    stage.innerHTML = `
        <div data-panel="showreel" class="audio-panel is-visible showreel-stage-wrap">
            <video id="hero-showcase" class="w-full h-full object-cover rounded-lg bg-[var(--color-secondary)]" playsinline preload="none" controls>
                <source src="videos/showreel.mp4" type="video/mp4">
            </video>
        </div>
        ${renderAudioPanel("music", TRACK_LISTS.music)}
        ${renderAudioPanel("dialogue", TRACK_LISTS.dialogue)}
        ${renderAudioPanel("sound", TRACK_LISTS.sound)}
        ${renderToolsPanel()}
    `;

    const panels = stage.querySelectorAll("[data-panel]");
    const allRows = Array.from(stage.querySelectorAll("[data-audio-row]"));
    const allAudios = Array.from(stage.querySelectorAll("audio"));
    const allVideos = Array.from(stage.querySelectorAll("video"));

    function syncPlayingHighlights() {
        const anyAudioPlaying = allAudios.some((a) => !a.paused && !a.ended);

        allRows.forEach((row) => {
            const rowAudio = row.querySelector("audio");
            const isRowPlaying = Boolean(rowAudio && !rowAudio.paused && !rowAudio.ended);
            row.classList.toggle("is-playing", isRowPlaying);
        });

        if (miniBar) {
            miniBar.classList.toggle("is-playing", anyAudioPlaying);
        }
    }

    function syncMiniBar() {
        if (!miniBar || !activeAudio) {
            miniBar?.classList.remove("is-active", "is-playing");
            return;
        }
        miniBar.classList.add("is-active");
        if (miniTitle) miniTitle.textContent = activeLabel || "Audio Track";
        if (miniToggle) {
            const isPaused = activeAudio.paused;
            miniToggle.innerHTML = isPaused ? PLAY_ICON_SVG : PAUSE_ICON_SVG;
            miniToggle.setAttribute("aria-label", isPaused ? "Play" : "Pause");
        }
        if (miniSlider && !activeAudio.muted) {
            miniSlider.value = String(activeAudio.volume);
        }
        syncPlayingHighlights();
    }

    function setTrackVolume(audioEl, vol) {
        const clamped = Math.max(0, Math.min(1, vol));
        audioEl.volume = clamped;
        const row = audioEl.closest("[data-audio-row]");
        const rowSlider = row?.querySelector('input[type="range"]');
        if (rowSlider && String(clamped) !== rowSlider.value) {
            rowSlider.value = String(clamped);
        }
        if (audioEl === activeAudio && miniSlider && String(clamped) !== miniSlider.value) {
            miniSlider.value = String(clamped);
        }
    }

    function pauseOtherAudio(currentAudio) {
        allAudios.forEach((other) => {
            if (other !== currentAudio) {
                other.pause();
            }
        });
    }

    allAudios.forEach((audioEl) => {
        audioEl.volume = 0.8;
        const row = audioEl.closest("[data-audio-row]");
        const label = row?.dataset.trackLabel || "Audio Track";

        audioEl.addEventListener("play", () => {
            pauseOtherAudio(audioEl);
            allVideos.forEach((vid) => vid.pause());
            activeAudio = audioEl;
            activeLabel = label;
            syncMiniBar();
        });

        audioEl.addEventListener("pause", syncMiniBar);
        audioEl.addEventListener("ended", syncMiniBar);

        audioEl.addEventListener("volumechange", () => {
            if (!audioEl.muted) {
                setTrackVolume(audioEl, audioEl.volume);
            }
        });

        audioEl.addEventListener("click", (e) => e.stopPropagation());
    });

    allVideos.forEach((vid) => {
        vid.addEventListener("play", () => {
            pauseOtherAudio(null);
            allVideos.forEach((otherVid) => {
                if (otherVid !== vid) otherVid.pause();
            });
            syncMiniBar();
        });
    });

    stage.querySelectorAll('input[type="range"][data-audio-target]').forEach((slider) => {
        const targetAudio = document.getElementById(slider.dataset.audioTarget);
        if (!targetAudio) return;

        slider.addEventListener("click", (e) => e.stopPropagation());
        slider.addEventListener("input", (e) => {
            e.stopPropagation();
            setTrackVolume(targetAudio, parseFloat(slider.value));
        });
    });

    allRows.forEach((row) => {
        const audioEl = row.querySelector("audio");
        if (!audioEl) return;

        row.addEventListener("click", () => {
            if (audioEl.paused) {
                audioEl.play().catch(() => {});
            } else {
                audioEl.pause();
            }
        });
    });

    miniToggle?.addEventListener("click", () => {
        if (!activeAudio) return;
        if (activeAudio.paused) {
            activeAudio.play().catch(() => {});
        } else {
            activeAudio.pause();
        }
    });

    miniSlider?.addEventListener("input", () => {
        if (!activeAudio) return;
        setTrackVolume(activeAudio, parseFloat(miniSlider.value));
    });

    function setMode(mode) {
        const targetMode = Array.from(panels).some((p) => p.dataset.panel === mode) ? mode : "showreel";
        if (targetMode !== "showreel") {
            allVideos.forEach((vid) => vid.pause());
        }
        panels.forEach((panel) => {
            panel.classList.toggle("is-visible", panel.dataset.panel === targetMode);
        });
        tabs.forEach((btn) => {
            btn.classList.toggle("is-active", btn.dataset.stageMode === targetMode);
        });
    }

    tabs.forEach((btn) => {
        btn.addEventListener("click", () => setMode(btn.dataset.stageMode));
    });

    setMode("showreel");
}