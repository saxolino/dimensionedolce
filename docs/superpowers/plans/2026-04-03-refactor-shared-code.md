# Refactoring Codice Condiviso — Dimensione Dolce

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Estrarre CSS/JS/HTML duplicato da 5 pagine monolitiche in file condivisi, uniformare responsive, eliminare codice orfano. Da ~5200 righe a ~3500 (-33%).

**Architecture:** Creare `css/shared.css` (variabili + reset + header + sidebar + footer + reveal + cursor + transition + responsive condiviso) e `js/shared.js` (header scroll + sidebar + cursor + reveal + page transition + gallery drag). Ogni pagina HTML tiene solo il CSS specifico della propria sezione.

**Tech Stack:** HTML/CSS/JS puro, nessun framework, nessun build tool.

---

## File Structure

### File da CREARE:
- `css/shared.css` — ~280 righe: variabili, reset, header, mobile sidebar, footer, .rv reveal, cursor, page transition, responsive condiviso (1024/768/480)
- `js/shared.js` — ~80 righe: header scroll, mobile sidebar open/close, custom cursor, scroll reveal observer, page transition, gallery drag-scroll (auto-init se `#galTrack` esiste)

### File da MODIFICARE (rimuovere duplicati):
- `index.html` — rimuovere: :root, reset, .hdr*, .mob-*, .ftr*, .rv*, cursor, page transition CSS+JS. Aggiungere `<link>` a shared.css e `<script src>` shared.js
- `chi-siamo.html` — stessa pulizia + rimuovere refs a css/style.css, css/animations.css, css/cart.css (non usati dal contenuto v3)
- `menu.html` — stessa pulizia
- `catering-eventi.html` — stessa pulizia
- `contatti.html` — stessa pulizia

### File da ELIMINARE (orfani per le 5 pagine v3):
- `css/pages.css` — non usato
- `css/vetrina.css` — non usato
- Valutare: `css/style.css`, `css/animations.css`, `css/cart.css` — usati solo da chi-siamo.html per classi legacy (p-hero, p-chef, etc). Se chi-siamo non li usa piu, eliminare.

---

## Task 1: Creare `css/shared.css`

**Files:**
- Create: `css/shared.css`

- [ ] **Step 1: Creare il file con variabili + reset**

```css
/* ============================================================
   DIMENSIONE DOLCE — Shared Styles
   Variables, reset, header, footer, sidebar, animations
   ============================================================ */

:root {
  --magenta: #E91E8C;
  --magenta-dark: #C4177A;
  --pistacchio: #BBC25C;
  --pistacchio-scuro: #A3AA42;
  --cioccolato: #382E2C;
  --cioccolato-deep: #2C2322;
  --crema: #F2F1F0;
  --crema-warm: #F7F6F4;
  --beige: #E8E5E1;
  --nero: #1E1918;
  --bianco: #ffffff;
  --testo: #382E2C;
  --testo-light: #6E6462;
  --testo-muted: #9A9290;

  --font-display: 'Cormorant Garamond', 'Georgia', serif;
  --font-ui: 'Montserrat', 'Helvetica Neue', sans-serif;
}

*, *::before, *::after {
  margin: 0; padding: 0; box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  font-family: var(--font-ui);
  font-size: 16px;
  color: var(--testo);
  background: var(--crema);
  overflow-x: hidden;
  animation: pageIn 0.5s ease-out;
}

body.is-leaving {
  opacity: 0;
  transition: opacity 0.3s ease-out;
}

@keyframes pageIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

a { color: inherit; text-decoration: none; }
img { display: block; max-width: 100%; }
```

- [ ] **Step 2: Aggiungere header CSS**

Copiare da `index.html` righe 93-268: tutto il blocco `.hdr`, `.hdr__inner`, `.hdr__nav`, `.hdr__link`, `.hdr__logo`, `.hdr__filament`, `.hdr.is-scrolled`, `.hdr__burger` — formattato, non minified.

- [ ] **Step 3: Aggiungere mobile sidebar CSS**

