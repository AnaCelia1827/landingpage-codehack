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

document.querySelectorAll('a[href="#inscricoes"]').forEach((link) => {
  link.addEventListener('click', () => {
    const registrationInfo = document.getElementById('inscricoes');
    if (registrationInfo instanceof HTMLDetailsElement) registrationInfo.open = true;
  });
});

const hero = document.querySelector('.hero');
const finePointer = window.matchMedia('(pointer: fine)');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

document.querySelectorAll('.faq details').forEach((details) => {
  let openedOnHover = false;
  details.addEventListener('pointerenter', (event) => {
    if (event.pointerType !== 'mouse' || details.open) return;
    openedOnHover = true;
    details.open = true;
  });
  details.addEventListener('pointerleave', (event) => {
    if (event.pointerType !== 'mouse' || !openedOnHover) return;
    if (!details.matches(':focus-within')) details.open = false;
    openedOnHover = false;
  });
  details.querySelector('summary').addEventListener('click', () => { openedOnHover = false; });
});

const countdown = document.querySelector('.hero-countdown');
if (countdown) {
  // This preview deliberately uses a fictional deadline, independent of the event date.
  const duration = ((20 * 24 + 8) * 60 + 30) * 60 * 1000;
  const storageKey = 'codehack-demo-countdown-v1';
  let deadline = Date.now() + duration;
  let countdownTimer = 0;
  try {
    const savedDeadline = Number(localStorage.getItem(storageKey));
    if (savedDeadline > Date.now() && savedDeadline <= Date.now() + duration) deadline = savedDeadline;
    else localStorage.setItem(storageKey, String(deadline));
  } catch { /* The preview also works when browser storage is unavailable. */ }

  const updateCountdown = () => {
    const seconds = Math.max(0, Math.floor((deadline - Date.now()) / 1000));
    const values = { days: Math.floor(seconds / 86400), hours: Math.floor(seconds / 3600) % 24, minutes: Math.floor(seconds / 60) % 60, seconds: seconds % 60 };
    Object.entries(values).forEach(([unit, value]) => {
      countdown.querySelector(`[data-countdown="${unit}"]`).textContent = String(value).padStart(2, '0');
    });
    if (seconds === 0) clearInterval(countdownTimer);
  };
  const startCountdown = () => {
    clearInterval(countdownTimer);
    updateCountdown();
    if (!document.hidden && deadline > Date.now()) countdownTimer = setInterval(updateCountdown, 1000);
  };
  document.addEventListener('visibilitychange', startCountdown);
  startCountdown();
}

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

