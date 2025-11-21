/* ============================================
   QuerySmart AI - Main JavaScript
   ============================================ */

// Career Form Handling
const careerForm = document.getElementById('careerForm');
const careerSubmitBtn = document.getElementById('careerSubmitBtn');
const careerSubmitText = document.getElementById('careerSubmitText');
const careerSubmitIcon = document.getElementById('careerSubmitIcon');
const careerSuccessMessage = document.getElementById('careerSuccessMessage');
const careerErrorMessage = document.getElementById('careerErrorMessage');

// File upload elements
const fileUpload = document.getElementById('resume-upload');
const fileInfo = document.getElementById('file-info');
const fileName = document.getElementById('file-name');
const removeFile = document.getElementById('remove-file');
const fileWrapper = document.querySelector('.file-upload-wrapper');

// File upload handling
if (fileUpload) {
  fileUpload.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert('File size must be less than 5MB. Please choose a smaller file.');
        fileUpload.value = '';
        return;
      }
      
      // Valid file types
      const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!validTypes.includes(file.type)) {
        alert('Please upload only PDF, DOC, or DOCX files.');
        fileUpload.value = '';
        return;
      }
      
      // Show file info
      if (fileName) fileName.textContent = file.name;
      if (fileInfo) fileInfo.style.display = 'block';
      
      // Hide upload text
      const uploadText = document.querySelector('.upload-text');
      const uploadSubtext = document.querySelector('.upload-subtext');
      if (uploadText) uploadText.style.display = 'none';
      if (uploadSubtext) uploadSubtext.style.display = 'none';
    }
  });
}

// Remove file functionality
if (removeFile) {
  removeFile.addEventListener('click', function() {
    if (fileUpload) fileUpload.value = '';
    if (fileInfo) fileInfo.style.display = 'none';
    
    // Show upload text again
    const uploadText = document.querySelector('.upload-text');
    const uploadSubtext = document.querySelector('.upload-subtext');
    if (uploadText) uploadText.style.display = 'block';
    if (uploadSubtext) uploadSubtext.style.display = 'block';
  });
}

// Drag and drop functionality
if (fileWrapper) {
  fileWrapper.addEventListener('dragover', function(e) {
    e.preventDefault();
    e.stopPropagation();
    this.classList.add('dragover');
  });

  fileWrapper.addEventListener('dragleave', function(e) {
    e.preventDefault();
    e.stopPropagation();
    this.classList.remove('dragover');
  });

  fileWrapper.addEventListener('drop', function(e) {
    e.preventDefault();
    e.stopPropagation();
    this.classList.remove('dragover');
    
    const files = e.dataTransfer.files;
    if (files.length > 0 && fileUpload) {
      fileUpload.files = files;
      fileUpload.dispatchEvent(new Event('change', { bubbles: true }));
    }
  });
}

// Career form submission
if (careerForm) {
  careerForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    console.log('Career form submitted');
    
    // Hide previous messages
    if (careerSuccessMessage) careerSuccessMessage.style.display = 'none';
    if (careerErrorMessage) careerErrorMessage.style.display = 'none';
    
    // Validate required fields
    const firstName = careerForm.querySelector('[name="first_name"]').value.trim();
    const lastName = careerForm.querySelector('[name="last_name"]').value.trim();
    const email = careerForm.querySelector('[name="email"]').value.trim();
    const phone = careerForm.querySelector('[name="phone"]').value.trim();
    const resume = careerForm.querySelector('[name="attachment"]').files[0];
    
    if (!firstName || !lastName || !email || !phone || !resume) {
      if (careerErrorMessage) {
        careerErrorMessage.querySelector('div div').innerHTML = '<strong>Missing Information!</strong><br>Please fill in all required fields and upload your resume.';
        careerErrorMessage.style.display = 'flex';
      }
      return;
    }
    
    // Show loading state
    if (careerSubmitBtn) {
      careerSubmitBtn.disabled = true;
      if (careerSubmitText) careerSubmitText.textContent = 'Uploading...';
      if (careerSubmitIcon) careerSubmitIcon.className = 'fas fa-spinner loading';
    }
    
    try {
      const formData = new FormData(careerForm);
      
      // Add additional data
      formData.append('timestamp', new Date().toLocaleString());
      formData.append('source', 'QuerySmart AI Careers Page');
      formData.append('form_type', 'Career Application');
      
      console.log('Sending form data to Web3Forms...');
      
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
      });

      console.log('Response status:', response.status);
      
      const data = await response.json();
      console.log('Response data:', data);

      if (data.success) {
        if (careerSuccessMessage) {
          careerSuccessMessage.style.display = 'flex';
          careerSuccessMessage.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
          });
        }
        
        // Reset form
        careerForm.reset();
        if (fileInfo) fileInfo.style.display = 'none';
        const uploadText = document.querySelector('.upload-text');
        const uploadSubtext = document.querySelector('.upload-subtext');
        if (uploadText) uploadText.style.display = 'block';
        if (uploadSubtext) uploadSubtext.style.display = 'block';
        
      } else {
        throw new Error(data.message || 'Application submission failed');
      }
      
    } catch (error) {
      console.error('Career form submission error:', error);
      
      if (careerErrorMessage) {
        careerErrorMessage.style.display = 'flex';
        careerErrorMessage.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
      }
      
    } finally {
      // Reset button state
      if (careerSubmitBtn) {
        careerSubmitBtn.disabled = false;
        if (careerSubmitText) careerSubmitText.textContent = 'Launch Application';
        if (careerSubmitIcon) careerSubmitIcon.className = 'fas fa-rocket';
      }
    }
  });
} else {
  console.error('Career form not found!');
}

