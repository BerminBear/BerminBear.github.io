// js/header-drawer.js
export function initHeaderDrawer({
    links = [
        { label: "Home", href: "home.html" },
        { label: "Projects", href: "projects.html" },
        { label: "Gallery", href: "gallery.html" },
        { label: "Blog", href: "blog.html" }
    ]
} = {}) {
    const host = document.getElementById("site-header");
    if (!host) return;

    const edgeOffset = 20;

    host.style.position = "fixed";
    host.style.top = "0";
    host.style.left = "0";
    host.style.width = "100%";
    host.style.zIndex = "120";
    host.style.pointerEvents = "none";

    host.innerHTML = `
        <div style="width: 100%; padding: ${edgeOffset}px 0 0 ${edgeOffset}px; display: flex; align-items: flex-start;">
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
                    z-index: 122;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    width: 40px;
                    height: 40px;
                    margin: 0;
                    border-radius: 6px;
                    background: #080808;
                    color: #ffffff;
                    border: 1px solid rgba(255, 255, 255, 0.28);
                    opacity: 1;
                    transition: opacity 0.4s ease, border-color 0.25s ease, box-shadow 0.3s ease, transform 0.3s ease;
                "
            >
                <svg
                    id="drawer-toggle-icon"
                    style="width: 16px; height: 16px; transition: transform 0.45s cubic-bezier(0.22, 1, 0.36, 1);"
                    viewBox="0 0 20 20"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.8"
                    aria-hidden="true"
                >
                    <path d="M3 6h14M3 10h14M3 14h14" stroke-linecap="round" />
                </svg>
            </button>
        </div>

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
                width: 380px;
                max-width: 90vw;
                z-index: 121;
                background: rgba(8, 8, 8, 0.96);
                backdrop-filter: blur(10px);
                border-right: 1px solid rgba(255, 255, 255, 0.18);
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                padding: ${edgeOffset}px 24px ${edgeOffset}px;
                box-shadow: 0 20px 50px rgba(0, 0, 0, 0.85);
                transform: translateX(-100%);
                transition: transform 0.48s cubic-bezier(0.22, 1, 0.36, 1);
            "
        >
            <div>
                <div style="display: flex; align-items: center; justify-content: space-between; height: 40px; padding-left: 52px; margin-bottom: 18px;">
                    <span class="label-mono" style="line-height: 1; font-size: 12px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: #8c8c8c;">
                        Navigation
                    </span>
                    <button
                        type="button"
                        id="drawer-close-btn"
                        aria-label="Close navigation menu"
                        class="label-mono"
                        style="line-height: 1; font-size: 12px; letter-spacing: 0.12em; text-transform: uppercase; color: #b8b8b8; background: transparent; border: none;"
                    >
                        [ CLOSE / ESC ]
                    </button>
                </div>

                <div style="height: 1px; background: rgba(255, 255, 255, 0.14); margin-bottom: 22px;"></div>

                <nav aria-label="Drawer navigation" style="display: flex; flex-direction: column; gap: 10px;">
                    ${links.map((item) => `
                        <a
                            href="${item.href}"
                            class="nav-link"
                            style="
                                display: flex;
                                align-items: center;
                                justify-content: space-between;
                                padding: 12px 16px;
                                border-radius: 6px;
                                background: #1a1a1a;
                                color: #e5e5e5;
                                border: 1px solid rgba(255, 255, 255, 0.16);
                                font-family: var(--font-mono, monospace);
                                font-size: 13px;
                                font-weight: 600;
                                letter-spacing: 0.12em;
                                text-transform: uppercase;
                                text-decoration: none;
                            "
                        >
                            <span>${item.label}</span>
                            <span aria-hidden="true">→</span>
                        </a>
                    `).join("")}
                </nav>
            </div>

            <p class="label-mono" style="font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: #767676;">
                Press ESC or click outside to close
            </p>
        </aside>
    `;

    const toggleBtn = document.getElementById("drawer-toggle-btn");
    const toggleIcon = document.getElementById("drawer-toggle-icon");
    const closeBtn = document.getElementById("drawer-close-btn");
    const drawer = document.getElementById("left-column-drawer");
    const infoCol = document.getElementById("hero-text-col");
    const stageCol = document.getElementById("hero-stage-col");

    if (!toggleBtn || !toggleIcon || !closeBtn || !drawer) return;

    let isOpen = false;

    const syncDrawerWidth = () => {
        if (infoCol && stageCol && window.innerWidth >= 1024) {
            const infoRect = infoCol.getBoundingClientRect();
            const stageRect = stageCol.getBoundingClientRect();
            const midpoint = Math.round((infoRect.right + stageRect.left) / 2);
            drawer.style.width = `${Math.max(280, midpoint)}px`;
            drawer.style.maxWidth = "none";
        } else if (infoCol && window.innerWidth >= 1024) {
            const rect = infoCol.getBoundingClientRect();
            drawer.style.width = `${Math.max(280, Math.round(rect.right + 16))}px`;
            drawer.style.maxWidth = "none";
        } else {
            drawer.style.width = "380px";
            drawer.style.maxWidth = "90vw";
        }
    };

    const setOpen = (open) => {
        isOpen = open;
        syncDrawerWidth();
        toggleBtn.setAttribute("aria-expanded", String(open));
        drawer.setAttribute("aria-hidden", String(!open));
        drawer.style.transform = open ? "translateX(0)" : "translateX(-100%)";
        toggleIcon.style.transform = open ? "rotate(90deg)" : "rotate(0deg)";
    };

    toggleBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        setOpen(!isOpen);
    });

    closeBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        setOpen(false);
    });

    document.addEventListener("click", (e) => {
        if (isOpen && !drawer.contains(e.target) && !toggleBtn.contains(e.target)) {
            setOpen(false);
        }
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && isOpen) {
            setOpen(false);
        }
    });

    window.addEventListener("resize", () => {
        if (isOpen) syncDrawerWidth();
    }, { passive: true });
}