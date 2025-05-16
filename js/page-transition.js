document.addEventListener('DOMContentLoaded', function() {
    // No creamos el overlay porque ya está en el HTML base
    const transitionOverlay = document.querySelector('.page-transition-overlay');

    // Function to show transition overlay
    function showTransition() {
        transitionOverlay.classList.add('active');
        setTimeout(() => {
            transitionOverlay.classList.remove('active');
        }, 2000); // Hide after 2 seconds
    }

    // Intercept link clicks
    document.addEventListener('click', function(e) {
        const link = e.target.closest('a');
        
        if (link && link.getAttribute('href').indexOf('#') !== 0 && 
            link.getAttribute('href').indexOf('javascript:') !== 0 && 
            !link.getAttribute('target') && 
            link.getAttribute('href').indexOf('http') !== 0 &&
            !link.classList.contains('no-transition')) {
            
            e.preventDefault();
            showTransition();
            
            setTimeout(() => {
                window.location.href = link.getAttribute('href');
            }, 1000); // Navigate after 1 second
        }
    });
});