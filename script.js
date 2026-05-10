/* ===== NAVBAR SCROLL ===== */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
});

/* ===== HAMBURGER MENU ===== */
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  hamburger.textContent = navLinks.classList.contains('open') ? '✕' : '☰';
});
navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.textContent = '☰';
  });
});

/* ===== SCROLL REVEAL ===== */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 80);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ===== MODAL (US34 — Demo) ===== */
const overlay = document.getElementById('modalOverlay');
const modalClose = document.getElementById('modalClose');
const demoForm = document.getElementById('demoForm');

function openModal() {
  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}
function closeModal() {
  overlay.classList.remove('active');
  document.body.style.overflow = '';
}

// Botones que abren el modal
['openModal', 'openModalBasico', 'openModalPremium', 'openModalDemo'].forEach(id => {
  const btn = document.getElementById(id);
  if (btn) btn.addEventListener('click', openModal);
});

modalClose.addEventListener('click', closeModal);
overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

/* ===== FORM VALIDATION & SUBMIT (US34 Criterio de Aceptación) ===== */
function validateField(input) {
  const errorEl = document.getElementById('error' + input.id.charAt(0).toUpperCase() + input.id.slice(1));
  if (!errorEl) return true;
  let msg = '';
  if (input.required && !input.value.trim()) {
    msg = 'Este campo es obligatorio.';
  } else if (input.type === 'email' && input.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) {
    msg = 'Ingresa un correo válido.';
  }
  errorEl.textContent = msg;
  input.classList.toggle('error', !!msg);
  return !msg;
}

demoForm.querySelectorAll('input, select, textarea').forEach(field => {
  field.addEventListener('blur', () => validateField(field));
  field.addEventListener('input', () => validateField(field));
});

demoForm.addEventListener('submit', function (e) {
  e.preventDefault();

  // Validar campos requeridos
  const nombre = document.getElementById('nombre');
  const email = document.getElementById('email');
  const valid = validateField(nombre) & validateField(email);

  if (!valid) return;

  // Simular envío (US34 — criterio de aceptación: confirmar recepción)
  const submitBtn = demoForm.querySelector('[type="submit"]');
  submitBtn.textContent = 'Enviando...';
  submitBtn.disabled = true;

  setTimeout(() => {
    closeModal();
    demoForm.reset();
    submitBtn.textContent = 'Enviar Solicitud';
    submitBtn.disabled = false;
    showToast();
  }, 1200);
});

/* ===== TOAST NOTIFICATION ===== */
function showToast() {
  const toast = document.getElementById('toast');
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 5000);
}

/* ===== FILTRO CASOS DE ÉXITO (US37) ===== */
const filterBtns = document.querySelectorAll('.filter-btn');
const successCards = document.querySelectorAll('.success-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    // Actualizar botón activo
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;

    successCards.forEach(card => {
      const match = filter === 'todos' || card.dataset.category === filter;
      if (match) {
        card.classList.remove('hidden');
        // Re-trigger entrada visual
        card.style.animation = 'none';
        card.offsetHeight; // reflow
        card.style.animation = '';
      } else {
        card.classList.add('hidden');
      }
    });
  });
});

/* ===== LINKS LEGALES (placeholders) ===== */
['privacyLink', 'transparencyLink', 'termsLink'].forEach(id => {
  const el = document.getElementById(id);
  if (el) {
    el.addEventListener('click', e => {
      e.preventDefault();
      alert('📄 Documento en preparación. BodyMatch AI está comprometido con la transparencia y la protección de tus datos conforme a la Ley 29733 del Perú.');
    });
  }
});

/* ===== SMOOTH COUNTER ANIMATION (estadísticas hero) ===== */
function animateCounter(el, target, duration = 1500) {
  const isText = isNaN(parseInt(target));
  if (isText) { el.textContent = target; return; }
  const start = 0;
  const end = parseInt(target);
  const step = end / (duration / 16);
  let current = start;
  const timer = setInterval(() => {
    current += step;
    if (current >= end) { el.textContent = end; clearInterval(timer); return; }
    el.textContent = Math.floor(current);
  }, 16);
}

const statsObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.querySelectorAll('.stat-num').forEach(num => {
      const raw = num.textContent.trim();
      animateCounter(num, raw);
    });
    statsObserver.unobserve(entry.target);
  });
}, { threshold: 0.5 });

const statsEl = document.querySelector('.hero-stats');
if (statsEl) statsObserver.observe(statsEl);
