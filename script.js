/**
 * VIKRAM PORTFOLIO — script.js
 * Features: Theme toggle | Particle canvas | Typewriter | Navbar |
 *           IntersectionObserver reveal | Skill cards | Project filter |
 *           Timeline animation | Animated counters | Contact form |
 *           Back-to-top | Mobile menu
 */

'use strict';

/* ===================== THEME TOGGLE ===================== */
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');
const html = document.documentElement;

// Apply saved theme on load
const savedTheme = localStorage.getItem('vk-theme') || 'dark';
html.setAttribute('data-theme', savedTheme);
updateThemeIcon(savedTheme);

themeToggle.addEventListener('click', () => {
  const current = html.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('vk-theme', next);
  updateThemeIcon(next);
});

function updateThemeIcon(theme) {
  themeIcon.className = theme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
}

/* ===================== NAVBAR ===================== */
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');

// Scroll: add .scrolled class
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}, { passive: true });

// Mobile hamburger toggle
hamburger.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  hamburger.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-expanded', isOpen.toString());
  // Toggle body class to prevent background scroll
  document.body.classList.toggle('menu-open', isOpen);
});

// Close mobile menu on nav link click
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-open');
  });
});

// Tap anywhere outside nav overlay to close (on mobile)
document.addEventListener('click', (e) => {
  if (
    navLinks.classList.contains('open') &&
    !navLinks.contains(e.target) &&
    !hamburger.contains(e.target)
  ) {
    navLinks.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-open');
  }
});

/* Active Nav Link on Scroll */
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav-link[data-section]');

function updateActiveNav() {
  let current = '';
  const scrollY = window.scrollY + window.innerHeight / 3;

  sections.forEach(section => {
    const top = section.offsetTop;
    const h = section.offsetHeight;
    if (scrollY >= top && scrollY < top + h) {
      current = section.getAttribute('id');
    }
  });

  navItems.forEach(link => {
    link.classList.toggle('active', link.dataset.section === current);
  });
}

window.addEventListener('scroll', updateActiveNav, { passive: true });
updateActiveNav();

