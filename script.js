/**
 * hyped.today - Coming Soon Page
 * Interactive functionality
 */

// ========================================
// Countdown Timer
// ========================================
function initCountdown() {
    // Set launch date (30 days from now)
    const launchDate = new Date();
    launchDate.setDate(launchDate.getDate() + 30);
    launchDate.setHours(0, 0, 0, 0);
    
    function updateCountdown() {
        const now = new Date().getTime();
        const distance = launchDate - now;
        
        if (distance < 0) {
            // Launch time!
            document.getElementById('days').textContent = '00';
            document.getElementById('hours').textContent = '00';
            document.getElementById('minutes').textContent = '00';
            document.getElementById('seconds').textContent = '00';
            return;
        }
        
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        document.getElementById('days').textContent = String(days).padStart(2, '0');
        document.getElementById('hours').textContent = String(hours).padStart(2, '0');
        document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
        document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
    }
    
    updateCountdown();
    setInterval(updateCountdown, 1000);
}

// ========================================
// Email Signup Form
// ========================================
function initSignupForm() {
    const form = document.getElementById('signupForm');
    const emailInput = document.getElementById('email');
    const successMessage = document.getElementById('successMessage');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = emailInput.value.trim();
        
        if (!email || !isValidEmail(email)) {
            showNotification('Lütfen geçerli bir email adresi gir!');
            emailInput.focus();
            return;
        }
        
        // Simulate API call
        const submitBtn = form.querySelector('.submit-btn');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span class="btn-text">GÖNDERİLİYOR...</span>';
        submitBtn.disabled = true;
        
        setTimeout(() => {
            // Store email (in real app, send to backend)
            storeEmail(email);
            
            // Show success
            form.style.display = 'none';
            successMessage.classList.add('active');
            
            // Increment counter
            incrementMemberCount();
            
            showNotification('Başarıyla kaydoldun! 🎉');
        }, 1500);
    });
    
    // Real-time validation feedback
    emailInput.addEventListener('input', function() {
        if (this.value && !isValidEmail(this.value)) {
            this.style.borderColor = '#FF3366';
        } else {
            this.style.borderColor = '';
        }
    });
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function storeEmail(email) {
    // Get existing emails or initialize array
    let emails = JSON.parse(localStorage.getItem('hypedEmails') || '[]');
    
    // Check if email already exists
    if (!emails.includes(email)) {
        emails.push({
            email: email,
            date: new Date().toISOString()
        });
        localStorage.setItem('hypedEmails', JSON.stringify(emails));
    }
}

// ========================================
// Member Counter Animation
// ========================================
function initMemberCounter() {
    const counter = document.getElementById('memberCount');
    
    // Get stored count or start with base number
    const storedEmails = JSON.parse(localStorage.getItem('hypedEmails') || '[]');
    const baseCount = 247; // Starting number for display
    const totalCount = baseCount + storedEmails.length;
    
    animateCounter(counter, 0, totalCount, 2000);
}

function incrementMemberCount() {
    const counter = document.getElementById('memberCount');
    const current = parseInt(counter.textContent) || 0;
    animateCounter(counter, current, current + 1, 500);
}

function animateCounter(element, start, end, duration) {
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const current = Math.floor(start + (end - start) * easeOutQuart);
        
        element.textContent = current.toLocaleString('tr-TR');
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    requestAnimationFrame(update);
}

// ========================================
// Notification System
// ========================================
function showNotification(message) {
    const notification = document.getElementById('notification');
    const notificationText = document.getElementById('notificationText');
    
    notificationText.textContent = message;
    notification.classList.add('active');
    
    // Hide after 3 seconds
    setTimeout(() => {
        notification.classList.remove('active');
    }, 3000);
}

// ========================================
// Scroll Animations
// ========================================
function initScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe sections
    const sections = document.querySelectorAll('.feature-card, .stat-card, .community-card, .signup-card');
    sections.forEach((section, index) => {
        section.style.opacity = '0';
        section.style.animationDelay = `${index * 0.1}s`;
        observer.observe(section);
    });
}

