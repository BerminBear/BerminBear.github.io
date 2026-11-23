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

const VOL_ON_SVG = `
    <svg viewBox="0 0 24 24" class="w-4 h-4 fill-none stroke-current" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" stroke="none" />
        <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
    </svg>
`;

const VOL_MUTED_SVG = `
    <svg viewBox="0 0 24 24" class="w-4 h-4 fill-none stroke-current" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" stroke="none" />
        <line x1="23" y1="9" x2="17" y2="15" />
        <line x1="17" y1="9" x2="23" y2="15" />
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

function formatTime(sec) {
    if (!Number.isFinite(sec) || sec < 0) return "0:00";
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${String(s).padStart(2, "0")}`;
}

function buildFallbackPeaks(seedStr, count = 64) {
    let hash = 2166136261;
    for (let i = 0; i < seedStr.length; i++) {
        hash ^= seedStr.charCodeAt(i);
        hash = Math.imul(hash, 16777619);
    }
    const peaks = [];
    for (let i = 0; i < count; i++) {
        hash ^= (hash << 13) + i * 97;
        hash >>>= 0;
        const r = (hash % 1000) / 1000;
        const envelope = 0.35 + 0.65 * Math.sin((i / Math.max(1, count - 1)) * Math.PI);
        peaks.push(Math.max(0.18, Math.min(1, (0.22 + r * 0.78) * envelope)));
    }
    return peaks;
}

function renderAudioPanel(mode, { headerLeft, headerRight, items }) {
    return `
        <div data-panel="${mode}" class="audio-panel w-full h-full min-h-0 overflow-y-auto flex-col justify-start sm:justify-center gap-1 pr-1 animate-fade-up" style="animation-duration: 0.65s;">
            <div class="flex items-center justify-between text-xs font-medium text-[var(--color-muted)] pb-2.5 mb-1 border-b border-[var(--color-accent-border)] shrink-0" style="${UI_FONT}">
                <span>${headerLeft}</span>
                <span>${headerRight}</span>
            </div>
            <div class="flex flex-col divide-y divide-[var(--color-accent-border)]">
                ${items.map(({ label, src }, idx) => `
                    <div
                        data-audio-row
                        data-track-label="${label}"
                        class="audio-row flex items-center justify-between gap-2.5 sm:gap-3.5 py-3 px-2 cursor-pointer select-none"
                    >
                        <div class="flex items-center gap-2.5 min-w-0 max-w-[42%] sm:max-w-[44%] shrink">
                            <button
                                type="button"
                                data-row-play
                                aria-label="Play ${label}"
                                class="row-play-btn w-8 h-8 rounded-full border border-[var(--color-accent-border)] flex items-center justify-center text-[var(--color-accent-hover)] shrink-0"
                            >
                                ${PLAY_ICON_SVG}
                            </button>
                            <span class="audio-row-title text-sm sm:text-base font-semibold leading-snug text-[var(--color-text)] truncate" style="${UI_FONT}">
                                ${label}
                            </span>
                        </div>

                        <div class="flex items-center gap-2.5 flex-1 min-w-0" data-controls-wrap>
                            <canvas
                                data-row-wave
                                aria-label="Waveform timeline for ${label}"
                                class="row-wave flex-1 min-w-[80px] h-8 sm:h-9 block cursor-grab active:cursor-grabbing"
                            ></canvas>
                            <span data-row-time class="row-time text-[11px] font-semibold text-[var(--color-muted)] tabular-nums w-9 text-right shrink-0" style="${UI_FONT}">0:00</span>
                            <button
                                type="button"
                                data-row-mute
                                aria-label="Toggle mute for ${label}"
                                aria-pressed="false"
                                class="row-mute-btn w-8 h-8 rounded-full border border-[var(--color-accent-border)] flex items-center justify-center text-[var(--color-muted)] hover:text-[var(--color-accent-hover)] shrink-0"
                            >
                                ${VOL_ON_SVG}
                            </button>
                            <audio id="audio-${mode}-${idx}" preload="metadata" src="${src}"></audio>
                        </div>
                    </div>
                `).join("")}
            </div>
        </div>
    `;
}