Copiare da `index.html` righe 270-363: `.mob-overlay`, `.mob-sidebar`, `.mob-sidebar__header`, `.mob-sidebar__brand`, `.mob-sidebar__close`, `.mob-sidebar__nav`, `.mob-sidebar__link`, `.mob-sidebar__footer`, `.mob-sidebar__contact`.

- [ ] **Step 4: Aggiungere footer CSS**

```css
/* Footer — Pistacchio */
.ftr {
  background: var(--pistacchio);
  padding: 140px 40px 80px;
  text-align: center;
  border-top: none;
}

.ftr__moon { width: 80px; margin: 0 auto 56px; }
.ftr__moon img { width: 100%; opacity: 0.7; filter: saturate(0) brightness(0.4); }

.ftr__nav {
  display: flex;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 48px;
  align-items: center;
}

.ftr__nav a {
  font-family: var(--font-ui);
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 0.04em;
  color: var(--cioccolato);
  transition: color 0.3s;
}

.ftr__nav a:hover { opacity: 0.7; }
.ftr__nav-sep { color: var(--cioccolato); opacity: 0.3; font-size: 13px; }

.ftr__copy {
  font-family: var(--font-ui);
  font-size: 11px;
  font-weight: 400;
  color: var(--cioccolato);
  opacity: 0.45;
}
```

- [ ] **Step 5: Aggiungere reveal + cursor + gallery-track CSS**

```css
/* Scroll Reveal */
.rv {
  opacity: 0;
  transform: translateY(18px);
  transition: opacity 0.7s ease-out, transform 0.7s ease-out;
}
.rv.is-v { opacity: 1; transform: translateY(0); }
.rv-d1 { transition-delay: 0.1s; }
.rv-d2 { transition-delay: 0.2s; }
.rv-d3 { transition-delay: 0.3s; }
.rv-d4 { transition-delay: 0.4s; }
.rv-d5 { transition-delay: 0.5s; }

/* Custom Cursor */
.cursor-dot {
  position: fixed;
  width: 8px; height: 8px;
  background: var(--pistacchio);
  border-radius: 50%;
  pointer-events: none;
  z-index: 9999;
  mix-blend-mode: difference;
  transition: transform 0.15s ease-out, opacity 0.3s;
  transform: translate(-50%, -50%);
  opacity: 0;
}
.cursor-dot.is-visible { opacity: 1; }
.cursor-dot.is-hovering { transform: translate(-50%, -50%) scale(3.5); }
```

- [ ] **Step 6: Aggiungere responsive condiviso**

```css
/* ============================================================
   RESPONSIVE — Shared breakpoints
   ============================================================ */

@media (max-width: 1024px) {
  .hdr__nav { gap: 24px; }
  .hdr__link { font-size: 10px; }
  .hdr__logo { padding: 0 48px; }
}

@media (max-width: 768px) {
  .hdr__nav { display: none; }
  .hdr__burger { display: flex; }
  .hdr__inner { height: 56px; }
  .hdr__logo-bottom { font-size: 22px; }

  .ftr { padding: 80px 24px 56px; }
  .ftr__nav { gap: 20px; }
}

@media (max-width: 480px) {
  .hdr__inner { padding: 0 16px; }
}

@media (prefers-reduced-motion: reduce) {
  .rv { opacity: 1; transform: none; transition: none !important; }
  body { animation: none; }
  body.is-leaving { transition: none; }
}
```

- [ ] **Step 7: Verificare il file completo**

Run: `wc -l css/shared.css`
Expected: ~280 righe

---

## Task 2: Creare `js/shared.js`

**Files:**
- Create: `js/shared.js`

- [ ] **Step 1: Creare il file con tutti i moduli condivisi**

