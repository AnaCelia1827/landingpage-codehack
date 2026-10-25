const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.site-nav');

menuButton?.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!open));
  menuButton.setAttribute('aria-label', open ? 'Abrir menu' : 'Fechar menu');
  navigation.classList.toggle('is-open', !open);
});

navigation?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  menuButton?.setAttribute('aria-expanded', 'false');
  menuButton?.setAttribute('aria-label', 'Abrir menu');
  navigation.classList.remove('is-open');
}));

document.getElementById('year').textContent = new Date().getFullYear();

const hero = document.querySelector('.hero');
const finePointer = window.matchMedia('(pointer: fine)');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

if (hero && finePointer.matches && !reducedMotion.matches) {
  let frame = 0;
  hero.addEventListener('pointermove', (event) => {
    if (frame) return;
    frame = requestAnimationFrame(() => {
      const rect = hero.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      hero.style.setProperty('--hero-x', `${-x * 18}px`);
      hero.style.setProperty('--hero-y', `${-y * 12}px`);
      hero.style.setProperty('--hero-left-x', `${x * 18}px`);
      hero.style.setProperty('--hero-left-y', `${y * 12}px`);
      frame = 0;
    });
  });
  hero.addEventListener('pointerleave', () => {
    hero.style.setProperty('--hero-x', '0px');
    hero.style.setProperty('--hero-y', '0px');
    hero.style.setProperty('--hero-left-x', '0px');
    hero.style.setProperty('--hero-left-y', '0px');
  });
}

let burstTimer;
hero?.addEventListener('pointerdown', () => {
  if (reducedMotion.matches) return;
  hero.classList.remove('hero-burst');
  void hero.offsetWidth;
  hero.classList.add('hero-burst');
  clearTimeout(burstTimer);
  burstTimer = setTimeout(() => hero.classList.remove('hero-burst'), 850);
});

if (hero && 'IntersectionObserver' in window) {
  const heroVisibility = new IntersectionObserver(([entry]) => {
    hero.classList.toggle('is-paused', !entry.isIntersecting || document.hidden);
  });
  heroVisibility.observe(hero);
  document.addEventListener('visibilitychange', () => {
    hero.classList.toggle('is-paused', document.hidden || hero.getBoundingClientRect().bottom < 0);
  });
}

if ('IntersectionObserver' in window && !reducedMotion.matches) {
  const groups = [
    ['.challenge-grid, .section-heading, .make-intro, .deliverables h3, .faq-grid > div:first-child, .cta-inner', 'motion-copy'],
    ['.step, .track, .judge, .practical-panel', 'motion-card'],
    ['.deliverable, .schedule-note, .partner-inner, .faq details', 'motion-row'],
  ];
  const targets = groups.flatMap(([selector, className]) =>
    [...document.querySelectorAll(selector)].map((element, index) => {
      element.classList.add('motion-target', className);
      element.style.setProperty('--motion-delay', `${Math.min(index % 3, 2) * 85}ms`);
      return element;
    })
  );
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('motion-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.08, rootMargin: '0px 0px 40px 0px' });
  targets.forEach((target) => observer.observe(target));
  document.body.classList.add('motion-ready');
}

document.querySelectorAll('.track, .step, .practical-panel').forEach((element) => {
  let tapTimer;
  element.addEventListener('pointerdown', () => {
    if (reducedMotion.matches) return;
    element.classList.add('is-tapped');
    clearTimeout(tapTimer);
    tapTimer = setTimeout(() => element.classList.remove('is-tapped'), 360);
  });
});
