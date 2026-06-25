document.addEventListener('DOMContentLoaded', () => {

  // ==========================================================================
  // 1. Header Scroll Tracking (Glassmorphism Effect)
  // ==========================================================================
  const header = document.getElementById('main-header');
  
  const handleScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll);
  // Run on load in case the page is already scrolled
  handleScroll();


  // ==========================================================================
  // 2. Mobile Menu Toggle
  // ==========================================================================
  const menuToggle = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-links a, .nav-cta');

  if (menuToggle && navMenu) {
    const toggleMenu = () => {
      const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', !isExpanded);
      menuToggle.classList.toggle('open');
      navMenu.classList.toggle('active');
    };

    menuToggle.addEventListener('click', toggleMenu);

    // Close menu when clicking navigation links
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.classList.remove('open');
        navMenu.classList.remove('active');
      });
    });
  }


  // ==========================================================================
  // 3. FAQ Accordion Accordion Logic
  // ==========================================================================
  const faqTriggers = document.querySelectorAll('.faq-trigger');

  faqTriggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const parent = trigger.parentElement;
      const content = trigger.nextElementSibling;
      const isExpanded = trigger.getAttribute('aria-expanded') === 'true';
      
      // Close other accordion items (optional, but makes layout cleaner)
      faqTriggers.forEach(otherTrigger => {
        if (otherTrigger !== trigger) {
          otherTrigger.setAttribute('aria-expanded', 'false');
          otherTrigger.nextElementSibling.style.maxHeight = null;
        }
      });

      // Toggle current item
      if (isExpanded) {
        trigger.setAttribute('aria-expanded', 'false');
        content.style.maxHeight = null;
      } else {
        trigger.setAttribute('aria-expanded', 'true');
        content.style.maxHeight = content.scrollHeight + 'px';
      }
    });
  });


  // ==========================================================================
  // 4. Scroll-Reveal Animation (Intersection Observer)
  // ==========================================================================
  const animatedElements = document.querySelectorAll('.fade-in');

  if ('IntersectionObserver' in window) {
    const observerOptions = {
      root: null, // viewport
      threshold: 0.1, // trigger when 10% of element is visible
      rootMargin: '0px 0px -50px 0px' // offset to trigger slightly before element is on screen
    };

    const revealCallback = (entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Once animated, we don't need to observe it anymore
          observer.unobserve(entry.target);
        }
      });
    };

    const observer = new IntersectionObserver(revealCallback, observerOptions);
    
    animatedElements.forEach(element => {
      observer.observe(element);
    });
  } else {
    // Fallback if IntersectionObserver is not supported: show elements immediately
    animatedElements.forEach(element => {
      element.classList.add('visible');
    });
  }


  // ==========================================================================
  // 5. Contact Form Submission & Validation Logic
  // ==========================================================================
  const contactForm = document.getElementById('contact-form');
  const successMsgContainer = document.getElementById('contact-success-msg');
  const successUserName = document.getElementById('success-user-name');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('contact-name');
      const emailInput = document.getElementById('contact-email');
      const messageInput = document.getElementById('contact-message');

      let isValid = true;

      // Full Name Validation
      if (!nameInput.value.trim()) {
        nameInput.classList.add('invalid');
        document.getElementById('name-error').style.display = 'block';
        isValid = false;
      } else {
        nameInput.classList.remove('invalid');
        document.getElementById('name-error').style.display = 'none';
      }

      // Email Validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailInput.value.trim() || !emailRegex.test(emailInput.value.trim())) {
        emailInput.classList.add('invalid');
        document.getElementById('email-error').style.display = 'block';
        isValid = false;
      } else {
        emailInput.classList.remove('invalid');
        document.getElementById('email-error').style.display = 'none';
      }

      // Message Validation
      if (!messageInput.value.trim()) {
        messageInput.classList.add('invalid');
        document.getElementById('message-error').style.display = 'block';
        isValid = false;
      } else {
        messageInput.classList.remove('invalid');
        document.getElementById('message-error').style.display = 'none';
      }

      if (isValid) {
        // Extract first name for a personalized message
        const firstName = nameInput.value.trim().split(' ')[0];
        if (successUserName) {
          successUserName.textContent = firstName;
        }

        // Hide form fields and display success block
        contactForm.style.display = 'none';
        if (successMsgContainer) {
          successMsgContainer.style.display = 'flex';
        }
      }
    });

    // UX: Remove invalid style and error text when typing
    const formFields = contactForm.querySelectorAll('input, textarea');
    formFields.forEach(field => {
      field.addEventListener('input', () => {
        if (field.classList.contains('invalid')) {
          field.classList.remove('invalid');
          const errorId = `${field.id.replace('contact-', '')}-error`;
          const errorElement = document.getElementById(errorId);
          if (errorElement) {
            errorElement.style.display = 'none';
          }
        }
      });
    });
  }
});
