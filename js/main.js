/* 
   Krishan Prageeth | Modern Web Developer & WordPress Specialist
   Core High-Speed JavaScript Engine (Zero Lag, Optimized for 60fps)
*/

document.addEventListener("DOMContentLoaded", () => {
    // 1. Mobile Navigation Menu Toggle
    const menuToggle = document.querySelector(".menu-toggle");
    const navMenu = document.querySelector(".nav-menu");
    const navLinks = document.querySelectorAll(".nav-link");

    if (menuToggle && navMenu) {
        menuToggle.addEventListener("click", () => {
            menuToggle.classList.toggle("active");
            navMenu.classList.toggle("active");
        });

        // Close mobile menu when clicking a link
        navLinks.forEach(link => {
            link.addEventListener("click", () => {
                menuToggle.classList.remove("active");
                navMenu.classList.remove("active");
            });
        });
    }

    // 2. Sticky Navbar & Active Section Highlighting
    const navbar = document.querySelector(".navbar");
    const sections = document.querySelectorAll("section[id]");

    function handleScroll() {
        const scrollY = window.pageYOffset;

        // Sticky Navbar shadow effect
        if (navbar) {
            if (scrollY > 50) {
                navbar.style.boxShadow = "0 10px 30px rgba(0, 0, 0, 0.6)";
                navbar.style.borderColor = "rgba(0, 212, 255, 0.25)";
            } else {
                navbar.style.boxShadow = "none";
                navbar.style.borderColor = "rgba(255, 255, 255, 0.1)";
            }
        }

        // Active Navigation Link on Scroll
        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 140;
            const sectionId = current.getAttribute("id");

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove("active");
                    if (link.getAttribute("href") === `#${sectionId}`) {
                        link.classList.add("active");
                    }
                });
            }
        });
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    // 3. Smooth Native Scroll for Internal Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const headerOffset = 90;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });

    // 4. Portfolio Category Filter Logic
    const filterButtons = document.querySelectorAll(".filter-btn");
    const portfolioCards = document.querySelectorAll(".portfolio-card");

    if (filterButtons.length > 0 && portfolioCards.length > 0) {
        filterButtons.forEach(btn => {
            btn.addEventListener("click", () => {
                filterButtons.forEach(b => b.classList.remove("active"));
                btn.classList.add("active");

                const filterValue = btn.getAttribute("data-filter");

                portfolioCards.forEach(card => {
                    const cardCategory = card.getAttribute("data-category");
                    if (filterValue === "all" || cardCategory === filterValue) {
                        card.classList.remove("is-hidden");
                        card.style.opacity = "0";
                        card.style.transform = "translateY(15px)";
                        setTimeout(() => {
                            card.style.transition = "opacity 0.35s ease, transform 0.35s ease";
                            card.style.opacity = "1";
                            card.style.transform = "translateY(0)";
                        }, 30);
                    } else {
                        card.classList.add("is-hidden");
                    }
                });
            });
        });
    }

    // 5. High-Performance Intersection Observer for Scroll Reveals
    const revealElements = document.querySelectorAll(".reveal");
    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("active");
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.12,
            rootMargin: "0px 0px -40px 0px"
        });

        revealElements.forEach(el => revealObserver.observe(el));
    } else {
        // Fallback for older browsers
        revealElements.forEach(el => el.classList.add("active"));
    }

    // 6. Contact Form WhatsApp Submission Handler
    const contactForm = document.getElementById("contact-form");
    if (contactForm) {
        contactForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const name = document.getElementById("name")?.value || "Client";
            const email = document.getElementById("email")?.value || "";
            const projectType = document.getElementById("project-type")?.value || "General Inquiry";
            const message = document.getElementById("message")?.value || "";

            const whatsappMessage = encodeURIComponent(
                `*New Inquiry from Portfolio Website*\n\n` +
                `*Name:* ${name}\n` +
                `*Email:* ${email}\n` +
                `*Project Type:* ${projectType}\n` +
                `*Message:* ${message}`
            );

            // Open WhatsApp directly with the pre-filled message
            const whatsappUrl = `https://wa.me/94701379291?text=${whatsappMessage}`;
            window.open(whatsappUrl, "_blank");

            // Optional reset
            contactForm.reset();
        });
    }
});