// Contact Form Handling
const contactForm = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');
const submitText = document.getElementById('submitText');
const submitIcon = document.getElementById('submitIcon');
const successMessage = document.getElementById('successMessage');
const errorMessage = document.getElementById('errorMessage');

// Form submission handling
if (contactForm) {
  contactForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Hide previous messages
    successMessage.style.display = 'none';
    errorMessage.style.display = 'none';
    
    // Show loading state
    submitBtn.disabled = true;
    submitText.textContent = 'Launching...';
    submitIcon.className = 'fas fa-spinner loading';
    
    try {
      const formData = new FormData(contactForm);
      
      // Add timestamp and source
      formData.append('timestamp', new Date().toLocaleString());
      formData.append('source', 'QuerySmart AI Website');
      
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        successMessage.style.display = 'flex';
        contactForm.reset();
        
        // Scroll to success message
        successMessage.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
        
        // Track success (if you have analytics)
        if (typeof gtag !== 'undefined') {
          gtag('event', 'form_submit', {
            event_category: 'Contact',
            event_label: 'Contact Form Success'
          });
        }
      } else {
        throw new Error(data.message || 'Form submission failed');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      errorMessage.style.display = 'flex';
      
      // Scroll to error message
      errorMessage.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      });
      
      // Track error (if you have analytics)
      if (typeof gtag !== 'undefined') {
        gtag('event', 'form_error', {
          event_category: 'Contact',
          event_label: 'Contact Form Error'
        });
      }
    } finally {
      submitBtn.disabled = false;
      submitText.textContent = 'Send Message';
      submitIcon.className = 'fas fa-rocket';
    }
  });
}

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
    header.style.background = 'rgba(10, 14, 39, 0.95)';
  } else {
    header.style.background = 'rgba(10, 14, 39, 0.7)';
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
    navMenu.style.background = 'rgba(10, 14, 39, 0.95)';
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

// Add subtle floating animation to logo
const logoIcon = document.querySelector('.logo-icon');
if (logoIcon) {
  setInterval(() => {
    logoIcon.style.transform = `translateY(${Math.sin(Date.now() / 1000) * 2}px)`;
  }, 16);
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
    outline: 2px solid var(--accent-cyan) !important;
    outline-offset: 2px;
  }
`;
document.head.appendChild(style);

// Form input enhancements
document.querySelectorAll('.form-input, .form-textarea').forEach(input => {
  input.addEventListener('focus', function() {
    this.style.transform = 'translateY(-2px)';
    this.style.boxShadow = '0 8px 25px rgba(0, 217, 255, 0.15)';
  });
  
  input.addEventListener('blur', function() {
    this.style.transform = 'translateY(0)';
    this.style.boxShadow = 'none';
  });
});

// Auto-hide messages after 10 seconds
function autoHideMessages() {
  setTimeout(() => {
    const messages = document.querySelectorAll('.form-message');
    messages.forEach(message => {
      if (message.style.display === 'flex') {
        message.style.opacity = '0.5';
        setTimeout(() => {
          message.style.display = 'none';
          message.style.opacity = '1';
        }, 2000);
      }
    });
  }, 10000);
}