const audienceBoard = document.querySelector('.audience-board');
const audiencePasses = [...document.querySelectorAll('.audience-pass')];
if (audienceBoard && audiencePasses.length) {
  const badges = audiencePasses.map((element, index) => ({
    element,
    rest: [-1.5, 1, -0.5][index] ?? 0,
    angle: [-1.5, 1, -0.5][index] ?? 0,
    velocity: 0,
    hover: 0,
    phase: index * 2.1,
  }));
  let visible = false;
  let frame = 0;
  let previousTime = 0;

  const animateBadges = (time) => {
    if (!visible || document.hidden || reducedMotion.matches) {
      frame = 0;
      previousTime = 0;
      return;
    }
    const elapsed = previousTime ? Math.min((time - previousTime) / 1000, 0.04) : 0.016;
    previousTime = time;
    badges.forEach((badge) => {
      const breeze = Math.sin(time * 0.0009 + badge.phase) * 0.65;
      const target = badge.rest + breeze + badge.hover;
      badge.velocity += ((target - badge.angle) * 32 - badge.velocity * 7.5) * elapsed;
      const limit = window.innerWidth <= 760 ? 5.5 : 7.5;
      badge.angle = Math.max(-limit, Math.min(limit, badge.angle + badge.velocity * elapsed));
      badge.element.style.transform = `rotate(${badge.angle.toFixed(3)}deg)`;
    });
    frame = requestAnimationFrame(animateBadges);
  };

  const startBadges = () => {
    if (visible && !document.hidden && !reducedMotion.matches && !frame) {
      frame = requestAnimationFrame(animateBadges);
    }
  };

  const nudgeBadge = (badge, event) => {
    if (reducedMotion.matches) return;
    const bounds = badge.element.getBoundingClientRect();
    const direction = event.clientX < bounds.left + bounds.width / 2 ? -1 : 1;
    badge.velocity = Math.max(-80, Math.min(80, badge.velocity + direction * 58));
    startBadges();
  };

  badges.forEach((badge) => {
    badge.element.style.transform = `rotate(${badge.rest}deg)`;
    badge.element.addEventListener('pointerenter', (event) => {
      if (event.pointerType === 'mouse') nudgeBadge(badge, event);
    });
    badge.element.addEventListener('pointermove', (event) => {
      if (event.pointerType === 'touch' || reducedMotion.matches) return;
      const bounds = badge.element.getBoundingClientRect();
      const position = (event.clientX - bounds.left) / bounds.width;
      badge.hover = Math.max(-3.6, Math.min(3.6, (position - 0.5) * 7.2));
      badge.velocity = Math.max(-80, Math.min(80, badge.velocity + Math.max(-20, Math.min(20, (event.movementX || 0) * 1.4))));
      startBadges();
    });
    badge.element.addEventListener('pointerleave', () => { badge.hover = 0; });
    badge.element.addEventListener('pointerdown', (event) => nudgeBadge(badge, event));
  });

  if ('IntersectionObserver' in window) {
    const audienceVisibility = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      startBadges();
    }, { rootMargin: '100px' });
    audienceVisibility.observe(audienceBoard);
  } else {
    visible = true;
    startBadges();
  }
  document.addEventListener('visibilitychange', startBadges);
  reducedMotion.addEventListener('change', () => {
    if (reducedMotion.matches) {
      cancelAnimationFrame(frame);
      frame = 0;
      badges.forEach((badge) => {
        badge.hover = 0;
        badge.velocity = 0;
        badge.element.style.transform = `rotate(${badge.rest}deg)`;
      });
    } else {
      startBadges();
    }
  });
}

// The mobile carousel scrolls each complete badge, including its strap.
const passTrack = document.querySelector('.audience-passes');
const mobileCarousel = window.matchMedia('(max-width: 760px)');

