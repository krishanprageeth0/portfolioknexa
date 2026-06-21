/* 
   Glassmorphic Personal Portfolio Core Logic
   Author: V.K. Krishan Prageeth Kumara (Antigravity AI Assistant Collaboration)
*/

document.addEventListener("DOMContentLoaded", () => {
    // --- Mobile Menu Toggle ---
    const menuToggle = document.querySelector(".menu-toggle");
    const navMenu = document.querySelector(".nav-menu");
    const navLinks = document.querySelectorAll(".nav-link");

    if (menuToggle && navMenu) {
        menuToggle.addEventListener("click", () => {
            menuToggle.classList.toggle("active");
            navMenu.classList.toggle("active");
        });

        // Close menu when clicking a link
        navLinks.forEach(link => {
            link.addEventListener("click", () => {
                menuToggle.classList.remove("active");
                navMenu.classList.remove("active");
            });
        });
    }

    // --- Dynamic Typing Effect ---
    const typedTextSpan = document.querySelector(".typed-text");
    const roles = ["Founder & Lead Developer", "Full-Stack Software Engineer", "Senior IT & Finance Coordinator", "UI/UX Enthusiast"];
    const typingSpeed = 100;
    const erasingSpeed = 50;
    const newWordDelay = 2000; // Delay between words
    let roleIndex = 0;
    let charIndex = 0;

    function type() {
        if (!typedTextSpan) return;
        if (charIndex < roles[roleIndex].length) {
            typedTextSpan.textContent += roles[roleIndex].charAt(charIndex);
            charIndex++;
            setTimeout(type, typingSpeed);
        } else {
            setTimeout(erase, newWordDelay);
        }
    }

    function erase() {
        if (!typedTextSpan) return;
        if (charIndex > 0) {
            typedTextSpan.textContent = roles[roleIndex].substring(0, charIndex - 1);
            charIndex--;
            setTimeout(erase, erasingSpeed);
        } else {
            roleIndex++;
            if (roleIndex >= roles.length) roleIndex = 0;
            setTimeout(type, typingSpeed + 500);
        }
    }

    // Initialize typing effect
    if (typedTextSpan && roles.length) {
        setTimeout(type, 1000);
    }

    // --- Active Link on Scroll ---
    const sections = document.querySelectorAll("section");
    
    function activeMenu() {
        let len = sections.length;
        while(--len && window.scrollY + 150 < sections[len].offsetTop) {}
        navLinks.forEach(lt => lt.classList.remove("active"));
        if(navLinks[len]) {
            navLinks[len].classList.add("active");
        }
    }
    
    window.addEventListener("scroll", activeMenu);

    // --- Scroll Reveal Animation ---
    const reveals = document.querySelectorAll(".reveal");
    
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("active");
                // Option: Unobserve if we only want animate once
                // observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    });

    reveals.forEach(reveal => {
        revealObserver.observe(reveal);
    });

    // --- 3D Tilt Effect for Portfolio Cards ---
    const cards = document.querySelectorAll(".portfolio-card");
    
    cards.forEach(card => {
        const inner = card.querySelector(".portfolio-card-inner");
        const shine = card.querySelector(".portfolio-overlay-shine");
        
        card.addEventListener("mousemove", (e) => {
            if (!inner) return;
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left; // x position within element
            const y = e.clientY - rect.top;  // y position within element
            
            // Calculate relative coordinate from card center (-0.5 to 0.5)
            const xc = (x - rect.width / 2) / (rect.width / 2);
            const yc = (y - rect.height / 2) / (rect.height / 2);
            
            // Rotate card: max 12 degrees
            const rotateX = -yc * 12;
            const rotateY = xc * 12;
            
            inner.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
            
            // Update shine gradient position
            if (shine) {
                const angle = Math.atan2(y - rect.height / 2, x - rect.width / 2) * (180 / Math.PI);
                shine.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(0, 212, 255, 0.15) 0%, transparent 60%)`;
            }
        });
        
        card.addEventListener("mouseleave", () => {
            if (!inner) return;
            inner.style.transform = `rotateX(0deg) rotateY(0deg) scale(1)`;
            if (shine) {
                shine.style.background = "linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, transparent 50%)";
            }
        });
    });

    // --- Canvas Particle Animation (Space Dust Effect) ---
    const canvas = document.getElementById("canvas-particles");
    if (canvas) {
        const ctx = canvas.getContext("2d");
        let particlesArray = [];
        const numberOfParticles = 60;

        // Set Canvas Size
        function setCanvasSize() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        setCanvasSize();
        window.addEventListener("resize", () => {
            setCanvasSize();
            initParticles();
        });

        // Particle Class
        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height + canvas.height; // Start below or randomly
                this.size = Math.random() * 2.5 + 0.5;
                this.speedY = Math.random() * 0.4 + 0.1; // slow vertical drift
                this.speedX = (Math.random() - 0.5) * 0.15; // slow drift sideways
                this.opacity = Math.random() * 0.5 + 0.2;
                this.pulseDirection = Math.random() > 0.5 ? 1 : -1;
                this.color = Math.random() > 0.4 ? "rgba(0, 212, 255," : "rgba(255, 255, 255,";
            }
            update() {
                this.y -= this.speedY;
                this.x += this.speedX;
                
                // Recycled if goes off screen top or side
                if (this.y < 0) {
                    this.y = canvas.height + Math.random() * 20;
                    this.x = Math.random() * canvas.width;
                }
                if (this.x < 0 || this.x > canvas.width) {
                    this.x = Math.random() * canvas.width;
                }

                // Opacity pulse (twinkle)
                this.opacity += 0.003 * this.pulseDirection;
                if (this.opacity > 0.7) this.pulseDirection = -1;
                if (this.opacity < 0.15) this.pulseDirection = 1;
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = this.color + this.opacity + ")";
                ctx.fill();
            }
        }

        function initParticles() {
            particlesArray = [];
            for (let i = 0; i < numberOfParticles; i++) {
                let p = new Particle();
                p.y = Math.random() * canvas.height; // distribute initially
                particlesArray.push(p);
            }
        }

        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (let i = 0; i < particlesArray.length; i++) {
                particlesArray[i].update();
                particlesArray[i].draw();
            }
            requestAnimationFrame(animateParticles);
        }

        initParticles();
        animateParticles();
    }

    // --- Contact Form Submission Handling ---
    const contactForm = document.querySelector(".contact-form");
    if (contactForm) {
        contactForm.addEventListener("submit", (e) => {
            e.preventDefault();
            
            // Basic values check
            const name = document.getElementById("name").value.trim();
            const email = document.getElementById("email").value.trim();
            const message = document.getElementById("message").value.trim();
            
            if (name && email && message) {
                // Show a modern glassmorphic alert or animation instead of default browser alert
                const submitBtn = contactForm.querySelector("button[type='submit']");
                const originalText = submitBtn.innerHTML;
                
                submitBtn.innerHTML = "Sending... <i class='fas fa-circle-notch fa-spin'></i>";
                submitBtn.disabled = true;
                
                setTimeout(() => {
                    submitBtn.innerHTML = "Success! <i class='fas fa-check'></i>";
                    submitBtn.style.background = "linear-gradient(135deg, #00E676 0%, #00B0FF 100%)";
                    submitBtn.style.boxShadow = "0 0 20px rgba(0, 230, 118, 0.4)";
                    
                    // Reset Form
                    contactForm.reset();
                    
                    // Revert button after a few seconds
                    setTimeout(() => {
                        submitBtn.innerHTML = originalText;
                        submitBtn.disabled = false;
                        submitBtn.style.background = "";
                        submitBtn.style.boxShadow = "";
                    }, 4000);
                }, 1500);
            }
        });
    }
});
