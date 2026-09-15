(function () {
    const navbar = document.querySelector("#navbar");
    const toggle = document.querySelector(".nav-toggle");
    const navLinks = document.querySelector("#nav-links");
    const links = Array.from(document.querySelectorAll("[data-nav]"));
    const sections = links
        .map(function (link) {
            return document.querySelector(link.getAttribute("href"));
        })
        .filter(Boolean);

    function setNavState() {
        if (!navbar) return;
        navbar.classList.toggle("is-scrolled", window.scrollY > 20);
    }

    function closeNav() {
        if (!navLinks || !toggle) return;
        navLinks.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Open menu");
        document.body.style.overflow = "";
    }

    function openNav() {
        navLinks.classList.add("is-open");
        toggle.setAttribute("aria-expanded", "true");
        toggle.setAttribute("aria-label", "Close menu");
        document.body.style.overflow = "hidden";
    }

    if (toggle && navLinks) {
        toggle.addEventListener("click", function () {
            if (navLinks.classList.contains("is-open")) {
                closeNav();
            } else {
                openNav();
            }
        });

        links.forEach(function (link) {
            link.addEventListener("click", closeNav);
        });

        document.addEventListener("keydown", function (event) {
            if (event.key === "Escape") closeNav();
        });
    }

    function setActiveLink() {
        const offset = window.innerHeight * 0.35;
        let currentId = "home";

        sections.forEach(function (section) {
            if (section.getBoundingClientRect().top - offset <= 0) {
                currentId = section.id;
            }
        });

        if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) {
            currentId = "footer";
        }

        links.forEach(function (link) {
            const isActive = link.getAttribute("href") === "#" + currentId;
            link.classList.toggle("is-active", isActive);
            if (isActive) {
                link.setAttribute("aria-current", "page");
            } else {
                link.removeAttribute("aria-current");
            }
        });
    }

    window.addEventListener("scroll", function () {
        setNavState();
        setActiveLink();
    }, { passive: true });

    window.addEventListener("resize", function () {
        if (window.innerWidth > 700) closeNav();
    });

    setNavState();
    setActiveLink();
})();
