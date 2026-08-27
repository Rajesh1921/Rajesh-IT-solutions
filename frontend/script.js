document.addEventListener('DOMContentLoaded', () => {
    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.2
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in').forEach(el => {
        observer.observe(el);
    });

    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Smooth scroll for all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const target = document.querySelector(targetId);
            if (target) {
                const headerOffset = 100;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });

    // Stagger card entrance
    const cards = document.querySelectorAll('.expertise-grid .expertise-card, .managed-grid .managed-card, .cert-grid .cert-card');
    cards.forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.1}s`;
    });

    // Mobile menu toggle
    const mobileMenu = document.getElementById('mobile-menu');
    const navLinks = document.querySelector('.nav-links');
    const navLinksItems = document.querySelectorAll('.nav-links a');

    if (mobileMenu) {
        mobileMenu.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = mobileMenu.querySelector('i');
            if(navLinks.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-xmark');
            } else {
                icon.classList.remove('fa-xmark');
                icon.classList.add('fa-bars');
            }
        });
    }

    if (navLinksItems) {
        navLinksItems.forEach(item => {
            item.addEventListener('click', () => {
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    const icon = mobileMenu.querySelector('i');
                    icon.classList.remove('fa-xmark');
                    icon.classList.add('fa-bars');
                }
            });
        });
    }

    // Contact Form AJAX Submission
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const nameInput = contactForm.querySelector('input[name="name"]');
            const emailInput = contactForm.querySelector('input[name="email"]');
            const messageInput = contactForm.querySelector('textarea[name="message"]');
            const submitBtn = contactForm.querySelector('.btn-submit');
            const originalBtnHtml = submitBtn.innerHTML;

            // Form Data
            const formData = {
                name: nameInput.value.trim(),
                email: emailInput.value.trim(),
                message: messageInput.value.trim()
            };

            // Loading state
            submitBtn.disabled = true;
            submitBtn.innerHTML = 'Sending... <i class="fa-solid fa-spinner fa-spin"></i>';

            try {
                const response = await fetch('/api/contact', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });

                const result = await response.json();

                if (response.ok) {
                    // Success! Show Toast
                    showToast(result.message || 'Message sent successfully!', 'success');
                    contactForm.reset();
                } else {
                    // Error returned from server
                    showToast(result.error || 'Something went wrong.', 'error');
                }
            } catch (err) {
                console.error("Fetch error:", err);
                showToast('Failed to connect to server. Please try again.', 'error');
            } finally {
                // Restore button
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnHtml;
            }
        });
    }

    // Simple toast notification function
    function showToast(message, type) {
        let container = document.querySelector('.toast-container');
        if (!container) {
            container = document.createElement('div');
            container.className = 'toast-container';
            document.body.appendChild(container);
        }

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const icon = type === 'success' ? 'fa-circle-check' : 'fa-circle-exclamation';
        toast.innerHTML = `
            <i class="fa-solid ${icon}"></i>
            <span>${message}</span>
        `;

        container.appendChild(toast);

        // Slide in
        setTimeout(() => toast.classList.add('show'), 10);

        // Slide out and remove
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 400);
        }, 4000);
    }
});


    // FAQ Accordion Toggle
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const item = question.parentNode;
            const answer = item.querySelector('.faq-answer');
            const isActive = item.classList.contains('active');

            // Close all other FAQ items for a clean single-open accordion feel
            document.querySelectorAll('.faq-item').forEach(i => {
                i.classList.remove('active');
                i.querySelector('.faq-answer').style.maxHeight = null;
            });

            if (!isActive) {
                item.classList.add('active');
                answer.style.maxHeight = answer.scrollHeight + "px";
            }
        });
    });

    // Consultation Form AJAX Submission (Homepage & contact page)
    const consultationForm = document.getElementById('consultationForm');
    if (consultationForm) {
        consultationForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const nameInput = document.getElementById('fullName');
            const emailInput = document.getElementById('businessEmail');
            const phoneInput = document.getElementById('phoneNumber');
            const serviceSelect = document.getElementById('serviceRequired');
            const messageInput = document.getElementById('projectScope');
            const submitBtn = document.getElementById('submitBtn');
            const originalBtnHtml = submitBtn.innerHTML;

            const phoneVal = phoneInput ? phoneInput.value.trim() : '';
            const serviceVal = serviceSelect ? serviceSelect.value : '';

            // Form Data (Concatenate extra fields into message for backend compatibility)
            const formData = {
                name: nameInput.value.trim(),
                email: emailInput.value.trim(),
                message: `[Phone: ${phoneVal}] [Service: ${serviceVal}] ${messageInput.value.trim()}`
            };

            // Loading state
            submitBtn.disabled = true;
            submitBtn.innerHTML = 'Sending... <i class="fa-solid fa-spinner fa-spin"></i>';

            try {
                const response = await fetch('/api/contact', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });

                const result = await response.json();

                if (response.ok) {
                    showToast(result.message || 'Message sent successfully!', 'success');
                    consultationForm.reset();
                } else {
                    showToast(result.error || 'Something went wrong.', 'error');
                }
            } catch (err) {
                console.error("Fetch error:", err);
                showToast('Failed to connect to server. Please try again.', 'error');
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnHtml;
            }
        });
    }

    // Simulated Terminal diagnostics loop
    const logs = [
        "Initializing secure gateway...",
        "Resolving domain mappings...",
        "Entra ID sync: 204 objects matching [OK]",
        "Loading Conditional Access settings...",
        "VNet peering connected successfully.",
        "Security Baseline audit: 100% PASS",
        "Sophos VPN status: tunnel active",
        "Backup job status: completed successfully",
        "Orchestrating Azure Virtual Desktop host pool..."
    ];

    const terminalBody = document.getElementById('terminalLogs');
    if (terminalBody) {
        setInterval(() => {
            const randomLog = logs[Math.floor(Math.random() * logs.length)];
            const div = document.createElement('div');
            div.textContent = `> [MONITOR] ${randomLog}`;
            terminalBody.appendChild(div);
            if (terminalBody.children.length > 5) {
                terminalBody.children[0].remove();
            }
        }, 3000);
    }
