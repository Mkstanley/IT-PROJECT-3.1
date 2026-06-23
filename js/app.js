/* ============================================================================
   KejaHunt — app.js
   ICN  : inline SVG icon set (Lucide-style, 1em, currentColor).
   KejaUI: shared view helpers used by every page (nav, footer, cards,
           modal, toast, badges, formatting).
   Depends on window.KH (data.js) being loaded first.
   ========================================================================== */
(function () {
  'use strict';

  /* ---- icons ------------------------------------------------------------- */
  const svg = (inner) =>
    `<svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${inner}</svg>`;

  const ICN = {
    home:    svg('<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/><path d="M9.5 21v-6h5v6"/>'),
    search:  svg('<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>'),
    pin:     svg('<path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11Z"/><circle cx="12" cy="10" r="2.5"/>'),
    shield:  svg('<path d="M12 3 5 6v5c0 4.5 3 7.8 7 10 4-2.2 7-5.5 7-10V6l-7-3Z"/><path d="m9 12 2 2 4-4"/>'),
    check:   svg('<path d="M20 6 9 17l-5-5"/>'),
    heart:   svg('<path d="M12 20s-7-4.6-9.5-9C1 8 2.5 4.5 6 4.5c2 0 3.2 1.2 4 2.3.8-1.1 2-2.3 4-2.3 3.5 0 5 3.5 3.5 6.5C19 15.4 12 20 12 20Z"/>'),
    msg:     svg('<path d="M21 15a3 3 0 0 1-3 3H8l-5 3V6a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3Z"/>'),
    user:    svg('<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.6-6 8-6s8 2 8 6"/>'),
    users:   svg('<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c0-3.3 3-5 6.5-5s6.5 1.7 6.5 5"/><path d="M16 5.2A3.5 3.5 0 0 1 16 12"/><path d="M17 15.2c2.6.4 4.5 2 4.5 4.8"/>'),
    calendar:svg('<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 9h18M8 3v4M16 3v4"/>'),
    mail:    svg('<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 7 8 6 8-6"/>'),
    phone:   svg('<path d="M5 4h3l2 5-2 1.5a12 12 0 0 0 5.5 5.5L18 18l5 2v3a2 2 0 0 1-2 2A18 18 0 0 1 3 6a2 2 0 0 1 2-2Z" transform="translate(-1 -1)"/>'),
    star:    svg('<path d="m12 3 2.6 5.6 6 .7-4.4 4.1 1.2 6L12 16.9 6.6 19.4l1.2-6L3.4 9.3l6-.7Z"/>'),
    arrow:   svg('<path d="M5 12h14"/><path d="m13 6 6 6-6 6"/>'),
    plus:    svg('<path d="M12 5v14M5 12h14"/>'),
    x:       svg('<path d="M6 6 18 18M18 6 6 18"/>'),
    bed:     svg('<path d="M3 18V8m0 4h18a0 0 0 0 1 0 0v6m0-6a3 3 0 0 0-3-3H9a3 3 0 0 0-3 3"/><path d="M3 18h18"/>'),
    bath:    svg('<path d="M4 11h16v3a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4Z"/><path d="M6 11V6a2 2 0 0 1 2-2c1.2 0 1.7.7 2 1.5"/><path d="M7 18l-1 2M18 18l1 2"/>'),
    grid:    svg('<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>'),
    list:    svg('<path d="M8 6h13M8 12h13M8 18h13"/><circle cx="3.5" cy="6" r="1"/><circle cx="3.5" cy="12" r="1"/><circle cx="3.5" cy="18" r="1"/>'),
    bell:    svg('<path d="M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6Z"/><path d="M10 20a2 2 0 0 0 4 0"/>'),
    chart:   svg('<path d="M4 20V4"/><path d="M4 20h16"/><rect x="7" y="11" width="3" height="6"/><rect x="12" y="7" width="3" height="10"/><rect x="17" y="13" width="3" height="4"/>'),
    eye:     svg('<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>'),
    edit:    svg('<path d="M4 20h4L19 9l-4-4L4 16Z"/><path d="m14 5 4 4"/>'),
    trash:   svg('<path d="M4 7h16"/><path d="M9 7V4h6v3"/><path d="M6 7l1 13h10l1-13"/>'),
    sliders: svg('<path d="M4 7h10M18 7h2M4 17h2M10 17h10"/><circle cx="16" cy="7" r="2"/><circle cx="8" cy="17" r="2"/>'),
    logout:  svg('<path d="M14 4h4a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-4"/><path d="M9 12h11"/><path d="m13 8-4 4 4 4"/>'),
    flag:    svg('<path d="M5 21V4"/><path d="M5 4h11l-2 4 2 4H5"/>'),
    /* amenity glyphs */
    water:   svg('<path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11Z"/>'),
    bolt:    svg('<path d="M13 3 4 14h6l-1 7 9-11h-6l1-7Z"/>'),
    wifi:    svg('<path d="M2.5 9a16 16 0 0 1 19 0"/><path d="M5.5 12.5a11 11 0 0 1 13 0"/><path d="M8.5 16a6 6 0 0 1 7 0"/><circle cx="12" cy="19.5" r="1"/>'),
    camera:  svg('<rect x="3" y="7" width="18" height="13" rx="2"/><circle cx="12" cy="13.5" r="3.5"/><path d="M8 7l1.5-3h5L16 7"/>'),
    car:     svg('<path d="M5 16v2M19 16v2"/><path d="M4 16h16v-3l-2-5H6l-2 5Z"/><circle cx="8" cy="16" r="1.4"/><circle cx="16" cy="16" r="1.4"/>'),
    lift:    svg('<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M10 9l2-2 2 2M10 15l2 2 2-2"/>'),
    dumbbell:svg('<path d="M3 9v6M6 7v10M18 7v10M21 9v6M6 12h12"/>'),
    shower:  svg('<path d="M4 14a8 8 0 0 1 16 0Z"/><path d="M12 6V3M9 18v1M12 19v1M15 18v1"/>'),
    door:    svg('<rect x="6" y="3" width="12" height="18" rx="1"/><circle cx="14.5" cy="12" r="1"/>'),
  };

  /* amenity name -> icon */
  const AMENITY_ICON = {
    'Water 24/7': ICN.water, 'Borehole': ICN.water,
    'Backup power': ICN.bolt,
    'Fibre internet': ICN.wifi, 'WiFi ready': ICN.wifi,
    'Secure compound': ICN.shield, 'CCTV': ICN.camera,
    'Parking': ICN.car, 'Lift': ICN.lift, 'Gym': ICN.dumbbell,
    'Hot shower': ICN.shower, 'Balcony': ICN.door, 'DSQ': ICN.home,
  };

  /* ---- tiny DOM + format utils ------------------------------------------ */
  function el(html) {
    const t = document.createElement('template');
    t.innerHTML = String(html).trim();
    return t.content.firstElementChild;
  }
  function qs(name) {
    return new URLSearchParams(location.search).get(name);
  }
  function initials(name) {
    return String(name || '?')
      .trim().split(/\s+/).slice(0, 2).map((w) => w[0] || '').join('').toUpperCase();
  }
  function fmtKES(n) {
    return 'KES ' + Number(n || 0).toLocaleString('en-KE');
  }

  /* ---- badges ------------------------------------------------------------ */
  function statusBadge(status) {
    if (status === 'verified') return `<span class="badge badge-verified">${ICN.shield} Verified</span>`;
    if (status === 'pending')  return `<span class="badge badge-pending">Pending review</span>`;
    if (status === 'rejected') return `<span class="badge badge-rejected">Rejected</span>`;
    return `<span class="badge badge-neutral">${status || ''}</span>`;
  }
  function amenityIcon(a) { return AMENITY_ICON[a] || ICN.check; }

  /* ---- listing card ------------------------------------------------------ */
  function listingCard(l) {
    const fav = KH.isFav(l.id);
    const beds = l.bedrooms === 0 ? 'Studio' : l.bedrooms + ' bd';
    const card = el(`
      <article class="listing-card" data-id="${l.id}">
        <div class="lc-media ph">
          <span class="ph-label">photo · ${l.hood.toLowerCase()}</span>
          <button class="lc-fav ${fav ? 'on' : ''}" type="button" aria-label="Save home">${ICN.heart}</button>
          ${l.status === 'verified' ? `<span class="lc-verified">${ICN.shield} Verified</span>` : ''}
          <span class="lc-type">${l.type}</span>
        </div>
        <div class="lc-body">
          <div class="lc-price">${fmtKES(l.rent)} <span>/mo</span></div>
          <h3 class="lc-title">${l.title}</h3>
          <div class="lc-loc">${ICN.pin} ${l.hood}, Nairobi</div>
          <div class="lc-meta">
            <span>${ICN.bed} ${beds}</span>
            <span>${ICN.bath} ${l.bathrooms} ba</span>
            ${l.rating ? `<span class="lc-rate">${ICN.star} ${l.rating}</span>` : '<span class="muted">New</span>'}
          </div>
        </div>
      </article>`);

    card.addEventListener('click', () => { location.href = 'property.html?id=' + l.id; });
    const favBtn = card.querySelector('.lc-fav');
    favBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const on = KH.toggleFav(l.id);
      favBtn.classList.toggle('on', on);
      toast(on ? 'Saved to favorites' : 'Removed from favorites', ICN.heart);
    });
    return card;
  }

  /* ---- toast ------------------------------------------------------------- */
  function toastHost() {
    let h = document.getElementById('kh-toasts');
    if (!h) { h = el('<div id="kh-toasts" class="toast-host"></div>'); document.body.appendChild(h); }
    return h;
  }
  function toast(msg, icon) {
    const t = el(`<div class="toast">${icon ? `<span class="toast-ic">${icon}</span>` : ''}<span>${msg}</span></div>`);
    toastHost().appendChild(t);
    requestAnimationFrame(() => t.classList.add('in'));
    setTimeout(() => { t.classList.remove('in'); setTimeout(() => t.remove(), 250); }, 2600);
  }

  /* ---- modal ------------------------------------------------------------- */
  function modal(html) {
    closeModal();
    const overlay = el(`<div class="modal-overlay" id="kh-modal">${html}</div>`);
    overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal(); });
    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(() => overlay.classList.add('in'));
    return overlay;
  }
  function closeModal() {
    const m = document.getElementById('kh-modal');
    if (m) m.remove();
    document.body.style.overflow = '';
  }

  /* ---- navigation -------------------------------------------------------- */
  function mountNav(active) {
    const host = document.getElementById('nav');
    if (!host) return;
    const u = KH.currentUser();

    const link = (key, href, label) =>
      `<a class="nav-link ${active === key ? 'on' : ''}" href="${href}">${label}</a>`;

    let right;
    if (u) {
      const dash = u.role === 'admin' ? 'admin.html'
        : (u.role === 'landlord' || u.role === 'agent') ? 'landlord.html' : 'account.html';
      right = `
        <a class="nav-icon ${active === 'messages' ? 'on' : ''}" href="messages.html" title="Messages">${ICN.msg}</a>
        ${u.role === 'admin' ? `<a class="nav-link ${active === 'admin' ? 'on' : ''}" href="admin.html">Admin</a>` : ''}
        <a class="nav-user" href="${dash}" title="${u.name}">
          <span class="avatar avatar-sm">${initials(u.name)}</span>
          <span class="nav-user-name">${u.name.split(' ')[0]}</span>
        </a>`;
    } else {
      right = `
        <a class="btn btn-ghost btn-sm" href="login.html">Log in</a>
        <a class="btn btn-primary btn-sm" href="register.html">Sign up</a>`;
    }

    host.innerHTML = `
      <div class="nav">
        <div class="wrap nav-inner">
          <a class="brand" href="index.html"><span class="brand-mark">${ICN.home}</span>Keja<span class="brand-hl">Hunt</span></a>
          <nav class="nav-links">
            ${link('home', 'index.html', 'Home')}
            ${link('listings', 'listings.html', 'Browse rentals')}
            ${link('landlord', 'landlord.html', 'List a property')}
          </nav>
          <div class="nav-right">${right}</div>
          <button class="nav-burger" id="navBurger" aria-label="Menu">${ICN.list}</button>
        </div>
        <div class="nav-drawer" id="navDrawer">
          ${link('home', 'index.html', 'Home')}
          ${link('listings', 'listings.html', 'Browse rentals')}
          ${link('landlord', 'landlord.html', 'List a property')}
          <a class="nav-link" href="messages.html">Messages</a>
          ${u ? `<a class="nav-link" href="account.html">My account</a>` : `<a class="nav-link" href="login.html">Log in</a><a class="nav-link" href="register.html">Sign up</a>`}
        </div>
      </div>`;

    const burger = document.getElementById('navBurger');
    const drawer = document.getElementById('navDrawer');
    if (burger) burger.addEventListener('click', () => drawer.classList.toggle('open'));
  }

  /* ---- footer ------------------------------------------------------------ */
  function mountFooter() {
    let host = document.getElementById('footer');
    if (!host) { host = el('<div id="footer"></div>'); document.body.appendChild(host); }
    const s = KH.stats();
    host.innerHTML = `
      <footer class="footer">
        <div class="wrap footer-inner">
          <div class="footer-brand">
            <a class="brand" href="index.html"><span class="brand-mark">${ICN.home}</span>Keja<span class="brand-hl">Hunt</span></a>
            <p>Verified rentals for urban Kenya. Real prices, real locations, real landlords — no brokers, no ghost listings.</p>
            <div class="footer-stat mono">${s.verified} verified homes · ${s.users} members</div>
          </div>
          <div class="footer-col">
            <h4>Renters</h4>
            <a href="listings.html">Browse rentals</a>
            <a href="listings.html?tier=low">Budget homes</a>
            <a href="account.html">Saved homes</a>
            <a href="messages.html">Messages</a>
          </div>
          <div class="footer-col">
            <h4>Landlords</h4>
            <a href="register.html">List a property</a>
            <a href="landlord.html">Landlord dashboard</a>
            <a href="login.html">Get verified</a>
          </div>
          <div class="footer-col">
            <h4>Company</h4>
            <a href="index.html#why">How it works</a>
            <a href="#">Data &amp; privacy</a>
            <a href="#">Contact</a>
          </div>
        </div>
        <div class="wrap footer-base">
          <span>© 2026 KejaHunt — Strathmore University · BBIT Project</span>
          <span class="mono">Compliant with the Kenya Data Protection Act (2019)</span>
        </div>
      </footer>`;
  }

  /* ---- export ------------------------------------------------------------ */
  window.ICN = ICN;
  window.KejaUI = {
    el, qs, initials, fmtKES, statusBadge, amenityIcon, listingCard,
    toast, modal, closeModal, mountNav, mountFooter,
  };
})();
