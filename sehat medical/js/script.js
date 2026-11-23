/* ============================================
   INIT LUCIDE ICONS
============================================ */
lucide.createIcons();

/* ============================================
   AOS INIT
============================================ */
AOS.init({
  duration: 800,
  easing: 'ease-out-cubic',
  once: true,
  offset: 60,
  disable: window.matchMedia('(prefers-reduced-motion: reduce)').matches
});

/* ============================================
   NAVBAR SCROLL
============================================ */
const navbar = document.getElementById('navbar');
const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
  const scrolled = window.scrollY > 50;
  navbar.classList.toggle('scrolled', scrolled);
  backToTop.classList.toggle('show', window.scrollY > 400);
});

/* ============================================
   BACK TO TOP
============================================ */
backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ============================================
   SIDEBAR
============================================ */
const hamburger = document.getElementById('hamburger');
const sidebar = document.getElementById('sidebar');
const sidebarOverlay = document.getElementById('sidebarOverlay');
const sidebarClose = document.getElementById('sidebarClose');
const sidebarLinks = document.querySelectorAll('.sidebar-link, .sidebar-cta a');

function openSidebar() {
  sidebar.classList.add('active');
  sidebarOverlay.classList.add('active');
  hamburger.classList.add('active');
  hamburger.setAttribute('aria-expanded', 'true');
  sidebar.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeSidebar() {
  sidebar.classList.remove('active');
  sidebarOverlay.classList.remove('active');
  hamburger.classList.remove('active');
  hamburger.setAttribute('aria-expanded', 'false');
  sidebar.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

hamburger.addEventListener('click', () => {
  if (sidebar.classList.contains('active')) closeSidebar();
  else openSidebar();
});

sidebarClose.addEventListener('click', closeSidebar);
sidebarOverlay.addEventListener('click', closeSidebar);

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && sidebar.classList.contains('active')) {
    closeSidebar();
  }
});

sidebarLinks.forEach(link => {
  link.addEventListener('click', () => {
    closeSidebar();
  });
});

/* ============================================
   ACTIVE NAV LINK ON SCROLL
============================================ */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

function updateActiveNav() {
  const scrollPos = window.scrollY + 120;
  sections.forEach(section => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    const id = section.getAttribute('id');
    if (scrollPos >= top && scrollPos < top + height) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + id) {
          link.classList.add('active');
        }
      });
    }
  });
}

window.addEventListener('scroll', updateActiveNav);

/* ============================================
   ANIMATED COUNTERS (GSAP)
============================================ */
function animateCounter(el) {
  const target = parseInt(el.dataset.count, 10);
  const suffix = el.dataset.suffix || '';
  const obj = { val: 0 };

  gsap.to(obj, {
    val: target,
    duration: 2.2,
    ease: 'power2.out',
    onUpdate: () => {
      el.textContent = Math.floor(obj.val) + suffix;
    }
  });
}

const counters = document.querySelectorAll('[data-count]');
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

counters.forEach(c => counterObserver.observe(c));

/* ============================================
   TESTIMONIALS SLIDER
============================================ */
const track = document.getElementById('testimonialsTrack');
const slides = track.querySelectorAll('.testimonial-slide');
const prevBtn = document.getElementById('prevTestimonial');
const nextBtn = document.getElementById('nextTestimonial');
const dotsContainer = document.getElementById('testimonialsDots');
let currentSlide = 0;
let autoSlideInterval;

// Create dots
slides.forEach((_, i) => {
  const dot = document.createElement('div');
  dot.className = 'testimonial-dot' + (i === 0 ? ' active' : '');
  dot.addEventListener('click', () => goToSlide(i));
  dotsContainer.appendChild(dot);
});

const dots = dotsContainer.querySelectorAll('.testimonial-dot');

function goToSlide(index) {
  currentSlide = (index + slides.length) % slides.length;
  track.style.transform = `translateX(-${currentSlide * 100}%)`;
  dots.forEach((d, i) => d.classList.toggle('active', i === currentSlide));
}

function nextSlide() { goToSlide(currentSlide + 1); }
function prevSlide() { goToSlide(currentSlide - 1); }

nextBtn.addEventListener('click', () => { nextSlide(); resetAutoSlide(); });
prevBtn.addEventListener('click', () => { prevSlide(); resetAutoSlide(); });