```js
/* ============================================================
   DIMENSIONE DOLCE — Shared JavaScript
   Header, sidebar, cursor, reveal, transition, gallery drag
   ============================================================ */

// Header scroll effect
const hdr = document.getElementById('hdr');
if (hdr) {
  window.addEventListener('scroll', () => {
    hdr.classList.toggle('is-scrolled', window.scrollY > 60);
  }, { passive: true });
}

// Mobile sidebar
const hdrBurger = document.getElementById('hdrBurger');
const mobSidebar = document.getElementById('mobSidebar');
const mobOverlay = document.getElementById('mobOverlay');
const mobClose = document.getElementById('mobClose');

if (hdrBurger && mobSidebar) {
  function openMob() {
    hdrBurger.classList.add('is-open');
    mobSidebar.classList.add('is-open');
    mobOverlay.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }
  function closeMob() {
    hdrBurger.classList.remove('is-open');
    mobSidebar.classList.remove('is-open');
    mobOverlay.classList.remove('is-open');
    document.body.style.overflow = '';
  }
  hdrBurger.addEventListener('click', () => {
    mobSidebar.classList.contains('is-open') ? closeMob() : openMob();
  });
  if (mobClose) mobClose.addEventListener('click', closeMob);
  if (mobOverlay) mobOverlay.addEventListener('click', closeMob);
  mobSidebar.querySelectorAll('a').forEach(l => l.addEventListener('click', closeMob));
}

// Gallery drag-to-scroll (auto-init if #galTrack exists)
const galTrack = document.getElementById('galTrack');
const galFill = document.getElementById('galProgressFill') || document.getElementById('galFill');
if (galTrack) {
  let isDragging = false, startX, scrollStart, hasDragged = false;
  function updateProgress() {
    if (!galFill) return;
    const max = galTrack.scrollWidth - galTrack.clientWidth;
    if (max <= 0) return;
    const pct = galTrack.scrollLeft / max;
    const fillW = Math.max(20, (galTrack.clientWidth / galTrack.scrollWidth) * 100);
    const travel = 100 - fillW;
    galFill.style.width = fillW + '%';
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

// Custom cursor (desktop only)
const dot = document.getElementById('cursorDot');
if (dot && window.matchMedia('(min-width: 769px) and (pointer: fine)').matches) {
  document.addEventListener('mousemove', e => {
    dot.style.left = e.clientX + 'px';
    dot.style.top = e.clientY + 'px';
    if (!dot.classList.contains('is-visible')) dot.classList.add('is-visible');
  });
  document.addEventListener('mouseleave', () => dot.classList.remove('is-visible'));
  document.querySelectorAll('a, button, .gal__item, .cs-gal__item').forEach(el => {
    el.addEventListener('mouseenter', () => dot.classList.add('is-hovering'));
    el.addEventListener('mouseleave', () => dot.classList.remove('is-hovering'));
  });
}

// Scroll reveal
const reveals = document.querySelectorAll('.rv');
if (reveals.length) {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('is-v');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });
  reveals.forEach(el => obs.observe(el));
}

// Page transition
document.querySelectorAll('a[href]').forEach(link => {
  const href = link.getAttribute('href');
  if (!href || href.startsWith('#') || href.startsWith('tel:') || href.startsWith('mailto:') || href.startsWith('http')) return;
  link.addEventListener('click', (e) => {
    e.preventDefault();
    document.body.classList.add('is-leaving');
    setTimeout(() => { window.location.href = href; }, 300);
  });
});
```

- [ ] **Step 2: Verificare**

Run: `wc -l js/shared.js`
Expected: ~100 righe

---

## Task 3: Pulire `index.html`

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Aggiungere link a shared.css e shared.js nel `<head>`**

Dopo il link Google Fonts (riga 12), aggiungere:
```html
  <link rel="stylesheet" href="css/shared.css">
```

- [ ] **Step 2: Rimuovere dal `<style>` il codice ora in shared.css**

