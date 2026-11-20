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

    host.className = "fixed top-0 left-0 w-full z-50 pointer-events-none";
    host.innerHTML = `
        <div class="w-full max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8 pt-5 flex items-start">
            <button
                type="button"
                id="drawer-toggle-btn"
                aria-label="Toggle navigation menu"
                aria-expanded="false"
                aria-controls="left-column-drawer"
                class="pointer-events-auto nav-link inline-flex items-center justify-center w-10 h-10 rounded-md bg-[var(--color-modal-bg)] border border-[var(--color-accent-border)] opacity-0 transition-all duration-700 ease-out focus:outline-none"
            >
                <svg
                    id="drawer-toggle-icon"
                    class="w-4 h-4 transition-transform duration-500 ease-out"
                    viewBox="0 0 20 20"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.6"
                    aria-hidden="true"
                >
                    <path d="M3 6h14M3 10h14M3 14h14" stroke-linecap="round" />
                </svg>
            </button>
        </div>

        <aside
            id="left-column-drawer"
            aria-hidden="true"
            class="pointer-events-auto fixed top-0 left-0 h-full bg-[var(--color-modal-bg)]/95 backdrop-blur-md border-r border-[var(--color-accent-border)] z-40 flex flex-col justify-between p-6 sm:p-8 shadow-2xl transition-transform duration-500 ease-out"
            style="width: 380px; max-width: 90vw; transform: translateX(-100%);"
        >
            <div>
                <div class="flex items-center justify-between pb-5 mb-6 border-b border-[var(--color-accent-border)]">
                    <span class="label-mono text-xs font-semibold uppercase tracking-widest text-[var(--color-muted)]">
                        Navigation
                    </span>
                    <button
                        type="button"
                        id="drawer-close-btn"
                        aria-label="Close navigation menu"
                        class="label-mono text-xs uppercase tracking-widest text-[var(--color-muted)] hover:text-white transition-colors"
                    >
                        [ CLOSE ]
                    </button>
                </div>

                <nav aria-label="Drawer navigation" class="flex flex-col gap-2.5">
                    ${links.map((item) => `
                        <a
                            href="${item.href}"
                            class="nav-link py-3 px-4 rounded-md bg-[var(--color-secondary)] border border-[var(--color-accent-border)] font-mono text-xs sm:text-sm font-semibold uppercase tracking-widest flex items-center justify-between"
                        >
                            <span>${item.label}</span>
                            <span aria-hidden="true">→</span>
                        </a>
                    `).join("")}
                </nav>
            </div>

            <p class="label-mono text-[11px] text-[var(--color-muted)] tracking-widest uppercase">
                Press ESC or click outside to close
            </p>
        </aside>
    `;

    const toggleBtn = document.getElementById("drawer-toggle-btn");
    const toggleIcon = document.getElementById("drawer-toggle-icon");
    const closeBtn = document.getElementById("drawer-close-btn");
    const drawer = document.getElementById("left-column-drawer");
    const infoCol = document.getElementById("hero-text-col");

    let isOpen = false;

    const syncDrawerWidth = () => {
        if (infoCol && window.innerWidth >= 1024) {
            const rect = infoCol.getBoundingClientRect();
            drawer.style.width = `${Math.round(rect.left + rect.width + 20)}px`;
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

    // Mjuk infade av knappen efter start (samma idé som scroll-knappen)
    setTimeout(() => {
        toggleBtn.classList.remove("opacity-0");
        toggleBtn.classList.add("opacity-100");
    }, 300);

    toggleBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        setOpen(!isOpen);
    });

    closeBtn.addEventListener("click", () => setOpen(false));

    document.addEventListener("click", (e) => {
        if (isOpen && !drawer.contains(e.target) && !toggleBtn.contains(e.target)) {
            setOpen(false);
        }
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && isOpen) setOpen(false);
    });

    window.addEventListener("resize", () => {
        if (isOpen) syncDrawerWidth();
    }, { passive: true });
}