if (passTrack && audiencePasses.length > 1) {
  let cards = [];
  let active = 1;
  let visible = false;
  let holding = false;
  let focused = false;
  let moving = false;
  let resetting = false;
  let timer = 0;
  let settleTimer = 0;
  let quietUntil = 0;
  let trackWidth = 0;

  const clearTimers = () => {
    clearTimeout(timer);
    clearTimeout(settleTimer);
  };
  const position = (index) => cards[index].offsetLeft - (passTrack.clientWidth - cards[index].offsetWidth) / 2;
  const nearest = () => cards.reduce((best, card, index) =>
    Math.abs(position(index) - passTrack.scrollLeft) < Math.abs(position(best) - passTrack.scrollLeft) ? index : best, 0);

  const jump = (index) => {
    active = index;
    resetting = true;
    passTrack.scrollLeft = position(index);
    requestAnimationFrame(() => requestAnimationFrame(() => { resetting = false; }));
  };
  const canPlay = () => cards.length && visible && !document.hidden && !holding && !focused && !moving && !reducedMotion.matches;
  const schedule = () => {
    clearTimeout(timer);
    if (!canPlay()) return;
    timer = setTimeout(() => {
      if (!canPlay()) return;
      active = Math.min(nearest() + 1, cards.length - 1);
      moving = true;
      passTrack.scrollTo({ left: position(active), behavior: 'smooth' });
      settleTimer = setTimeout(finishScroll, 800);
    }, Math.max(3200, quietUntil - performance.now()));
  };
  const finishScroll = () => {
    clearTimeout(settleTimer);
    if (!cards.length || holding) return;
    moving = false;
    active = nearest();
    if (active === 0) jump(audiencePasses.length);
    else if (active === cards.length - 1) jump(1);
    schedule();
  };
  const restAfterInteraction = () => {
    clearTimeout(timer);
    quietUntil = performance.now() + 6500;
    schedule();
  };
  const layout = () => {
    if (!cards.length || trackWidth === passTrack.clientWidth) return;
    trackWidth = passTrack.clientWidth;
    passTrack.style.setProperty('--pass-edge', `${Math.max(20, (trackWidth - audiencePasses[0].offsetWidth) / 2)}px`);
    jump(active);
    schedule();
  };
  const syncCarousel = () => {
    clearTimers();
    passTrack.querySelectorAll('[data-carousel-clone]').forEach((card) => card.remove());
    passTrack.querySelectorAll('.audience-carousel-slide').forEach((slide) => slide.replaceWith(...slide.childNodes));
    passTrack.classList.remove('is-auto-carousel');
    passTrack.style.removeProperty('--pass-edge');
    cards = [];
    moving = false;
    trackWidth = 0;
    passTrack.scrollLeft = 0;
    if (!mobileCarousel.matches || reducedMotion.matches) return;

    const slide = (card, isClone = false) => {
      const wrapper = document.createElement('div');
      wrapper.className = 'audience-carousel-slide';
      wrapper.append(isClone ? card.cloneNode(true) : card);
      if (isClone) {
        wrapper.dataset.carouselClone = '';
        wrapper.setAttribute('aria-hidden', 'true');
        wrapper.inert = true;
      }
      return wrapper;
    };
    audiencePasses.forEach((card) => passTrack.append(slide(card)));
    passTrack.prepend(slide(audiencePasses.at(-1), true));
    passTrack.append(slide(audiencePasses[0], true));
    passTrack.classList.add('is-auto-carousel');
    cards = [...passTrack.children];
    active = 1;
    layout();
  };

  passTrack.addEventListener('scroll', () => {
    if (!cards.length || resetting) return;
    if (!moving) restAfterInteraction();
    clearTimeout(settleTimer);
    settleTimer = setTimeout(finishScroll, 180);
  }, { passive: true });
  passTrack.addEventListener('pointerdown', () => {
    holding = true;
    moving = false;
    restAfterInteraction();
    passTrack.scrollLeft = passTrack.scrollLeft;
  }, { passive: true });
  const release = () => {
    if (!holding) return;
    holding = false;
    restAfterInteraction();
    finishScroll();
  };
  window.addEventListener('pointerup', release, { passive: true });
  window.addEventListener('pointercancel', release, { passive: true });
  passTrack.addEventListener('wheel', restAfterInteraction, { passive: true });
  passTrack.addEventListener('focusin', () => {
    focused = passTrack.matches(':focus-visible');
    if (focused) clearTimeout(timer);
  });
  passTrack.addEventListener('keydown', () => { focused = true; restAfterInteraction(); });
  passTrack.addEventListener('focusout', () => { focused = false; schedule(); });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      schedule();
    }, { threshold: 0.25 }).observe(passTrack);
  } else {
    visible = true;
  }
  if ('ResizeObserver' in window) new ResizeObserver(layout).observe(passTrack);
  else window.addEventListener('resize', layout);
  document.addEventListener('visibilitychange', schedule);
  mobileCarousel.addEventListener('change', syncCarousel);
  reducedMotion.addEventListener('change', syncCarousel);
  syncCarousel();
}

if ('IntersectionObserver' in window && !reducedMotion.matches) {
  const groups = [
    ['.challenge-grid, .audience-board, .section-heading, .make-intro, .deliverables h3, .prize-grid, .faq-grid > div:first-child, .cta-inner', 'motion-copy'],
    ['.step, .track, .mosaic-tile, .judge, .practical-panel', 'motion-card'],
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

document.querySelectorAll('.track, .step, .mosaic-tile, .practical-panel, .audience-pass, .judge').forEach((element) => {
  let tapTimer;
  element.addEventListener('pointerdown', () => {
    if (reducedMotion.matches) return;
    element.classList.add('is-tapped');
    clearTimeout(tapTimer);
    tapTimer = setTimeout(() => element.classList.remove('is-tapped'), element.classList.contains('audience-pass') ? 650 : 360);
  });
});