function startAutoSlide() {
  autoSlideInterval = setInterval(nextSlide, 6000);
}

function resetAutoSlide() {
  clearInterval(autoSlideInterval);
  startAutoSlide();
}

startAutoSlide();

// Touch swipe support
let touchStartX = 0;
let touchEndX = 0;

track.addEventListener('touchstart', (e) => {
  touchStartX = e.changedTouches[0].screenX;
}, { passive: true });

track.addEventListener('touchend', (e) => {
  touchEndX = e.changedTouches[0].screenX;
  const diff = touchStartX - touchEndX;
  if (Math.abs(diff) > 50) {
    if (diff > 0) nextSlide();
    else prevSlide();
    resetAutoSlide();
  }
});

/* ============================================
   APPOINTMENT FORM VALIDATION
============================================ */
const form = document.getElementById('appointmentForm');
const formSuccess = document.getElementById('formSuccess');
const dateInput = document.getElementById('appointmentDate');

// Set min date to today
const today = new Date().toISOString().split('T')[0];
dateInput.setAttribute('min', today);

function validateField(field) {
  const group = field.closest('.form-group');
  if (!group) return true;

  let isValid = true;

  if (field.hasAttribute('required') && !field.value.trim()) {
    isValid = false;
  }

  if (field.type === 'email' && field.value.trim()) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    isValid = emailRegex.test(field.value.trim());
  }

  if (field.type === 'tel' && field.value.trim()) {
    const phoneRegex = /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\./0-9]*$/;
    isValid = phoneRegex.test(field.value.replace(/\s/g, '')) && field.value.replace(/\D/g, '').length >= 9;
  }

  if (field.type === 'date' && field.value) {
    const selectedDate = new Date(field.value);
    const todayDate = new Date();
    todayDate.setHours(0, 0, 0, 0);
    if (selectedDate < todayDate) isValid = false;
  }

  group.classList.toggle('error', !isValid);
  return isValid;
}

// Real-time validation
form.querySelectorAll('.form-control').forEach(field => {
  field.addEventListener('blur', () => validateField(field));
  field.addEventListener('input', () => {
    const group = field.closest('.form-group');
    if (group && group.classList.contains('error')) {
      validateField(field);
    }
  });
});

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const requiredFields = form.querySelectorAll('[required]');
  let allValid = true;

  requiredFields.forEach(field => {
    if (!validateField(field)) allValid = false;
  });

  // Also validate optional email if filled
  const emailField = document.getElementById('patientEmail');
  if (emailField.value.trim() && !validateField(emailField)) {
    allValid = false;
  }

  if (allValid) {
    // Simulate submission
    const submitBtn = form.querySelector('.form-submit');
    const originalHTML = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i data-lucide="loader-2" style="animation:spin 1s linear infinite;"></i> Submitting...';
    submitBtn.disabled = true;
    lucide.createIcons();

    setTimeout(() => {
      formSuccess.classList.add('show');
      submitBtn.innerHTML = originalHTML;
      submitBtn.disabled = false;
      lucide.createIcons();

      // Scroll to success message
      formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });

      // Reset form after delay
      setTimeout(() => {
        form.reset();
        formSuccess.classList.remove('show');
      }, 8000);
    }, 1200);
  } else {
    // Scroll to first error
    const firstError = form.querySelector('.form-group.error');
    if (firstError) {
      firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }
});

/* ============================================
   GSAP HERO ENTRANCE
============================================ */
gsap.registerPlugin(ScrollTrigger);

// Subtle floating animation for hero cards
gsap.utils.toArray('.float-card').forEach((card, i) => {
  gsap.to(card, {
    y: -15,
    duration: 3 + i * 0.5,
    ease: 'sine.inOut',
    yoyo: true,
    repeat: -1
  });
});

// Parallax on hero background shapes
gsap.to('.hero::before', {
  y: -50,
  scrollTrigger: {
    trigger: '.hero',
    start: 'top top',
    end: 'bottom top',
    scrub: 1
  }
});

/* ============================================
   SMOOTH SCROLL FOR ANCHOR LINKS
============================================ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    if (href === '#' || href.length < 2) return;

    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      const offset = 80;
      const targetPos = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: targetPos, behavior: 'smooth' });
    }
  });
});

/* ============================================
   INITIAL STATE
============================================ */
window.addEventListener('load', () => {
  document.body.style.opacity = '1';
});