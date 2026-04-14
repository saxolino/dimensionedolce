/* ================================================
   Dimensione Dolce — Shared JS
   Loaded with defer on every page.
   ================================================ */

/* 1. Header scroll effect
   ------------------------------------------------ */
const hdr = document.getElementById('hdr');
if (hdr) {
  const isHomepage = window.location.pathname === '/' || window.location.pathname === '/index.html';
  const isMobile = () => window.matchMedia('(max-width: 768px)').matches;

  const updateHeaderState = () => {
    const scrolled = window.scrollY > 60;
    hdr.classList.toggle('is-scrolled', scrolled);
    hdr.classList.toggle('is-home-hidden', isHomepage && isMobile() && window.scrollY < 30);
  };

  updateHeaderState();
  window.addEventListener('scroll', updateHeaderState, { passive: true });
  window.addEventListener('resize', updateHeaderState, { passive: true });
}

/* 2. Mobile sidebar
   ------------------------------------------------ */
const hdrBurger  = document.getElementById('hdrBurger');
const mobSidebar = document.getElementById('mobSidebar');
const mobOverlay = document.getElementById('mobOverlay');
const mobClose   = document.getElementById('mobClose');

if (hdrBurger && mobSidebar) {
  function openMob() {
    hdrBurger.classList.add('is-open');
    mobSidebar.classList.add('is-open');
    if (mobOverlay) mobOverlay.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }
  function closeMob() {
    hdrBurger.classList.remove('is-open');
    mobSidebar.classList.remove('is-open');
    if (mobOverlay) mobOverlay.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  hdrBurger.addEventListener('click', () => {
    mobSidebar.classList.contains('is-open') ? closeMob() : openMob();
  });
  if (mobClose)   mobClose.addEventListener('click', closeMob);
  if (mobOverlay) mobOverlay.addEventListener('click', closeMob);

  mobSidebar.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMob);
  });
}

/* 3. Gallery drag-to-scroll
   ------------------------------------------------ */
const galTrack = document.getElementById('galTrack');
const galFill  = document.getElementById('galProgressFill') || document.getElementById('galFill');

if (galTrack) {
  let isDragging = false, startX, scrollStart, hasDragged = false;

  function updateProgress() {
    if (!galFill) return;
    const max = galTrack.scrollWidth - galTrack.clientWidth;
    if (max <= 0) return;
    const pct   = galTrack.scrollLeft / max;
    const fillW = Math.max(20, (galTrack.clientWidth / galTrack.scrollWidth) * 100);
    const travel = 100 - fillW;
    galFill.style.width     = fillW + '%';
    galFill.style.transform = `translateX(${pct * travel * (100 / fillW)}%)`;
  }

  galTrack.addEventListener('scroll', () => updateProgress(), { passive: true });
  galTrack.addEventListener('mousedown', (e) => {
    isDragging = true; hasDragged = false;
    startX = e.pageX - galTrack.offsetLeft;
    scrollStart = galTrack.scrollLeft;
    galTrack.classList.add('is-dragging');
  });
  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return; e.preventDefault();
    const walk = (e.pageX - galTrack.offsetLeft - startX) * 1.5;
    if (Math.abs(walk) > 5) hasDragged = true;
    galTrack.scrollLeft = scrollStart - walk;
  });
  window.addEventListener('mouseup', () => {
    if (!isDragging) return; isDragging = false;
    galTrack.classList.remove('is-dragging');
  });
  galTrack.addEventListener('click', (e) => {
    if (hasDragged) { e.preventDefault(); e.stopPropagation(); }
  }, true);
  updateProgress();
}

/* 4. Custom cursor (desktop + fine pointer only)
   ------------------------------------------------ */
const cursorDot = document.getElementById('cursorDot');
if (cursorDot && window.matchMedia('(min-width:769px) and (pointer:fine)').matches) {
  document.addEventListener('mousemove', e => {
    cursorDot.style.left = e.clientX + 'px';
    cursorDot.style.top  = e.clientY + 'px';
    if (!cursorDot.classList.contains('is-visible')) cursorDot.classList.add('is-visible');
  });
  document.addEventListener('mouseleave', () => cursorDot.classList.remove('is-visible'));
  document.querySelectorAll('a, button, .gal__item, .cs-gal__item').forEach(el => {
    el.addEventListener('mouseenter', () => cursorDot.classList.add('is-hovering'));
    el.addEventListener('mouseleave', () => cursorDot.classList.remove('is-hovering'));
  });
}

/* 5. Scroll reveal
   ------------------------------------------------ */
const reveals = document.querySelectorAll('.rv');
if (reveals.length) {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('is-v'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.1 });
  reveals.forEach(el => obs.observe(el));
}

/* 6. Page transition
   ------------------------------------------------ */
document.querySelectorAll('a[href]').forEach(link => {
  const href = link.getAttribute('href');
  if (!href || href.startsWith('#') || href.startsWith('tel:') || href.startsWith('mailto:') || href.startsWith('http')) return;
  link.addEventListener('click', (e) => {
    e.preventDefault();
    document.body.classList.add('is-leaving');
    const nextUrl = new URL(href, window.location.origin);
    const currentParams = new URLSearchParams(window.location.search);
    currentParams.forEach((value, key) => {
      if (key.startsWith('sanity-') || key === 'preview') {
        nextUrl.searchParams.set(key, value);
      }
    });
    setTimeout(() => { window.location.href = nextUrl.toString(); }, 300);
  });
});

// Cookie banner
const cookieBanner = document.querySelector('.cookie-banner');
const cookieBtn = document.querySelector('.cookie-banner__btn');
if (cookieBanner && cookieBtn) {
  if (!localStorage.getItem('dd_cookie_consent')) {
    setTimeout(() => cookieBanner.classList.add('is-visible'), 1000);
  }
  cookieBtn.addEventListener('click', () => {
    localStorage.setItem('dd_cookie_consent', 'accepted');
    cookieBanner.classList.remove('is-visible');
  });
}