function renderToolsPanel() {
    return `
        <div data-panel="tools" class="audio-panel w-full h-full min-h-0 overflow-y-auto flex-col justify-center gap-5 text-center animate-fade-up" style="animation-duration: 0.65s;">
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

    let miniMuteBtn = miniBar?.querySelector("#mini-mute-toggle");
    if (miniBar && !miniMuteBtn) {
        miniMuteBtn = document.createElement("button");
        miniMuteBtn.type = "button";
        miniMuteBtn.id = "mini-mute-toggle";
        miniMuteBtn.className = "row-mute-btn w-7 h-7 rounded-full border border-[var(--color-accent-border)] flex items-center justify-center text-[var(--color-muted)] shrink-0";
        miniMuteBtn.setAttribute("aria-label", "Toggle mute");
        miniMuteBtn.innerHTML = VOL_ON_SVG;
        miniBar.appendChild(miniMuteBtn);
    }

    let activeAudio = null;
    let activeLabel = "";

    let decodeCtx = null;
    const rowPeaksMap = new WeakMap();

    async function loadRealPeaks(audioEl, label) {
        if (!audioEl?.src || rowPeaksMap.has(audioEl)) return;
        const fallback = buildFallbackPeaks(label || audioEl.src, 64);
        rowPeaksMap.set(audioEl, fallback);

        try {
            const res = await fetch(audioEl.src);
            if (!res.ok) return;
            const arrBuf = await res.arrayBuffer();
            if (!decodeCtx) {
                const AudioContextClass = window.AudioContext || window.webkitAudioContext;
                if (!AudioContextClass) return;
                decodeCtx = new AudioContextClass();
            }
            const decoded = await decodeCtx.decodeAudioData(arrBuf.slice(0));
            const channel = decoded.getChannelData(0);
            const barCount = 64;
            const blockSize = Math.max(1, Math.floor(channel.length / barCount));
            const peaks = [];
            for (let i = 0; i < barCount; i++) {
                let max = 0;
                const start = i * blockSize;
                const end = Math.min(channel.length, start + blockSize);
                for (let j = start; j < end; j++) {
                    const v = Math.abs(channel[j]);
                    if (v > max) max = v;
                }
                peaks.push(Math.max(0.16, Math.min(1, max)));
            }
            rowPeaksMap.set(audioEl, peaks);
            const row = audioEl.closest("[data-audio-row]");
            if (row) drawRowWaveform(row, audioEl);
        } catch (_) {
            // Behåll fallback-vågformen om avkodning inte tillåts
        }
    }

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

    function drawRowWaveform(row, audioEl) {
        const waveCanvas = row.querySelector("[data-row-wave]");
        if (!waveCanvas) return;

        const rect = waveCanvas.getBoundingClientRect();
        const width = Math.max(60, Math.floor(rect.width || 180));
        const height = Math.max(24, Math.floor(rect.height || 34));
        const dpr = Math.min(window.devicePixelRatio || 1, 2);

        if (waveCanvas.width !== Math.floor(width * dpr) || waveCanvas.height !== Math.floor(height * dpr)) {
            waveCanvas.width = Math.floor(width * dpr);
            waveCanvas.height = Math.floor(height * dpr);
        }

        const ctx = waveCanvas.getContext("2d");
        if (!ctx) return;

        const peaks = rowPeaksMap.get(audioEl) || buildFallbackPeaks(row.dataset.trackLabel || "track", 64);
        const progress = audioEl.duration > 0 ? Math.min(1, Math.max(0, audioEl.currentTime / audioEl.duration)) : 0;
        const isPlaying = Boolean(audioEl && !audioEl.paused && !audioEl.ended);
        const isSelected = Boolean(audioEl && audioEl === activeAudio);

        ctx.save();
        ctx.scale(dpr, dpr);
        ctx.clearRect(0, 0, width, height);

        const bars = peaks.length;
        const step = width / bars;
        const barW = Math.max(2, step * 0.58);

        if (isPlaying || isSelected) {
            ctx.shadowColor = isPlaying ? "rgba(231, 198, 126, 0.55)" : "rgba(184, 153, 97, 0.35)";
            ctx.shadowBlur = isPlaying ? 8 : 5;
        }

        for (let i = 0; i < bars; i++) {
            const x = i * step;
            const barPos = (i + 0.5) / bars;
            const passed = barPos <= progress;
            const h = Math.max(4, peaks[i] * (height - 6));
            const y = (height - h) / 2;

            if (passed) {
                ctx.fillStyle = isPlaying
                    ? "#f2d694"
                    : isSelected
                        ? "#c5a467"
                        : "rgba(214, 184, 128, 0.78)";
            } else {
                ctx.fillStyle = isSelected
                    ? "rgba(184, 153, 97, 0.28)"
                    : "rgba(255, 255, 255, 0.16)";
            }

            ctx.beginPath();
            ctx.roundRect(x, y, barW, h, 1);
            ctx.fill();
        }

        if (progress > 0 || isSelected || isPlaying) {
            const px = Math.min(width - 1.5, Math.max(1.5, progress * width));
            ctx.shadowColor = isPlaying ? "rgba(239, 225, 195, 0.85)" : "rgba(184, 153, 97, 0.5)";
            ctx.shadowBlur = isPlaying ? 10 : 6;
            ctx.fillStyle = isPlaying ? "#EFE1C3" : "#c5a467";
            ctx.fillRect(px - 0.75, 2, 1.5, height - 4);

            ctx.beginPath();
            ctx.arc(px, height / 2, isPlaying ? 3.2 : 2.6, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.restore();
    }

    function syncRowUI(row, audioEl) {
        const isPlaying = Boolean(audioEl && !audioEl.paused && !audioEl.ended);
        const isActive = Boolean(audioEl && audioEl === activeAudio);
        row.classList.toggle("is-playing", isPlaying);
        row.classList.toggle("is-selected", isActive);

        const playBtn = row.querySelector("[data-row-play]");
        if (playBtn) {
            playBtn.innerHTML = isPlaying ? PAUSE_ICON_SVG : PLAY_ICON_SVG;
            playBtn.setAttribute("aria-label", isPlaying ? `Pause ${row.dataset.trackLabel}` : `Play ${row.dataset.trackLabel}`);
        }

        const timeEl = row.querySelector("[data-row-time]");
        if (timeEl) {
            timeEl.textContent = formatTime(audioEl.currentTime);
        }

        const muteBtn = row.querySelector("[data-row-mute]");
        if (muteBtn) {
            const muted = Boolean(audioEl.muted);
            muteBtn.innerHTML = muted ? VOL_MUTED_SVG : VOL_ON_SVG;
            muteBtn.setAttribute("aria-pressed", String(muted));
            muteBtn.classList.toggle("is-muted", muted);
        }

        drawRowWaveform(row, audioEl);
    }

    function syncAllUI() {
        allRows.forEach((row) => {
            const audioEl = row.querySelector("audio");
            if (audioEl) syncRowUI(row, audioEl);
        });

        const anyAudioPlaying = allAudios.some((a) => !a.paused && !a.ended);

        if (!miniBar || !activeAudio) {
            miniBar?.classList.remove("is-active", "is-playing");
            return;
        }

        miniBar.classList.add("is-active");
        miniBar.classList.toggle("is-playing", anyAudioPlaying);
        if (miniTitle) miniTitle.textContent = activeLabel || "Audio Track";

        if (miniToggle) {
            const isPaused = activeAudio.paused;
            miniToggle.innerHTML = isPaused ? PLAY_ICON_SVG : PAUSE_ICON_SVG;
            miniToggle.setAttribute("aria-label", isPaused ? "Play" : "Pause");
        }

        if (miniMuteBtn) {
            const muted = Boolean(activeAudio.muted);
            miniMuteBtn.innerHTML = muted ? VOL_MUTED_SVG : VOL_ON_SVG;
            miniMuteBtn.setAttribute("aria-pressed", String(muted));
            miniMuteBtn.classList.toggle("is-muted", muted);
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
        rowPeaksMap.set(audioEl, buildFallbackPeaks(label, 64));

        audioEl.addEventListener("play", () => {
            loadRealPeaks(audioEl, label);
            pauseOtherAudio(audioEl);
            allVideos.forEach((vid) => vid.pause());
            activeAudio = audioEl;
            activeLabel = label;
            syncAllUI();
        });

        audioEl.addEventListener("pause", syncAllUI);
        audioEl.addEventListener("ended", syncAllUI);
        audioEl.addEventListener("loadedmetadata", () => {
            if (row) drawRowWaveform(row, audioEl);
        });
        audioEl.addEventListener("timeupdate", () => {
            if (row) syncRowUI(row, audioEl);
        });
        audioEl.addEventListener("volumechange", syncAllUI);
    });

    allVideos.forEach((vid) => {
        vid.addEventListener("play", () => {
            pauseOtherAudio(null);
            allVideos.forEach((otherVid) => {
                if (otherVid !== vid) otherVid.pause();
            });
            syncAllUI();
        });
    });

    allRows.forEach((row) => {
        const audioEl = row.querySelector("audio");
        if (!audioEl) return;

        const playBtn = row.querySelector("[data-row-play]");
        const muteBtn = row.querySelector("[data-row-mute]");
        const waveCanvas = row.querySelector("[data-row-wave]");
        const controlsWrap = row.querySelector("[data-controls-wrap]");
        let isScrubbing = false;
        let wasMutedBeforeScrub = false;

        controlsWrap?.addEventListener("click", (e) => e.stopPropagation());

        playBtn?.addEventListener("click", (e) => {
            e.stopPropagation();
            loadRealPeaks(audioEl, row.dataset.trackLabel || "Audio Track");
            activeAudio = audioEl;
            activeLabel = row.dataset.trackLabel || "Audio Track";
            if (audioEl.paused) {
                audioEl.play().catch(() => {});
            } else {
                audioEl.pause();
            }
            syncAllUI();
        });

        muteBtn?.addEventListener("click", (e) => {
            e.stopPropagation();
            audioEl.muted = !audioEl.muted;
            syncAllUI();
        });

        function seekFromClientX(clientX) {
            if (!waveCanvas) return;
            const rect = waveCanvas.getBoundingClientRect();
            if (!rect.width) return;
            const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
            loadRealPeaks(audioEl, row.dataset.trackLabel || "Audio Track");
            activeAudio = audioEl;
            activeLabel = row.dataset.trackLabel || "Audio Track";
            if (audioEl.duration > 0) {
                audioEl.currentTime = ratio * audioEl.duration;
            }
            syncAllUI();
        }

        waveCanvas?.addEventListener("pointerdown", (e) => {
            e.stopPropagation();
            e.preventDefault();
            isScrubbing = true;
            wasMutedBeforeScrub = Boolean(audioEl.muted);
            audioEl.muted = true;
            waveCanvas.setPointerCapture(e.pointerId);
            seekFromClientX(e.clientX);
        });

        waveCanvas?.addEventListener("pointermove", (e) => {
            if (!isScrubbing) return;
            e.stopPropagation();
            audioEl.muted = true;
            seekFromClientX(e.clientX);
        });

        const stopScrub = (e) => {
            if (!isScrubbing) return;
            e.stopPropagation();
            isScrubbing = false;
            if (waveCanvas?.hasPointerCapture?.(e.pointerId)) {
                waveCanvas.releasePointerCapture(e.pointerId);
            }
            audioEl.muted = wasMutedBeforeScrub;
            syncAllUI();
        };

        waveCanvas?.addEventListener("pointerup", stopScrub);
        waveCanvas?.addEventListener("pointercancel", stopScrub);

        row.addEventListener("click", () => {
            loadRealPeaks(audioEl, row.dataset.trackLabel || "Audio Track");
            activeAudio = audioEl;
            activeLabel = row.dataset.trackLabel || "Audio Track";
            if (audioEl.paused) {
                audioEl.play().catch(() => {});
            } else {
                audioEl.pause();
            }
            syncAllUI();
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

    miniMuteBtn?.addEventListener("click", () => {
        if (!activeAudio) return;
        activeAudio.muted = !activeAudio.muted;
        syncAllUI();
    });

    document.addEventListener("keydown", (e) => {
        if (e.code !== "Space" || e.repeat) return;
        if (!activeAudio) return;

        const tag = document.activeElement?.tagName?.toLowerCase();
        const isEditable = document.activeElement?.isContentEditable;
        if (tag === "input" || tag === "textarea" || tag === "select" || isEditable) return;
        if (tag === "button" || tag === "a") return;

        const projectModal = document.getElementById("project-detail-modal");
        const aboutModal = document.getElementById("about-detail-modal");
        const modalOpen =
            (projectModal && !projectModal.classList.contains("hidden")) ||
            (aboutModal && !aboutModal.classList.contains("hidden"));
        if (modalOpen) return;

        e.preventDefault();
        if (activeAudio.paused) {
            activeAudio.play().catch(() => {});
        } else {
            activeAudio.pause();
        }
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
        syncAllUI();
    }

    window.addEventListener("resize", () => {
        allRows.forEach((row) => {
            const audioEl = row.querySelector("audio");
            if (audioEl) drawRowWaveform(row, audioEl);
        });
    }, { passive: true });

    tabs.forEach((btn) => {
        btn.addEventListener("click", () => setMode(btn.dataset.stageMode));
    });

    setMode("showreel");
}