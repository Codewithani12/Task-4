/* ============================================================================
   PORTFOLIO JAVASCRIPT - Interactive Features
   ============================================================================ */

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    setupScrollProgressBar();
    setupTypingAnimation();
    setupNavigation();
    setupSmoothScrolling();
    setupScrollReveal();
    setupFormValidation();
});

/* ============================================================================
   DARK MODE / LIGHT MODE TOGGLE
   ============================================================================ */
function initTheme() {
    const themeToggle = document.getElementById('themeToggle');
    const htmlElement = document.documentElement;
    
    // Check for saved theme preference or default to dark mode
    const savedTheme = localStorage.getItem('theme') || 'dark-mode';
    document.body.classList.add(savedTheme);
    updateThemeIcon(savedTheme);
    
    themeToggle.addEventListener('click', () => {
        const isDarkMode = document.body.classList.contains('dark-mode');
        
        if (isDarkMode) {
            document.body.classList.remove('dark-mode');
            document.body.classList.add('light-mode');
            localStorage.setItem('theme', 'light-mode');
            updateThemeIcon('light-mode');
        } else {
            document.body.classList.remove('light-mode');
            document.body.classList.add('dark-mode');
            localStorage.setItem('theme', 'dark-mode');
            updateThemeIcon('dark-mode');
        }
    });
}

function updateThemeIcon(theme) {
    const icon = document.querySelector('.theme-toggle i');
    if (theme === 'dark-mode') {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
    } else {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    }
}

/* ============================================================================
   SCROLL PROGRESS BAR
   ============================================================================ */
function setupScrollProgressBar() {
    const scrollProgress = document.querySelector('.scroll-progress');
    
    window.addEventListener('scroll', () => {
        const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = (window.scrollY / windowHeight) * 100;
        scrollProgress.style.width = scrolled + '%';
    });
}

/* ============================================================================
   TYPING ANIMATION
   ============================================================================ */
function setupTypingAnimation() {
    const typingText = document.querySelector('.typing-text');
    const words = ['Developer', 'Designer', 'Creator', 'Engineer', 'Innovator'];
    let wordIndex = 0;
    let letterIndex = 0;
    let isDeleting = false;
    const typingSpeed = 100;
    const deletingSpeed = 50;
    const delayBetweenWords = 2000;
    
    function typeWord() {
        const currentWord = words[wordIndex];
        
        if (!isDeleting) {
            // Typing
            if (letterIndex < currentWord.length) {
                typingText.textContent += currentWord.charAt(letterIndex);
                letterIndex++;
                setTimeout(typeWord, typingSpeed);
            } else {
                // Word complete, pause then start deleting
                setTimeout(() => {
                    isDeleting = true;
                    typeWord();
                }, delayBetweenWords);
            }
        } else {
            // Deleting
            if (letterIndex > 0) {
                typingText.textContent = currentWord.substring(0, letterIndex - 1);
                letterIndex--;
                setTimeout(typeWord, deletingSpeed);
            } else {
                // Word deleted, move to next word
                isDeleting = false;
                wordIndex = (wordIndex + 1) % words.length;
                setTimeout(typeWord, 500);
            }
        }
    }
    
    typeWord();
}

/* ============================================================================
   NAVIGATION - Hamburger Menu & Sticky Navbar
   ============================================================================ */
function setupNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const navbar = document.querySelector('.navbar');
    
    // Hamburger menu toggle
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    
    // Close menu when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
    
    // Sticky navbar on scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

/* ============================================================================
   SMOOTH SCROLLING
   ============================================================================ */
function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const navHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetElement.offsetTop - navHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/* ============================================================================
   SCROLL REVEAL ANIMATIONS
   ============================================================================ */
function setupScrollReveal() {
    // Add scroll-reveal class to elements
    const elementsToReveal = document.querySelectorAll(
        '.about-content, .skill-card, .project-card, .timeline-item, .info-card'
    );
    
    elementsToReveal.forEach(element => {
        element.classList.add('scroll-reveal');
    });
    
    // Intersection Observer for scroll reveal
    const revealOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const revealOnScroll = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                revealOnScroll.unobserve(entry.target);
            }
        });
    }, revealOptions);
    
    elementsToReveal.forEach(element => {
        revealOnScroll.observe(element);
    });
}

/* ============================================================================
   FORM VALIDATION & SUBMISSION
   ============================================================================ */
