/* MLUE motion layer: scroll reveal, count-up, nav, page transitions, hero glow */
(function () {
  'use strict';
  var reduce = false;
  var fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* Nav */
  window.toggleMenu = function () {
    var l = document.querySelector('.nav-links'); if (l) l.classList.toggle('open');
  };
  var nav = document.getElementById('main-nav');
  var ticking = false;
  function onScroll() {
    if (ticking) return; ticking = true;
    requestAnimationFrame(function () {
      if (nav) nav.classList.toggle('scrolled', window.scrollY > 40);
      ticking = false;
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* Scroll reveal with automatic stagger inside grids */
  var targets = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .proc-item');
  var groups = '.pkg-grid, .packages-grid, .rs-grid, .about-stats-grid-clean, .values-grid, .svc-grid-3, .deck-cards, .faq-grid, .ala-grid, .services-list, .process-grid';
  document.querySelectorAll(groups).forEach(function (g) {
    var i = 0;
    g.querySelectorAll(':scope > .reveal, :scope > .proc-item').forEach(function (c) {
      c.style.setProperty('--d', (i * 0.09).toFixed(2) + 's'); i++;
    });
  });
  function settle(el) {
    setTimeout(function () { el.classList.add('reveal-done'); }, 1300);
  }
  if (reduce || !('IntersectionObserver' in window)) {
    targets.forEach(function (el) { el.classList.add('visible'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('visible');
        settle(e.target);
        io.unobserve(e.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    targets.forEach(function (el) { io.observe(el); });
  }

  /* Count-up for any element with data-count */
  var counters = document.querySelectorAll('[data-count]');
  function runCount(el) {
    var to = parseFloat(el.getAttribute('data-count'));
    var dec = parseInt(el.getAttribute('data-dec') || '0', 10);
    var dur = 1600, t0 = null;
    function step(t) {
      if (t0 === null) t0 = t;
      var p = Math.min((t - t0) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 4);
      el.textContent = (to * eased).toFixed(dec);
      if (p < 1) requestAnimationFrame(step); else el.textContent = to.toFixed(dec);
    }
    requestAnimationFrame(step);
  }
  if (!reduce && 'IntersectionObserver' in window && counters.length) {
    var co = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { runCount(e.target); co.unobserve(e.target); }
      });
    }, { threshold: 0.6 });
    counters.forEach(function (c) { c.textContent = (0).toFixed(parseInt(c.getAttribute('data-dec') || '0', 10)); co.observe(c); });
  }

  /* Hero pointer glow, eased follow, runs only while the pointer is over the hero */
  var hero = document.getElementById('hero');
  if (hero && fine && !reduce) {
    var glow = document.createElement('div');
    glow.className = 'hero-pointer';
    hero.insertBefore(glow, hero.firstChild);
    var tx = 0, ty = 0, cx = 0, cy = 0, raf = null;
    function loop() {
      cx += (tx - cx) * 0.12; cy += (ty - cy) * 0.12;
      glow.style.setProperty('--mx', cx + 'px'); glow.style.setProperty('--my', cy + 'px');
      if (Math.abs(tx - cx) > 0.5 || Math.abs(ty - cy) > 0.5) raf = requestAnimationFrame(loop); else raf = null;
    }
    hero.addEventListener('mousemove', function (e) {
      var r = hero.getBoundingClientRect(); tx = e.clientX - r.left; ty = e.clientY - r.top;
      if (!raf) raf = requestAnimationFrame(loop);
    }, { passive: true });
  }

  /* Page transitions between internal pages */
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href]');
    if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    if (a.target && a.target !== '_self') return;
    var href = a.getAttribute('href');
    if (!href || href.charAt(0) === '#' || /^(mailto:|tel:|https?:|javascript:)/i.test(href)) return;
    if (a.hostname && a.hostname !== location.hostname) return;
    e.preventDefault();
    document.documentElement.classList.add('page-leave');
    setTimeout(function () { location.href = a.href; }, reduce ? 0 : 200);
  });
  window.addEventListener('pageshow', function (e) {
    if (e.persisted) document.documentElement.classList.remove('page-leave');
  });
})();

/* Extras: scroll progress bar, hero orbs, floating WhatsApp button */
(function () {
  var bar = document.createElement('div'); bar.className = 'scroll-progress'; document.body.appendChild(bar);
  var t = false;
  function prog() {
    if (t) return; t = true;
    requestAnimationFrame(function () {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.transform = 'scaleX(' + (h > 0 ? Math.min(window.scrollY / h, 1) : 0) + ')'; t = false;
    });
  }
  window.addEventListener('scroll', prog, { passive: true }); prog();

  var hero = document.getElementById('hero');
  if (hero) {
    ['o1', 'o2'].forEach(function (c) { var o = document.createElement('div'); o.className = 'hero-orb ' + c; hero.insertBefore(o, hero.firstChild); });
  }

  if (!/contact\.html$/i.test(location.pathname)) {
    var a = document.createElement('a');
    a.className = 'wa-float'; a.href = 'https://wa.me/94728444300'; a.target = '_blank'; a.rel = 'noopener noreferrer';
    a.setAttribute('aria-label', 'Chat with MLUE on WhatsApp');
    a.innerHTML = '<svg viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12.048 2.002C6.476 2.002 1.94 6.532 1.94 12.098c0 1.763.463 3.479 1.345 4.995L2 22l5.04-1.322a10.108 10.108 0 0 0 4.984 1.315h.004c5.572 0 10.109-4.53 10.109-10.097 0-2.697-1.052-5.23-2.961-7.137A10.06 10.06 0 0 0 12.048 2zm0 18.49h-.003a8.4 8.4 0 0 1-4.282-1.175l-.307-.183-3.183.835.85-3.1-.2-.318a8.38 8.38 0 0 1-1.285-4.451c0-4.638 3.78-8.412 8.423-8.412a8.37 8.37 0 0 1 5.954 2.465 8.347 8.347 0 0 1 2.462 5.945c-.002 4.638-3.78 8.394-8.429 8.394z"/></svg>';
    document.body.appendChild(a);
  }
})();