Rimuovere:
- `:root { ... }` (variabili)
- `*, *::before, *::after { ... }` (reset)
- `html { ... }`, `body { ... }`, `a { ... }`, `img { ... }` (base)
- `.rv`, `.rv.is-v`, `.rv-d1` a `.rv-d5` (reveal)
- `.cursor-dot`, `.cursor-dot.is-visible`, `.cursor-dot.is-hovering` (cursor)
- Tutto il blocco HEADER (`.hdr` fino a `.hdr__burger.is-open`)
- Tutto il blocco MOBILE SIDEBAR (`.mob-overlay` fino a `.mob-sidebar__contact`)
- `.main { margin-left: 0; }` (ora nel shared)
- Tutto il blocco FOOTER (`.ftr` fino a `.ftr__copy`)
- `body { animation: pageIn... }`, `body.is-leaving`, `@keyframes pageIn` (page transition)
- Le regole responsive duplicate per header/footer/burger/reveal/motion dentro i breakpoint 1024/768/480

Lasciare SOLO: hero, gallery (.gal), benvenuti, service blocks (.svc), storia, team, e i responsive specifici di queste sezioni.

- [ ] **Step 3: Sostituire tutto il `<script>` inline con un singolo tag**

Rimuovere tutto il contenuto dello `<script>` e sostituire con:
```html
  <script src="js/shared.js" defer></script>
```

NOTA: index.html ha anche il hero carousel JS e hero parallax che NON sono in shared. Se esistono ancora, lasciarli in un `<script>` inline separato. Se il carousel e stato rimosso (hero bianco), eliminare anche quello.

- [ ] **Step 4: Verificare in browser**

Aprire `http://localhost:3000/` e verificare:
- Header visibile e scrolled state funziona
- Mobile sidebar si apre/chiude
- Gallery drag funziona
- Scroll reveal funziona
- Page transition funziona
- Footer visibile

- [ ] **Step 5: Commit**

```bash
git add css/shared.css js/shared.js index.html
git commit -m "refactor: extract shared CSS/JS, clean index.html"
```

---

## Task 4: Pulire `chi-siamo.html`

**Files:**
- Modify: `chi-siamo.html`

- [ ] **Step 1: Aggiungere link shared.css, rimuovere vecchi CSS esterni**

Sostituire:
```html
<link rel="stylesheet" href="css/style.css?v=3">
<link rel="stylesheet" href="css/animations.css">
<link rel="stylesheet" href="css/cart.css">
```
Con:
```html
<link rel="stylesheet" href="css/shared.css">
```

- [ ] **Step 2: Rimuovere dal `<style>` inline il codice duplicato**

Stessa pulizia di Task 3: rimuovere :root, reset, header, sidebar, footer, reveal, cursor, page transition. Lasciare SOLO: `.cs-gal`, `.cs-storia`, `.cs-cta`, `.p-maestri`, `.p-chef`, e relativi responsive.

- [ ] **Step 3: Aggiungere breakpoint 480px mancante**

Aggiungere dopo il blocco `@media (max-width: 768px)`:
```css
@media (max-width: 480px) {
  .p-maestri__grid { grid-template-columns: 1fr; }
  .cs-storia { padding: 64px 20px; }
}
```

- [ ] **Step 4: Rimuovere vecchi `<script>` esterni e inline, sostituire con shared.js**

Rimuovere:
```html
<script src="js/main.js"></script>
<script src="js/shopify.js" defer></script>
```
E tutto il JS inline (header, sidebar, gallery, cursor, reveal, transition).

Aggiungere:
```html
<script src="js/shared.js" defer></script>
```

- [ ] **Step 5: Verificare in browser e commit**

```bash
git add chi-siamo.html
git commit -m "refactor: clean chi-siamo.html, use shared CSS/JS"
```

---

## Task 5: Pulire `menu.html`

**Files:**
- Modify: `menu.html`

- [ ] **Step 1-4: Stessa procedura di Task 3/4**

- Aggiungere `<link rel="stylesheet" href="css/shared.css">`
- Rimuovere da `<style>`: variabili, reset, header, sidebar, footer, reveal, cursor, transition
- Lasciare SOLO: hero (se presente), `.menu-section`, `.menu-card`, responsive specifici
- Sostituire JS inline con `<script src="js/shared.js" defer></script>`
- Se ci sono JS specifici (carousel menu), lasciarli in script inline separato

- [ ] **Step 5: Verificare e commit**

