/* ============================================================
   DIMENSIONE DOLCE — Award-Level Scroll Interactions
   Vanilla JS — No dependencies
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* -------------------------------------------
     1. SCROLL REVEAL (IntersectionObserver)
     Enhanced: observes all animated elements
     ------------------------------------------- */

  const initScrollReveal = () => {
    const selectors = [
      '.fade-in-up', '.fade-in-left', '.fade-in-right', '.fade-in',
      '.clip-reveal', '.clip-reveal-left', '.clip-reveal-right',
      '.text-reveal',
      '.product__keyword',
      '.product__deco',
      '.product',
      '.about__border-bottom'
    ];
    const els = document.querySelectorAll(selectors.join(', '));
    if (!els.length) return;

    // Use threshold 0 to catch clip-path elements reliably
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Delay slightly for elements below the fold for visual effect
          const delay = entry.target.getBoundingClientRect().top < window.innerHeight ? 0 : 50;
          setTimeout(() => {
            entry.target.classList.add('in-view');
          }, delay);
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0,
      rootMargin: '0px 0px -80px 0px'
    });

    els.forEach((el) => observer.observe(el));
  };


  /* -------------------------------------------
     2. HERO SLIDER
     ------------------------------------------- */

  const initHeroSlider = () => {
    const slides = document.querySelectorAll('.hero__slide');
    const prevBtn = document.getElementById('heroPrev');
    const nextBtn = document.getElementById('heroNext');
    const counter = document.getElementById('heroCounter');
    const heroSection = document.getElementById('hero');

    if (!slides.length) return;

    let currentIndex = 0;
    let autoPlayInterval = null;
    const totalSlides = slides.length;
    const AUTO_PLAY_DELAY = 5000;

    const goToSlide = (index) => {
      if (index === currentIndex) return;
      slides[currentIndex].classList.remove('active');
      currentIndex = index;
      slides[currentIndex].classList.add('active');
      if (counter) counter.textContent = `${currentIndex + 1} / ${totalSlides}`;
    };

    const nextSlide = () => goToSlide((currentIndex + 1) % totalSlides);
    const prevSlide = () => goToSlide((currentIndex - 1 + totalSlides) % totalSlides);

    const startAutoPlay = () => {
      stopAutoPlay();
      autoPlayInterval = setInterval(nextSlide, AUTO_PLAY_DELAY);
    };

    const stopAutoPlay = () => {
      if (autoPlayInterval) { clearInterval(autoPlayInterval); autoPlayInterval = null; }
    };

    if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); startAutoPlay(); });
    if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); startAutoPlay(); });

    if (heroSection) {
      heroSection.addEventListener('mouseenter', stopAutoPlay);
      heroSection.addEventListener('mouseleave', startAutoPlay);
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') { prevSlide(); startAutoPlay(); }
      if (e.key === 'ArrowRight') { nextSlide(); startAutoPlay(); }
    });

    startAutoPlay();
  };


  /* -------------------------------------------
     3. STICKY HEADER
     ------------------------------------------- */

  const initStickyHeader = () => {
    const header = document.getElementById('header');
    if (!header) return;

    const updateHeader = () => {
      header.classList.toggle('scrolled', window.scrollY > 80);
    };

    window.addEventListener('scroll', updateHeader, { passive: true });
    updateHeader();
  };


  /* -------------------------------------------
     4. SIDE NAVIGATION
     ------------------------------------------- */

  const initSideNav = () => {
    const sideNav = document.getElementById('sideNav');
    const navItems = document.querySelectorAll('.side-nav__item');
    const sections = document.querySelectorAll('[data-nav-section]');
    const heroSection = document.getElementById('hero');
    const footer = document.querySelector('.footer');

    if (!sideNav || !sections.length) return;

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.getAttribute('data-nav-section');
          navItems.forEach((item) => {
            item.classList.toggle('active', item.getAttribute('data-target') === sectionId);
          });
        }
      });
    }, { threshold: 0.3, rootMargin: '-20% 0px -20% 0px' });

    sections.forEach((s) => sectionObserver.observe(s));

    navItems.forEach((item) => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(`[data-nav-section="${item.getAttribute('data-target')}"]`);
        if (target) {
          const headerH = document.getElementById('header')?.offsetHeight || 0;
          window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - headerH, behavior: 'smooth' });
        }
      });
    });

    const toggleSideNav = () => {
      if (!heroSection) { sideNav.classList.add('visible'); return; }
      const heroBottom = heroSection.getBoundingClientRect().bottom;
      const footerTop = footer ? footer.getBoundingClientRect().top : Infinity;
      const wh = window.innerHeight;
      sideNav.classList.toggle('visible', heroBottom < wh * 0.5 && footerTop > wh * 0.5);
    };

    toggleSideNav();
    window.addEventListener('scroll', toggleSideNav, { passive: true });
  };


  /* -------------------------------------------
     5. PARALLAX ENGINE (rAF lerp loop)
     Images, keywords, SVGs — all scroll-driven
     ------------------------------------------- */

  const initParallaxEngine = () => {
    const keywords = document.querySelectorAll('.product__keyword');
    const productImages = document.querySelectorAll('.product__image img');
    const decoElements = document.querySelectorAll('.product__deco');
    const parallaxBg = document.getElementById('parallaxBg');
    const parallaxSection = document.querySelector('.parallax-section');

    const lerp = (start, end, factor) => start + (end - start) * factor;

    const keywordStates = Array.from(keywords).map(() => ({ x: 0, y: 0 }));
    const imageStates = Array.from(productImages).map(() => ({ y: 0 }));
    const decoStates = Array.from(decoElements).map(() => ({ rot: 0, y: 0 }));
    let parallaxY = 0;

    const updateParallax = () => {
      const wh = window.innerHeight;

      // --- FULL-WIDTH PARALLAX SECTION ---
      if (parallaxBg && parallaxSection) {
        const rect = parallaxSection.getBoundingClientRect();
        if (rect.bottom > -200 && rect.top < wh + 200) {
          const progress = (wh - rect.top) / (wh + rect.height);
          const targetY = (progress - 0.5) * -100;
          parallaxY = lerp(parallaxY, targetY, 0.1);
          parallaxBg.style.transform = `translateY(${parallaxY}px)`;
        }
      }

      // --- KEYWORD: horizontal + vertical drift ---
      keywords.forEach((keyword, i) => {
        const section = keyword.closest('.product');
        if (!section) return;
        const rect = section.getBoundingClientRect();
        if (rect.bottom < -100 || rect.top > wh + 100) return;

        const progress = (wh - rect.top) / (wh + rect.height);
        const targetX = (progress - 0.5) * 200;
        const targetY = (progress - 0.5) * 80;

        keywordStates[i].x = lerp(keywordStates[i].x, targetX, 0.08);
        keywordStates[i].y = lerp(keywordStates[i].y, targetY, 0.08);

        keyword.style.transform = `translate(calc(-50% + ${keywordStates[i].x}px), calc(-50% + ${keywordStates[i].y}px))`;
      });

      // --- PRODUCT IMAGE: vertical parallax ---
      productImages.forEach((img, i) => {
        const rect = img.getBoundingClientRect();
        if (rect.bottom < -100 || rect.top > wh + 100) return;

        const progress = (wh - rect.top) / (wh + rect.height);
        const targetY = (progress - 0.5) * -40;

        imageStates[i].y = lerp(imageStates[i].y, targetY, 0.06);
        img.style.transform = `translateY(${imageStates[i].y}px) scale(1.08)`;
      });

      // --- SVG DECO: rotate + drift ---
      decoElements.forEach((svg, i) => {
        const rect = svg.getBoundingClientRect();
        if (rect.bottom < -200 || rect.top > wh + 200) return;

        const centerDist = (rect.top + rect.height / 2 - wh / 2) / wh;
        const targetRot = centerDist * 15;
        const targetY = centerDist * 40;

        decoStates[i].rot = lerp(decoStates[i].rot, targetRot, 0.05);
        decoStates[i].y = lerp(decoStates[i].y, targetY, 0.05);

        svg.style.transform = `rotate(${decoStates[i].rot}deg) translateY(${decoStates[i].y}px)`;
      });

      requestAnimationFrame(updateParallax);
    };

    requestAnimationFrame(updateParallax);
  };


  /* -------------------------------------------
     6. SMOOTH SCROLL FOR ANCHORS
     ------------------------------------------- */

  const initSmoothScroll = () => {
    document.querySelectorAll('a[href^="#"]').forEach((link) => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href === '#' || href === '#!') return;
        const target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        const headerH = document.getElementById('header')?.offsetHeight || 0;
        window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - headerH, behavior: 'smooth' });
      });
    });
  };


  /* -------------------------------------------
     7. SCROLL-DOWN CHEVRON
     ------------------------------------------- */

  const initScrollDown = () => {
    const chevron = document.querySelector('.hero__scroll-down');
    if (!chevron) return;
    chevron.style.cursor = 'pointer';
    chevron.addEventListener('click', () => {
      const about = document.getElementById('chi-siamo');
      if (about) {
        const headerH = document.getElementById('header')?.offsetHeight || 0;
        window.scrollTo({ top: about.getBoundingClientRect().top + window.scrollY - headerH, behavior: 'smooth' });
      }
    });
  };


  /* -------------------------------------------
     8. CUSTOM CURSOR ON HERO
     ------------------------------------------- */

  const initHeroCursor = () => {
    const hero = document.getElementById('hero');
    if (!hero || window.innerWidth < 1024) return;

    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    const label = document.createElement('span');
    label.textContent = 'SCOPRI';
    cursor.appendChild(label);
    hero.appendChild(cursor);

    let mouseX = 0, mouseY = 0, curX = 0, curY = 0;
    let isInHero = false;

    hero.addEventListener('mouseenter', () => {
      isInHero = true;
      cursor.classList.add('active');
    });
    hero.addEventListener('mouseleave', () => {
      isInHero = false;
      cursor.classList.remove('active');
    });
    hero.addEventListener('mousemove', (e) => {
      const rect = hero.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    });

    hero.querySelectorAll('button, a').forEach(el => {
      el.addEventListener('mouseenter', () => cursor.classList.remove('active'));
      el.addEventListener('mouseleave', () => { if (isInHero) cursor.classList.add('active'); });
    });

    const animateCursor = () => {
      curX += (mouseX - curX) * 0.12;
      curY += (mouseY - curY) * 0.12;
      cursor.style.transform = `translate(${curX}px, ${curY}px)`;
      requestAnimationFrame(animateCursor);
    };
    requestAnimationFrame(animateCursor);
  };


  /* -------------------------------------------
     9. SCROLL PROGRESS BAR
     ------------------------------------------- */

  const initProgressBar = () => {
    const bar = document.createElement('div');
    bar.className = 'scroll-progress';
    document.body.appendChild(bar);

    const updateProgress = () => {
      const scrollH = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollH > 0 ? (window.scrollY / scrollH) * 100 : 0;
      bar.style.width = `${progress}%`;
    };

    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();
  };


  /* -------------------------------------------
     10. VETRINA CAROUSEL
     Cinematic drag carousel with snap, Ken Burns
     ------------------------------------------- */

  const initVetrina = () => {
    const viewport = document.getElementById('vetrinaViewport');
    const track = document.getElementById('vetrinaTrack');
    const slides = track ? track.querySelectorAll('.vetrina__slide') : [];
    const captionEl = document.getElementById('vetrinaCaption');
    const captionName = document.getElementById('vetrinaCaptionName');
    const captionDesc = document.getElementById('vetrinaCaptionDesc');
    const dotsContainer = document.getElementById('vetrinaDots');
    const prevBtn = document.getElementById('vetrinaPrev');
    const nextBtn = document.getElementById('vetrinaNext');
    const dragHint = document.getElementById('vetrinaDragHint');

    if (!viewport || !track || !slides.length) return;

    let currentIndex = 0;
    let isDragging = false;
    let startX = 0;
    let dragDelta = 0;
    let trackX = 0;
    let hasDragged = false;
    const isMobile = window.innerWidth < 768;

    // --- Build dots ---
    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'vetrina__dot' + (i === 0 ? ' is-active' : '');
      dot.setAttribute('aria-label', `Slide ${i + 1}`);
      dot.addEventListener('click', () => goToSlide(i));
      dotsContainer.appendChild(dot);
    });

    const dots = dotsContainer.querySelectorAll('.vetrina__dot');

    // --- Slide sizing ---
    const getSlideWidth = () => {
      return slides[0].offsetWidth + parseFloat(getComputedStyle(track).gap || 24);
    };

    // --- Go to slide ---
    const goToSlide = (index) => {
      if (index < 0) index = 0;
      if (index >= slides.length) index = slides.length - 1;
      currentIndex = index;

      if (!isMobile) {
        trackX = -(currentIndex * getSlideWidth());
        track.style.transform = `translateX(${trackX}px)`;
      } else {
        // Mobile: scroll to the right position
        const slideW = getSlideWidth();
        track.scrollTo({ left: currentIndex * slideW, behavior: 'smooth' });
      }

      updateSlideStates();
      updateCaption();
      updateDots();
    };

    // --- Update active/adjacent states ---
    const updateSlideStates = () => {
      slides.forEach((slide, i) => {
        slide.classList.remove('is-active', 'is-adjacent');
        if (i === currentIndex) {
          slide.classList.add('is-active');
        } else if (Math.abs(i - currentIndex) === 1) {
          slide.classList.add('is-adjacent');
        }
      });
    };

    // --- Update caption ---
    const updateCaption = () => {
      if (!captionEl) return;
      captionEl.classList.remove('is-visible');

      setTimeout(() => {
        const slide = slides[currentIndex];
        if (captionName) captionName.textContent = slide.getAttribute('data-caption') || '';
        if (captionDesc) captionDesc.textContent = slide.getAttribute('data-desc') || '';
        captionEl.classList.add('is-visible');
      }, 200);
    };

    // --- Update dots ---
    const updateDots = () => {
      dots.forEach((dot, i) => {
        dot.classList.toggle('is-active', i === currentIndex);
      });
    };

    // --- Entry animation (clip-path reveal on scroll) ---
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const allSlides = entry.target.querySelectorAll('.vetrina__slide');
          allSlides.forEach((slide, i) => {
            setTimeout(() => {
              slide.classList.add('is-revealed');
            }, i * 120);
          });
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    revealObserver.observe(viewport);

    // --- Drag / Touch interaction (unified for desktop + tablet) ---
    const getClientX = (e) => {
      if (e.touches && e.touches.length) return e.touches[0].clientX;
      return e.clientX;
    };

    const onPointerDown = (e) => {
      if (e.target.closest('button, a')) return;
      isDragging = true;
      hasDragged = false;
      startX = getClientX(e);
      dragDelta = 0;
      viewport.classList.add('is-dragging');
      if (dragHint) dragHint.classList.add('is-hidden');
    };

    const onPointerMove = (e) => {
      if (!isDragging) return;
      const x = getClientX(e);
      dragDelta = x - startX;

      if (Math.abs(dragDelta) > 5) hasDragged = true;

      // Prevent vertical scroll while dragging horizontally
      if (Math.abs(dragDelta) > 10 && e.cancelable) e.preventDefault();

      const resistance = 0.35;
      const atStart = currentIndex === 0 && dragDelta > 0;
      const atEnd = currentIndex === slides.length - 1 && dragDelta < 0;
      const multiplier = (atStart || atEnd) ? resistance : 1;

      track.style.transition = 'none';
      track.style.transform = `translateX(${trackX + dragDelta * multiplier}px)`;
    };

    const onPointerUp = () => {
      if (!isDragging) return;
      isDragging = false;
      viewport.classList.remove('is-dragging');

      // Restore transition for snap animation
      track.style.transition = '';

      const threshold = getSlideWidth() * 0.15;

      if (dragDelta < -threshold && currentIndex < slides.length - 1) {
        goToSlide(currentIndex + 1);
      } else if (dragDelta > threshold && currentIndex > 0) {
        goToSlide(currentIndex - 1);
      } else {
        goToSlide(currentIndex);
      }
    };

    // Prevent native image drag
    viewport.addEventListener('dragstart', (e) => e.preventDefault());

    // Mouse events
    viewport.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);

    // Touch events
    viewport.addEventListener('touchstart', onPointerDown, { passive: true });
    window.addEventListener('touchmove', onPointerMove, { passive: false });
    window.addEventListener('touchend', onPointerUp);

    // Prevent link clicks when dragging
    viewport.addEventListener('click', (e) => {
      if (hasDragged) e.preventDefault();
    }, true);

    // --- Arrow buttons ---
    if (prevBtn) prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));

    // --- Keyboard ---
    const vetrinaSection = viewport.closest('.vetrina');
    if (vetrinaSection) {
      const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            document.addEventListener('keydown', handleKeys);
          } else {
            document.removeEventListener('keydown', handleKeys);
          }
        });
      }, { threshold: 0.3 });

      sectionObserver.observe(vetrinaSection);
    }

    function handleKeys(e) {
      if (e.key === 'ArrowLeft') goToSlide(currentIndex - 1);
      if (e.key === 'ArrowRight') goToSlide(currentIndex + 1);
    }

    // --- Resize handler ---
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => goToSlide(currentIndex), 200);
    });

    // --- Init first slide ---
    goToSlide(0);
  };


  /* -------------------------------------------
     INITIALIZE
     ------------------------------------------- */

  initScrollReveal();
  initHeroSlider();
  initStickyHeader();
  initSideNav();
  initParallaxEngine();
  initSmoothScroll();
  initScrollDown();
  initHeroCursor();
  initProgressBar();
  initVetrina();

});
