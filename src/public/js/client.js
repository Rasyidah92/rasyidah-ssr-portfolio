// ========== CLIENT-SIDE JS - MINIMAL UNTUK INTERAKSI ==========

(function() {
    console.log('✅ Rasyidah Portfolio - SSR version loaded');
    
    // ========== FLIP BOOK FUNCTIONALITY ==========
    const pageTurnBtn = document.querySelectorAll('.nextprev-btn');
    const flipSound = document.getElementById('flipSound');
    
    pageTurnBtn.forEach((el, index) => {
        el.addEventListener('click', (e) => {
            const pageTurnId = el.getAttribute('data-page');
            const pageTurn = document.getElementById(pageTurnId);
            
            if (flipSound) {
                flipSound.currentTime = 0;
                flipSound.play().catch(() => {});
            }
            
            if(pageTurn.classList.contains('turn')) {
                pageTurn.classList.remove('turn');
                setTimeout(() => {
                    if (pageTurn) pageTurn.style.zIndex = 20 - index;
                }, 500);
            } else {
                pageTurn.classList.add('turn');
                setTimeout(() => {
                    if (pageTurn) pageTurn.style.zIndex = 20 + index;
                }, 500);
            }
        });
    });
    
    // ========== BACK TO PROFILE ==========
    const backProfileBtn = document.querySelector('.back-profile');
    if (backProfileBtn) {
        backProfileBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const pages = document.querySelectorAll('.book-page.page-right');
            pages.forEach((page, index) => {
                setTimeout(() => {
                    if (page.classList.contains('turn')) {
                        page.classList.remove('turn');
                    }
                }, index * 100);
            });
        });
    }
    
    // ========== DARK MODE ==========
    const darkModeToggle = document.getElementById('darkModeToggle');
    if (darkModeToggle) {
        // Load saved preference
        if (localStorage.getItem('darkMode') === 'enabled') {
            document.body.classList.add('dark-mode');
            darkModeToggle.checked = true;
        }
        
        darkModeToggle.addEventListener('change', () => {
            if (darkModeToggle.checked) {
                document.body.classList.add('dark-mode');
                localStorage.setItem('darkMode', 'enabled');
            } else {
                document.body.classList.remove('dark-mode');
                localStorage.setItem('darkMode', 'disabled');
            }
        });
    }
    
    // ========== FLOATING ACTION BUTTON ==========
    const fabBtn = document.getElementById('fabBtn');
    const actionMenu = document.getElementById('actionMenu');
    
    if (fabBtn && actionMenu) {
        fabBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            actionMenu.classList.toggle('show');
            fabBtn.classList.toggle('active');
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!actionMenu.contains(e.target) && !fabBtn.contains(e.target)) {
                actionMenu.classList.remove('show');
                fabBtn.classList.remove('active');
            }
        });
    }
    
    // ========== MENU ITEMS ==========
    document.getElementById('menuDownloadCV')?.addEventListener('click', () => {
        window.open('https://drive.google.com/file/d/1I09_XzlPwojteHihVh15b4GN5EreSEVf/view?usp=sharing', '_blank');
        actionMenu?.classList.remove('show');
        fabBtn?.classList.remove('active');
    });
    
    document.getElementById('menuContactMe')?.addEventListener('click', () => {
        // Navigate to contact page (page 6)
        const pages = document.querySelectorAll('.book-page.page-right');
        pages.forEach((page, index) => {
            setTimeout(() => {
                page.classList.add('turn');
            }, (index + 1) * 200);
        });
        actionMenu?.classList.remove('show');
        fabBtn?.classList.remove('active');
    });
    
    document.getElementById('menuWhatsApp')?.addEventListener('click', () => {
        const wsLink = document.querySelector('.ws-profile');
        if (wsLink) {
            window.open(wsLink.href, '_blank');
        }
        actionMenu?.classList.remove('show');
        fabBtn?.classList.remove('active');
    });
    
    document.getElementById('menuShare')?.addEventListener('click', async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Rasyidah Binti Raduan - Freelancer GIS & Web Developer',
                    text: 'Check out my interactive 3D portfolio!',
                    url: window.location.href
                });
            } catch (err) {}
        } else {
            navigator.clipboard.writeText(window.location.href);
            alert('Link copied to clipboard!');
        }
        actionMenu?.classList.remove('show');
        fabBtn?.classList.remove('active');
    });
    
    document.getElementById('menuInstallApp')?.addEventListener('click', () => {
        // Trigger PWA install
        if (deferredPrompt) {
            deferredPrompt.prompt();
        }
        actionMenu?.classList.remove('show');
        fabBtn?.classList.remove('active');
    });
    
    // ========== PWA INSTALL PROMPT ==========
    let deferredPrompt;
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        
        const pwaBadge = document.getElementById('pwaBadge');
        if (pwaBadge) {
            setTimeout(() => pwaBadge.classList.add('show'), 3000);
        }
    });
    
    document.getElementById('pwaBadge')?.addEventListener('click', async () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            if (outcome === 'accepted') {
                document.getElementById('pwaBadge')?.classList.remove('show');
            }
            deferredPrompt = null;
        }
    });
    
    // ========== OFFLINE DETECTION ==========
    const offlineIndicator = document.getElementById('offlineIndicator');
    
    window.addEventListener('online', () => {
        offlineIndicator?.classList.remove('show');
    });
    
    window.addEventListener('offline', () => {
        offlineIndicator?.classList.add('show');
    });
    
    if (!navigator.onLine && offlineIndicator) {
        offlineIndicator.classList.add('show');
    }
    
    // ========== FORM SUBMISSION ==========
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Google Sheets integration would go here
            // For now, just show success message
            const resultDiv = document.getElementById('result');
            resultDiv.innerHTML = '<div style="color: #25D366; padding: 1rem; text-align: center;">✅ Thank you! I will contact you soon.</div>';
            contactForm.reset();
            
            setTimeout(() => {
                resultDiv.innerHTML = '';
            }, 5000);
        });
    }
})();