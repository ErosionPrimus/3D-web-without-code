/* ═══════════════════════════════════════════════════
   FocusedBuzz — Shared JS
   - Mobile nav drawer
   - Search overlay
   - Lazy loading images
   - Cookie banner
   ═══════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Mobile nav drawer ────────────────────── */
  const hamburger = document.querySelector('[data-drawer-toggle]');
  const drawer   = document.querySelector('[data-drawer]');
  const overlay  = document.querySelector('[data-drawer-overlay]');
  const closeBtn = document.querySelector('[data-drawer-close]');

  function openDrawer() {
    drawer.classList.add('is-open');
    overlay.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  }
  function closeDrawer() {
    drawer.classList.remove('is-open');
    overlay.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  if (hamburger) hamburger.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  if (overlay)  overlay.addEventListener('click', closeDrawer);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeDrawer(); });

  /* ── Search ──────────────────────────────── */
  const searchInput    = document.querySelector('[data-search-input]');
  const searchResults  = document.querySelector('[data-search-results]');
  const searchForm     = document.querySelector('[data-search-form]');

  if (searchForm && searchResults) {
    searchForm.addEventListener('submit', e => {
      e.preventDefault();
      const q = searchInput.value.trim();
      if (q.length >= 3) {
        window.location.href = `/search?q=${encodeURIComponent(q)}`;
      }
    });
  }

  /* ── Lazy load images ────────────────────── */
  const lazyImgs = document.querySelectorAll('img[data-src]');
  if ('IntersectionObserver' in window) {
    const obs = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          img.classList.add('hl-lazy--loaded');
          obs.unobserve(img);
        }
      });
    }, { rootMargin: '200px' });
    lazyImgs.forEach(img => obs.observe(img));
  } else {
    lazyImgs.forEach(img => { img.src = img.dataset.src; img.removeAttribute('data-src'); });
  }

  /* ── Cookie banner ───────────────────────── */
  const cookieBanner = document.querySelector('[data-cookie-banner]');
  const cookieAccept = document.querySelector('[data-cookie-accept]');
  if (cookieBanner && cookieAccept) {
    if (!localStorage.getItem('focusedbuzz_cookie_consent')) {
      cookieBanner.classList.add('is-visible');
    }
    cookieAccept.addEventListener('click', () => {
      localStorage.setItem('focusedbuzz_cookie_consent', '1');
      cookieBanner.classList.remove('is-visible');
    });
  }

  /* ── Article TOC auto-generate ───────────── */
  const articleBody = document.querySelector('.hl-article__body');
  if (articleBody) {
    const headings = articleBody.querySelectorAll('h2, h3');
    if (headings.length > 2) {
      const toc = document.createElement('nav');
      toc.className = 'hl-toc';
      toc.innerHTML = '<p class="hl-toc__title">On this page</p><ol></ol>';
      const ol = toc.querySelector('ol');
      headings.forEach(h => {
        if (!h.id) {
          h.id = 'sec-' + Math.random().toString(36).slice(2, 8);
        }
        const li = document.createElement('li');
        const a  = document.createElement('a');
        a.href = '#' + h.id;
        a.textContent = h.textContent;
        li.appendChild(a);
        ol.appendChild(li);
      });
      articleBody.insertBefore(toc, articleBody.firstChild);
    }
  }

});