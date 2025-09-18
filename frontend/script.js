// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// Header background change on scroll
window.addEventListener('scroll', () => {
  const header = document.getElementById('header');
  if (window.scrollY > 100) {
    header.style.background = 'rgba(0, 0, 0, 0.95)';
  } else {
    header.style.background = 'rgba(0, 0, 0, 0.8)';
  }
});

// Intersection Observer for fade-in animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, observerOptions);

// Observe all elements with fade-in-up class
document.querySelectorAll('.fade-in-up').forEach(el => {
  observer.observe(el);
});

// Counter animation for stats
const animateCounters = () => {
  const counters = document.querySelectorAll('.stat-number');
  const speed = 200; // The lower the slower

  counters.forEach(counter => {
    if (counter.textContent === '∞') return; // Skip infinity symbol
    
    const target = parseInt(counter.getAttribute('data-target') || counter.textContent);
    const count = parseInt(counter.textContent);
    const inc = target / speed;

    if (count < target) {
      counter.textContent = Math.ceil(count + inc);
      setTimeout(() => animateCounters(), 1);
    } else {
      counter.textContent = target;
    }
  });
};

// Trigger counter animation when stats section is visible
const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // Set data targets for counters
      const statNumbers = entry.target.querySelectorAll('.stat-number');
      statNumbers.forEach((stat, index) => {
        const values = ['2025', '3', '∞', '1'];
        if (stat.textContent !== '∞') {
          stat.setAttribute('data-target', values[index]);
          stat.textContent = '0';
        }
      });
      setTimeout(animateCounters, 500);
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const statsSection = document.querySelector('.stats');
if (statsSection) {
  statsObserver.observe(statsSection);
}

// Form submission handling
const form = document.querySelector('.contact-form');
if (form) {
  form.addEventListener('submit', function(e) {
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Launching...';
    submitBtn.disabled = true;
    
    // Re-enable after 3 seconds (fallback)
    setTimeout(() => {
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
    }, 3000);
  });
}

// Mobile menu toggle
const mobileMenuBtn = document.getElementById('mobile-menu');
const navMenu = document.querySelector('.nav-menu');

if (mobileMenuBtn && navMenu) {
  mobileMenuBtn.addEventListener('click', () => {
    navMenu.style.display = navMenu.style.display === 'flex' ? 'none' : 'flex';
    navMenu.style.position = 'absolute';
    navMenu.style.top = '100%';
    navMenu.style.left = '0';
    navMenu.style.right = '0';
    navMenu.style.background = 'rgba(0, 0, 0, 0.95)';
    navMenu.style.flexDirection = 'column';
    navMenu.style.padding = '2rem';
    navMenu.style.gap = '1rem';
  });
}

// Service card hover effects
document.querySelectorAll('.service-card').forEach(card => {
  card.addEventListener('mouseenter', function() {
    this.style.transform = 'translateY(-10px) scale(1.02)';
  });
  
  card.addEventListener('mouseleave', function() {
    this.style.transform = 'translateY(0) scale(1)';
  });
});

// Tech card stagger animation
document.querySelectorAll('.tech-card').forEach((card, index) => {
  card.style.animationDelay = `${index * 0.1}s`;
});

// Parallax effect for hero section
window.addEventListener('scroll', () => {
  const scrolled = window.pageYOffset;
  const hero = document.querySelector('.hero');
  if (hero) {
    const rate = scrolled * -0.5;
    hero.style.transform = `translateY(${rate}px)`;
  }
});

// Smooth reveal animation for service cards
const serviceCards = document.querySelectorAll('.service-card');
const serviceObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, index) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }, index * 200);
    }
  });
}, { threshold: 0.2 });

serviceCards.forEach(card => {
  card.style.opacity = '0';
  card.style.transform = 'translateY(50px)';
  card.style.transition = 'all 0.6s ease';
  serviceObserver.observe(card);
});

// Add loading state for external resources
window.addEventListener('load', () => {
  document.body.classList.add('loaded');
  
  // Add subtle entrance animations
  const hero = document.querySelector('.hero-content');
  if (hero) {
    hero.style.opacity = '1';
    hero.style.transform = 'translateY(0)';
  }
});

// Performance optimization: Reduce animations on mobile
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
if (prefersReducedMotion.matches) {
  document.documentElement.style.setProperty('--animation-duration', '0s');
}

// Keyboard navigation support
document.addEventListener('keydown', (e) => {
  if (e.key === 'Tab') {
    document.body.classList.add('keyboard-navigation');
  }
});

document.addEventListener('mousedown', () => {
  document.body.classList.remove('keyboard-navigation');
});

// Add focus styles for keyboard navigation
const style = document.createElement('style');
style.textContent = `
  .keyboard-navigation *:focus {
    outline: 2px solid var(--accent-blue) !important;
    outline-offset: 2px;
  }
`;
document.head.appendChild(style);

// Debounce function for performance optimization
function debounce(func, wait, immediate) {
  var timeout;
  return function() {
    var context = this, args = arguments;
    var later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

// Optimized scroll handler
const optimizedScroll = debounce(() => {
  const header = document.getElementById('header');
  const scrolled = window.pageYOffset;
  
  // Header background
  if (scrolled > 100) {
    header.style.background = 'rgba(0, 0, 0, 0.95)';
  } else {
    header.style.background = 'rgba(0, 0, 0, 0.8)';
  }
  
  // Parallax effect
  const hero = document.querySelector('.hero');
  if (hero && scrolled < window.innerHeight) {
    const rate = scrolled * -0.5;
    hero.style.transform = `translateY(${rate}px)`;
  }
}, 10);

window.addEventListener('scroll', optimizedScroll);

// Initialize animations on page load
document.addEventListener('DOMContentLoaded', () => {
  // Add initial animation classes
  const heroContent = document.querySelector('.hero-content');
  if (heroContent) {
    heroContent.style.opacity = '0';
    heroContent.style.transform = 'translateY(30px)';
    heroContent.style.transition = 'all 1s ease';
    
    setTimeout(() => {
      heroContent.style.opacity = '1';
      heroContent.style.transform = 'translateY(0)';
    }, 300);
  }
});