/* ===================== PARTICLE CANVAS ===================== */
(function initParticles() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let particles = [];
  let W, H;
  let raf;

  function resize() {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function Particle() {
    this.reset();
  }

  Particle.prototype.reset = function () {
    this.x = Math.random() * W;
    this.y = Math.random() * H;
    this.r = Math.random() * 1.5 + 0.4;
    this.vx = (Math.random() - 0.5) * 0.4;
    this.vy = (Math.random() - 0.5) * 0.4;
    this.a = Math.random() * 0.5 + 0.1;
  };

  function buildParticles() {
    const count = Math.floor((W * H) / 8000);
    particles = Array.from({ length: count }, () => new Particle());
  }

  function getAccentColor() {
    const theme = html.getAttribute('data-theme');
    return theme === 'dark' ? '0,245,160' : '0,158,104';
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    const color = getAccentColor();

    particles.forEach(p => {
      // Move
      p.x += p.vx;
      p.y += p.vy;

      // Wrap
      if (p.x < 0) p.x = W;
      if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H;
      if (p.y > H) p.y = 0;

      // Draw dot
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${color},${p.a})`;
      ctx.fill();
    });

    // Draw connecting lines
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(${color},${0.08 * (1 - dist / 100)})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }

    raf = requestAnimationFrame(draw);
  }

  const resizeObs = new ResizeObserver(() => {
    resize();
    buildParticles();
  });
  resizeObs.observe(canvas.parentElement);

  resize();
  buildParticles();
  draw();
})();

/* ===================== TYPEWRITER EFFECT ===================== */
(function initTypewriter() {
  const el = document.getElementById('typewriter-text');
  if (!el) return;

  const roles = [
    'Web Developer',
    'Video Editor',
    'Digital Creator',
    'Marketing Enthusiast',
    'AI Enthusiast',
  ];

  let roleIdx = 0;
  let charIdx = 0;
  let deleting = false;
  let timeout;

  function type() {
    const word = roles[roleIdx];

    if (!deleting) {
      el.textContent = word.slice(0, charIdx + 1);
      charIdx++;
      if (charIdx === word.length) {
        // Pause then start deleting
        timeout = setTimeout(() => { deleting = true; type(); }, 2000);
        return;
      }
    } else {
      el.textContent = word.slice(0, charIdx - 1);
      charIdx--;
      if (charIdx === 0) {
        deleting = false;
        roleIdx = (roleIdx + 1) % roles.length;
      }
    }

    const speed = deleting ? 60 : 110;
    timeout = setTimeout(type, speed);
  }

  type();
})();

/* ===================== INTERSECTION OBSERVER REVEAL ===================== */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ===================== SKILL CARDS STAGGER ===================== */
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const cards = entry.target.querySelectorAll('.skill-card');
      cards.forEach((card, i) => {
        const delay = parseInt(card.dataset.delay || i) * 80;
        setTimeout(() => {
          card.classList.add('visible');
        }, delay);
      });
      skillObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.skills-category').forEach(cat => skillObserver.observe(cat));

/* ===================== PROJECT FILTER ===================== */
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    // Update active state
    filterBtns.forEach(b => {
      b.classList.remove('active');
      b.setAttribute('aria-pressed', 'false');
    });
    btn.classList.add('active');
    btn.setAttribute('aria-pressed', 'true');

    const filter = btn.dataset.filter;

    projectCards.forEach(card => {
      const match = filter === 'all' || card.dataset.category === filter;
      if (match) {
        card.classList.remove('hidden');
        // Re-trigger entrance animation
        card.style.animation = 'none';
        card.getBoundingClientRect(); // force reflow
        card.style.animation = '';
      } else {
        card.classList.add('hidden');
      }
    });
  });
});

/* ===================== MOBILE TAP-TO-REVEAL PROJECT OVERLAYS ===================== */
// On touch devices, tap a project card to reveal its overlay
(function initMobileTap() {
  if (!('ontouchstart' in window)) return; // desktop: do nothing

  const cards = document.querySelectorAll('.project-card');
  cards.forEach(card => {
    card.addEventListener('click', (e) => {
      // If they clicked a link inside overlay, let it through
      if (e.target.closest('a')) return;

      const isOpen = card.classList.contains('touched');
      // Close all others first
      cards.forEach(c => c.classList.remove('touched'));
      // Toggle this one
      if (!isOpen) card.classList.add('touched');
    });
  });

  // Tap outside any card to close overlays
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.project-card')) {
      cards.forEach(c => c.classList.remove('touched'));
    }
  });
})();

/* ===================== ANIMATED COUNTERS ===================== */
function animateCounter(el, target, duration = 1500) {
  let start = 0;
  const step = target / (duration / 16);

  function update() {
    start += step;
    if (start < target) {
      el.textContent = Math.floor(start);
      requestAnimationFrame(update);
    } else {
      el.textContent = target;
    }
  }
  update();
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.stat-number').forEach(el => {
        const target = parseInt(el.dataset.target, 10);
        animateCounter(el, target);
      });
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const statsEl = document.querySelector('.about-stats');
if (statsEl) counterObserver.observe(statsEl);

/* ===================== TIMELINE ANIMATION ===================== */
(function initTimeline() {
  const fill = document.getElementById('timeline-fill');
  const timeline = document.getElementById('timeline');
  if (!fill || !timeline) return;

  function updateFill() {
    const rect = timeline.getBoundingClientRect();
    const winH = window.innerHeight;
    const totalH = timeline.scrollHeight;

    // How far we've scrolled into the timeline
    const scrolled = Math.max(0, winH - rect.top);
    const pct = Math.min(100, (scrolled / (totalH + winH)) * 180);

    fill.style.height = pct + '%';
  }

  window.addEventListener('scroll', updateFill, { passive: true });
  updateFill();
})();

/* Timeline item dots animate on scroll via revealObserver (already set) */

/* ===================== CONTACT FORM ===================== */
(function initContactForm() {
  const form = document.getElementById('contact-form');
  const success = document.getElementById('form-success');
  const submitBtn = document.getElementById('submit-btn');
  const btnText = submitBtn?.querySelector('.btn-text');
  const btnLoad = submitBtn?.querySelector('.btn-loading');
  const sendAnother = document.getElementById('send-another');

  if (!form) return;

  // Validation helpers
  function showError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const error = document.getElementById(fieldId + '-error');
    if (field) field.classList.add('error');
    if (error) error.textContent = message;
  }

  function clearError(fieldId) {
    const field = document.getElementById(fieldId);
    const error = document.getElementById(fieldId + '-error');
    if (field) field.classList.remove('error');
    if (error) error.textContent = '';
  }

  function clearAllErrors() {
    ['name', 'email', 'subject', 'message'].forEach(id => clearError(id));
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function validate() {
    let valid = true;

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value.trim();

    clearAllErrors();

    if (!name) {
      showError('name', 'Please enter your name.');
      valid = false;
    } else if (name.length < 2) {
      showError('name', 'Name must be at least 2 characters.');
      valid = false;
    }

    if (!email) {
      showError('email', 'Please enter your email address.');
      valid = false;
    } else if (!isValidEmail(email)) {
      showError('email', 'Please enter a valid email address.');
      valid = false;
    }

    if (!subject) {
      showError('subject', 'Please select a subject.');
      valid = false;
    }

    if (!message) {
      showError('message', 'Please enter a message.');
      valid = false;
    } else if (message.length < 15) {
      showError('message', 'Message must be at least 15 characters.');
      valid = false;
    }

    return valid;
  }

  // Real-time error clearing
  ['name', 'email', 'subject', 'message'].forEach(id => {
    const field = document.getElementById(id);
    if (field) {
      field.addEventListener('input', () => clearError(id));
      field.addEventListener('change', () => clearError(id));
    }
  });

  // Form submit
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!validate()) return;

    // Loading state
    submitBtn.disabled = true;
    btnText.hidden = true;
    btnLoad.hidden = false;

    // Simulate async send (no backend)
    setTimeout(() => {
      // Show success
      form.hidden = true;
      success.hidden = false;

      // Reset for next time
      submitBtn.disabled = false;
      btnText.hidden = false;
      btnLoad.hidden = true;
    }, 1500);
  });

  // Send another message
  if (sendAnother) {
    sendAnother.addEventListener('click', () => {
      form.reset();
      clearAllErrors();
      form.hidden = false;
      success.hidden = true;
    });
  }
})();

/* ===================== BACK TO TOP ===================== */
(function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

/* ===================== SMOOTH SCROLL POLYFILL ===================== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const targetId = anchor.getAttribute('href');
    if (targetId === '#') return;

    const target = document.querySelector(targetId);
    if (!target) return;

    e.preventDefault();
    const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 72;
    const top = target.getBoundingClientRect().top + window.scrollY - navH;

    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ===================== INIT COMPLETE ===================== */
console.log('%c⚡ Portfolio of Vikram — Loaded', 'color: #00f5a0; font-weight: 700; font-size: 14px;');
