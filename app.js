(function () {
    const navbar = document.querySelector("#navbar");
    const toggle = document.querySelector(".nav-toggle");
    const navLinks = document.querySelector("#nav-links");
    const links = Array.from(document.querySelectorAll("[data-nav]"));
    const sections = links
        .map(function (link) {
            return document.querySelector(link.getAttribute("href"));
        })
        .filter(Boolean)
        .sort(function (a, b) {
            return a.offsetTop - b.offsetTop;
        });

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

    function initCarousels() {
        var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        document.querySelectorAll("[data-carousel]").forEach(function (root) {
            var track = root.querySelector(".carousel-track");
            var slides = Array.from(root.querySelectorAll(".carousel-slide"));
            var prev = root.querySelector("[data-prev]");
            var next = root.querySelector("[data-next]");
            var dotsWrap = root.querySelector("[data-dots]");
            var index = 0;
            var timer;

            if (!track || slides.length === 0) return;

            function renderDots() {
                if (!dotsWrap) return;
                dotsWrap.innerHTML = "";
                slides.forEach(function (_, i) {
                    var button = document.createElement("button");
                    button.type = "button";
                    button.className = "carousel-dot" + (i === index ? " is-active" : "");
                    button.setAttribute("aria-label", "Go to slide " + (i + 1));
                    button.addEventListener("click", function () {
                        goTo(i);
                        restart();
                    });
                    dotsWrap.appendChild(button);
                });
            }

            function goTo(i) {
                index = (i + slides.length) % slides.length;
                track.style.transform = "translateX(" + (-index * 100) + "%)";
                slides.forEach(function (slide, slideIndex) {
                    slide.classList.toggle("is-active", slideIndex === index);
                });
                if (dotsWrap) {
                    Array.from(dotsWrap.children).forEach(function (dot, dotIndex) {
                        dot.classList.toggle("is-active", dotIndex === index);
                    });
                }
            }

            function restart() {
                if (prefersReduced || slides.length < 2) return;
                window.clearInterval(timer);
                timer = window.setInterval(function () {
                    goTo(index + 1);
                }, 5000);
            }

            if (prev) {
                prev.addEventListener("click", function () {
                    goTo(index - 1);
                    restart();
                });
            }

            if (next) {
                next.addEventListener("click", function () {
                    goTo(index + 1);
                    restart();
                });
            }

            root.addEventListener("keydown", function (event) {
                if (event.key === "ArrowLeft") {
                    goTo(index - 1);
                    restart();
                }
                if (event.key === "ArrowRight") {
                    goTo(index + 1);
                    restart();
                }
            });

            root.addEventListener("mouseenter", function () {
                window.clearInterval(timer);
            });
            root.addEventListener("mouseleave", restart);

            root.setAttribute("tabindex", "0");
            renderDots();
            goTo(0);
            restart();
        });
    }

    initCarousels();
})();
