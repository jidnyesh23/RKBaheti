/**
 * RKBaheti & Associates – Main JavaScript
 * Premium CA Firm Website
 */

'use strict';

/* ============================================================
   PRELOADER
   ============================================================ */
window.addEventListener('load', () => {
  const preloader = document.getElementById('preloader');
  if (preloader) {
    setTimeout(() => {
      preloader.classList.add('hidden');
      setTimeout(() => preloader.remove(), 650);
    }, 1800);
  }
});

/* ============================================================
   AOS INIT
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  AOS.init({
    duration: 800,
    easing: 'ease-out-cubic',
    once: true,
    offset: 60,
  });

  initNavbar();
  initHeroParticles();

  initScrollTop();
  initContactForm();
  initSmoothScroll();
  initActiveNavLinks();
});

/* ============================================================
   NAVBAR – SCROLL BEHAVIOUR & ACTIVE LINK
   ============================================================ */
function initNavbar() {
  const nav = document.getElementById('mainNav');
  if (!nav) return;

  const onScroll = () => {
    if (window.scrollY > 60) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load

  // Close mobile menu on link click
  const mobileLinks = nav.querySelectorAll('.nav-link:not(.dropdown-toggle), .dropdown-item');
  const navCollapse = document.getElementById('navbarContent');
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navCollapse && navCollapse.classList.contains('show')) {
        const bsCollapse = bootstrap.Collapse.getOrCreateInstance(navCollapse);
        bsCollapse.hide();
      }
    });
  });
}

/* ============================================================
   ACTIVE NAV – INTERSECTION OBSERVER
   ============================================================ */
function initActiveNavLinks() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.navbar-nav .nav-link:not(.dropdown-toggle):not(.nav-cta-btn)');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(section => observer.observe(section));
}

/* ============================================================
   HERO PARTICLES CANVAS
   ============================================================ */
function initHeroParticles() {
  const container = document.getElementById('hero-particles');
  if (!container) return;

  const canvas = document.createElement('canvas');
  container.appendChild(canvas);

  const ctx = canvas.getContext('2d');

  const resize = () => {
    canvas.width = container.offsetWidth;
    canvas.height = container.offsetHeight;
  };
  resize();
  window.addEventListener('resize', resize, { passive: true });

  const PARTICLE_COUNT = 55;
  const particles = Array.from({ length: PARTICLE_COUNT }, () => createParticle(canvas));

  function createParticle(canvas) {
    return {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 2 + 0.5,
      alpha: Math.random() * 0.4 + 0.1,
      color: Math.random() > 0.5 ? `rgba(46,139,139,` : `rgba(255,255,255,`,
    };
  }

  const CONNECTION_DIST = 130;

  function draw() {
    if (!canvas.isConnected) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Move particles
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `${p.color}${p.alpha})`;
      ctx.fill();
    });

    // Draw connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CONNECTION_DIST) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(46,139,139,${0.12 * (1 - dist / CONNECTION_DIST)})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(draw);
  }

  draw();
}



/* ============================================================
   SCROLL TO TOP
   ============================================================ */
function initScrollTop() {
  const btn = document.getElementById('scrollTopBtn');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ============================================================
   CONTACT FORM
   ============================================================ */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const inputs = form.querySelectorAll('[required]');
    let valid = true;

    inputs.forEach(input => {
      if (!input.value.trim()) {
        markInvalid(input);
        valid = false;
      } else {
        markValid(input);
      }
    });

    const emailInput = form.querySelector('#contactEmail');
    if (emailInput && emailInput.value && !isValidEmail(emailInput.value)) {
      markInvalid(emailInput);
      valid = false;
    }

    if (!valid) {
      showToast('⚠️ Please fill in all required fields correctly.', false);
      return;
    }

    const btn = form.querySelector('#form-submit-btn');
    const orig = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Sending...';
    btn.disabled = true;

    // Simulate submission (replace with actual backend later)
    setTimeout(() => {
      form.reset();
      btn.innerHTML = orig;
      btn.disabled = false;
      showToast('✅ Your query has been sent! We will respond within 24 hours.', true);
    }, 1800);
  });

  // Live validation feedback
  form.querySelectorAll('.form-control-custom').forEach(input => {
    input.addEventListener('blur', () => {
      if (input.hasAttribute('required') && !input.value.trim()) {
        markInvalid(input);
      } else {
        markValid(input);
      }
    });
    input.addEventListener('input', () => {
      if (input.value.trim()) markValid(input);
    });
  });
}

function markInvalid(el) {
  el.style.borderColor = '#e74c3c';
  el.style.boxShadow = '0 0 0 3px rgba(231,76,60,0.12)';
}
function markValid(el) {
  el.style.borderColor = '#2E8B8B';
  el.style.boxShadow = '0 0 0 3px rgba(46,139,139,0.1)';
}
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/* ============================================================
   TOAST NOTIFICATION
   ============================================================ */
function showToast(message, success = true) {
  const existing = document.querySelector('.toast-notif');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'toast-notif';
  toast.style.borderLeftColor = success ? 'var(--teal)' : '#e74c3c';
  toast.innerHTML = message;
  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    requestAnimationFrame(() => toast.classList.add('show'));
  });

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 400);
  }, 4500);
}

/* ============================================================
   SMOOTH SCROLLING (all internal anchor links)
   ============================================================ */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const target = link.getAttribute('href');
      if (target === '#' || target === '#0') return;
      const el = document.querySelector(target);
      if (el) {
        e.preventDefault();
        const navHeight = document.getElementById('mainNav')?.offsetHeight || 80;
        const top = el.getBoundingClientRect().top + window.scrollY - navHeight;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });
}