function setupFormValidation() {
    const contactForm = document.getElementById('contactForm');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');
    const formMessage = document.getElementById('formMessage');
    
    // Real-time validation
    nameInput.addEventListener('blur', () => validateName());
    emailInput.addEventListener('blur', () => validateEmail());
    messageInput.addEventListener('blur', () => validateMessage());
    
    // Form submission
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Validate all fields
        const isNameValid = validateName();
        const isEmailValid = validateEmail();
        const isMessageValid = validateMessage();
        
        if (isNameValid && isEmailValid && isMessageValid) {
            // Show success message
            formMessage.textContent = 'Message sent successfully! Thank you for reaching out!';
            formMessage.classList.add('success');
            formMessage.classList.remove('error');
            
            // Reset form
            setTimeout(() => {
                contactForm.reset();
                formMessage.classList.remove('success');
                formMessage.textContent = '';
                clearAllErrors();
            }, 3000);
        } else {
            // Show error message
            formMessage.textContent = 'Please fix the errors above.';
            formMessage.classList.add('error');
            formMessage.classList.remove('success');
        }
    });
    
    function validateName() {
        const nameError = document.getElementById('nameError');
        const name = nameInput.value.trim();
        
        if (!name) {
            nameError.textContent = 'Name is required';
            nameError.classList.add('show');
            return false;
        } else if (name.length < 2) {
            nameError.textContent = 'Name must be at least 2 characters';
            nameError.classList.add('show');
            return false;
        } else {
            nameError.classList.remove('show');
            return true;
        }
    }
    
    function validateEmail() {
        const emailError = document.getElementById('emailError');
        const email = emailInput.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!email) {
            emailError.textContent = 'Email is required';
            emailError.classList.add('show');
            return false;
        } else if (!emailRegex.test(email)) {
            emailError.textContent = 'Please enter a valid email';
            emailError.classList.add('show');
            return false;
        } else {
            emailError.classList.remove('show');
            return true;
        }
    }
    
    function validateMessage() {
        const messageError = document.getElementById('messageError');
        const message = messageInput.value.trim();
        
        if (!message) {
            messageError.textContent = 'Message is required';
            messageError.classList.add('show');
            return false;
        } else if (message.length < 10) {
            messageError.textContent = 'Message must be at least 10 characters';
            messageError.classList.add('show');
            return false;
        } else {
            messageError.classList.remove('show');
            return true;
        }
    }
    
    function clearAllErrors() {
        document.getElementById('nameError').classList.remove('show');
        document.getElementById('emailError').classList.remove('show');
        document.getElementById('messageError').classList.remove('show');
    }
}

/* ============================================================================
   ADDITIONAL UTILITIES
   ============================================================================ */

// Smooth scroll behavior for the landing page
document.addEventListener('wheel', (e) => {
    // This is handled by CSS scroll-behavior: smooth
}, { passive: true });

// Add keyboard navigation
document.addEventListener('keydown', (e) => {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    // Close menu with ESC key
    if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }
});

// Prevent body scroll when mobile menu is open
const navMenu = document.querySelector('.nav-menu');
const htmlElement = document.documentElement;

const observer = new MutationObserver(() => {
    if (navMenu.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = 'auto';
    }
});

observer.observe(navMenu, { attributes: true, attributeFilter: ['class'] });

// Add animation on button hover
const buttons = document.querySelectorAll('.btn');
buttons.forEach(button => {
    button.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-2px)';
    });
    
    button.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
});

// Lazy load images when they come into view
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.style.opacity = '0';
                img.onload = () => {
                    img.style.transition = 'opacity 0.3s ease-in';
                    img.style.opacity = '1';
                };
                observer.unobserve(img);
            }
        });
    });
    
    document.querySelectorAll('img').forEach(img => imageObserver.observe(img));
}

// Counter animation for skills
function animateProgressBars() {
    const progressBars = document.querySelectorAll('.progress');
    
    progressBars.forEach(bar => {
        const rect = bar.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            const width = bar.style.width;
            bar.style.width = '0%';
            setTimeout(() => {
                bar.style.width = width;
            }, 100);
        }
    });
}

// Initialize on page load and on scroll
window.addEventListener('load', animateProgressBars);
window.addEventListener('scroll', () => {
    animateProgressBars();
});

// Parallax effect for hero section (optional)
const heroSection = document.querySelector('.hero');
if (heroSection) {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        heroSection.style.transform = `translateY(${scrolled * 0.5}px)`;
    });
}

// Random background particles for visual appeal
function createParticles() {
    const starsContainer = document.querySelector('.stars');
    if (!starsContainer) return;
    
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: absolute;
            width: 2px;
            height: 2px;
            background: rgba(255, 255, 255, ${Math.random() * 0.5 + 0.2});
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            border-radius: 50%;
            pointer-events: none;
            animation: twinkle ${Math.random() * 3 + 2}s infinite;
        `;
        starsContainer.appendChild(particle);
    }
}

window.addEventListener('load', createParticles);

// Add scroll-to-top button functionality (optional)
function addScrollToTop() {
    const scrollTopBtn = document.createElement('button');
    scrollTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollTopBtn.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: linear-gradient(135deg, #6366f1 0%, #ec4899 100%);
        border: none;
        border-radius: 50%;
        color: white;
        font-size: 1.2rem;
        cursor: pointer;
        display: none;
        z-index: 99;
        transition: all 0.3s ease;
        box-shadow: 0 5px 15px rgba(99, 102, 241, 0.4);
    `;
    
    document.body.appendChild(scrollTopBtn);
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollTopBtn.style.display = 'flex';
            scrollTopBtn.style.alignItems = 'center';
            scrollTopBtn.style.justifyContent = 'center';
        } else {
            scrollTopBtn.style.display = 'none';
        }
    });
    
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    scrollTopBtn.addEventListener('mouseenter', () => {
        scrollTopBtn.style.transform = 'translateY(-5px)';
        scrollTopBtn.style.boxShadow = '0 8px 20px rgba(99, 102, 241, 0.6)';
    });
    
    scrollTopBtn.addEventListener('mouseleave', () => {
        scrollTopBtn.style.transform = 'translateY(0)';
        scrollTopBtn.style.boxShadow = '0 5px 15px rgba(99, 102, 241, 0.4)';
    });
}

window.addEventListener('load', addScrollToTop);

// Add some interactive effects to cards
function setupCardInteractions() {
    const cards = document.querySelectorAll('.skill-card, .project-card, .timeline-content, .info-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transition = 'all 0.3s ease';
            this.style.boxShadow = '0 20px 40px rgba(99, 102, 241, 0.2)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.boxShadow = '';
        });
    });
}

window.addEventListener('load', setupCardInteractions);

console.log('Portfolio initialized successfully!');
