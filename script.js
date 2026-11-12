// ============================================
// MAIN SCRIPT FILE - COMPLETE VERSION
// ============================================

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log("🚀 Script.js loaded successfully");
    
    // Initialize all functionality
    initializeAll();
});

// ============================================
// MAIN INITIALIZATION FUNCTION
// ============================================

function initializeAll() {
    console.log("🔄 Initializing all components...");
    
    // 1. Initialize mobile menu
    initializeMobileMenu();
    
    // 2. Initialize countdown timer
    initializeCountdownTimer();
    
    // 3. Initialize smooth scrolling
    initializeSmoothScrolling();
    
    // 4. Initialize scroll animations
    initializeScrollAnimations();
    
    // 5. Check current page and initialize specific functionality
    checkPageAndInitialize();
    
    console.log("✅ All components initialized");
}

// ============================================
// OPTIMIZED MOBILE MENU FUNCTIONALITY
// ============================================

function initializeMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const mainNav = document.querySelector('.main-nav ul');
    
    if (!menuToggle || !mainNav) return;
    
    let isMenuOpen = false;
    let resizeTimer;
    const mobileMenuOverlay = createMobileOverlay();
    
    // Toggle menu function
    function toggleMenu(forceClose = false) {
        if (forceClose && !isMenuOpen) return;
        
        isMenuOpen = forceClose ? false : !isMenuOpen;
        
        mainNav.classList.toggle('show', isMenuOpen);
        mobileMenuOverlay.classList.toggle('show', isMenuOpen);
        menuToggle.classList.toggle('active', isMenuOpen);
        document.body.style.overflow = isMenuOpen ? 'hidden' : '';
        menuToggle.setAttribute('aria-expanded', isMenuOpen);
    }
    
    function closeMenu() {
        if (isMenuOpen) toggleMenu(true);
    }
    
    function checkScreenWidth() {
        const isMobile = window.innerWidth <= 768;
        menuToggle.style.display = isMobile ? 'flex' : 'none';
        if (!isMobile && isMenuOpen) closeMenu();
    }
    
    function setupEventListeners() {
        // Toggle menu on click
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMenu();
        }, { passive: true });
        
        // Close on overlay click
        mobileMenuOverlay.addEventListener('click', closeMenu, { passive: true });
        
        // Close on outside click
        document.addEventListener('click', (e) => {
            if (isMenuOpen && 
                !menuToggle.contains(e.target) && 
                !mainNav.contains(e.target)) {
                closeMenu();
            }
        }, { passive: true });
        
        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && isMenuOpen) closeMenu();
        }, { passive: true });
        
        // Close on nav link click
        mainNav.addEventListener('click', (e) => {
            if (isMenuOpen && e.target.tagName === 'A') {
                requestAnimationFrame(() => setTimeout(closeMenu, 50));
            }
        }, { passive: true });
        
        // Handle resize
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(checkScreenWidth, 150);
        }, { passive: true });
    }
    
    function createMobileOverlay() {
        let overlay = document.getElementById('mobileMenuOverlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'mobileMenuOverlay';
            overlay.className = 'mobile-menu-overlay';
            document.body.appendChild(overlay);
        }
        return overlay;
    }
    
    // Initialize
    menuToggle.setAttribute('aria-label', 'Toggle menu');
    menuToggle.setAttribute('aria-expanded', 'false');
    checkScreenWidth();
    setupEventListeners();
    
    return closeMenu;
}

// Initialize with debounce
let menuInitialized = false;
function initMobileMenu() {
    if (menuInitialized) return;
    
    setTimeout(() => {
        initializeMobileMenu();
        menuInitialized = true;
    }, 100);
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMobileMenu);
} else {
    initMobileMenu();
}

// ============================================
// LIGHTWEIGHT SMOOTH SCROLL
// ============================================

function initSmoothScroll() {
    // Check for reduce motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;
    
    let isScrolling = false;
    let scrollFrame;
    
    // Handle anchor clicks
    document.addEventListener('click', function(e) {
        const anchor = e.target.closest('a[href^="#"]');
        if (!anchor || anchor.hash === '#') return;
        
        const target = document.querySelector(anchor.hash);
        if (!target) return;
        
        e.preventDefault();
        smoothScrollTo(target);
    }, { passive: false });
    
    function smoothScrollTo(element) {
        if (isScrolling) return;
        isScrolling = true;
        
        const header = document.querySelector('.main-header');
        const headerHeight = header ? header.offsetHeight : 0;
        const start = window.pageYOffset;
        const target = element.getBoundingClientRect().top + start - headerHeight - 20;
        const distance = target - start;
        const duration = Math.min(800, Math.abs(distance) * 1.2);
        let startTime = null;
        
        // Cancel any existing animation
        if (scrollFrame) cancelAnimationFrame(scrollFrame);
        
        function animate(currentTime) {
            if (!startTime) startTime = currentTime;
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Ease in-out cubic
            const ease = progress < 0.5 
                ? 4 * progress * progress * progress 
                : 1 - Math.pow(-2 * progress + 2, 3) / 2;
            
            window.scrollTo(0, start + (distance * ease));
            
            if (progress < 1) {
                scrollFrame = requestAnimationFrame(animate);
            } else {
                isScrolling = false;
                scrollFrame = null;
            }
        }
        
        scrollFrame = requestAnimationFrame(animate);
    }
    
    // Optimize scroll performance
    let scrollTimer;
    window.addEventListener('scroll', () => {
        clearTimeout(scrollTimer);
        scrollTimer = setTimeout(updateHeaderShadow, 10);
    }, { passive: true });
    
    function updateHeaderShadow() {
        const header = document.querySelector('.main-header');
        if (header) {
            header.classList.toggle('scrolled', window.scrollY > 10);
        }
    }
}

// Initialize smooth scroll
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSmoothScroll);
} else {
    initSmoothScroll();
}

// ============================================
// PERFORMANCE OPTIMIZATIONS
// ============================================

function applyPerformanceOptimizations() {
    // Apply will-change to critical elements
    const criticalElements = ['.main-header', '.mobile-menu-overlay'];
    criticalElements.forEach(selector => {
        const element = document.querySelector(selector);
        if (element) {
            element.style.transform = 'translateZ(0)';
        }
    });
    
    // Optimize images if needed
    const images = document.querySelectorAll('img[loading="lazy"]');
    if ('loading' in HTMLImageElement.prototype) {
        images.forEach(img => {
            if (img.dataset.src) {
                img.src = img.dataset.src;
            }
        });
    }
    
    // Optimize animations for reduced motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) {
        document.documentElement.classList.add('reduce-motion');
    }
}

// Apply optimizations after load
window.addEventListener('load', applyPerformanceOptimizations, { once: true });

// ============================================
// FPS MONITOR (Development only)
// ============================================

if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    let frameCount = 0;
    let lastTime = performance.now();
    
    function monitorFPS() {
        frameCount++;
        const currentTime = performance.now();
        
        if (currentTime > lastTime + 1000) {
            const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
            if (fps < 50) {
                console.log(`⚠️ FPS: ${fps} - Consider optimizing`);
            }
            frameCount = 0;
            lastTime = currentTime;
        }
        
        requestAnimationFrame(monitorFPS);
    }
    
    setTimeout(() => requestAnimationFrame(monitorFPS), 2000);
}
// ============================================
// 2. COUNTDOWN TIMER FUNCTIONALITY
// ============================================

