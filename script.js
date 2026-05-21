/* ============================================================
   Grupo L&N — Conservadora · JavaScript Principal
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ── HEADER: muda cor ao rolar ──────────────────────────────
  const header = document.getElementById('header');

  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 60);
  });


  // ── MENU MOBILE (hamburger) ────────────────────────────────
  const hamburger   = document.getElementById('hamburger');
  const mobileMenu  = document.getElementById('mobileMenu');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
  });

  // Fecha o menu ao clicar em qualquer link
  mobileMenu.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
    });
  });


  // ── SCROLL REVEAL ─────────────────────────────────────────
  const revealEls = document.querySelectorAll(
    '.reveal, .reveal-left, .reveal-right, .pillar'
  );

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealEls.forEach(el => revealObserver.observe(el));


  // ── CONTADOR ANIMADO (estatísticas do hero) ────────────────
  function animateCounter(el, target) {
    let current = 0;
    const step  = Math.ceil(target / 40);

    const timer = setInterval(() => {
      current = Math.min(current + step, target);
      // preserva o <span> do sufixo ("+", etc.)
      el.childNodes[0].textContent = current;
      if (current >= target) clearInterval(timer);
    }, 35);
  }

  const statsSection = document.querySelector('.hero-stats');

  if (statsSection) {
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          document.querySelectorAll('[data-target]').forEach(el => {
            animateCounter(el, parseInt(el.dataset.target, 10));
          });
          statsObserver.disconnect();
        }
      });
    }, { threshold: 0.5 });

    statsObserver.observe(statsSection);
  }


  // ── SMOOTH SCROLL para âncoras internas ───────────────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });


  // ── NEWSLETTER: feedback ao se inscrever ──────────────────
  const newsBtn   = document.querySelector('.news-form .btn');
  const newsInput = document.querySelector('.news-form input');

  if (newsBtn && newsInput) {
    newsBtn.addEventListener('click', () => {
      if (newsInput.value && newsInput.value.includes('@')) {
        newsInput.value       = '';
        newsInput.placeholder = '✓ Inscrito com sucesso!';
        setTimeout(() => {
          newsInput.placeholder = 'Seu melhor e-mail';
        }, 3000);
      }
    });
  }

});