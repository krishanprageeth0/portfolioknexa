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
                    const cardCategory = card.getAttribute("data-category") || "";
                    const categories = cardCategory.split(" ");
                    if (filterValue === "all" || categories.includes(filterValue)) {
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

    // 6. Direct Email Dispatcher (Sends directly to krishanprageeth87@gmail.com)
    const contactForm = document.getElementById("contact-form");
    const submitBtn = document.getElementById("form-submit-btn");
    const btnText = document.getElementById("btn-text");
    const btnIcon = document.getElementById("btn-icon");
    const formStatus = document.getElementById("form-status");

    if (contactForm) {
        contactForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const name = document.getElementById("name")?.value.trim() || "";
            const email = document.getElementById("email")?.value.trim() || "";
            const projectType = document.getElementById("project-type")?.value || "General Inquiry";
            const message = document.getElementById("message")?.value.trim() || "";

            // Disable button & show spinner
            if (submitBtn) submitBtn.disabled = true;
            if (btnText) btnText.textContent = "Sending Message...";
            if (btnIcon) btnIcon.className = "fas fa-spinner fa-spin";
            if (formStatus) formStatus.style.display = "none";

            try {
                const response = await fetch("https://formsubmit.co/ajax/krishanprageeth87@gmail.com", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    },
                    body: JSON.stringify({
                        Name: name,
                        Email: email,
                        "Project Type": projectType,
                        Message: message,
                        "_subject": `New Portfolio Lead from ${name} (${projectType})`,
                        "_template": "table",
                        "_captcha": "false"
                    })
                });

                const data = await response.json();

                if (response.ok) {
                    if (formStatus) {
                        formStatus.style.display = "block";
                        formStatus.style.background = "rgba(16, 185, 129, 0.12)";
                        formStatus.style.border = "1px solid rgba(16, 185, 129, 0.35)";
                        formStatus.style.color = "#10b981";
                        formStatus.innerHTML = `<i class="fas fa-check-circle"></i> <strong>Message Sent Successfully!</strong><br>Thank you ${name}, your message has been delivered directly to Krishan's email (krishanprageeth87@gmail.com). I will reply shortly!`;
                    }
                    contactForm.reset();
                } else {
                    throw new Error(data.message || "Submission failed");
                }
            } catch (err) {
                console.error("Form submission error:", err);
                if (formStatus) {
                    formStatus.style.display = "block";
                    formStatus.style.background = "rgba(239, 68, 68, 0.12)";
                    formStatus.style.border = "1px solid rgba(239, 68, 68, 0.35)";
                    formStatus.style.color = "#f87171";
                    formStatus.innerHTML = `<i class="fas fa-exclamation-circle"></i> <strong>Unable to send directly right now.</strong><br>Please chat directly via WhatsApp: <a href="https://wa.me/94701379291" target="_blank" style="color: #25D366; text-decoration: underline; font-weight: bold;">+94 70 137 9291</a> or email <a href="mailto:Krishanprageeth87@gmail.com" style="color: #00d4ff; text-decoration: underline;">Krishanprageeth87@gmail.com</a>`;
                }
            } finally {
                if (submitBtn) submitBtn.disabled = false;
                if (btnText) btnText.textContent = "Send Message to Email";
                if (btnIcon) btnIcon.className = "fas fa-paper-plane";
            }
        });
    }

    // 7. Interactive FAQ Accordion
    const faqItems = document.querySelectorAll(".faq-item");
    faqItems.forEach(item => {
        const questionBtn = item.querySelector(".faq-question");
        const answer = item.querySelector(".faq-answer");

        if (questionBtn && answer) {
            questionBtn.addEventListener("click", () => {
                const isActive = item.classList.contains("active");

                // Close all other items
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove("active");
                        const otherBtn = otherItem.querySelector(".faq-question");
                        const otherAns = otherItem.querySelector(".faq-answer");
                        if (otherBtn) otherBtn.setAttribute("aria-expanded", "false");
                        if (otherAns) otherAns.style.maxHeight = null;
                    }
                });

                // Toggle current item
                if (isActive) {
                    item.classList.remove("active");
                    questionBtn.setAttribute("aria-expanded", "false");
                    answer.style.maxHeight = null;
                } else {
                    item.classList.add("active");
                    questionBtn.setAttribute("aria-expanded", "true");
                    answer.style.maxHeight = (answer.scrollHeight + 40) + "px";
                }
            });
        }
    });

    // 8. Floating Back-to-Top Button
    const backToTopBtn = document.getElementById("back-to-top");
    if (backToTopBtn) {
        window.addEventListener("scroll", () => {
            if (window.pageYOffset > 400) {
                backToTopBtn.classList.add("visible");
            } else {
                backToTopBtn.classList.remove("visible");
            }
        }, { passive: true });

        backToTopBtn.addEventListener("click", () => {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });
    }

    // 9. Instant Copy-to-Clipboard with Toast Notification
    const toast = document.getElementById("toast");
    let toastTimeout;

    function showToast(message) {
        if (!toast) return;
        toast.innerHTML = `<i class="fas fa-check-circle" style="color: #10b981;"></i> ${message}`;
        toast.classList.add("show");
        clearTimeout(toastTimeout);
        toastTimeout = setTimeout(() => {
            toast.classList.remove("show");
        }, 2500);
    }

    document.querySelectorAll(".copy-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            const textToCopy = btn.getAttribute("data-copy");
            if (textToCopy && navigator.clipboard) {
                navigator.clipboard.writeText(textToCopy).then(() => {
                    showToast(`Copied to clipboard: <strong>${textToCopy}</strong>`);
                }).catch(() => {
                    showToast(`Copied: <strong>${textToCopy}</strong>`);
                });
            }
        });
    });
});
