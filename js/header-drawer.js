// js/header-drawer.js
const STORAGE_KEY = "b_natalli_menu_expanded";

export function initHeaderDrawer({
    pageName,
    links = [
        { label: "Home", href: "home.html" },
        { label: "Projects", href: "projects.html" },
        { label: "Gallery", href: "gallery.html" },
        { label: "Blog", href: "blog.html" }
    ]
} = {}) {
    const host = document.getElementById("site-header");
    if (!host) return;

    const inferredPage =
        pageName ||
        document.body.dataset.page ||
        (document.title ? document.title.split("|")[0].trim() : "") ||
        "Navigation";

    const currentPageLabel = String(inferredPage).toUpperCase();
    const edgeOffset = 16;

    host.style.position = "fixed";
    host.style.top = "0";
    host.style.left = "0";
    host.style.width = "100%";
    host.style.zIndex = "120";
    host.style.pointerEvents = "none";

    host.innerHTML = `
        <style>
            #site-header-bar {
                pointer-events: auto;
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                z-index: 121;
                background: rgba(8, 8, 8, 0.96);
                backdrop-filter: blur(10px);
                border-bottom: 1px solid rgba(255, 255, 255, 0.16);
                box-shadow: 0 12px 36px rgba(0, 0, 0, 0.75);
                transform: translateX(-100%);
                opacity: 0;
                transition:
                    transform 0.52s cubic-bezier(0.16, 1, 0.3, 1),
                    opacity 0.35s ease;
            }
            #site-header-bar.is-open {
                transform: translateX(0);
                opacity: 1;
            }
            #left-column-drawer {
                transition: transform 0.48s cubic-bezier(0.16, 1, 0.3, 1);
            }
            #left-column-drawer.is-open {
                transform: translateX(0) !important;
            }
            #drawer-toggle-icon {
                transition: transform 0.38s cubic-bezier(0.16, 1, 0.3, 1);
            }
            /* Ingen sidbytes-animation på navbaren eller dess länkar */
            #site-header.skip-nav-anim,
            #site-header.skip-nav-anim *,
            #site-header-bar a.nav-link,
            #left-column-drawer a.nav-link {
                animation: none !important;
            }
            #site-header-bar a.nav-link,
            #left-column-drawer a.nav-link {
                transition: color 0.2s ease, border-color 0.2s ease, background-color 0.2s ease, box-shadow 0.25s ease !important;
            }
            #site-header.instant-init #site-header-bar,
            #site-header.instant-init #left-column-drawer,
            #site-header.instant-init #drawer-toggle-icon,
            #site-header.instant-init #current-page-badge {
                transition: none !important;
            }
        </style>

        <!-- FAST TRIGGER & SIDNAMN (visas när menyn är ihopfälld) -->
        <div style="width: 100%; padding: ${edgeOffset}px ${edgeOffset}px 0 ${edgeOffset}px; display: flex; align-items: center; gap: 12px;">
            <button
                type="button"
                id="drawer-toggle-btn"
                aria-label="Toggle navigation menu"
                aria-expanded="false"
                aria-controls="left-column-drawer"
                class="nav-link"
                style="
                    pointer-events: auto;
                    position: relative;
                    z-index: 123;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    width: 38px;
                    height: 38px;
                    margin: 0;
                    border-radius: 6px;
                    background: #080808;
                    color: #ffffff;
                    border: 1px solid rgba(255, 255, 255, 0.25);
                    opacity: 1;
                "
            >
                <svg
                    id="drawer-toggle-icon"
                    style="width: 16px; height: 16px;"
                    viewBox="0 0 20 20"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.8"
                    aria-hidden="true"
                >
                    <path d="M3 6h14M3 10h14M3 14h14" stroke-linecap="round" />
                </svg>
            </button>

            <span
                id="current-page-badge"
                class="label-mono"
                style="
                    pointer-events: none;
                    font-size: 11px;
                    font-weight: 700;
                    letter-spacing: 0.16em;
                    text-transform: uppercase;
                    color: rgba(255, 255, 255, 0.85);
                    background: transparent;
                    border: none;
                    padding: 0;
                    transition: opacity 0.2s ease;
                "
            >
                ${currentPageLabel}
            </span>
        </div>

        <!-- DESKTOP: UTFÄLLBAR TOPP-HEADER -->
        <div id="site-header-bar" aria-hidden="true">
            <div style="width: 100%; padding: 10px 24px 10px 68px; display: flex; align-items: center; justify-content: space-between; gap: 18px;">
                <nav aria-label="Header navigation" style="display: flex; align-items: center; gap: 10px; flex: 1; max-width: 920px; margin: 0 auto;">
                    ${links.map((item) => {
                        const isCurrent = item.label.toLowerCase() === currentPageLabel.toLowerCase();
                        return `
                            <a
                                href="${item.href}"
                                class="nav-link"
                                style="
                                    flex: 1 1 0;
                                    display: inline-flex;
                                    align-items: center;
                                    justify-content: center;
                                    padding: 9px 16px;
                                    border-radius: 6px;
                                    background: ${isCurrent ? "#242424" : "#141414"};
                                    color: ${isCurrent ? "#ffffff" : "#d4d4d4"};
                                    border: 1px solid ${isCurrent ? "rgba(255, 255, 255, 0.55)" : "rgba(255, 255, 255, 0.16)"};
                                    font-family: var(--font-mono);
                                    font-size: 12px;
                                    font-weight: 700;
                                    letter-spacing: 0.14em;
                                    text-transform: uppercase;
                                    text-decoration: none;
                                    white-space: nowrap;
                                "
                            >
                                <span>${item.label}</span>
                            </a>
                        `;
                    }).join("")}
                </nav>

                <button
                    type="button"
                    id="topbar-close-btn"
                    aria-label="Close navigation menu"
                    class="label-mono"
                    style="shrink: 0; white-space: nowrap; font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: #b8b8b8; background: transparent; border: none;"
                >
                    [ CLOSE / ESC ]
                </button>
            </div>
        </div>

        <!-- MOBIL / SMAL SKÄRM: VÄNSTER-DRAWER -->
        <aside
            id="left-column-drawer"
            aria-hidden="true"
            style="
                pointer-events: auto;
                position: fixed;
                top: 0;
                left: 0;
                margin: 0;
                height: 100vh;
                width: 340px;
                max-width: 88vw;
                z-index: 121;
                background: rgba(8, 8, 8, 0.96);
                backdrop-filter: blur(10px);
                border-right: 1px solid rgba(255, 255, 255, 0.18);
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                padding: ${edgeOffset}px 22px ${edgeOffset}px;
                box-shadow: 0 20px 50px rgba(0, 0, 0, 0.85);
                transform: translateX(-100%);
            "
        >
            <div>
                <div style="display: flex; align-items: center; justify-content: flex-end; height: 38px; margin-bottom: 16px;">
                    <button
                        type="button"
                        id="drawer-close-btn"
                        aria-label="Close navigation menu"
                        class="label-mono"
                        style="line-height: 1; font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: #b8b8b8; background: transparent; border: none;"
                    >
                        [ CLOSE / ESC ]
                    </button>
                </div>

                <div style="height: 1px; background: rgba(255, 255, 255, 0.14); margin-bottom: 18px;"></div>

                <nav aria-label="Drawer navigation" style="display: flex; flex-direction: column; gap: 10px;">
                    ${links.map((item) => {
                        const isCurrent = item.label.toLowerCase() === currentPageLabel.toLowerCase();
                        return `
                            <a
                                href="${item.href}"
                                class="nav-link"
                                style="
                                    display: flex;
                                    align-items: center;
                                    justify-content: space-between;
                                    padding: 13px 16px;
                                    border-radius: 6px;
                                    background: ${isCurrent ? "#242424" : "#141414"};
                                    color: ${isCurrent ? "#ffffff" : "#d4d4d4"};
                                    border: 1px solid ${isCurrent ? "rgba(255, 255, 255, 0.55)" : "rgba(255, 255, 255, 0.16)"};
                                    font-family: var(--font-mono);
                                    font-size: 12px;
                                    font-weight: 700;
                                    letter-spacing: 0.14em;
                                    text-transform: uppercase;
                                    text-decoration: none;
                                "
                            >
                                <span>${item.label}</span>
                                <span aria-hidden="true">→</span>
                            </a>
                        `;
                    }).join("")}
                </nav>
            </div>

            <p class="label-mono" style="font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: #767676;">
                Press ESC or click outside to close
            </p>
        </aside>
    `;

    host.classList.add("skip-nav-anim");

    const toggleBtn = document.getElementById("drawer-toggle-btn");
    const toggleIcon = document.getElementById("drawer-toggle-icon");
    const pageBadge = document.getElementById("current-page-badge");
    const closeDrawerBtn = document.getElementById("drawer-close-btn");
    const closeTopbarBtn = document.getElementById("topbar-close-btn");
    const drawer = document.getElementById("left-column-drawer");
    const topBar = document.getElementById("site-header-bar");

    if (!toggleBtn || !toggleIcon || !drawer || !topBar) return;

    let isMenuExpanded = sessionStorage.getItem(STORAGE_KEY) === "true";
    const isDesktopBar = () => window.innerWidth >= 1024;

    const hasOpenModal = () => {
        const projectModal = document.getElementById("project-detail-modal");
        const aboutModal = document.getElementById("about-detail-modal");
        const projectOpen = projectModal && !projectModal.classList.contains("hidden");
        const aboutOpen = aboutModal && !aboutModal.classList.contains("hidden");
        return Boolean(projectOpen || aboutOpen);
    };

    const applyMenuState = (expanded, { persist = true, instant = false } = {}) => {
        isMenuExpanded = Boolean(expanded);
        if (persist) {
            try {
                sessionStorage.setItem(STORAGE_KEY, String(isMenuExpanded));
            } catch (_) {}
        }

        if (instant) {
            host.classList.add("instant-init");
        }

        toggleBtn.setAttribute("aria-expanded", String(isMenuExpanded));
        toggleIcon.style.transform = isMenuExpanded ? "rotate(90deg)" : "rotate(0deg)";

        if (pageBadge) {
            pageBadge.style.opacity = isMenuExpanded ? "0" : "1";
        }

        if (isDesktopBar()) {
            topBar.classList.toggle("is-open", isMenuExpanded);
            topBar.setAttribute("aria-hidden", String(!isMenuExpanded));
            drawer.classList.remove("is-open");
            drawer.setAttribute("aria-hidden", "true");
        } else {
            drawer.classList.toggle("is-open", isMenuExpanded);
            drawer.setAttribute("aria-hidden", String(!isMenuExpanded));
            topBar.classList.remove("is-open");
            topBar.setAttribute("aria-hidden", "true");
        }

        if (instant) {
            void topBar.offsetWidth;
            requestAnimationFrame(() => {
                host.classList.remove("instant-init");
            });
        }
    };

    toggleBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        applyMenuState(!isMenuExpanded);
    });

    closeDrawerBtn?.addEventListener("click", (e) => {
        e.stopPropagation();
        applyMenuState(false);
    });

    closeTopbarBtn?.addEventListener("click", (e) => {
        e.stopPropagation();
        applyMenuState(false);
    });

    document.addEventListener("click", (e) => {
        if (!isMenuExpanded) return;
        if (hasOpenModal()) return;
        if (e.target.closest("#project-detail-modal, #about-detail-modal, .project-card")) return;

        if (
            !drawer.contains(e.target) &&
            !topBar.contains(e.target) &&
            !toggleBtn.contains(e.target)
        ) {
            applyMenuState(false);
        }
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            if (hasOpenModal()) return;
            applyMenuState(!isMenuExpanded);
        }
    });

    window.addEventListener("resize", () => {
        const isExpandedOnNarrowScreen = isMenuExpanded && !isDesktopBar();
        if (isExpandedOnNarrowScreen) {
            applyMenuState(false, { persist: true, instant: true });
            return;
        }
        applyMenuState(isMenuExpanded, { persist: false, instant: true });
    }, { passive: true });

    // Vid ny flik / sidbyte: om menyn är utfälld på smal skärm, fäll in direkt; annars visa kvarstående utan slide-intro
    const isExpandedOnNarrowScreen = isMenuExpanded && !isDesktopBar();
    if (isExpandedOnNarrowScreen) {
        applyMenuState(false, { persist: true, instant: true });
    } else {
        applyMenuState(isMenuExpanded, { persist: false, instant: true });
    }
}