// ========================================
// Parallax Effect for Floating Shapes
// ========================================
function initParallax() {
    const shapes = document.querySelectorAll('.shape');
    let ticking = false;
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const scrollY = window.scrollY;
                
                shapes.forEach((shape, index) => {
                    const speed = 0.1 + (index * 0.05);
                    const yPos = scrollY * speed;
                    shape.style.transform = `translateY(${yPos}px)`;
                });
                
                ticking = false;
            });
            
            ticking = true;
        }
    });
}

// ========================================
// Easter Egg - Konami Code
// ========================================
function initEasterEgg() {
    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let konamiIndex = 0;
    
    document.addEventListener('keydown', (e) => {
        if (e.key === konamiCode[konamiIndex]) {
            konamiIndex++;
            
            if (konamiIndex === konamiCode.length) {
                activateHypeMode();
                konamiIndex = 0;
            }
        } else {
            konamiIndex = 0;
        }
    });
}

function activateHypeMode() {
    document.body.style.filter = 'hue-rotate(180deg)';
    showNotification('🎮 HYPE MODE ACTIVATED! 🎮');
    
    // Add disco effect
    const colors = ['#FFD700', '#FF3366', '#00D9FF', '#7B2D8E', '#00FF88'];
    let colorIndex = 0;
    
    const interval = setInterval(() => {
        document.documentElement.style.setProperty('--color-primary', colors[colorIndex]);
        colorIndex = (colorIndex + 1) % colors.length;
    }, 500);
    
    // Reset after 5 seconds
    setTimeout(() => {
        clearInterval(interval);
        document.body.style.filter = '';
        document.documentElement.style.setProperty('--color-primary', '#FFD700');
        showNotification('Hype mode deactivated 😎');
    }, 5000);
}

// ========================================
// Confetti Effect (for form submission)
// ========================================
function createConfetti() {
    const colors = ['#FFD700', '#FF3366', '#00D9FF', '#000000'];
    const confettiCount = 50;
    
    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.style.cssText = `
            position: fixed;
            width: 10px;
            height: 10px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            left: 50%;
            top: 50%;
            z-index: 9999;
            pointer-events: none;
        `;
        
        document.body.appendChild(confetti);
        
        // Animate
        const angle = (Math.PI * 2 * i) / confettiCount;
        const velocity = 5 + Math.random() * 10;
        const vx = Math.cos(angle) * velocity;
        const vy = Math.sin(angle) * velocity - 10;
        
        let x = 0;
        let y = 0;
        let opacity = 1;
        
        const animate = () => {
            x += vx;
            y += vy + 0.5; // gravity
            opacity -= 0.02;
            
            confetti.style.transform = `translate(${x}px, ${y}px) rotate(${x * 2}deg)`;
            confetti.style.opacity = opacity;
            
            if (opacity > 0) {
                requestAnimationFrame(animate);
            } else {
                confetti.remove();
            }
        };
        
        requestAnimationFrame(animate);
    }
}

// Modify form submission to include confetti
const originalStoreEmail = storeEmail;
storeEmail = function(email) {
    originalStoreEmail(email);
    createConfetti();
};

// ========================================
// Initialize Everything
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    initCountdown();
    initSignupForm();
    initMemberCounter();
    initScrollAnimations();
    initParallax();
    initEasterEgg();
    
    // Console easter egg
    console.log('%c🔥 hyped.today 🔥', 'font-size: 24px; font-weight: bold; color: #FFD700;');
    console.log('%cSupport to Promote. Promote to Support.', 'font-size: 14px; color: #666;');
    console.log('%cTry the Konami code! ↑↑↓↓←→←→BA', 'font-size: 12px; color: #999;');
});

// Handle visibility change (pause animations when tab is hidden)
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        document.body.classList.add('paused');
    } else {
        document.body.classList.remove('paused');
    }
});
