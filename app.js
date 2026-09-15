(function () {
    const header = document.querySelector(".site-header");
    const toggle = document.querySelector(".nav-toggle");
    const nav = document.querySelector("#site-nav");
    const backdrop = document.querySelector("[data-nav-close]");
    const navLinks = Array.from(document.querySelectorAll("[data-nav]"));
    const sections = navLinks
        .map(function (link) {
            return document.querySelector(link.getAttribute("href"));
        })
        .filter(Boolean);

    function setHeaderState() {
        if (!header) return;
        header.classList.toggle("is-scrolled", window.scrollY > 12);
    }

    function closeNav() {
        if (!nav || !toggle) return;
        nav.classList.remove("is-open");
        if (backdrop) {
            backdrop.classList.remove("is-open");
            backdrop.hidden = true;
        }
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Open menu");
        document.body.style.overflow = "";
    }

    function openNav() {
        nav.classList.add("is-open");
        if (backdrop) {
            backdrop.hidden = false;
            backdrop.classList.add("is-open");
        }
        toggle.setAttribute("aria-expanded", "true");
        toggle.setAttribute("aria-label", "Close menu");
        document.body.style.overflow = "hidden";
    }

    if (toggle && nav) {
        toggle.addEventListener("click", function () {
            if (nav.classList.contains("is-open")) {
                closeNav();
            } else {
                openNav();
            }
        });

        navLinks.forEach(function (link) {
            link.addEventListener("click", closeNav);
        });

        if (backdrop) {
            backdrop.addEventListener("click", closeNav);
        }

        document.addEventListener("keydown", function (event) {
            if (event.key === "Escape") closeNav();
        });
    }

    function setActiveLink() {
        const offset = window.innerHeight * 0.35;
        let currentId = sections[0] ? sections[0].id : "";

        sections.forEach(function (section) {
            const top = section.getBoundingClientRect().top;
            if (top - offset <= 0) {
                currentId = section.id;
            }
        });

        if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) {
            currentId = "contact";
        }

        navLinks.forEach(function (link) {
            const isActive = link.getAttribute("href") === "#" + currentId;
            link.classList.toggle("is-active", isActive);
            if (isActive) {
                link.setAttribute("aria-current", "page");
            } else {
                link.removeAttribute("aria-current");
            }
        });
    }

    if ("IntersectionObserver" in window) {
        const revealObserver = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("is-visible");
                        revealObserver.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.14, rootMargin: "0px 0px -8% 0px" }
        );

        document.querySelectorAll("[data-reveal]").forEach(function (el) {
            revealObserver.observe(el);
        });
    } else {
        document.querySelectorAll("[data-reveal]").forEach(function (el) {
            el.classList.add("is-visible");
        });
    }

    window.addEventListener("scroll", function () {
        setHeaderState();
        setActiveLink();
    }, { passive: true });

    window.addEventListener("resize", function () {
        if (window.innerWidth > 768) closeNav();
    });

    setHeaderState();
    setActiveLink();
})();
