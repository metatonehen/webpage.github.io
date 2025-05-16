/**
 * Neo Gaiam - Spiritual Education Platform
 * Main JavaScript file
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize any interactive elements
    initializeNavbar();
    initializeAnimations();
    addStarTwinkle();
    
    // Add any page-specific initializations
    if (document.querySelector('.calculator-form')) {
        initializeCalculatorForms();
    }
    
    if (document.querySelector('.contact-form')) {
        initializeContactForm();
    }
});

/**
 * Initialize navbar behavior for mobile and dropdown menus
 */
function initializeNavbar() {
    // Handle navbar collapse for mobile
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    
    if (navbarToggler && navbarCollapse) {
        navbarToggler.addEventListener('click', function() {
            navbarCollapse.classList.toggle('show');
        });
    }
    
    // Close navbar when clicking outside
    document.addEventListener('click', function(e) {
        if (!navbarCollapse.contains(e.target) && !navbarToggler.contains(e.target) && navbarCollapse.classList.contains('show')) {
            navbarCollapse.classList.remove('show');
        }
    });
    
    // Add active class to current page nav item
    const currentLocation = window.location.pathname;
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    
    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href');
        if (linkPath === currentLocation) {
            link.classList.add('active');
        }
    });
}

/**
 * Initialize animations for sacred geometry and cosmic elements
 */
