/* =========================================================
   MONOLITH BUILDERS & MATERIALS: demo behaviour
   Vanilla JS, no dependencies, no backend.
   ========================================================= */
(() => {
  'use strict';

  /* ---------------------------------------------------------
     CONFIGURATION: edit this block for a real client
     --------------------------------------------------------- */
  const CONFIG = {
    // Supplier WhatsApp number: digits only, with country code and no "+".
    // Example: '2348012345678'. Left empty, WhatsApp opens its chat picker.
    WHATSAPP_NUMBER: '',
    BUSINESS_NAME: 'Monolith Builders & Materials',
    TELEPHONE: '',   // e.g. '+234 801 234 5678'
    EMAIL: '',       // e.g. 'sales@example.com'
    SERVICE_AREAS: ['Abuja', 'Kano', 'Lagos', 'Kaduna'],

    // Images sit next to index.html. Swap any file (or URL) for a real photograph.
    // Anything empty or failing to load shows the built-in architectural drawing.
    IMAGES: {
      hero: 'hero.jpg',
      residential: 'residential.jpg',
      commercial: 'commercial.jpg',
      renovation: 'renovation.jpg',
      foundation: 'foundation.jpg',
      cement: 'cement.jpg',
      steel: 'steel.jpg',
      roofing: 'roofing.jpg',
      blocks: 'blocks.jpg',
      finishing: 'finishing.jpg',
      plumbing: 'plumbing.jpg'
    },

    // Looping hero background video. Set to '' to fall back to the CSS animation.
    VIDEO: {
      desktop: [['hero-bg.webm', 'video/webm'], ['hero-bg.mp4', 'video/mp4']],
      mobile:  [['hero-bg-mobile.mp4', 'video/mp4']]
    }
  };

  const CATEGORIES = [
    { id: 'cement',    name: 'Cement & Binders',      desc: 'Structural cement and binding mixes for foundations, walls and slabs.' },
    { id: 'steel',     name: 'Steel & Reinforcement', desc: 'Reinforcement bars and fixings that carry the load.' },
    { id: 'roofing',   name: 'Roofing Materials',     desc: 'Sheets and accessories for durable, weather-ready roofs.' },
    { id: 'blocks',    name: 'Blocks & Concrete',     desc: 'Walling units and concrete products for clean, true builds.' },
    { id: 'finishing', name: 'Finishing Materials',   desc: 'Tiles, paints and finishes for the final impression.' },
    { id: 'plumbing',  name: 'Plumbing & Electrical', desc: 'Pipes, conduit and fittings for services behind the walls.' }
  ];

  // Fictional demo products. No prices, no stock claims.
  const PRODUCTS = [
    { id: 'p1',  cat: 'cement',    name: 'Foundation Cement',             specs: ['General structural use', 'Bagged'],            unit: 'Per bag' },
    { id: 'p2',  cat: 'cement',    name: 'Rapid-Set Binder Mix',          specs: ['Repair and patching', 'Small-batch bags'],     unit: 'Per bag' },
    { id: 'p3',  cat: 'steel',     name: 'Ribbed Reinforcement Bar',      specs: ['Multiple diameters', 'Cut-to-length options'], unit: 'Per length' },
    { id: 'p4',  cat: 'steel',     name: 'Binding Wire Coil',             specs: ['Annealed wire', 'For tying reinforcement'],    unit: 'Per roll' },
    { id: 'p5',  cat: 'roofing',   name: 'Longspan Roofing Sheet',        specs: ['Profiled sheet', 'Choice of colours'],         unit: 'Per sheet' },
    { id: 'p6',  cat: 'roofing',   name: 'Ridge Cap Section',             specs: ['Matches roofing sheet', 'Weather seal ready'], unit: 'Per piece' },
    { id: 'p7',  cat: 'blocks',    name: 'Solid Concrete Block',          specs: ['Load-bearing walling', 'Standard sizes'],      unit: 'Per block' },
    { id: 'p8',  cat: 'blocks',    name: 'Hollow Concrete Block',         specs: ['Lighter walling unit', 'Standard sizes'],      unit: 'Per block' },
    { id: 'p9',  cat: 'finishing', name: 'Porcelain Floor Tile, Stone',   specs: ['Interior flooring', 'Boxed by area'],          unit: 'Per carton' },
    { id: 'p10', cat: 'finishing', name: 'Interior Emulsion, Ivory',      specs: ['Walls and ceilings', 'Pail packaging'],        unit: 'Per pail' },
    { id: 'p11', cat: 'plumbing',  name: 'PVC Pressure Pipe',             specs: ['Water supply lines', 'Multiple diameters'],    unit: 'Per length' },
    { id: 'p12', cat: 'plumbing',  name: 'Conduit and Cable Starter Set', specs: ['Wiring runs', 'Fittings included'],            unit: 'Per set' }
  ];

  /* ---------------------------------------------------------
     Helpers
     --------------------------------------------------------- */
  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const root = document.documentElement;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  const isSmall = window.matchMedia('(max-width: 720px)');
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const catName = (id) => (CATEGORIES.find((c) => c.id === id) || {}).name || '';

  /* ---------------------------------------------------------
     Art: line drawings used when photos are absent or fail
     --------------------------------------------------------- */
  const svg = (inner, vb = '0 0 400 300') =>
    `<svg viewBox="${vb}" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false"><g fill="none" stroke="currentColor" stroke-width="1.2">${inner}</g></svg>`;

  const lines = (n, fn) => Array.from({ length: n }, (_, i) => fn(i)).join('');

  const ART = {
    cement: svg('<rect x="70" y="170" width="120" height="70"/><rect x="200" y="170" width="120" height="70"/><rect x="135" y="100" width="120" height="70"/><path d="M135 120h120M70 190h120M200 190h120M160 112h70M95 182h70M225 182h70"/>'),
    steel: svg(lines(7, (i) => `<path d="M40 ${70 + i * 28}H360"/>`) + lines(14, (i) => `<path d="M${60 + i * 22} ${64 + (i % 2) * 2}v${(6 - 0) * 28 + 12}" opacity=".35"/>`)),
    roofing: svg(lines(4, (i) => `<path d="M0 ${90 + i * 46}q25 -28 50 0t50 0t50 0t50 0t50 0t50 0t50 0t50 0"/>`)),
    blocks: svg(lines(6, (i) => `<path d="M40 ${60 + i * 36}H360"/>` + lines(6, (j) => `<path d="M${(i % 2 ? 40 : 90) + j * 100} ${60 + i * 36}v36"/>`)) + '<path d="M40 276H360"/>'),
    finishing: svg(lines(7, (i) => `<path d="M${40 + i * 53} 40v220"/>`) + lines(5, (i) => `<path d="M40 ${40 + i * 55}H360"/>`) + '<path d="M40 260L360 40" opacity=".4"/>'),
    plumbing: svg('<path d="M40 110H230a30 30 0 0 1 30 30V230H360"/><path d="M40 134H222a6 6 0 0 1 6 6V254H360" opacity=".5"/><circle cx="260" cy="140" r="9"/><rect x="226" y="98" width="8" height="48" opacity=".6"/>'),
    hero: svg(
      '<rect x="180" y="120" width="360" height="470"/>' +
      lines(11, (i) => `<path d="M${210 + i * 30} 120V590" opacity=".5"/>`) +
      lines(5, (i) => `<path d="M180 ${212 + i * 92}H540"/>`) +
      '<rect x="80" y="380" width="170" height="210"/><path d="M80 470H250M80 520H250" opacity=".5"/><path d="M20 590H640"/><path d="M540 210H620V590" opacity=".4"/>',
      '0 0 640 700'),
    residential: svg('<path d="M60 250V150L200 70l140 80v100"/><path d="M40 250H360"/><rect x="95" y="165" width="60" height="85"/><rect x="215" y="165" width="90" height="50"/><path d="M95 207h60M260 165v50"/>'),
    commercial: svg('<rect x="110" y="40" width="180" height="210"/>' + lines(8, (i) => `<path d="M${110 + (i + 1) * 20} 40V250"/>`) + lines(6, (i) => `<path d="M110 ${74 + i * 29}H290"/>`) + '<path d="M40 250H360"/>'),
    renovation: svg('<rect x="100" y="70" width="200" height="180"/><path d="M80 60V260M320 60V260M80 110H320M80 160H320M80 210H320" opacity=".55"/><path d="M120 250V190h50v60M200 150h70v60h-70z"/><path d="M40 260H360"/>'),
    foundation: svg(lines(5, (i) => `<rect x="${50 + i * 62}" y="70" width="26" height="190"/>`) + '<path d="M30 70H350M30 260H370M30 280H370" /><path d="M30 70l16-16h300"/>')
  };

  function mountMedia() {
    $$('.media[data-art]:not([data-mounted])').forEach((el) => {
      el.dataset.mounted = '1';
      const key = el.dataset.art;
      el.insertAdjacentHTML('afterbegin', ART[key] || '');
      const url = CONFIG.IMAGES[el.dataset.img || key];
      if (!url) return;
      const img = new Image();
      img.alt = el.dataset.alt || '';
      img.decoding = 'async';
      if (key !== 'hero') img.loading = 'lazy';
      img.width = 800; img.height = 600;
      img.onload = () => img.classList.add('is-loaded');
      img.onerror = () => img.remove();
      img.src = url;
      el.prepend(img);
    });
  }

  /* ---------------------------------------------------------
     Navigation: solid on scroll, active link, mobile menu
     --------------------------------------------------------- */
  function initNav() {
    const nav = $('#nav');
    const onScroll = () => nav.classList.toggle('is-solid', window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    const burger = $('#burger');
    const menu = $('#menu');
    const setMenu = (open) => {
      burger.setAttribute('aria-expanded', String(open));
      burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      menu.classList.toggle('is-open', open);
      menu.setAttribute('aria-hidden', String(!open));
      document.body.classList.toggle('lock', open);
      if (open) $('a', menu).focus({ preventScroll: true });
    };
    burger.addEventListener('click', () => setMenu(burger.getAttribute('aria-expanded') !== 'true'));
    $$('[data-menu]').forEach((a) => a.addEventListener('click', () => setMenu(false)));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && menu.classList.contains('is-open')) { setMenu(false); burger.focus(); }
    });
    window.matchMedia('(min-width: 1025px)').addEventListener('change', (e) => { if (e.matches) setMenu(false); });

    // Active link by section in view
    const links = $$('[data-nav]');
    const map = new Map(links.map((a) => [a.getAttribute('href').slice(1), a]));
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((en) => {
          if (!en.isIntersecting) return;
          links.forEach((l) => l.classList.remove('is-active'));
          const link = map.get(en.target.id);
          if (link) link.classList.add('is-active');
        });
      }, { rootMargin: '-45% 0px -50% 0px' });
      map.forEach((_, id) => { const s = document.getElementById(id); if (s) io.observe(s); });
    }
  }

  /* ---------------------------------------------------------
     Hero background: particles, parallax, pause when hidden
     --------------------------------------------------------- */
  function initVideo(hero) {
    const video = $('.hero__video', hero);
    if (!video || !CONFIG.VIDEO) return;
    const saveData = navigator.connection && navigator.connection.saveData;
    const useVideo = () => { video.classList.add('is-on'); hero.classList.add('has-video'); };
    const dropVideo = () => { video.classList.remove('is-on'); hero.classList.remove('has-video'); };

    // Reduced motion or Data Saver: show the still poster only, never download the video
    if (reduceMotion.matches || saveData) { useVideo(); return; }

    (isSmall.matches ? CONFIG.VIDEO.mobile : CONFIG.VIDEO.desktop).forEach(([src, type]) => {
      const s = document.createElement('source'); s.src = src; s.type = type; video.appendChild(s);
    });
    video.muted = true;
    video.addEventListener('error', dropVideo, true);
    video.load();
    const p = video.play();
    if (p && p.then) p.then(useVideo).catch(dropVideo); else useVideo();

    // Only run while the hero is on screen and the tab is visible
    let inView = true;
    const sync = () => { if (!hero.classList.contains('has-video')) return; (inView && !document.hidden) ? video.play().catch(() => {}) : video.pause(); };
    new IntersectionObserver(([e]) => { inView = e.isIntersecting; sync(); }).observe(hero);
    document.addEventListener('visibilitychange', sync);
  }

  function initHero() {
    document.addEventListener('visibilitychange', () => root.classList.toggle('is-paused', document.hidden));
    initVideo($('.hero'));
    if (reduceMotion.matches) return;

    const dust = $('#dust');
    const count = isSmall.matches ? 6 : 18;
    const frag = document.createDocumentFragment();
    for (let i = 0; i < count; i++) {
      const p = document.createElement('i');
      p.style.setProperty('--x', Math.random() * 100 + '%');
      p.style.setProperty('--y', 30 + Math.random() * 70 + '%');
      p.style.setProperty('--dx', (Math.random() * 80 - 40) + 'px');
      p.style.setProperty('--d', 14 + Math.random() * 14 + 's');
      p.style.setProperty('--delay', -Math.random() * 20 + 's');
      frag.appendChild(p);
    }
    dust.appendChild(frag);

    // Pointer parallax: desktop with a fine pointer only
    if (!finePointer.matches || isSmall.matches) return;
    const hero = $('.hero');
    const layers = $$('[data-depth]', hero);
    let tx = 0, ty = 0, raf = 0, visible = true;
    new IntersectionObserver(([e]) => { visible = e.isIntersecting; }).observe(hero);
    hero.addEventListener('pointermove', (e) => {
      if (!visible) return;
      tx = e.clientX / window.innerWidth - .5;
      ty = e.clientY / window.innerHeight - .5;
      if (!raf) raf = requestAnimationFrame(() => {
        raf = 0;
        layers.forEach((l) => { const d = +l.dataset.depth; l.style.translate = `${-tx * d}px ${-ty * d}px`; });
      });
    }, { passive: true });
  }

  /* ---------------------------------------------------------
     Scroll reveal (content is visible by default without JS)
     --------------------------------------------------------- */
  function initReveal() {
    const items = $$('.reveal');
    if (!('IntersectionObserver' in window) || reduceMotion.matches) { items.forEach((i) => i.classList.add('is-in')); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); } });
    }, { threshold: .12, rootMargin: '0px 0px -6% 0px' });
    items.forEach((el, i) => { el.style.transitionDelay = (i % 4) * 70 + 'ms'; io.observe(el); });
    // Safety net: never leave content hidden
    setTimeout(() => items.forEach((i) => i.classList.add('is-in')), 6000);
  }

  /* ---------------------------------------------------------
     Catalogue: categories, search, filter, request price
     --------------------------------------------------------- */
  const state = { cat: 'all', q: '' };

  function renderCategories() {
    $('#cats').innerHTML = CATEGORIES.map((c) => `
      <button class="cat" type="button" data-cat="${c.id}" aria-pressed="false" role="listitem">
        <div class="media" data-art="${c.id}" data-img="${c.id}" data-alt="${esc(c.name)}"></div>
        <span class="cat__text"><h3>${esc(c.name)}</h3><p>${esc(c.desc)}</p><span class="cat__go">Explore category</span></span>
      </button>`).join('');

    const chips = [{ id: 'all', name: 'All' }, ...CATEGORIES];
    $('#chips').innerHTML = chips.map((c) => `<button class="chip" type="button" data-cat="${c.id}" aria-pressed="${c.id === 'all'}">${esc(c.name)}</button>`).join('');
  }

  function renderProducts() {
    const q = state.q.trim().toLowerCase();
    const list = PRODUCTS.filter((p) =>
      (state.cat === 'all' || p.cat === state.cat) &&
      (!q || [p.name, p.unit, catName(p.cat), ...p.specs].join(' ').toLowerCase().includes(q)));

    $('#count').textContent = `${list.length} sample ${list.length === 1 ? 'product' : 'products'} shown`;
    const grid = $('#products');
    grid.innerHTML = list.length ? list.map((p) => `
      <article class="product">
        <div class="media" data-art="${p.cat}" data-img="${p.cat}" data-alt="${esc(p.name)}"></div>
        <div class="product__meta"><span>${esc(catName(p.cat))}</span><span>Sample</span></div>
        <h3>${esc(p.name)}</h3>
        <ul class="specs">${p.specs.map((s) => `<li>${esc(s)}</li>`).join('')}</ul>
        <div class="product__foot">
          <div class="unit"><span>${esc(p.unit)}</span><b>Price on request</b></div>
          <button class="btn btn--dark" type="button" data-request="${p.id}">REQUEST PRICE</button>
        </div>
      </article>`).join('')
      : '<p class="empty">No sample products match. Try a different word or category, or ask for it through the quote form.</p>';
    mountMedia();
  }

  function setCategory(id, scroll) {
    state.cat = id;
    $$('.cat').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.cat === id)));
    $$('.chip').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.cat === id)));
    const c = CATEGORIES.find((x) => x.id === id);
    $('#panel-kicker').textContent = c ? c.name.toUpperCase() : 'ALL CATEGORIES';
    $('#panel-title').textContent = c ? c.name : 'Sample product listings';
    $('#panel-text').textContent = c ? c.desc + ' Sample products only; the supplier confirms prices and availability.' : 'Products below are fictional examples. Prices and stock are confirmed by the supplier on request.';
    renderProducts();
    if (scroll) $('#catalogue').scrollIntoView({ behavior: reduceMotion.matches ? 'auto' : 'smooth', block: 'start' });
  }

  function initCatalogue() {
    renderCategories();
    mountMedia();
    renderProducts();

    $('#cats').addEventListener('click', (e) => {
      const b = e.target.closest('.cat'); if (!b) return;
      setCategory(state.cat === b.dataset.cat ? 'all' : b.dataset.cat, true);
    });
    $('#chips').addEventListener('click', (e) => {
      const b = e.target.closest('.chip'); if (b) setCategory(b.dataset.cat, false);
    });
    let t;
    $('#search').addEventListener('input', (e) => { clearTimeout(t); t = setTimeout(() => { state.q = e.target.value; renderProducts(); }, 120); });
    $('#products').addEventListener('click', (e) => {
      const b = e.target.closest('[data-request]'); if (!b) return;
      const p = PRODUCTS.find((x) => x.id === b.dataset.request);
      prefillQuote(p);
    });
  }

  /* ---------------------------------------------------------
     Quote form + WhatsApp
     --------------------------------------------------------- */
  const form = $('#quote');
  const f = (id) => $('#f-' + id);
  let toastTimer;

  function toast(msg) {
    const t = $('#toast');
    t.textContent = msg; t.classList.add('is-on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove('is-on'), 3200);
  }

  function fillProductList() {
    const cat = f('cat').value;
    $('#product-list').innerHTML = PRODUCTS.filter((p) => !cat || p.cat === cat).map((p) => `<option value="${esc(p.name)}"></option>`).join('');
  }

  function prefillQuote(p) {
    f('cat').value = p.cat;
    fillProductList();
    f('product').value = p.name;
    clearError('cat'); clearError('product');
    form.scrollIntoView({ behavior: reduceMotion.matches ? 'auto' : 'smooth', block: 'start' });
    setTimeout(() => f('qty').focus({ preventScroll: true }), reduceMotion.matches ? 0 : 650);
    toast(`${p.name} added to your quote`);
  }

  const RULES = {
    name:    (v) => v.trim().length >= 2 ? '' : 'Enter your full name.',
    phone:   (v) => /^\+?[0-9][0-9\s-]{8,16}$/.test(v.trim()) ? '' : 'Enter a valid phone number, for example +234 800 000 0000.',
    cat:     (v) => v ? '' : 'Choose a material category.',
    product: (v) => v.trim().length >= 2 ? '' : 'Enter or choose a product name.',
    qty:     (v) => v.trim() ? '' : 'Enter an estimated quantity, for example 200 bags.',
    loc:     (v) => v.trim().length >= 2 ? '' : 'Enter the delivery town or city.'
  };

  function setError(key, msg) {
    f(key).setAttribute('aria-invalid', 'true');
    $('#e-' + key).textContent = msg;
  }
  function clearError(key) {
    f(key).removeAttribute('aria-invalid');
    $('#e-' + key).textContent = '';
  }
  function validate() {
    let first = null;
    Object.keys(RULES).forEach((k) => {
      const msg = RULES[k](f(k).value);
      if (msg) { setError(k, msg); first = first || f(k); } else clearError(k);
    });
    return first;
  }

  function buildMessage() {
    const v = (k) => f(k).value.trim();
    const rows = [
      `*Quotation request: ${CONFIG.BUSINESS_NAME}*`,
      '',
      `*Name:* ${v('name')}`,
      v('biz') ? `*Business:* ${v('biz')}` : null,
      `*Phone:* ${v('phone')}`,
      '',
      `*Category:* ${catName(f('cat').value)}`,
      `*Product:* ${v('product')}`,
      `*Estimated quantity:* ${v('qty')}`,
      `*Delivery location:* ${v('loc')}`,
      v('notes') ? '' : null,
      v('notes') ? `*Project details:*\n${v('notes')}` : null,
      '',
      '_Sent from the website quote form._'
    ];
    return rows.filter((r) => r !== null).join('\n');
  }

  function initForm() {
    $('#f-cat').insertAdjacentHTML('beforeend', CATEGORIES.map((c) => `<option value="${c.id}">${esc(c.name)}</option>`).join(''));
    fillProductList();
    $('#area-list').innerHTML = CONFIG.SERVICE_AREAS.map((a) => `<option value="${esc(a)}"></option>`).join('');
    f('cat').addEventListener('change', fillProductList);

    Object.keys(RULES).forEach((k) => {
      f(k).addEventListener('blur', () => { const m = RULES[k](f(k).value); m ? setError(k, m) : clearError(k); });
      f(k).addEventListener('input', () => { if (f(k).getAttribute('aria-invalid')) { const m = RULES[k](f(k).value); if (!m) clearError(k); } });
    });

    const status = $('#status');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      status.className = 'status'; status.textContent = '';
      const bad = validate();
      if (bad) { bad.focus(); status.classList.add('is-warn'); status.textContent = 'Please correct the highlighted fields.'; return; }

      const number = CONFIG.WHATSAPP_NUMBER.replace(/\D/g, '');
      const url = `https://wa.me/${number}?text=${encodeURIComponent(buildMessage())}`;
      const win = window.open(url, '_blank', 'noopener');
      if (!win) { window.location.href = url; }
      status.textContent = number
        ? 'WhatsApp is opening with your message ready to send. Nothing has been sent until you press send there.'
        : 'WhatsApp is opening. This demo has no supplier number set yet, so you will be asked who to send to.';
      if (!number) status.classList.add('is-warn');
    });

    $('#check-delivery').addEventListener('click', () => {
      setTimeout(() => f('loc').focus({ preventScroll: true }), reduceMotion.matches ? 0 : 700);
    });
  }

  /* ---------------------------------------------------------
     Delivery areas, contact placeholders
     --------------------------------------------------------- */
  function initContent() {
    $('#areas').innerHTML = CONFIG.SERVICE_AREAS.map((a) => `<li>${esc(a)}<small>example</small></li>`).join('');
    $('#areas-text').textContent = CONFIG.SERVICE_AREAS.join(', ') + ' (examples)';
    const number = CONFIG.WHATSAPP_NUMBER.replace(/\D/g, '');
    $('#wa-link').href = `https://wa.me/${number}`;
    if (CONFIG.TELEPHONE) $('#phone-ph').textContent = CONFIG.TELEPHONE;
    if (CONFIG.EMAIL) $('#email-ph').innerHTML = `<a href="mailto:${esc(CONFIG.EMAIL)}">${esc(CONFIG.EMAIL)}</a>`;
  }

  /* ---------------------------------------------------------
     Back to top, legal dialogs, custom cursor
     --------------------------------------------------------- */
  function initUtilities() {
    const top = $('#to-top');
    window.addEventListener('scroll', () => { top.hidden = window.scrollY < 900; }, { passive: true });
    top.addEventListener('click', () => window.scrollTo({ top: 0, behavior: reduceMotion.matches ? 'auto' : 'smooth' }));

    const LEGAL = {
      privacy: ['Privacy policy', 'Placeholder. This demo site collects no data. The quote form only opens WhatsApp on your own device. Replace this text with the supplier\'s real privacy policy before launch.'],
      terms: ['Terms and conditions', 'Placeholder. Product listings are illustrative samples with no prices or stock claims. Replace this text with the supplier\'s real terms before launch.']
    };
    const dlg = $('#legal');
    $$('[data-legal]').forEach((b) => b.addEventListener('click', () => {
      const [t, body] = LEGAL[b.dataset.legal];
      $('#legal-title').textContent = t; $('#legal-body').textContent = body;
      if (typeof dlg.showModal === 'function') dlg.showModal(); else alert(t + '\n\n' + body);
    }));

    // Custom cursor ring: desktop with a fine pointer only; native cursor stays
    if (finePointer.matches && !reduceMotion.matches) {
      const c = $('#cursor');
      let x = 0, y = 0, cx = 0, cy = 0, run = false;
      const loop = () => {
        cx += (x - cx) * .22; cy += (y - cy) * .22;
        c.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
        run = document.hidden ? false : (Math.abs(x - cx) > .1 || Math.abs(y - cy) > .1);
        if (run) requestAnimationFrame(loop);
      };
      window.addEventListener('pointermove', (e) => {
        x = e.clientX; y = e.clientY; c.classList.add('is-on');
        c.classList.toggle('is-link', !!e.target.closest('a, button, input, select, textarea, label'));
        if (!run) { run = true; requestAnimationFrame(loop); }
      }, { passive: true });
      document.addEventListener('pointerleave', () => c.classList.remove('is-on'));
    }
  }

  /* ---------------------------------------------------------
     Init
     --------------------------------------------------------- */
  function init() {
    mountMedia();
    initNav();
    initHero();
    initCatalogue();
    initForm();
    initContent();
    initReveal();
    initUtilities();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
