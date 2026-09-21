// ===== Header scroll state =====
const header = document.getElementById('header');
const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 12);
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

// ===== Mobile nav toggle =====
const navToggle = document.getElementById('navToggle');
const mainNav = document.getElementById('main-nav');
const navClose = document.getElementById('navClose');
const navBackdrop = document.createElement('div');
navBackdrop.className = 'nav-backdrop';
document.body.appendChild(navBackdrop);

const setNav = (open) => {
  mainNav.classList.toggle('open', open);
  navBackdrop.classList.toggle('show', open);
  navToggle.setAttribute('aria-expanded', String(open));
  document.body.style.overflow = open ? 'hidden' : '';
  if (open) navClose.focus(); else if (document.activeElement === navClose) navToggle.focus();
};
navToggle.addEventListener('click', () => setNav(!mainNav.classList.contains('open')));
navClose.addEventListener('click', () => setNav(false));
navBackdrop.addEventListener('click', () => setNav(false));
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setNav(false); });
mainNav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setNav(false)));

// ===== Scroll-reveal animations =====
const revealEls = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
  );
  revealEls.forEach((el) => revealObserver.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add('is-visible'));
}

// ===== Animated stat counters =====
const statEls = document.querySelectorAll('.stat-num');
const animateCount = (el) => {
  const target = parseFloat(el.dataset.count);
  const decimals = parseInt(el.dataset.decimals || '0', 10);
  const duration = 1400;
  const start = performance.now();
  const step = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = (eased * target).toFixed(decimals);
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
};
if ('IntersectionObserver' in window && statEls.length) {
  const statObserver = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );
  statEls.forEach((el) => statObserver.observe(el));
}

// ===== Play showcase videos only while in view =====
const showcaseVideos = document.querySelectorAll('.work-video');
if ('IntersectionObserver' in window && showcaseVideos.length) {
  const videoObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const video = entry.target;
      if (entry.isIntersecting) {
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    });
  }, { threshold: 0.4 });
  showcaseVideos.forEach((video) => videoObserver.observe(video));
}

// ===== Contact form (placeholder handler — replace with real endpoint) =====
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    formStatus.textContent = "Thanks! Holly will be in touch within 1 business day.";
    contactForm.reset();
  });
}

// ===== Preselect package from ?package= =====
const packageSelect = document.getElementById('package');
if (packageSelect) {
  const wanted = new URLSearchParams(window.location.search).get('package');
  if (wanted && [...packageSelect.options].some((o) => o.value === wanted)) packageSelect.value = wanted;
}

// ===== Footer year =====
document.getElementById('year').textContent = new Date().getFullYear();

// ===== Promo popup (free discovery call CTA) =====
(function () {
  const DISMISS_KEY = 'arlaPromoDismissed';
  if (sessionStorage.getItem(DISMISS_KEY)) return;

  const overlay = document.createElement('div');
  overlay.className = 'promo-popup-overlay';
  overlay.innerHTML = `
    <div class="promo-popup" role="dialog" aria-modal="true" aria-labelledby="promoTitle">
      <button class="promo-close" type="button" aria-label="Close">&times;</button>
      <div class="promo-media"></div>
      <div class="promo-content">
        <p class="promo-eyebrow">Limited spots this month</p>
        <h3 id="promoTitle">Book Your Free<br>Discovery Call</h3>
        <p class="promo-sub">15 minutes with Holly to map out exactly how Arla Digital can grow your business.</p>
        <a href="contact.html" class="btn btn-primary btn-block">Book Your Free Call</a>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);

  const dismiss = () => {
    overlay.classList.remove('show');
    document.body.style.overflow = '';
    sessionStorage.setItem(DISMISS_KEY, '1');
  };

  overlay.querySelector('.promo-close').addEventListener('click', dismiss);
  overlay.querySelector('.promo-content a').addEventListener('click', dismiss);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) dismiss(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && overlay.classList.contains('show')) dismiss(); });

  setTimeout(() => {
    overlay.classList.add('show');
    document.body.style.overflow = 'hidden';
  }, 4500);
})();