function initializeAnimations() {
    // Add parallax effect to cosmic background when scrolling
    window.addEventListener('scroll', function() {
        const scrollPosition = window.scrollY;
        
        // Move stars slightly on scroll for parallax effect
        const stars = document.querySelector('.stars');
        if (stars) {
            stars.style.transform = `translateY(${scrollPosition * 0.1}px)`;
        }
        
        // Move constellations at a different rate
        const constellations = document.querySelector('.constellations');
        if (constellations) {
            constellations.style.transform = `translateY(${scrollPosition * 0.05}px)`;
        }
    });
    
    // Add hover effects to cubes
    const portalCubes = document.querySelectorAll('.portal-cube');
    
    portalCubes.forEach(cube => {
        cube.addEventListener('mouseenter', function() {
            const vertices = this.querySelectorAll('.vertex');
            vertices.forEach((vertex, index) => {
                vertex.style.transitionDelay = `${index * 0.05}s`;
                vertex.style.transform = 'scale(1.1)';
            });
        });
        
        cube.addEventListener('mouseleave', function() {
            const vertices = this.querySelectorAll('.vertex');
            vertices.forEach(vertex => {
                vertex.style.transitionDelay = '0s';
                vertex.style.transform = 'scale(1)';
            });
        });
    });
    
    // Add smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

/**
 * Add random twinkling effect to the stars in the background
 */
function addStarTwinkle() {
    // Create stars dynamically for more realistic effect
    const starsContainer = document.querySelector('.stars');
    
    if (starsContainer) {
        // Clear existing stars
        starsContainer.innerHTML = '';
        
        // Create 100 random stars
        for (let i = 0; i < 100; i++) {
            const star = document.createElement('div');
            star.className = 'star';
            
            // Random position
            const posX = Math.random() * 100; // percentage
            const posY = Math.random() * 100; // percentage
            
            // Random size (1-3px)
            const size = Math.random() * 2 + 1;
            
            // Random animation delay
            const delay = Math.random() * 5;
            
            star.style.cssText = `
                position: absolute;
                top: ${posY}%;
                left: ${posX}%;
                width: ${size}px;
                height: ${size}px;
                background-color: white;
                border-radius: 50%;
                opacity: ${Math.random() * 0.5 + 0.3};
                animation: twinkle 5s infinite;
                animation-delay: ${delay}s;
            `;
            
            starsContainer.appendChild(star);
        }
    }
}

/**
 * Initialize calculator forms (Natal Chart and Human Design)
 */
function initializeCalculatorForms() {
    // Natal Chart form logic
    const natalChartForm = document.getElementById('natal-chart-form');
    if (natalChartForm) {
        const unknownBirthTime = document.getElementById('unknown-birth-time');
        const birthHour = document.getElementById('birth-hour');
        const birthMinute = document.getElementById('birth-minute');
        
        // Toggle birth time fields based on checkbox
        if (unknownBirthTime) {
            unknownBirthTime.addEventListener('change', function() {
                if (birthHour && birthMinute) {
                    birthHour.disabled = this.checked;
                    birthMinute.disabled = this.checked;
                    
                    if (this.checked) {
                        birthHour.value = '';
                        birthMinute.value = '';
                    }
                }
            });
        }
        
        // Handle form submission (simulated)
        natalChartForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Show a loading state
            const chartResult = document.getElementById('chart-result');
            const previewPlaceholder = document.querySelector('.preview-placeholder');
            
            if (previewPlaceholder) {
                previewPlaceholder.innerHTML = '<div class="loading-spinner"><i class="fas fa-spinner fa-spin"></i></div><p class="text-center">Calculating your chart...</p>';
            }
            
            // Simulate calculation delay (in a real implementation, this would be an API call)
            setTimeout(function() {
                if (chartResult && previewPlaceholder) {
                    // Display a simulated result
                    chartResult.innerHTML = `
                        <div class="chart-header">
                            <h3>${document.getElementById('birth-name').value}'s Natal Chart</h3>
                            <p>Born on ${formatDate(document.getElementById('birth-date').value)} in ${document.getElementById('birth-city').value}</p>
                        </div>
                        <div class="chart-image">
                            <p class="text-center">This is where your actual chart would be displayed.</p>
                            <p class="text-center">In the WordPress implementation, this would connect to an astrology API.</p>
                        </div>
                        <div class="chart-interpretation">
                            <div class="interpretation-section">
                                <h4>Sun in Aries</h4>
                                <p>Your core essence is energetic, independent, and pioneering. You have a natural leadership quality and aren't afraid to initiate new projects.</p>
                            </div>
                            <div class="interpretation-section">
                                <h4>Moon in Cancer</h4>
                                <p>Your emotional nature is sensitive, nurturing, and protective. Home and family are important to your sense of security.</p>
                            </div>
                            <div class="interpretation-section">
                                <h4>Ascendant in Libra</h4>
                                <p>You present yourself as diplomatic, charming, and relationship-oriented. You value harmony and fairness in your interactions.</p>
                            </div>
                        </div>
                    `;
                    
                    // Show the result and hide placeholder
                    chartResult.classList.remove('d-none');
                    previewPlaceholder.classList.add('d-none');
                }
            }, 2000);
        });
    }
    
    // Human Design form logic
    const humanDesignForm = document.getElementById('human-design-form');
    if (humanDesignForm) {
        const unknownBirthTime = document.getElementById('hd-unknown-birth-time');
        const birthHour = document.getElementById('hd-birth-hour');
        const birthMinute = document.getElementById('hd-birth-minute');
        
        // Toggle birth time fields based on checkbox
        if (unknownBirthTime) {
            unknownBirthTime.addEventListener('change', function() {
                if (birthHour && birthMinute) {
                    birthHour.disabled = this.checked;
                    birthMinute.disabled = this.checked;
                    
                    if (this.checked) {
                        birthHour.value = '';
                        birthMinute.value = '';
                    }
                }
            });
        }
        
        // Handle form submission (simulated)
        humanDesignForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Show a loading state
            const designResult = document.getElementById('design-result');
            const previewPlaceholder = document.querySelector('.preview-placeholder');
            
            if (previewPlaceholder) {
                previewPlaceholder.innerHTML = '<div class="loading-spinner"><i class="fas fa-spinner fa-spin"></i></div><p class="text-center">Calculating your Human Design...</p>';
            }
            
            // Simulate calculation delay (in a real implementation, this would be an API call)
            setTimeout(function() {
                if (designResult && previewPlaceholder) {
                    // Display a simulated result
                    designResult.innerHTML = `
                        <div class="design-header">
                            <h3>${document.getElementById('hd-name').value}'s Human Design</h3>
                            <p>Born on ${formatDate(document.getElementById('hd-birth-date').value)} in ${document.getElementById('hd-birth-city').value}</p>
                        </div>
                        <div class="design-summary">
                            <div class="summary-item">
                                <span class="label">Type</span>
                                <span class="value">Generator</span>
                            </div>
                            <div class="summary-item">
                                <span class="label">Authority</span>
                                <span class="value">Sacral</span>
                            </div>
                            <div class="summary-item">
                                <span class="label">Profile</span>
                                <span class="value">5/1</span>
                            </div>
                            <div class="summary-item">
                                <span class="label">Definition</span>
                                <span class="value">Single</span>
                            </div>
                        </div>
                        <div class="bodygraph-placeholder">
                            <p class="text-center">This is where your actual BodyGraph would be displayed.</p>
                            <p class="text-center">In the WordPress implementation, this would connect to a Human Design API.</p>
                        </div>
                        <div class="design-interpretation">
                            <div class="interpretation-section">
                                <h4>Your Type: Generator</h4>
                                <p>As a Generator, you have a powerful sacral center that gives you sustainable energy for things that excite you. Your strategy is to <strong>wait to respond</strong> rather than initiating.</p>
                            </div>
                            <div class="interpretation-section">
                                <h4>Your Authority: Sacral</h4>
                                <p>Your decisions are best made through your gut responses. Listen to the visceral "uh-huh" (yes) or "uh-uh" (no) sounds and feelings from your sacral center.</p>
                            </div>
                            <div class="interpretation-section">
                                <h4>Your Profile: 5/1 (Heretic/Investigator)</h4>
                                <p>You have a natural capacity to solve problems in practical ways. The 5th line brings an expectation from others that you'll be a savior or heretic.</p>
                            </div>
                        </div>
                    `;
                    
                    // Show the result and hide placeholder
                    designResult.classList.remove('d-none');
                    previewPlaceholder.classList.add('d-none');
                }
            }, 2000);
        });
    }
}

/**
 * Initialize contact form submission and validation
 */
function initializeContactForm() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Simple validation
            let isValid = true;
            const requiredFields = contactForm.querySelectorAll('[required]');
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.classList.add('is-invalid');
                } else {
                    field.classList.remove('is-invalid');
                }
            });
            
            if (isValid) {
                // Show success message
                const formSuccess = document.getElementById('form-success');
                
                if (formSuccess) {
                    // Reset form
                    contactForm.reset();
                    
                    // Show success message
                    formSuccess.classList.remove('d-none');
                    
                    // Hide success message after 5 seconds
                    setTimeout(function() {
                        formSuccess.classList.add('d-none');
                    }, 5000);
                }
            }
        });
        
        // Add validation on input
        const requiredFields = contactForm.querySelectorAll('[required]');
        requiredFields.forEach(field => {
            field.addEventListener('input', function() {
                if (field.value.trim()) {
                    field.classList.remove('is-invalid');
                }
            });
        });
    }
}

/**
 * Format a date string to a more readable format
 * @param {string} dateString - Date string in ISO format (YYYY-MM-DD)
 * @return {string} Formatted date string
 */
function formatDate(dateString) {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
}