```bash
git add menu.html
git commit -m "refactor: clean menu.html, use shared CSS/JS"
```

---

## Task 6: Pulire `catering-eventi.html`

**Files:**
- Modify: `catering-eventi.html`

- [ ] **Step 1-4: Stessa procedura**

- Aggiungere shared.css
- Rimuovere duplicati dal `<style>`
- Lasciare SOLO: `.showcase`, `.servizio-intro`, `.process-block`, `.cta-section`, responsive specifici
- Sostituire JS inline con shared.js

- [ ] **Step 5: Uniformare footer padding a 768px**

Attualmente ha `padding: 80px 24px 56px` diverso dalle altre (56px 24px 36px). Rimuovere la regola locale — userà quella di shared.css.

- [ ] **Step 6: Verificare e commit**

```bash
git add catering-eventi.html
git commit -m "refactor: clean catering-eventi.html, use shared CSS/JS"
```

---

## Task 7: Pulire `contatti.html`

**Files:**
- Modify: `contatti.html`

- [ ] **Step 1-4: Stessa procedura**

- Aggiungere shared.css
- Rimuovere duplicati dal `<style>`
- Lasciare SOLO: `.ct`, `.ct__*`, `.ct-map`, responsive specifici
- Sostituire JS inline con shared.js

- [ ] **Step 5: Verificare e commit**

```bash
git add contatti.html
git commit -m "refactor: clean contatti.html, use shared CSS/JS"
```

---

## Task 8: Pulizia file orfani

**Files:**
- Delete: `css/pages.css`, `css/vetrina.css`
- Evaluate: `css/style.css`, `css/animations.css`, `css/cart.css`

- [ ] **Step 1: Verificare se style.css/animations.css/cart.css sono ancora referenziati**

```bash
grep -rl "style.css\|animations.css\|cart.css" *.html
```

Se nessuna pagina li referenzia piu, sono orfani.

- [ ] **Step 2: Eliminare file orfani confermati**

```bash
rm css/pages.css css/vetrina.css
```

Se style.css/animations.css/cart.css sono usati solo da pagine v1/v2 (index-v1.html, index-v2.html, chi-siamo-v2.html), lasciarli ma documentare che sono legacy.

- [ ] **Step 3: Rimuovere `--sidebar-w: 200px` da shared.css**

Variabile orfana, non piu usata.

- [ ] **Step 4: Commit finale**

```bash
git add -A
git commit -m "chore: remove orphaned CSS files, clean up variables"
```

---

## Task 9: Test finale cross-page

- [ ] **Step 1: Navigare tutte le pagine**

Verificare su `http://localhost:3000/`:
- `/` (index) — header, gallery, servizi, footer
- `/chi-siamo` — gallery, storia, maestri, footer  
- `/menu` — gallery, sezioni menu, footer
- `/catering-eventi` — gallery, servizi, CTA, footer
- `/contatti` — info, form, mappa, footer

- [ ] **Step 2: Verificare mobile (DevTools 375px)**

Per ogni pagina:
- Hamburger visibile e funzionante
- Sidebar si apre da sinistra
- Contenuto non overflow orizzontale
- Footer adattato

- [ ] **Step 3: Verificare transizioni pagina**

Navigare da pagina a pagina — fade out/in fluido.

- [ ] **Step 4: PR, merge, deploy**

```bash
git checkout -b refactor/shared-code
git push -u origin refactor/shared-code
gh pr create --title "Refactor: extract shared CSS/JS, clean all pages"
gh pr merge --merge
git checkout main && git pull
npx vercel --prod --yes
```

---

## Risultato atteso

| Metrica | Prima | Dopo |
|---------|-------|------|
| Righe totali HTML | 5,213 | ~3,500 |
| CSS duplicato | 1,357 righe | 0 |
| JS duplicato | 265 righe | 0 |
| File condivisi | 0 | 2 (shared.css + shared.js) |
| Breakpoint coerenti | No | Si (1024/768/480) |
| File orfani | 2-3 | 0 |
