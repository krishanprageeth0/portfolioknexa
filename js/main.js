/* 
   Glassmorphic Personal Portfolio Core Logic
   Author: Krishan Prageeth (Antigravity AI Assistant Collaboration)
*/

document.addEventListener("DOMContentLoaded", () => {
    let isGravityOff = false;
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

    // --- 3D Tilt Effect for Portfolio Cards (Throttled for Smoothness) ---
    const cards = document.querySelectorAll(".portfolio-card");
    
    cards.forEach(card => {
        const inner = card.querySelector(".portfolio-card-inner");
        const shine = card.querySelector(".portfolio-overlay-shine");
        
        let tiltFrameId = null;
        
        card.addEventListener("mousemove", (e) => {
            if (!inner) return;
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left; // x position within element
            const y = e.clientY - rect.top;  // y position within element
            
            if (tiltFrameId) {
                cancelAnimationFrame(tiltFrameId);
            }
            
            tiltFrameId = requestAnimationFrame(() => {
                // Calculate relative coordinate from card center (-0.5 to 0.5)
                const xc = (x - rect.width / 2) / (rect.width / 2);
                const yc = (y - rect.height / 2) / (rect.height / 2);
                
                // Rotate card: max 12 degrees
                const rotateX = -yc * 12;
                const rotateY = xc * 12;
                
                inner.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
                
                // Update shine gradient position
                if (shine) {
                    shine.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(0, 212, 255, 0.15) 0%, transparent 60%)`;
                }
            });
        });
        
        card.addEventListener("mouseleave", () => {
            if (tiltFrameId) {
                cancelAnimationFrame(tiltFrameId);
            }
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

    // --- Anti-Gravity Overdrive Mode & Cyber-HUD Panel ---
    const gravityToggle = document.querySelector(".gravity-toggle");
    let gravityAnimationId = null;
    const floatTargets = document.querySelectorAll(
        '.photo-frame, .about-card, .feature-box, .skill-card, .timeline-card, .portfolio-card, .contact-card, .contact-form-card'
    );

    let angle = 0;

    function driftLoop() {
        if (!isGravityOff) return;
        angle += 0.008; // Speed of drift

        floatTargets.forEach((target, index) => {
            // If user is currently hovering the element, pause drift so hover scaling/tilts take precedence
            if (target.matches(':hover')) return;

            // Unique offsets using card index to make the drift asynchronous and natural
            const speedX = 0.4 + (index % 5) * 0.15;
            const speedY = 0.5 + (index % 3) * 0.2;
            const ampX = 25 + (index % 4) * 8;   // horizontal float range (px)
            const ampY = 30 + (index % 3) * 10;  // vertical float range (px)
            const rotAmp = 4 + (index % 3) * 2;  // rotation float range (deg)

            const x = Math.sin(angle * speedX + index) * ampX;
            const y = Math.cos(angle * speedY + index) * ampY;
            const rot = Math.sin(angle * (speedX * 0.8) + index) * rotAmp;

            target.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${rot}deg)`;
        });

        gravityAnimationId = requestAnimationFrame(driftLoop);
    }

    function toggleZeroGravity(active) {
        isGravityOff = active;
        
        // Update quick toggle button state
        if (gravityToggle) {
            gravityToggle.classList.toggle("active", active);
            const toggleSpan = gravityToggle.querySelector("span");
            const toggleIcon = gravityToggle.querySelector("i");
            if (toggleSpan) toggleSpan.textContent = active ? "Zero-G On" : "Zero-G Off";
            if (toggleIcon) toggleIcon.className = active ? "fas fa-satellite-dish" : "fas fa-satellite";
        }

        // Update HUD checkbox state
        const hudGravityInput = document.getElementById("hud-gravity");
        if (hudGravityInput) {
            hudGravityInput.checked = active;
        }

        // Update body class
        document.body.classList.toggle("zero-g-active", active);

        if (active) {
            floatTargets.forEach(target => {
                target.classList.add("zero-g-target");
            });
            driftLoop();
            playUiClick(440, "sine", 0.12); // low synth pitch for turning ON
        } else {
            if (gravityAnimationId) {
                cancelAnimationFrame(gravityAnimationId);
            }
            floatTargets.forEach(target => {
                target.style.transform = "";
                setTimeout(() => {
                    target.classList.remove("zero-g-target");
                }, 500);
            });
            playUiClick(330, "sine", 0.08); // lower pitch for turning OFF
        }
    }

    // Attach listeners to quick gravity button
    if (gravityToggle) {
        gravityToggle.addEventListener("click", () => {
            toggleZeroGravity(!isGravityOff);
        });
    }

    // --- UI Sound Synthesizer (Web Audio API) ---
    let isSoundOn = false;
    let audioCtx = null;

    function playUiClick(freq = 800, type = "sine", duration = 0.05) {
        if (!isSoundOn) return;
        try {
            if (!audioCtx) {
                audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            }
            if (audioCtx.state === 'suspended') {
                audioCtx.resume();
            }
            const osc = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();
            
            osc.type = type;
            osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
            
            gainNode.gain.setValueAtTime(0.03, audioCtx.currentTime); // Keep sound soft
            gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
            
            osc.connect(gainNode);
            gainNode.connect(audioCtx.destination);
            
            osc.start();
            osc.stop(audioCtx.currentTime + duration);
        } catch (e) {
            console.log("AudioContext blocked or unsupported", e);
        }
    }

    // Hook hover click sounds to UI elements
    function attachSoundHooks() {
        const hoverables = document.querySelectorAll(
            '.nav-link, .nav-cta, .btn, .skill-card, .portfolio-btn, .social-btn, .theme-btn, .hud-toggle, .hud-close, .hud-switch, .footer-links a, .footer-contact-details a, .footer-social-btn'
        );

        hoverables.forEach(el => {
            el.addEventListener('mouseenter', () => {
                playUiClick(1200, 'sine', 0.015); // soft quick chirp
            });
            el.addEventListener('click', () => {
                playUiClick(700, 'sine', 0.06); // mid beep
            });
        });
    }

    // --- HUD Panel Interactions ---
    const hudToggle = document.querySelector(".hud-toggle");
    const hudPanel = document.querySelector(".hud-panel");
    const hudClose = document.querySelector(".hud-close");

    if (hudToggle && hudPanel) {
        hudToggle.addEventListener("click", () => {
            const isOpen = hudPanel.classList.toggle("active");
            hudToggle.classList.toggle("active", isOpen);
            playUiClick(isOpen ? 850 : 650, "sine", 0.05);
        });

        if (hudClose) {
            hudClose.addEventListener("click", () => {
                hudPanel.classList.remove("active");
                hudToggle.classList.remove("active");
                playUiClick(650, "sine", 0.05);
            });
        }
    }

    // Atmospheric switches
    const particleSwitch = document.getElementById("hud-particles");
    const particlesCanvas = document.getElementById("canvas-particles");
    if (particleSwitch && particlesCanvas) {
        particleSwitch.addEventListener("change", (e) => {
            particlesCanvas.style.display = e.target.checked ? "block" : "none";
            playUiClick(e.target.checked ? 850 : 550, "sine", 0.04);
        });
    }

    const soundSwitch = document.getElementById("hud-sound");
    if (soundSwitch) {
        soundSwitch.addEventListener("change", (e) => {
            isSoundOn = e.target.checked;
            if (isSoundOn) {
                if (!audioCtx) {
                    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
                }
                playUiClick(950, "sine", 0.08);
                // Attach hooks first time sound is turned ON
                attachSoundHooks();
            }
        });
    }

    const gravitySwitch = document.getElementById("hud-gravity");
    if (gravitySwitch) {
        gravitySwitch.addEventListener("change", (e) => {
            toggleZeroGravity(e.target.checked);
        });
    }

    // Theme Accent Switcher
    const themeBtns = document.querySelectorAll(".theme-btn");
    const themeColors = {
        cyan: {
            primary: "#00d4ff",
            secondary: "#0088ff",
            glow: "rgba(0, 212, 255, 0.4)"
        },
        pink: {
            primary: "#ff007f",
            secondary: "#ff00ff",
            glow: "rgba(255, 0, 127, 0.4)"
        },
        green: {
            primary: "#39ff14",
            secondary: "#00ff66",
            glow: "rgba(57, 255, 20, 0.4)"
        },
        gold: {
            primary: "#ff9f00",
            secondary: "#ff5500",
            glow: "rgba(255, 159, 0, 0.4)"
        }
    };

    themeBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            themeBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            
            const themeName = btn.getAttribute("data-theme");
            const colors = themeColors[themeName];
            if (colors) {
                document.documentElement.style.setProperty('--accent-cyan', colors.primary);
                document.documentElement.style.setProperty('--accent-blue', colors.secondary);
                document.documentElement.style.setProperty('--accent-glow', colors.glow);
                
                const freqs = { cyan: 900, pink: 1050, green: 800, gold: 950 };
                playUiClick(freqs[themeName] || 900, "sine", 0.12);
            }
        });
    });

    // --- Biometric Identity Scanner (Holographic Boot Loader) ---
    const bootLoader = document.getElementById("boot-loader");
    const scanner = document.querySelector(".scanner-container");
    const progressFill = document.querySelector(".scanner-progress-fill");
    const statusText = document.querySelector(".scanner-status");

    let isScanning = false;
    let scanProgress = 0;
    let scanInterval = null;

    // Check if session has already authorized access
    if (sessionStorage.getItem("krishan_booted") === "true") {
        if (bootLoader) bootLoader.style.display = "none";
    }

    if (bootLoader && scanner) {
        function startScan() {
            if (isScanning) return;
            isScanning = true;
            scanner.classList.add("scanning");
            statusText.textContent = "SCANNING BIOMETRIC DATA... KEEP HOLDING";
            statusText.classList.remove("granted");

            scanInterval = setInterval(() => {
                scanProgress += 2.5; // Reaches 100% in 40 steps (2 seconds)
                if (progressFill) progressFill.style.width = `${scanProgress}%`;
                
                // Play scanning click sound that rises in pitch
                playUiClick(300 + scanProgress * 5, "sine", 0.03);

                if (scanProgress >= 100) {
                    completeScan();
                }
            }, 50);
        }

        function cancelScan() {
            if (!isScanning) return;
            clearInterval(scanInterval);
            isScanning = false;
            scanner.classList.remove("scanning");
            scanProgress = 0;
            if (progressFill) progressFill.style.width = "0%";
            statusText.textContent = "SCAN INTERRUPTED. HOLD TO AUTHORIZE";
            
            // Play error synth beep
            playUiClick(150, "sawtooth", 0.25);
        }

        function completeScan() {
            clearInterval(scanInterval);
            isScanning = false;
            scanner.classList.remove("scanning");
            statusText.textContent = "ACCESS GRANTED. AUTHORIZING PROTOCOLS...";
            statusText.classList.add("granted");

            // Play successful access chord sequence
            setTimeout(() => { playUiClick(520, "sine", 0.1); }, 0);
            setTimeout(() => { playUiClick(650, "sine", 0.1); }, 80);
            setTimeout(() => { playUiClick(850, "sine", 0.15); }, 160);

            sessionStorage.setItem("krishan_booted", "true");

            // Fade out overlay screen smoothly
            setTimeout(() => {
                bootLoader.classList.add("fade-out");
                setTimeout(() => {
                    bootLoader.style.display = "none";
                }, 800);
            }, 600);
        }

        scanner.addEventListener("mousedown", (e) => {
            if (!audioCtx) {
                audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            }
            startScan();
        });
        scanner.addEventListener("mouseup", cancelScan);
        scanner.addEventListener("mouseleave", cancelScan);

        // Touch event support for mobile
        scanner.addEventListener("touchstart", (e) => {
            e.preventDefault();
            if (!audioCtx) {
                audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            }
            startScan();
        });
        scanner.addEventListener("touchend", cancelScan);
        scanner.addEventListener("touchcancel", cancelScan);
    }

    // --- Skill Orbits Detail Switcher ---
    const orbitNodes = document.querySelectorAll(".orbit-node, .orbit-center");
    const detailPlaceholder = document.querySelector(".skill-details-placeholder");
    const detailContents = document.querySelectorAll(".skill-details-content");

    orbitNodes.forEach(node => {
        node.addEventListener("mouseenter", () => {
            if (detailPlaceholder) detailPlaceholder.style.display = "none";
            
            detailContents.forEach(content => {
                content.classList.remove("active");
            });

            const skillName = node.getAttribute("data-skill");
            const targetContent = document.getElementById(`skill-${skillName}`);
            
            if (targetContent) {
                targetContent.classList.add("active");
                
                const barFill = targetContent.querySelector(".skill-bar-fill");
                if (barFill) {
                    const percent = barFill.getAttribute("data-percent");
                    // Trigger CSS width transition smoothly
                    setTimeout(() => {
                        barFill.style.width = percent;
                    }, 50);
                }
                
                playUiClick(1000, "sine", 0.04);
            }
        });
    });
});