function initializeCountdownTimer() {
    console.log("⏰ Initializing countdown timer...");
    
    const countdownElement = document.querySelector('.countdown-timer');
    if (!countdownElement) {
        console.log("⚠️ Countdown timer not found");
        return;
    }
    
    // Set the election date (20 Januari 2026)
    const countDownDate = new Date("November 14, 2026 23:59:59").getTime();
    
    // Update countdown every second
    const countdownInterval = setInterval(updateCountdown, 1000);
    
    // Initial update
    updateCountdown();
    
    function updateCountdown() {
        const now = new Date().getTime();
        const distance = countDownDate - now;
        
        // Time calculations
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        // Display elements
        const daysElement = document.getElementById('days');
        const hoursElement = document.getElementById('hours');
        const minutesElement = document.getElementById('minutes');
        const secondsElement = document.getElementById('seconds');
        
        // Update display
        if (daysElement) {
            daysElement.textContent = formatTime(days);
            daysElement.style.animation = 'pulse 1s ease';
            setTimeout(() => daysElement.style.animation = '', 1000);
        }
        
        if (hoursElement) {
            hoursElement.textContent = formatTime(hours);
            hoursElement.style.animation = 'pulse 1s ease';
            setTimeout(() => hoursElement.style.animation = '', 1000);
        }
        
        if (minutesElement) {
            minutesElement.textContent = formatTime(minutes);
            minutesElement.style.animation = 'pulse 1s ease';
            setTimeout(() => minutesElement.style.animation = '', 1000);
        }
        
        if (secondsElement) {
            secondsElement.textContent = formatTime(seconds);
            secondsElement.style.animation = 'pulse 1s ease';
            setTimeout(() => secondsElement.style.animation = '', 1000);
        }
        
        // If countdown is finished
        if (distance < 0) {
            clearInterval(countdownInterval);
            
            if (daysElement) daysElement.textContent = "00";
            if (hoursElement) hoursElement.textContent = "00";
            if (minutesElement) minutesElement.textContent = "00";
            if (secondsElement) secondsElement.textContent = "00";
            
            // Show election day message
            const countdownContainer = document.querySelector('.countdown-container');
            if (countdownContainer) {
                const finishedMessage = document.createElement('div');
                finishedMessage.className = 'countdown-finished';
                finishedMessage.innerHTML = `
                    <h3>🎉 PEMILIHAN DIMULAI!</h3>
                    <p>Selamat datang di Pemilu OSSIP 2026-2027</p>
                `;
                countdownContainer.appendChild(finishedMessage);
            }
        }
        
        // Add visual effects for last 24 hours
        if (distance < 24 * 60 * 60 * 1000) {
            countdownElement.classList.add('countdown-urgent');
        }
        
        // Add visual effects for last hour
        if (distance < 60 * 60 * 1000) {
            countdownElement.classList.add('countdown-critical');
        }
    }
    
    function formatTime(time) {
        return time.toString().padStart(2, '0');
    }
    
    console.log("✅ Countdown timer initialized");
    
    // Add CSS for countdown animations
    const countdownCSS = `
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); }
        }
        
        .countdown-urgent .countdown-number {
            color: #ff9800;
            font-weight: bold;
        }
        
        .countdown-critical .countdown-number {
            color: #f44336;
            font-weight: bold;
            animation: pulse 0.5s infinite;
        }
        
        .countdown-finished {
            text-align: center;
            padding: 20px;
            background: linear-gradient(135deg, #4CAF50, #2E7D32);
            color: white;
            border-radius: 10px;
            margin-top: 20px;
            animation: slideIn 0.5s ease;
        }
        
        .countdown-finished h3 {
            margin: 0 0 10px 0;
            font-size: 1.5em;
        }
        
        .countdown-finished p {
            margin: 0;
            opacity: 0.9;
        }
        
        @keyframes slideIn {
            from {
                opacity: 0;
                transform: translateY(-20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    
    addStyleToHead(countdownCSS);
}

// ============================================
// 3. SMOOTH SCROLLING FUNCTIONALITY
// ============================================

function initializeSmoothScrolling() {
    console.log("🔄 Initializing smooth scrolling...");
    
    // Select all anchor links with hash
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    if (anchorLinks.length === 0) {
        console.log("⚠️ No anchor links found");
        return;
    }
    
    anchorLinks.forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            // Skip if it's just "#"
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                e.preventDefault();
                
                // Get current scroll position
                const startPosition = window.pageYOffset;
                const targetPosition = targetElement.getBoundingClientRect().top + startPosition;
                const distance = targetPosition - startPosition;
                const duration = 800; // milliseconds
                let startTime = null;
                
                // Calculate header height for offset
                const headerHeight = document.querySelector('header')?.offsetHeight || 80;
                const offset = headerHeight + 20;
                
                // Animation function
                function animation(currentTime) {
                    if (startTime === null) startTime = currentTime;
                    const timeElapsed = currentTime - startTime;
                    const run = easeInOutQuad(timeElapsed, startPosition, distance, duration);
                    
                    window.scrollTo(0, run - offset);
                    
                    if (timeElapsed < duration) {
                        requestAnimationFrame(animation);
                    }
                }
                
                // Easing function
                function easeInOutQuad(t, b, c, d) {
                    t /= d / 2;
                    if (t < 1) return c / 2 * t * t + b;
                    t--;
                    return -c / 2 * (t * (t - 2) - 1) + b;
                }
                
                // Start animation
                requestAnimationFrame(animation);
                
                // Close mobile menu if open
                const mainNav = document.querySelector('.main-nav ul');
                if (mainNav && mainNav.classList.contains('show')) {
                    const menuToggle = document.getElementById('menuToggle');
                    if (menuToggle) menuToggle.click();
                }
                
                // Update URL hash without scrolling
                history.pushState(null, null, targetId);
                
                // Add active class to clicked link
                anchorLinks.forEach(link => link.classList.remove('active'));
                this.classList.add('active');
            }
        });
    });
    
    // Highlight active link on scroll
    window.addEventListener('scroll', function() {
        const scrollPosition = window.scrollY + 100;
        
        anchorLinks.forEach(link => {
            const targetId = link.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const targetTop = targetElement.offsetTop;
                const targetBottom = targetTop + targetElement.offsetHeight;
                
                if (scrollPosition >= targetTop && scrollPosition <= targetBottom) {
                    anchorLinks.forEach(l => l.classList.remove('active'));
                    link.classList.add('active');
                }
            }
        });
    });
    
    console.log("✅ Smooth scrolling initialized");
}

// ============================================
// 4. SCROLL ANIMATIONS FUNCTIONALITY
// ============================================

function initializeScrollAnimations() {
    console.log("🎭 Initializing scroll animations...");
    
    // Elements to animate on scroll
    const animatedElements = document.querySelectorAll('.animate-on-scroll, .kandidat-card, .timeline-item, .feature-card, .stat-item');
    
    if (animatedElements.length === 0) {
        console.log("⚠️ No elements to animate");
        return;
    }
    
    // Create Intersection Observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add animation class with delay based on index
                const index = Array.from(animatedElements).indexOf(entry.target);
                const delay = (index % 5) * 100; // Stagger animations
                
                setTimeout(() => {
                    entry.target.classList.add('animated');
                    
                    // Add specific animation based on element type
                    if (entry.target.classList.contains('kandidat-card')) {
                        entry.target.classList.add('fade-in-up');
                    }
                    if (entry.target.classList.contains('timeline-item')) {
                        entry.target.classList.add('slide-in-right');
                    }
                    if (entry.target.classList.contains('stat-item')) {
                        animateCounter(entry.target);
                    }
                }, delay);
                
                // Stop observing after animation
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    // Observe each element
    animatedElements.forEach(element => {
        observer.observe(element);
    });
    
    // Animate counter for statistics
    function animateCounter(element) {
        const counter = element.querySelector('.counter');
        if (!counter) return;
        
        const target = parseInt(counter.getAttribute('data-target') || counter.textContent);
        const duration = 2000; // 2 seconds
        const increment = target / (duration / 16); // 60fps
        
        let current = 0;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            counter.textContent = Math.floor(current).toLocaleString();
        }, 16);
    }
    
    console.log("✅ Scroll animations initialized");
    
    // Add CSS for animations
    const animationsCSS = `
        .animate-on-scroll {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }
        
        .animate-on-scroll.animated {
            opacity: 1;
            transform: translateY(0);
        }
        
        .kandidat-card {
            opacity: 0;
            transform: translateY(50px) scale(0.95);
            transition: all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        
        .kandidat-card.fade-in-up {
            opacity: 1;
            transform: translateY(0) scale(1);
        }
        
        .timeline-item {
            opacity: 0;
            transform: translateX(-50px);
            transition: all 0.6s ease;
        }
        
        .timeline-item.slide-in-right {
            opacity: 1;
            transform: translateX(0);
        }
        
        .feature-card {
            opacity: 0;
            transform: scale(0.8);
            transition: all 0.5s ease;
        }
        
        .feature-card.animated {
            opacity: 1;
            transform: scale(1);
        }
        
        .stat-item .counter {
            font-size: 2.5em;
            font-weight: bold;
            color: #2c3e50;
            transition: all 0.3s ease;
        }
        
        @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
        }
        
        .floating {
            animation: float 3s ease-in-out infinite;
        }
    `;
    
    addStyleToHead(animationsCSS);
}

// ============================================
// 5. PAGE-SPECIFIC FUNCTIONALITY
// ============================================

function checkPageAndInitialize() {
    const currentPage = window.location.pathname.split('/').pop();
    
    console.log(`📄 Current page: ${currentPage}`);
    
    switch (currentPage) {
        case 'index.html':
        case '':
            initializeHomePage();
            break;
            
        case 'login.html':
            initializeLoginPage();
            break;
            
        case 'vote.html':
            // Voting page has its own script
            console.log("✅ Voting page will use its own script");
            break;
            
        case 'admin-login.html':
            initializeAdminLoginPage();
            break;
            
        case 'admin-dashboard.html':
            initializeAdminDashboard();
            break;
            
        default:
            console.log("⚠️ No specific initialization for this page");
            
            // Check if it's a login page by URL
            if (window.location.pathname.includes('login')) {
                initializeLoginPage();
            }
            
            // Check if it's an admin page
            if (window.location.pathname.includes('admin')) {
                initializeAdminPages();
            }
    }
}

// ============================================
// 5.1 HOME PAGE FUNCTIONALITY
// ============================================

function initializeHomePage() {
    console.log("🏠 Initializing home page...");
    
    // Initialize candidate cards hover effects
    initializeCandidateCards();
    
    // Initialize statistics
    initializeStatistics();
    
    // Initialize election timeline
    initializeElectionTimeline();
    
    // Initialize call to action buttons
    initializeCTAButtons();
    
    // Initialize news ticker if exists
    initializeNewsTicker();
    
    console.log("✅ Home page initialized");
}

function initializeCandidateCards() {
    const candidateCards = document.querySelectorAll('.kandidat-card');
    
    if (candidateCards.length === 0) return;
    
    candidateCards.forEach((card, index) => {
        // Add hover effects
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
            this.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.2)';
            
            // Highlight this card
            this.style.zIndex = '10';
            
            // Slightly dim other cards
            candidateCards.forEach((otherCard, otherIndex) => {
                if (otherIndex !== index) {
                    otherCard.style.opacity = '0.8';
                    otherCard.style.transform = 'scale(0.98)';
                }
            });
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = '';
            this.style.boxShadow = '';
            this.style.zIndex = '';
            
            // Reset all cards
            candidateCards.forEach(otherCard => {
                otherCard.style.opacity = '';
                otherCard.style.transform = '';
            });
        });
        
        // Add click effect
        card.addEventListener('click', function() {
            this.style.animation = 'pulse 0.5s ease';
            setTimeout(() => {
                this.style.animation = '';
            }, 500);
        });
    });
}

function initializeStatistics() {
    const statItems = document.querySelectorAll('.stat-item');
    
    if (statItems.length === 0) return;
    
    // Animate statistics when they come into view
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counters = entry.target.querySelectorAll('.counter');
                counters.forEach(counter => {
                    animateCounter(counter);
                });
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    statItems.forEach(item => {
        statsObserver.observe(item);
    });
}

function initializeElectionTimeline() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    if (timelineItems.length === 0) return;
    
    // Add click events to timeline items
    timelineItems.forEach(item => {
        item.addEventListener('click', function() {
            const isActive = this.classList.contains('active');
            
            // Toggle active state
            timelineItems.forEach(i => i.classList.remove('active'));
            
            if (!isActive) {
                this.classList.add('active');
                
                // Scroll to center the active item
                this.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center',
                    inline: 'center'
                });
            }
        });
        
        // Add hover effect
        item.addEventListener('mouseenter', function() {
            if (!this.classList.contains('active')) {
                this.style.transform = 'scale(1.05)';
            }
        });
        
        item.addEventListener('mouseleave', function() {
            if (!this.classList.contains('active')) {
                this.style.transform = '';
            }
        });
    });
}

function initializeCTAButtons() {
    const ctaButtons = document.querySelectorAll('.btn-primary, .btn-secondary, .btn-vote-now');
    
    ctaButtons.forEach(button => {
        // Add ripple effect
        button.addEventListener('click', function(e) {
            // Remove existing ripples
            const existingRipples = this.querySelectorAll('.ripple');
            existingRipples.forEach(ripple => ripple.remove());
            
            // Create new ripple
            const ripple = document.createElement('span');
            ripple.className = 'ripple';
            
            // Get position
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            // Set styles
            ripple.style.cssText = `
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.7);
                transform: scale(0);
                animation: ripple-animation 0.6s linear;
                width: ${size}px;
                height: ${size}px;
                top: ${y}px;
                left: ${x}px;
                pointer-events: none;
            `;
            
            this.appendChild(ripple);
            
            // Remove ripple after animation
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
        
        // Add hover effect
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });
    
    // Add CSS for ripple effect
    const rippleCSS = `
        @keyframes ripple-animation {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
        
        .btn-primary, .btn-secondary, .btn-vote-now {
            position: relative;
            overflow: hidden;
            transition: transform 0.3s ease;
        }
    `;
    
    addStyleToHead(rippleCSS);
}

function initializeNewsTicker() {
    const newsTicker = document.querySelector('.news-ticker');
    if (!newsTicker) return;
    
    const newsItems = [
        "📢 Pemilu OSSIP 2026-2027 telah dibuka!",
        "🎯 107 siswa berhak memilih",
        "🗳️ Gunakan hak pilih Anda dengan bijak",
        "⏰ Batas waktu voting: 20 Januari 2026",
        "🔒 Sistem voting aman dan terenkripsi"
    ];
    
    let currentIndex = 0;
    const tickerContent = newsTicker.querySelector('.ticker-content');
    
    if (!tickerContent) return;
    
    // Function to update ticker
    function updateTicker() {
        tickerContent.textContent = newsItems[currentIndex];
        tickerContent.style.animation = 'none';
        
        // Trigger reflow
        void tickerContent.offsetWidth;
        
        tickerContent.style.animation = 'slideInOut 10s ease-in-out';
        
        currentIndex = (currentIndex + 1) % newsItems.length;
    }
    
    // Initial update
    updateTicker();
    
    // Update every 10 seconds
    setInterval(updateTicker, 10000);
    
    // Add CSS for ticker animation
    const tickerCSS = `
        @keyframes slideInOut {
            0%, 20% {
                transform: translateX(100%);
                opacity: 0;
            }
            25%, 75% {
                transform: translateX(0);
                opacity: 1;
            }
            80%, 100% {
                transform: translateX(-100%);
                opacity: 0;
            }
        }
        
        .ticker-content {
            display: inline-block;
            white-space: nowrap;
            animation: slideInOut 10s ease-in-out infinite;
        }
    `;
    
    addStyleToHead(tickerCSS);
}

// ============================================
// 5.2 LOGIN PAGE FUNCTIONALITY
// ============================================

function initializeLoginPage() {
    console.log("🔐 Initializing login page...");
    
    // Check if we're on the login page
    const loginForm = document.getElementById('loginForm');
    if (!loginForm) {
        console.log("⚠️ Login form not found");
        return;
    }
    
    // Initialize CAPTCHA system
    initializeCaptcha();
    
    // Initialize form validation
    initializeFormValidation();
    
    // Initialize login button effects
    initializeLoginButton();
    
    // Initialize password visibility toggle
    initializePasswordToggle();
    
    // Check for error messages
    checkForErrors();
    
    console.log("✅ Login page initialized");
}

function initializeCaptcha() {
    console.log("🔄 Initializing CAPTCHA...");
    
    const captchaText = document.getElementById('captchaText');
    const refreshCaptcha = document.getElementById('refreshCaptcha');
    const captchaInput = document.getElementById('captcha');
    
    if (!captchaText || !captchaInput) {
        console.log("⚠️ CAPTCHA elements not found");
        return;
    }
    
    // Generate random CAPTCHA
    function generateCaptcha() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        
        // Generate 6 random characters
        for (let i = 0; i < 6; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        
        return result;
    }
    
    // Set initial CAPTCHA
    let currentCaptcha = generateCaptcha();
    captchaText.textContent = currentCaptcha;
    
    // Add visual effects to CAPTCHA
    function animateCaptcha() {
        captchaText.style.animation = 'shake 0.5s ease';
        setTimeout(() => {
            captchaText.style.animation = '';
        }, 500);
    }
    
    // Refresh CAPTCHA
    if (refreshCaptcha) {
        refreshCaptcha.addEventListener('click', function() {
            currentCaptcha = generateCaptcha();
            captchaText.textContent = currentCaptcha;
            animateCaptcha();
            captchaInput.value = '';
            captchaInput.focus();
        });
        
        // Add hover effect
        refreshCaptcha.addEventListener('mouseenter', function() {
            this.style.transform = 'rotate(180deg)';
        });
        
        refreshCaptcha.addEventListener('mouseleave', function() {
            this.style.transform = 'rotate(0)';
        });
    }
    
    // Validate CAPTCHA on input
    captchaInput.addEventListener('input', function() {
        const userInput = this.value;
        
        if (userInput.length === 6) {
            if (userInput === currentCaptcha) {
                this.style.borderColor = '#4CAF50';
                this.style.boxShadow = '0 0 10px rgba(76, 175, 80, 0.3)';
            } else {
                this.style.borderColor = '#f44336';
                this.style.boxShadow = '0 0 10px rgba(244, 67, 54, 0.3)';
            }
        } else {
            this.style.borderColor = '';
            this.style.boxShadow = '';
        }
    });
    
    // Store CAPTCHA in global scope for form validation
    window.currentCaptcha = currentCaptcha;
    window.validateCaptcha = function(input) {
        return input === currentCaptcha;
    };
    
    // Add CSS for CAPTCHA animations
    const captchaCSS = `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
        }
        
        .captcha-container {
            transition: all 0.3s ease;
        }
        
        .captcha-text {
            font-family: 'Courier New', monospace;
            letter-spacing: 5px;
            background: linear-gradient(45deg, #666, #333);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
        
        .captcha-refresh {
            transition: transform 0.5s ease;
            cursor: pointer;
        }
        
        .captcha-refresh:hover {
            color: #3498db;
        }
    `;
    
    addStyleToHead(captchaCSS);
    
    console.log("✅ CAPTCHA initialized");
}

function initializeFormValidation() {
    const loginForm = document.getElementById('loginForm');
    if (!loginForm) return;
    
    const usernameInput = document.getElementById('username');
    const captchaInput = document.getElementById('captcha');
    const submitButton = loginForm.querySelector('.btn-login-submit');
    
    if (!usernameInput || !captchaInput || !submitButton) return;
    
    // Real-time validation
    usernameInput.addEventListener('input', validateUsername);
    captchaInput.addEventListener('input', validateCaptchaInput);
    
    // Form submission
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Validate all fields
        const isUsernameValid = validateUsername();
        const isCaptchaValid = validateCaptchaInput();
        
        if (!isUsernameValid || !isCaptchaValid) {
            showFormError('Harap perbaiki kesalahan pada form sebelum melanjutkan.');
            return;
        }
        
        // Get form data
        const username = usernameInput.value.trim();
        const token = document.getElementById('token').value.trim();
        const captcha = captchaInput.value;
        
        // Validate CAPTCHA
        if (!window.validateCaptcha || !window.validateCaptcha(captcha)) {
            showFormError('Kode keamanan salah! Silakan coba lagi.');
            
            // Refresh CAPTCHA
            const refreshBtn = document.getElementById('refreshCaptcha');
            if (refreshBtn) refreshBtn.click();
            
            captchaInput.value = '';
            captchaInput.focus();
            return;
        }
        
        // Show loading state
        const originalText = submitButton.innerHTML;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Memverifikasi...';
        submitButton.disabled = true;
        
        try {
            // Wait for database to be ready
            if (!window.db || !window.db.validateLogin) {
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
            
            // Validate login with database
            const loginResult = await window.db.validateLogin(username, token);
            
            if (!loginResult.success) {
                showFormError(loginResult.message);
                submitButton.innerHTML = originalText;
                submitButton.disabled = false;
                return;
            }
            
            // Check if already voted
            if (loginResult.voter.has_voted) {
                showAlreadyVotedModal(loginResult.voter);
                submitButton.innerHTML = originalText;
                submitButton.disabled = false;
                return;
            }
            
            // Save voter data to sessionStorage
            sessionStorage.setItem('currentVoter', JSON.stringify(loginResult.voter));
            
            // Show success message
            submitButton.innerHTML = '<i class="fas fa-check"></i> Login Berhasil!';
            submitButton.style.background = '#4CAF50';
            
            // Redirect to voting page after delay
            setTimeout(() => {
                window.location.href = 'vote.html';
            }, 1500);
            
        } catch (error) {
            console.error('❌ Login error:', error);
            showFormError('Terjadi kesalahan saat login. Silakan coba lagi.');
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
        }
    });
    
    // Validation functions
    function validateUsername() {
        const value = usernameInput.value.trim();
        const isValid = value.length >= 3 && /^[a-zA-Z0-9]+$/.test(value);
        
        if (value === '') {
            setFieldValid(usernameInput, false, 'Username harus diisi');
            return false;
        }
        
        if (!isValid) {
            setFieldValid(usernameInput, false, 'Username minimal 3 karakter dan hanya boleh mengandung huruf dan angka');
            return false;
        }
        
        setFieldValid(usernameInput, true);
        return true;
    }
    
    function validateCaptchaInput() {
        const value = captchaInput.value.trim();
        
        if (value === '') {
            setFieldValid(captchaInput, false, 'Kode keamanan harus diisi');
            return false;
        }
        
        if (value.length !== 6) {
            setFieldValid(captchaInput, false, 'Kode keamanan harus 6 karakter');
            return false;
        }
        
        setFieldValid(captchaInput, true);
        return true;
    }
    
    function setFieldValid(inputElement, isValid, message = '') {
        const formGroup = inputElement.closest('.form-group');
        if (!formGroup) return;
        
        const errorElement = formGroup.querySelector('.error-message') || createErrorMessageElement(formGroup);
        
        if (isValid) {
            inputElement.classList.remove('error');
            inputElement.classList.add('success');
            errorElement.textContent = '';
            errorElement.style.display = 'none';
        } else {
            inputElement.classList.remove('success');
            inputElement.classList.add('error');
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }
    }
    
    function createErrorMessageElement(formGroup) {
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.style.display = 'none';
        formGroup.appendChild(errorElement);
        return errorElement;
    }
    
    function showFormError(message) {
        // Remove existing error message
        const existingError = document.querySelector('.form-error-message');
        if (existingError) existingError.remove();
        
        // Create error message element
        const errorElement = document.createElement('div');
        errorElement.className = 'form-error-message';
        errorElement.innerHTML = `
            <i class="fas fa-exclamation-circle"></i>
            <span>${message}</span>
        `;
        
        // Add CSS for error message
        const errorCSS = `
            .form-error-message {
                background: #ffebee;
                border-left: 4px solid #f44336;
                padding: 12px;
                border-radius: 4px;
                margin-bottom: 20px;
                display: flex;
                align-items: center;
                gap: 10px;
                color: #c62828;
                animation: slideDown 0.3s ease;
            }
            
            @keyframes slideDown {
                from {
                    opacity: 0;
                    transform: translateY(-10px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
        `;
        
        addStyleToHead(errorCSS);
        
        // Insert error message before form
        loginForm.insertBefore(errorElement, loginForm.firstChild);
        
        // Remove error after 5 seconds
        setTimeout(() => {
            if (errorElement.parentNode) {
                errorElement.remove();
            }
        }, 5000);
    }
    
    // Initialize fields
    validateUsername();
    validateCaptchaInput();
    
    console.log("✅ Form validation initialized");
}

function initializeLoginButton() {
    const submitButton = document.querySelector('.btn-login-submit');
    if (!submitButton) return;
    
    // Add hover effect
    submitButton.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-2px)';
        this.style.boxShadow = '0 8px 20px rgba(52, 152, 219, 0.4)';
    });
    
    submitButton.addEventListener('mouseleave', function() {
        this.style.transform = '';
        this.style.boxShadow = '';
    });
    
    // Add click effect
    submitButton.addEventListener('click', function() {
        this.style.animation = 'pulse 0.5s ease';
        setTimeout(() => {
            this.style.animation = '';
        }, 500);
    });
}

function initializePasswordToggle() {
    const togglePassword = document.getElementById('togglePassword');
    if (!togglePassword) return;
    
    const passwordInput = document.getElementById('adminPassword');
    if (!passwordInput) return;
    
    togglePassword.addEventListener('click', function() {
        const icon = this.querySelector('i');
        
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
            this.setAttribute('aria-label', 'Sembunyikan password');
        } else {
            passwordInput.type = 'password';
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
            this.setAttribute('aria-label', 'Tampilkan password');
        }
        
        // Add animation
        this.style.transform = 'scale(1.2)';
        setTimeout(() => {
            this.style.transform = '';
        }, 300);
    });
}

function showAlreadyVotedModal(voter) {
    // Remove existing modal
    const existingModal = document.getElementById('alreadyVotedModal');
    if (existingModal) existingModal.remove();
    
    // Create modal HTML
    const modalHTML = `
        <div class="modal-overlay" id="alreadyVotedModal" style="display: flex;">
            <div class="modal-content success-modal">
                <div class="modal-icon" style="color: #e74c3c;">
                    <i class="fas fa-exclamation-circle"></i>
                </div>
                <h2 style="color: #e74c3c;">ANDA SUDAH MEMILIH!</h2>
                <p>Anda sudah melakukan voting sebelumnya. Setiap siswa hanya dapat memilih satu kali.</p>
                
                <div class="success-details">
                    <p><i class="fas fa-user"></i> <strong>Nama Pemilih:</strong> ${voter.name}</p>
                    <p><i class="fas fa-id-card"></i> <strong>Username:</strong> ${voter.username}</p>
                    <p><i class="fas fa-graduation-cap"></i> <strong>Kelas:</strong> ${voter.class}</p>
                    <p><i class="fas fa-info-circle"></i> <strong>Status:</strong> Sudah melakukan voting</p>
                </div>
                
                <button class="btn-finish" id="backToHomeBtn" style="background: #e74c3c;">
                    <i class="fas fa-home"></i> KEMBALI KE BERANDA
                </button>
            </div>
        </div>
    `;
    
    // Add modal to body
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Add event listener for back button
    document.getElementById('backToHomeBtn').addEventListener('click', function() {
        window.location.href = 'index.html';
    });
    
    // Add modal styles if not exists
    const modalCSS = `
        .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            z-index: 9999;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        
        .modal-content {
            background: white;
            border-radius: 15px;
            width: 100%;
            max-width: 500px;
            max-height: 90vh;
            overflow-y: auto;
            animation: modalSlideIn 0.3s ease;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        }
        
        @keyframes modalSlideIn {
            from {
                opacity: 0;
                transform: translateY(-30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .success-modal {
            text-align: center;
            padding: 30px;
        }
        
        .modal-icon {
            font-size: 70px;
            margin-bottom: 25px;
            animation: scaleIn 0.5s ease;
        }
        
        @keyframes scaleIn {
            from {
                transform: scale(0);
            }
            to {
                transform: scale(1);
            }
        }
        
        .success-details {
            text-align: left;
            margin: 25px 0;
            background: #f8f9fa;
            padding: 20px;
            border-radius: 10px;
        }
        
        .success-details p {
            margin: 12px 0;
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 12px;
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
        }
        
        .btn-finish {
            padding: 14px 28px;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            border: none;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            min-width: 200px;
            margin: 20px auto 0;
            color: white;
        }
        
        .btn-finish:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
        }
    `;
    
    addStyleToHead(modalCSS);
}

function checkForErrors() {
    // Check URL for error parameters
    const urlParams = new URLSearchParams(window.location.search);
    const error = urlParams.get('error');
    
    if (error) {
        let message = '';
        
        switch (error) {
            case 'session_expired':
                message = 'Sesi Anda telah berakhir. Silakan login kembali.';
                break;
            case 'invalid_session':
                message = 'Sesi tidak valid. Silakan login kembali.';
                break;
            case 'already_voted':
                message = 'Anda sudah melakukan voting sebelumnya.';
                break;
            default:
                message = 'Terjadi kesalahan. Silakan coba lagi.';
        }
        
        // Show error message
        setTimeout(() => {
            const loginForm = document.getElementById('loginForm');
            if (loginForm) {
                const errorDiv = document.createElement('div');
                errorDiv.className = 'alert alert-danger';
                errorDiv.innerHTML = `
                    <i class="fas fa-exclamation-triangle"></i>
                    <span>${message}</span>
                `;
                loginForm.insertBefore(errorDiv, loginForm.firstChild);
                
                // Remove error after 5 seconds
                setTimeout(() => {
                    errorDiv.remove();
                }, 5000);
            }
        }, 1000);
        
        // Clean URL
        window.history.replaceState({}, document.title, window.location.pathname);
    }
}

// ============================================
// 5.3 ADMIN LOGIN PAGE FUNCTIONALITY
// ============================================

function initializeAdminLoginPage() {
    console.log("🔧 Initializing admin login page...");
    
    // Check if we're on the admin login page
    const adminLoginForm = document.getElementById('adminLoginForm');
    if (!adminLoginForm) {
        console.log("⚠️ Admin login form not found");
        return;
    }
    
    // Initialize security modal
    initializeSecurityModal();
    
    // Initialize admin form validation
    initializeAdminFormValidation();
    
    // Initialize admin password toggle
    initializeAdminPasswordToggle();
    
    // Initialize security hint
    initializeSecurityHint();
    
    console.log("✅ Admin login page initialized");
}

function initializeSecurityModal() {
    const securityModal = document.getElementById('securityModal');
    if (!securityModal) return;
    
    const closeSecurityModal = document.getElementById('closeSecurityModal');
    const understandBtn = document.getElementById('understandBtn');
    
    // Show modal after delay
    setTimeout(() => {
        securityModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }, 1000);
    
    // Close modal functions
    function closeModal() {
        securityModal.style.display = 'none';
        document.body.style.overflow = '';
        
        // Set cookie to prevent showing again (for 1 day)
        document.cookie = "securityModalShown=true; max-age=86400; path=/";
    }
    
    // Close on button click
    if (closeSecurityModal) {
        closeSecurityModal.addEventListener('click', closeModal);
    }
    
    if (understandBtn) {
        understandBtn.addEventListener('click', closeModal);
    }
    
    // Close on overlay click
    securityModal.addEventListener('click', function(e) {
        if (e.target === securityModal) {
            closeModal();
        }
    });
    
    // Close on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && securityModal.style.display === 'flex') {
            closeModal();
        }
    });
    
    // Check if modal was shown before
    function wasModalShown() {
        return document.cookie.split(';').some((item) => item.trim().startsWith('securityModalShown='));
    }
    
    // Don't show modal if it was shown before
    if (wasModalShown()) {
        securityModal.style.display = 'none';
    }
}

function initializeAdminFormValidation() {
    const adminLoginForm = document.getElementById('adminLoginForm');
    if (!adminLoginForm) return;
    
    const usernameInput = document.getElementById('adminUsername');
    const passwordInput = document.getElementById('adminPassword');
    const securityCodeInput = document.getElementById('adminCode');
    const submitButton = adminLoginForm.querySelector('.btn-admin-login');
    
    if (!usernameInput || !passwordInput || !securityCodeInput || !submitButton) return;
    
    // Real-time validation
    usernameInput.addEventListener('input', validateAdminUsername);
    passwordInput.addEventListener('input', validateAdminPassword);
    securityCodeInput.addEventListener('input', validateSecurityCode);
    
    // Form submission
        // Form submission
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Validate all fields
        const isUsernameValid = validateUsername();
        const isCaptchaValid = validateCaptchaInput();
        
        if (!isUsernameValid || !isCaptchaValid) {
            showFormError('Harap perbaiki kesalahan pada form sebelum melanjutkan.');
            return;
        }
        
        // Get form data (Termasuk Token)
        const username = usernameInput.value.trim();
        const token = document.getElementById('token').value.trim();
        const captcha = captchaInput.value;
        
        // Validasi jika token kosong
        if (token === '') {
            showFormError('Token rahasia harus diisi!');
            return;
        }
        
        // Validate CAPTCHA
        if (!window.validateCaptcha || !window.validateCaptcha(captcha)) {
            showFormError('Kode keamanan salah! Silakan coba lagi.');
            
            // Refresh CAPTCHA
            const refreshBtn = document.getElementById('refreshCaptcha');
            if (refreshBtn) refreshBtn.click();
            
            captchaInput.value = '';
            captchaInput.focus();
            return;
        }
        
        // Show loading state
        const originalText = submitButton.innerHTML;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Memverifikasi...';
        submitButton.disabled = true;
        
        try {
            // Wait for database to be ready
            if (!window.db || !window.db.validateLogin) {
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
            
            // Kirim Username dan Token ke fungsi validateLogin di database.js
            const loginResult = await window.db.validateLogin(username, token);
            
            if (!loginResult.success) {
                // Jika token salah, pesan error dari database akan muncul di sini
                showFormError(loginResult.message);
                submitButton.innerHTML = originalText;
                submitButton.disabled = false;
                return;
            }
            
            // Check if already voted
            if (loginResult.voter.has_voted) {
                showAlreadyVotedModal(loginResult.voter);
                submitButton.innerHTML = originalText;
                submitButton.disabled = false;
                return;
            }
            
            // Save voter data to sessionStorage
            sessionStorage.setItem('currentVoter', JSON.stringify(loginResult.voter));
            
            // Show success message
            submitButton.innerHTML = '<i class="fas fa-check"></i> Login Berhasil!';
            submitButton.style.background = '#4CAF50';
            
            // Redirect to voting page after delay
            setTimeout(() => {
                window.location.href = 'vote.html';
            }, 1500);
            
        } catch (error) {
            console.error('❌ Login error:', error);
            showFormError('Terjadi kesalahan saat login. Silakan coba lagi.');
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
        }
    });

    // Validation functions
    function validateAdminUsername() {
        const value = usernameInput.value.trim();
        
        if (value === '') {
            setAdminFieldValid(usernameInput, false, 'Username admin harus diisi');
            return false;
        }
        
        setAdminFieldValid(usernameInput, true);
        return true;
    }
    
    function validateAdminPassword() {
        const value = passwordInput.value;
        
        if (value === '') {
            setAdminFieldValid(passwordInput, false, 'Password harus diisi');
            return false;
        }
        
        if (value.length < 6) {
            setAdminFieldValid(passwordInput, false, 'Password minimal 6 karakter');
            return false;
        }
        
        setAdminFieldValid(passwordInput, true);
        return true;
    }
    
    function validateSecurityCode() {
        const value = securityCodeInput.value.trim();
        
        if (value === '') {
            setAdminFieldValid(securityCodeInput, false, 'Kode keamanan harus diisi');
            return false;
        }
        
        setAdminFieldValid(securityCodeInput, true);
        return true;
    }
    
    function setAdminFieldValid(inputElement, isValid, message = '') {
        const formGroup = inputElement.closest('.form-group');
        if (!formGroup) return;
        
        const errorElement = formGroup.querySelector('.error-message') || createAdminErrorMessageElement(formGroup);
        
        if (isValid) {
            inputElement.classList.remove('error');
            inputElement.classList.add('success');
            errorElement.textContent = '';
            errorElement.style.display = 'none';
        } else {
            inputElement.classList.remove('success');
            inputElement.classList.add('error');
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }
    }
    
    function createAdminErrorMessageElement(formGroup) {
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.style.display = 'none';
        formGroup.appendChild(errorElement);
        return errorElement;
    }
    
    function showAdminFormError(message) {
        // Remove existing error message
        const existingError = document.querySelector('.admin-form-error-message');
        if (existingError) existingError.remove();
        
        // Create error message element
        const errorElement = document.createElement('div');
        errorElement.className = 'admin-form-error-message';
        errorElement.innerHTML = `
            <i class="fas fa-exclamation-circle"></i>
            <span>${message}</span>
        `;
        
        // Add CSS for error message
        const errorCSS = `
            .admin-form-error-message {
                background: #ffebee;
                border-left: 4px solid #f44336;
                padding: 12px;
                border-radius: 4px;
                margin-bottom: 20px;
                display: flex;
                align-items: center;
                gap: 10px;
                color: #c62828;
                animation: slideDown 0.3s ease;
            }
        `;
        
        addStyleToHead(errorCSS);
        
        // Insert error message before form
        adminLoginForm.insertBefore(errorElement, adminLoginForm.firstChild);
        
        // Remove error after 5 seconds
        setTimeout(() => {
            if (errorElement.parentNode) {
                errorElement.remove();
            }
        }, 5000);
    }
    
    // Initialize fields
    validateAdminUsername();
    validateAdminPassword();
    validateSecurityCode();
}

function initializeAdminPasswordToggle() {
    const togglePassword = document.getElementById('togglePassword');
    if (!togglePassword) return;
    
    const passwordInput = document.getElementById('adminPassword');
    if (!passwordInput) return;
    
    togglePassword.addEventListener('click', function() {
        const icon = this.querySelector('i');
        
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
            this.setAttribute('aria-label', 'Sembunyikan password');
            
            // Add visual feedback
            this.style.color = '#3498db';
            setTimeout(() => {
                this.style.color = '';
            }, 300);
        } else {
            passwordInput.type = 'password';
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
            this.setAttribute('aria-label', 'Tampilkan password');
            
            // Add visual feedback
            this.style.color = '#666';
            setTimeout(() => {
                this.style.color = '';
            }, 300);
        }
        
        // Add animation
        this.style.transform = 'scale(1.2)';
        setTimeout(() => {
            this.style.transform = '';
        }, 300);
    });
    
    // Add hover effect
    togglePassword.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.1)';
    });
    
    togglePassword.addEventListener('mouseleave', function() {
        this.style.transform = '';
    });
}

function initializeSecurityHint() {
    const securityHintBtn = document.getElementById('securityHintBtn');
    const securityInfo = document.getElementById('securityInfo');
    
    if (!securityHintBtn || !securityInfo) return;
    
    let isVisible = false;
    
    securityHintBtn.addEventListener('click', function() {
        isVisible = !isVisible;
        
        if (isVisible) {
            securityInfo.style.display = 'block';
            securityInfo.style.animation = 'fadeIn 0.3s ease';
            
            // Auto hide after 10 seconds
            setTimeout(() => {
                if (isVisible) {
                    securityInfo.style.display = 'none';
                    isVisible = false;
                }
            }, 10000);
        } else {
            securityInfo.style.display = 'none';
        }
        
        // Add button animation
        this.style.transform = 'rotate(180deg)';
        setTimeout(() => {
            this.style.transform = '';
        }, 300);
    });
    
    // Add CSS for hint
    const hintCSS = `
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        #securityHintBtn {
            transition: transform 0.3s ease;
            cursor: help;
        }
        
        #securityInfo {
            display: none;
            background: #e3f2fd;
            border-left: 4px solid #2196F3;
            padding: 15px;
            border-radius: 4px;
            margin-top: 10px;
            animation: fadeIn 0.3s ease;
        }
    `;
    
    addStyleToHead(hintCSS);
}

// ============================================
// 5.4 ADMIN PAGES FUNCTIONALITY
// ============================================

function initializeAdminPages() {
    console.log("⚙️ Initializing admin pages...");
    
    // Check if admin is logged in
    checkAdminAuth();
    
    // Initialize admin dashboard
    if (window.location.pathname.includes('admin-dashboard')) {
        initializeAdminDashboard();
    }
    
    // Initialize admin logout
    initializeAdminLogout();
    
    console.log("✅ Admin pages initialized");
}

function checkAdminAuth() {
    const currentAdmin = sessionStorage.getItem('currentAdmin');
    const isAdminPage = window.location.pathname.includes('admin');
    const isAdminLoginPage = window.location.pathname.includes('admin-login');
    
    // If not on admin login page and no admin session, redirect to login
    if (isAdminPage && !isAdminLoginPage && !currentAdmin) {
        alert('Anda harus login sebagai admin terlebih dahulu.');
        window.location.href = 'admin-login.html';
        return;
    }
    
    // If on admin login page and already logged in, redirect to dashboard
    if (isAdminLoginPage && currentAdmin) {
        window.location.href = 'admin-dashboard.html';
        return;
    }
}

function initializeAdminDashboard() {
    console.log("📊 Initializing admin dashboard...");
    
    // Update admin time display
    initializeAdminTime();
    
    // Initialize admin stats
    initializeAdminStats();
    
    // Initialize admin navigation
    initializeAdminNavigation();
    
    // Initialize admin action buttons
    initializeAdminActions();
    
    console.log("✅ Admin dashboard initialized");
}

function initializeAdminTime() {
    const adminTimeElement = document.getElementById('adminTime');
    const lastUpdateElement = document.getElementById('lastUpdate');
    
    function updateTime() {
        const now = new Date();
        const options = { 
            weekday: 'long',
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            timeZoneName: 'short'
        };
        
        const formattedTime = now.toLocaleDateString('id-ID', options);
        
        if (adminTimeElement) {
            adminTimeElement.textContent = formattedTime;
        }
        
        if (lastUpdateElement) {
            lastUpdateElement.textContent = formattedTime;
        }
    }
    
    // Update time every second
    updateTime();
    setInterval(updateTime, 1000);
}

function initializeAdminStats() {
    // This would typically fetch data from the database
    // For now, we'll simulate with sample data
    
    const stats = {
        totalVoters: 107,
        voted: 45,
        notVoted: 62,
        participation: '42.1%',
        candidate1Votes: 18,
        candidate2Votes: 15,
        candidate3Votes: 12
    };
    
    // Update stats elements if they exist
    const statElements = {
        'totalVoters': document.getElementById('totalVoters'),
        'voted': document.getElementById('voted'),
        'notVoted': document.getElementById('notVoted'),
        'participation': document.getElementById('participation'),
        'candidate1Votes': document.getElementById('candidate1Votes'),
        'candidate2Votes': document.getElementById('candidate2Votes'),
        'candidate3Votes': document.getElementById('candidate3Votes')
    };
    
    // Update each element
    Object.keys(statElements).forEach(key => {
        if (statElements[key] && stats[key] !== undefined) {
            statElements[key].textContent = stats[key];
            
            // Animate counter if it's a number
            if (typeof stats[key] === 'number') {
                animateCounter(statElements[key], stats[key]);
            }
        }
    });
    
    // Update progress bars
    const participationBar = document.getElementById('participationBar');
    if (participationBar) {
        const percentage = parseFloat(stats.participation);
        participationBar.style.width = `${percentage}%`;
        participationBar.style.transition = 'width 1s ease';
    }
    
    // Function to animate counter
    function animateCounter(element, target) {
        const current = parseInt(element.textContent) || 0;
        const increment = (target - current) / 50;
        let count = current;
        
        const timer = setInterval(() => {
            count += increment;
            if ((increment > 0 && count >= target) || (increment < 0 && count <= target)) {
                count = target;
                clearInterval(timer);
            }
            element.textContent = Math.round(count).toLocaleString();
        }, 20);
    }
}

function initializeAdminNavigation() {
    const adminNavItems = document.querySelectorAll('.admin-nav-item');
    
    adminNavItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all items
            adminNavItems.forEach(navItem => {
                navItem.classList.remove('active');
            });
            
            // Add active class to clicked item
            this.classList.add('active');
            
            // Get target section
            const targetId = this.getAttribute('data-target');
            if (targetId) {
                // Show target section, hide others
                document.querySelectorAll('.admin-section').forEach(section => {
                    section.style.display = 'none';
                });
                
                const targetSection = document.getElementById(targetId);
                if (targetSection) {
                    targetSection.style.display = 'block';
                    targetSection.style.animation = 'fadeIn 0.5s ease';
                }
            }
        });
    });
    
    // Add CSS for admin navigation
    const adminNavCSS = `
        .admin-nav-item {
            transition: all 0.3s ease;
            cursor: pointer;
        }
        
        .admin-nav-item:hover {
            background: rgba(52, 152, 219, 0.1);
            transform: translateX(5px);
        }
        
        .admin-nav-item.active {
            background: #3498db;
            color: white;
        }
        
        .admin-section {
            display: none;
            animation: fadeIn 0.5s ease;
        }
        
        .admin-section.active {
            display: block;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
    `;
    
    addStyleToHead(adminNavCSS);
}

function initializeAdminActions() {
    // Reset votes button
    const resetVotesBtn = document.getElementById('resetVotesBtn');
    if (resetVotesBtn) {
        resetVotesBtn.addEventListener('click', async function() {
            if (!confirm('⚠️ PERINGATAN!\n\nAnda akan mereset semua data voting. Tindakan ini tidak dapat dibatalkan.\n\nApakah Anda yakin?')) {
                return;
            }
            
            const securityCode = prompt('Masukkan kode keamanan untuk mereset votes:');
            if (securityCode !== "RESETVOTE2027") {
                alert('❌ Kode keamanan salah!');
                return;
            }
            
            // Show loading
            const originalText = this.innerHTML;
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Mereset...';
            this.disabled = true;
            
            try {
                // Call reset function from database
                if (window.db && window.db.resetAllVotes) {
                    const result = await window.db.resetAllVotes();
                    
                    if (result.success) {
                        alert('✅ Semua data voting berhasil direset!');
                        // Refresh page to show updated stats
                        window.location.reload();
                    } else {
                        alert('❌ Gagal mereset votes: ' + (result.error || 'Unknown error'));
                    }
                } else {
                    alert('❌ Database tidak tersedia');
                }
            } catch (error) {
                console.error('❌ Reset votes error:', error);
                alert('❌ Terjadi kesalahan saat mereset votes');
            } finally {
                this.innerHTML = originalText;
                this.disabled = false;
            }
        });
    }
    
    // Export data button
    const exportDataBtn = document.getElementById('exportDataBtn');
    if (exportDataBtn) {
        exportDataBtn.addEventListener('click', function() {
            // Show loading
            const originalText = this.innerHTML;
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Mengekspor...';
            this.disabled = true;
            
            setTimeout(() => {
                // Simulate export
                const data = {
                    title: 'Hasil Pemilu OSSIP 2026-2027',
                    timestamp: new Date().toISOString(),
                    totalVoters: 107,
                    voted: 45,
                    notVoted: 62,
                    participation: '42.1%',
                    candidates: [
                        { name: 'Kandidat 1', votes: 18 },
                        { name: 'Kandidat 2', votes: 15 },
                        { name: 'Kandidat 3', votes: 12 }
                    ]
                };
                
                // Create and download JSON file
                const dataStr = JSON.stringify(data, null, 2);
                const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
                const exportFileDefaultName = `hasil-pemilu-${new Date().toISOString().split('T')[0]}.json`;
                
                const linkElement = document.createElement('a');
                linkElement.setAttribute('href', dataUri);
                linkElement.setAttribute('download', exportFileDefaultName);
                linkElement.click();
                
                // Reset button
                this.innerHTML = originalText;
                this.disabled = false;
                
                alert('✅ Data berhasil diekspor!');
            }, 1500);
        });
    }
    
    // Print report button
    const printReportBtn = document.getElementById('printReportBtn');
    if (printReportBtn) {
        printReportBtn.addEventListener('click', function() {
            window.print();
        });
    }
}

function initializeAdminLogout() {
    const adminLogoutBtn = document.getElementById('adminLogoutBtn');
    
    if (adminLogoutBtn) {
        adminLogoutBtn.addEventListener('click', function() {
            if (confirm('Apakah Anda yakin ingin logout dari panel admin?')) {
                // Clear admin session
                sessionStorage.removeItem('currentAdmin');
                
                // Show loading
                this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging out...';
                this.disabled = true;
                
                // Redirect to home page
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1000);
            }
        });
        
        // Add hover effect
        adminLogoutBtn.addEventListener('mouseenter', function() {
            this.style.background = '#e74c3c';
        });
        
        adminLogoutBtn.addEventListener('mouseleave', function() {
            this.style.background = '';
        });
    }
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

function addStyleToHead(css) {
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
}

function animateCounter(element, target) {
    if (!element) return;
    
    const current = parseInt(element.textContent.replace(/,/g, '')) || 0;
    const duration = 2000; // 2 seconds
    const increment = target / (duration / 16); // 60fps
    
    let count = current;
    const timer = setInterval(() => {
        count += increment;
        if (count >= target) {
            count = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(count).toLocaleString();
    }, 16);
}

// ============================================
// GLOBAL ERROR HANDLING
// ============================================

// Global error handler
window.addEventListener('error', function(e) {
    console.error('❌ Global error:', e.error);
    
    // Don't show alert for common errors
    if (e.message.includes('favicon') || e.message.includes('Failed to load')) {
        return;
    }
    
    // Show user-friendly error message
    const errorMessage = `
        <div class="global-error" style="
            position: fixed;
            top: 20px;
            right: 20px;
            background: #f44336;
            color: white;
            padding: 15px;
            border-radius: 5px;
            z-index: 99999;
            max-width: 400px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            animation: slideInRight 0.3s ease;
        ">
            <div style="display: flex; align-items: center; gap: 10px;">
                <i class="fas fa-exclamation-triangle"></i>
                <div>
                    <strong>Terjadi Kesalahan</strong>
                    <p style="margin: 5px 0 0 0; font-size: 0.9em;">Silakan refresh halaman atau coba lagi nanti.</p>
                </div>
                <button onclick="this.parentElement.parentElement.remove()" style="
                    background: none;
                    border: none;
                    color: white;
                    cursor: pointer;
                    margin-left: auto;
                ">×</button>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', errorMessage);
    
    // Auto remove after 10 seconds
    setTimeout(() => {
        const errorDiv = document.querySelector('.global-error');
        if (errorDiv) errorDiv.remove();
    }, 10000);
});

// Unhandled promise rejection handler
window.addEventListener('unhandledrejection', function(e) {
    console.error('❌ Unhandled promise rejection:', e.reason);
});

// ============================================
// PAGE LOAD COMPLETE
// ============================================

// Add loading animation
window.addEventListener('load', function() {
    console.log("✅ Page fully loaded");
    
    // Remove loading screen if exists
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500);
    }
    
    // Add loaded class to body for animations
    document.body.classList.add('loaded');
    
    // Show welcome message on home page
    if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
        setTimeout(() => {
            console.log("🎉 Welcome to OSSIP Election 2026-2027!");
        }, 1000);
    }
});

// ============================================
// EXPORT FUNCTIONS FOR GLOBAL USE
// ============================================

// Make some functions available globally
window.ElectionUtils = {
    animateCounter: animateCounter,
    formatTime: function(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    },
    
    getRandomColor: function() {
        const colors = ['#3498db', '#2ecc71', '#e74c3c', '#f39c12', '#9b59b6', '#1abc9c'];
        return colors[Math.floor(Math.random() * colors.length)];
    },
    
    showToast: function(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
            <button onclick="this.parentElement.remove()">×</button>
        `;
        
        // Add CSS for toast
        const toastCSS = `
            .toast {
                position: fixed;
                bottom: 20px;
                right: 20px;
                background: white;
                padding: 15px 20px;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                display: flex;
                align-items: center;
                gap: 12px;
                z-index: 9999;
                animation: slideInUp 0.3s ease;
                max-width: 400px;
            }
            
            .toast-success {
                border-left: 4px solid #4CAF50;
            }
            
            .toast-error {
                border-left: 4px solid #f44336;
            }
            
            .toast-info {
                border-left: 4px solid #2196F3;
            }
            
            .toast button {
                background: none;
                border: none;
                color: #666;
                cursor: pointer;
                font-size: 1.2em;
                margin-left: auto;
            }
            
            @keyframes slideInUp {
                from {
                    transform: translateY(100%);
                    opacity: 0;
                }
                to {
                    transform: translateY(0);
                    opacity: 1;
                }
            }
        `;
        
        addStyleToHead(toastCSS);
        
        document.body.appendChild(toast);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (toast.parentNode) {
                toast.remove();
            }
        }, 5000);
    }
};

// Add keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl + L for login page
    if (e.ctrlKey && e.key === 'l') {
        e.preventDefault();
        if (!window.location.pathname.includes('login')) {
            window.location.href = 'login.html';
        }
    }
    
    // Ctrl + H for home page
    if (e.ctrlKey && e.key === 'h') {
        e.preventDefault();
        window.location.href = 'index.html';
    }
    
    // Ctrl + D for admin dashboard (if admin)
    if (e.ctrlKey && e.key === 'd' && sessionStorage.getItem('currentAdmin')) {
        e.preventDefault();
        window.location.href = 'admin-dashboard.html';
    }
    
    // F5 to refresh
    if (e.key === 'F5') {
        console.log("🔄 Refreshing page...");
    }
    
    // Escape to close modals
    if (e.key === 'Escape') {
        const modals = document.querySelectorAll('.modal-overlay');
        modals.forEach(modal => {
            if (modal.style.display === 'flex') {
                modal.style.display = 'none';
                document.body.style.overflow = '';
            }
        });
    }
});

console.log("🎉 Script.js initialization complete!");

    // ============================================
    // KANDIDAT JS
    // ============================================

    /**
 * Animasi untuk Section Kandidat OSSIP
 */

document.addEventListener('DOMContentLoaded', function() {
    // Element yang akan dianimasikan
    const kandidatItems = document.querySelectorAll('.kandidat-item');
    const kandidatAction = document.querySelector('.kandidat-action');
    let animationTriggered = false;
    
    // Fungsi untuk mengecek apakah elemen ada di viewport
    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;
        
        return (
            rect.top <= windowHeight * 0.85 &&
            rect.bottom >= windowHeight * 0.15
        );
    }
    
    // Fungsi untuk animasi masuk
    function animateOnScroll() {
        let allVisible = true;
        
        // Animasi untuk setiap kandidat item
        kandidatItems.forEach((item, index) => {
            if (isElementInViewport(item)) {
                setTimeout(() => {
                    item.classList.add('animate-in');
                }, index * 200);
            } else {
                allVisible = false;
            }
        });
        
        // Animasi untuk tombol jika semua item sudah terlihat
        if (allVisible && !animationTriggered && kandidatAction) {
            setTimeout(() => {
                kandidatAction.classList.add('animate-in');
                animationTriggered = true;
            }, kandidatItems.length * 200 + 300);
        }
    }
    
    // Inisialisasi animasi
    function initAnimations() {
        // Reset state
        kandidatItems.forEach(item => {
            item.classList.remove('animate-in');
        });
        
        if (kandidatAction) {
            kandidatAction.classList.remove('animate-in');
        }
        
        animationTriggered = false;
        
        // Cek dan jalankan animasi
        animateOnScroll();
        
        // Event listeners
        window.addEventListener('scroll', animateOnScroll);
        window.addEventListener('resize', animateOnScroll);
    }
    
    // Efek hover tambahan
    function initHoverEffects() {
        kandidatItems.forEach(item => {
            item.addEventListener('mouseenter', function() {
                this.style.zIndex = '10';
            });
            
            item.addEventListener('mouseleave', function() {
                this.style.zIndex = '1';
            });
        });
    }
    
    // Efek ripple untuk tombol
    function initButtonEffects() {
        const btn = document.querySelector('.btn-pilih-kandidat');
        if (!btn) return;
        
        btn.addEventListener('click', function(e) {
            // Efek ripple
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.4);
                transform: scale(0);
                animation: ripple-animation 0.6s linear;
                width: ${size}px;
                height: ${size}px;
                top: ${y}px;
                left: ${x}px;
                pointer-events: none;
            `;
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    }
    
    // Tambahkan style untuk ripple animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple-animation {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
        
        @keyframes card-enter {
            from {
                opacity: 0;
                transform: translateY(50px) scale(0.95);
            }
            to {
                opacity: 1;
                transform: translateY(0) scale(1);
            }
        }
    `;
    document.head.appendChild(style);
    
    // Inisialisasi semua fungsi
    setTimeout(() => {
        initAnimations();
        initHoverEffects();
        initButtonEffects();
    }, 300);
    
    // Preload images
    function preloadImages() {
        const images = [
            'assets/kandidat1.jpg',
            'assets/kandidat2.jpg',
            'assets/kandidat3.jpg'
        ];
        
        images.forEach(src => {
            const img = new Image();
            img.src = src;
        });
    }
    
    preloadImages();
    
    // Smooth scroll untuk link yang menuju #candidates
    document.querySelectorAll('a[href="#candidates"]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 100,
                    behavior: 'smooth'
                });
                
                // Trigger animasi setelah scroll
                setTimeout(initAnimations, 1000);
            }
        });
    });
});

// ============================================
// TIMELINE WITH LINE EFFECTS
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    // Efek hover untuk timeline circles
    const timelineCircles = document.querySelectorAll('.timeline-circle');
    
    timelineCircles.forEach(circle => {
        circle.addEventListener('mouseenter', function() {
            // Tambahkan efek glow
            this.style.boxShadow = '0 0 30px rgba(74, 111, 165, 0.4)';
            
            // Animasikan icon di dalam circle
            const icon = this.querySelector('i');
            if (icon) {
                icon.style.transform = 'scale(1.2)';
                icon.style.transition = 'transform 0.3s ease';
            }
            
            // Highlight content box terkait
            const contentBox = this.closest('.timeline-line-item').querySelector('.timeline-content-box');
            if (contentBox) {
                contentBox.style.transform = 'translateY(-8px)';
                contentBox.style.boxShadow = '0 20px 50px rgba(0, 0, 0, 0.15)';
            }
        });
        
        circle.addEventListener('mouseleave', function() {
            // Kembalikan ke keadaan semula
            this.style.boxShadow = '';
            
            const icon = this.querySelector('i');
            if (icon) {
                icon.style.transform = 'scale(1)';
            }
            
            const contentBox = this.closest('.timeline-line-item').querySelector('.timeline-content-box');
            if (contentBox) {
                contentBox.style.transform = '';
                contentBox.style.boxShadow = '';
            }
        });
    });
    
    // Efek hover untuk content box
    const contentBoxes = document.querySelectorAll('.timeline-content-box');
    
    contentBoxes.forEach(box => {
        box.addEventListener('mouseenter', function() {
            // Highlight circle terkait
            const circle = this.closest('.timeline-line-item').querySelector('.timeline-circle');
            if (circle) {
                circle.style.transform = 'scale(1.15)';
                circle.style.boxShadow = '0 0 30px rgba(74, 111, 165, 0.4)';
            }
        });
        
        box.addEventListener('mouseleave', function() {
            // Kembalikan ke keadaan semula
            const circle = this.closest('.timeline-line-item').querySelector('.timeline-circle');
            if (circle) {
                circle.style.transform = '';
                circle.style.boxShadow = '';
            }
        });
    });
    
    // Animasi saat scroll
    const timelineSection = document.querySelector('.timeline-line-section');
    
    if (timelineSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Trigger animasi untuk items
                    const items = entry.target.querySelectorAll('.timeline-line-item');
                    items.forEach((item, index) => {
                        setTimeout(() => {
                            item.style.opacity = '1';
                            item.style.transform = 'translateY(0)';
                            
                            // Animasi khusus untuk circle
                            const circle = item.querySelector('.timeline-circle');
                            if (circle) {
                                circle.style.animation = 'pulse 2s ease ' + (index * 0.2) + 's';
                            }
                        }, index * 200);
                    });
                    
                    // Tambahkan animasi untuk garis utama
                    const mainLine = entry.target.querySelector('.timeline-main-line');
                    if (mainLine) {
                        setTimeout(() => {
                            mainLine.style.background = 'linear-gradient(to right, #4a6fa5, #6d9dc5)';
                            mainLine.style.transition = 'background 1.5s ease';
                        }, 800);
                    }
                }
            });
        }, { threshold: 0.1 });
        
        observer.observe(timelineSection);
    }
    
    // Tambahkan keyframe untuk animasi pulse
    const style = document.createElement('style');
    style.textContent = `
        @keyframes pulse {
            0% { transform: scale(1); box-shadow: 0 10px 30px rgba(74, 111, 165, 0.15); }
            50% { transform: scale(1.1); box-shadow: 0 15px 40px rgba(74, 111, 165, 0.25); }
            100% { transform: scale(1); box-shadow: 0 10px 30px rgba(74, 111, 165, 0.15); }
        }
    `;
    document.head.appendChild(style);
});

