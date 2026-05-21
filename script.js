/* ============================================================
   Grupo L&N — Conservadora · JavaScript Principal
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ── HEADER: muda cor e troca LOGO ao rolar ─────────────────
  const header = document.getElementById('header');
  const logoImg = document.getElementById('header-logo');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      header.classList.add('scrolled');
      if (logoImg) logoImg.src = 'imgs/lnwhite.webp';
    } else {
      header.classList.remove('scrolled');
      if (logoImg) logoImg.src = 'imgs/lnorange.webp';
    }
  });


  // ── MENU MOBILE (hamburger) ────────────────────────────────
  const hamburger   = document.getElementById('hamburger');
  const mobileMenu  = document.getElementById('mobileMenu');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
  });

  mobileMenu.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
    });
  });


  // ── SCROLL REVEAL ─────────────────────────────────────────
  const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .pillar');

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


  // ── INTEGRAÇÃO EMAILJS E VALIDAÇÕES ─────────────────────────
  emailjs.init("JT5Z5uznjfwDW16PH");

  const formCotacao = document.getElementById('form-cotacao');
  const phoneInput = document.querySelector('input[name="user_phone"]');
  const emailInput = document.querySelector('input[name="user_email"]');
  
  const errorPhone = document.getElementById('error-phone');
  const errorEmail = document.getElementById('error-email');

  // Máscara de Telefone (Formata enquanto digita: (31) 99999-9999)
  if (phoneInput) {
    phoneInput.addEventListener('input', function (e) {
      let x = e.target.value.replace(/\D/g, '').match(/(\d{0,2})(\d{0,5})(\d{0,4})/);
      e.target.value = !x[2] ? x[1] : '(' + x[1] + ') ' + x[2] + (x[3] ? '-' + x[3] : '');
      
      // Remove o erro visual se o usuário começar a consertar
      if (e.target.value.replace(/\D/g, '').length >= 10) {
        errorPhone.style.display = 'none';
        phoneInput.classList.remove('input-error');
      }
    });
  }

  // Remove o erro de e-mail enquanto o usuário digita
  if (emailInput) {
    emailInput.addEventListener('input', function() {
      errorEmail.style.display = 'none';
      emailInput.classList.remove('input-error');
    });
  }

  // Validação estrita de formato de E-mail
  function isEmailValid(email) {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
  }

  if (formCotacao) {
    formCotacao.addEventListener('submit', function(event) {
      event.preventDefault(); 
      let isValid = true;

      // Valida Telefone (deve ter no mínimo 10 dígitos numéricos: DDD + 8 números)
      const phoneDigits = phoneInput.value.replace(/\D/g, '');
      if (phoneDigits.length < 10) {
        errorPhone.textContent = "Insira um número de telefone válido com DDD.";
        errorPhone.style.display = 'block';
        phoneInput.classList.add('input-error');
        isValid = false;
      }

      // Valida E-mail (exige @ e domínio, ex: gmail.com)
      if (!isEmailValid(emailInput.value)) {
        errorEmail.textContent = "Insira um e-mail válido (ex: seu.nome@gmail.com).";
        errorEmail.style.display = 'block';
        emailInput.classList.add('input-error');
        isValid = false;
      }

      // Se houver erro, para a execução aqui e não envia o e-mail
      if (!isValid) return;

      const btn = this.querySelector('button[type="submit"]');
      const btnOriginalText = btn.innerHTML;
      btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';

      // Envia via EmailJS
      emailjs.sendForm('service_6bck65v', 'template_fra41cd', this)
        .then(() => {
          btn.innerHTML = '<i class="fas fa-check"></i> Cotação Enviada!';
          this.reset(); 
          
          setTimeout(() => {
            btn.innerHTML = btnOriginalText;
          }, 4000);
        }, (error) => {
          console.error("Erro no EmailJS:", error);
          btn.innerHTML = '<i class="fas fa-xmark"></i> Erro ao enviar';
          
          setTimeout(() => {
            btn.innerHTML = btnOriginalText;
          }, 4000);
        });
    });
  }

});