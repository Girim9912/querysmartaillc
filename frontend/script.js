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

// script.js (append or replace with this)
document.addEventListener('DOMContentLoaded', () => {
  // Contact Form Submission
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const formData = new FormData(contactForm);
      try {
        const response = await fetch('http://localhost:3000/contact', {
          method: 'POST',
          body: formData,
        });
        const result = await response.json();
        showMessage(
          response.ok
            ? 'Mission Control Confirmed! We’ll get back to you within 24 hours.'
            : `Houston, We Have a Problem! ${result.error || 'Please try again.'}`,
          response.ok ? 'success' : 'error',
          'contact-message'
        );
        if (response.ok) contactForm.reset();
      } catch (error) {
        console.error('Error:', error);
        showMessage(
          'Houston, We Have a Problem! Please try again or email contact@querysmartaillc.com',
          'error',
          'contact-message'
        );
      }
    });
  }

 // Append to script.js
const careersForm = document.getElementById('careersForm');
if (careersForm) {
  careersForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(careersForm);
    try {
      const res = await fetch('http://localhost:8000/api/apply', {  // Update to your backend URL
        method: 'POST',
        body: formData
      });
      if (res.ok) {
        careersForm.reset();
        document.getElementById('careers-message').innerText = 'Mission Control Confirmed! Application received.';
        document.getElementById('careers-message').classList.add('success');
      } else {
        throw new Error(await res.text());
      }
    } catch (err) {
      document.getElementById('careers-message').innerText = `Houston, We Have a Problem! ${err.message}`;
      document.getElementById('careers-message').classList.add('error');
    }
  });
}

// Drag-and-drop
const dropZone = document.getElementById('dropZone');
const resumeInput = document.getElementById('resume');
if (dropZone && resumeInput) {
  dropZone.addEventListener('click', () => resumeInput.click());
  dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('highlight');
  });
  dropZone.addEventListener('dragleave', () => dropZone.classList.remove('highlight'));
  dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('highlight');
    resumeInput.files = e.dataTransfer.files;
    dropZone.querySelector('p').textContent = resumeInput.files[0]?.name || 'Drag & drop or click to browse';
  });
}
}); 