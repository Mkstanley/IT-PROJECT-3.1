/* ============================================================================
   KejaHunt — data.js
   A self-contained, localStorage-backed mock "database" + data API (window.KH).
   No backend required: everything lives in the browser and persists across
   reloads under the key `kejahunt_v1`. Call KH.reset() to reseed.
   ========================================================================== */
(function () {
  'use strict';

  const STORE_KEY = 'kejahunt_v1';
  const SESSION_KEY = 'kejahunt_session_v1';

  /* ---- static reference data (not persisted; same for everyone) ---------- */

  // x / y are percentage positions on the mock map in listings.html (0–100).
  const NEIGHBORHOODS = [
    { name: 'Kilimani',    x: 44, y: 52, tier: 'high' },
    { name: 'Westlands',   x: 38, y: 30, tier: 'high' },
    { name: 'Kileleshwa',  x: 34, y: 44, tier: 'high' },
    { name: 'Lavington',   x: 26, y: 40, tier: 'high' },
    { name: 'Parklands',   x: 46, y: 22, tier: 'high' },
    { name: 'South B',     x: 58, y: 64, tier: 'mid'  },
    { name: 'South C',     x: 54, y: 72, tier: 'mid'  },
    { name: 'Nairobi West',x: 50, y: 70, tier: 'mid'  },
    { name: 'Langata',     x: 40, y: 80, tier: 'mid'  },
    { name: 'Donholm',     x: 76, y: 56, tier: 'mid'  },
    { name: 'Kasarani',    x: 70, y: 20, tier: 'low'  },
    { name: 'Roysambu',    x: 62, y: 16, tier: 'low'  },
    { name: 'Embakasi',    x: 82, y: 66, tier: 'low'  },
    { name: 'Kayole',      x: 88, y: 48, tier: 'low'  },
  ];

  const TYPES = ['Bedsitter', 'Studio', '1 Bedroom', '2 Bedroom', '3 Bedroom', 'Maisonette'];

  const ALL_AMENITIES = [
    'Water 24/7', 'Backup power', 'Fibre internet', 'Secure compound', 'CCTV',
    'Parking', 'Borehole', 'Balcony', 'Lift', 'Gym', 'Hot shower', 'DSQ',
  ];

  /* ---- seed (the factory state) ------------------------------------------ */

  function seed() {
    const users = [
      { id: 'u_t1',    role: 'tenant',   name: 'Aisha Mwangi',    email: 'aisha@example.com',   phone: '0712 345 678', verified: true,  joined: 'Jan 2026' },
      { id: 'u_t2',    role: 'tenant',   name: 'Brian Otieno',    email: 'brian@example.com',   phone: '0721 998 110', verified: false, joined: 'Mar 2026' },
      { id: 'u_l1',    role: 'landlord', name: 'Grace Wanjiru',   email: 'grace@example.com',   phone: '0733 220 145', verified: true,  joined: 'Nov 2025' },
      { id: 'u_l2',    role: 'landlord', name: 'Peter Kamau',     email: 'peter@example.com',   phone: '0700 551 233', verified: false, joined: 'Apr 2026' },
      { id: 'u_a1',    role: 'agent',    name: 'Halsa Properties', email: 'halsa@example.com',  phone: '0790 010 010', verified: true,  joined: 'Sep 2025' },
      { id: 'u_admin', role: 'admin',    name: 'Site Admin',      email: 'admin@kejahunt.co.ke',phone: '0800 000 000', verified: true,  joined: 'Aug 2025' },
    ];

    // helper to keep listing objects terse
    let n = 1;
    const L = (o) => Object.assign({
      id: 'l_' + String(n++).padStart(2, '0'),
      bathrooms: 1, furnished: false, deposit: 0, rating: 0,
      status: 'verified', amenities: [], createdAt: '2026-06-01',
    }, o);

    const listings = [
      L({ title: 'Modern 1BR with balcony, Yaya side', type: '1 Bedroom', hood: 'Kilimani',
          bedrooms: 1, bathrooms: 1, rent: 42000, deposit: 42000, furnished: false, rating: 4.6,
          available: 'Immediately', landlordId: 'u_l1', createdAt: '2026-06-18',
          amenities: ['Water 24/7','Backup power','Fibre internet','Secure compound','Parking','Balcony','Lift'],
          desc: 'Bright, recently renovated one-bedroom in a quiet gated court near Yaya Centre. Borehole water, backup generator, secure parking and a lift. Walking distance to Argwings Kodhek shops and matatu stage.' }),
      L({ title: 'Executive 2BR, Westlands, fibre + gym', type: '2 Bedroom', hood: 'Westlands',
          bedrooms: 2, bathrooms: 2, rent: 78000, deposit: 78000, furnished: true, rating: 4.8,
          available: 'Immediately', landlordId: 'u_a1', createdAt: '2026-06-15',
          amenities: ['Water 24/7','Backup power','Fibre internet','Secure compound','CCTV','Parking','Lift','Gym','Hot shower'],
          desc: 'Fully furnished two-bedroom apartment in a managed block off Waiyaki Way. 24/7 security with CCTV, rooftop gym, high-speed fibre included. Ideal for professionals working in Westlands.' }),
      L({ title: 'Cozy bedsitter near the stage', type: 'Bedsitter', hood: 'Kasarani',
          bedrooms: 0, bathrooms: 1, rent: 8500, deposit: 8500, rating: 4.1,
          available: 'Immediately', landlordId: 'u_l1', createdAt: '2026-06-12',
          amenities: ['Water 24/7','Secure compound','CCTV'],
          desc: 'Affordable self-contained bedsitter two minutes from the Kasarani matatu stage. Tiled floor, own bathroom, instant shower point. Tokens-metered electricity, water included in rent.' }),
      L({ title: 'Self-contained studio, Roysambu', type: 'Studio', hood: 'Roysambu',
          bedrooms: 0, bathrooms: 1, rent: 11000, deposit: 11000, rating: 4.0,
          available: 'From 1 July', landlordId: 'u_l2', createdAt: '2026-06-10',
          amenities: ['Water 24/7','Backup power','Secure compound'],
          desc: 'Neat studio in a five-storey block along Thika Road service lane. Reliable water tank, perimeter wall with manned gate. Close to TRM and the BRT stop.' }),
      L({ title: 'Spacious 2BR maisonette, South B', type: 'Maisonette', hood: 'South B',
          bedrooms: 3, bathrooms: 2, rent: 55000, deposit: 110000, rating: 4.5,
          available: 'Immediately', landlordId: 'u_a1', createdAt: '2026-06-08',
          amenities: ['Water 24/7','Backup power','Secure compound','CCTV','Parking','DSQ','Borehole'],
          desc: 'Three-bedroom maisonette with a detached DSQ in a gated community off Mukoma Road. Borehole plus mains water, ample parking, mature garden. Family-friendly and quiet.' }),
      L({ title: 'Bright 1BR, Kileleshwa, water guaranteed', type: '1 Bedroom', hood: 'Kileleshwa',
          bedrooms: 1, bathrooms: 1, rent: 38000, deposit: 38000, rating: 4.4,
          available: 'Immediately', landlordId: 'u_l1', createdAt: '2026-06-05',
          amenities: ['Water 24/7','Backup power','Fibre internet','Secure compound','Parking','Borehole','Lift'],
          desc: 'One-bedroom in a leafy Kileleshwa lane with borehole water and a standby generator. Open-plan kitchen, large windows, secure parking bay. Quiet residential setting close to the city.' }),
      L({ title: 'Affordable 1BR, Nairobi West', type: '1 Bedroom', hood: 'Nairobi West',
          bedrooms: 1, bathrooms: 1, rent: 19500, deposit: 19500, rating: 4.2,
          available: 'Immediately', landlordId: 'u_l2', createdAt: '2026-06-03',
          amenities: ['Water 24/7','Secure compound','Parking'],
          desc: 'Practical one-bedroom near Nairobi West shopping centre and the expressway. Tiled throughout, secure compound with parking. Walking distance to plenty of eateries and a 24-hour supermarket.' }),
      L({ title: 'Studio apartment, Langata, pet-friendly', type: 'Studio', hood: 'Langata',
          bedrooms: 0, bathrooms: 1, rent: 16000, deposit: 16000, rating: 4.3,
          available: 'From 15 July', landlordId: 'u_a1', createdAt: '2026-05-30',
          amenities: ['Water 24/7','Backup power','Secure compound','Parking','Balcony'],
          desc: 'Open studio with a small balcony in a low-rise Langata court. Green, calm, pet-friendly with management approval. Easy access to Langata Road and Carnivore area.' }),
      L({ title: 'Lavington 3BR townhouse', type: '3 Bedroom', hood: 'Lavington',
          bedrooms: 3, bathrooms: 3, rent: 95000, deposit: 190000, furnished: false, rating: 4.9,
          available: 'Immediately', landlordId: 'u_a1', createdAt: '2026-05-28',
          amenities: ['Water 24/7','Backup power','Fibre internet','Secure compound','CCTV','Parking','Borehole','DSQ','Gym'],
          desc: 'Premium three-bedroom townhouse in a small, well-managed Lavington gated scheme. Private garden, DSQ, borehole, shared gym. Top-rated by previous tenants for security and quiet.' }),
      L({ title: 'Bedsitter, Kayole, tokens metered', type: 'Bedsitter', hood: 'Kayole',
          bedrooms: 0, bathrooms: 1, rent: 4500, deposit: 4500, rating: 3.8,
          available: 'Immediately', landlordId: 'u_l2', createdAt: '2026-05-25',
          amenities: ['Water 24/7','Secure compound'],
          desc: 'Budget bedsitter on a secured plot in Kayole. Own bathroom, water tank on site, token electricity. Close to the matatu stage and daily market.' }),
      L({ title: 'Embakasi 2BR near the airport', type: '2 Bedroom', hood: 'Embakasi',
          bedrooms: 2, bathrooms: 1, rent: 24000, deposit: 24000, rating: 4.1,
          available: 'From 1 August', landlordId: 'u_l1', createdAt: '2026-05-22',
          amenities: ['Water 24/7','Backup power','Secure compound','Parking','CCTV'],
          desc: 'Two-bedroom apartment in Embakasi, handy for JKIA and the Eastern bypass. Standby water, secure compound with CCTV and parking. Good for airport and EPZ workers.' }),
      L({ title: 'Donholm 2BR, family block', type: '2 Bedroom', hood: 'Donholm',
          bedrooms: 2, bathrooms: 2, rent: 27000, deposit: 27000, rating: 4.2,
          available: 'Immediately', landlordId: 'u_a1', createdAt: '2026-05-20',
          amenities: ['Water 24/7','Backup power','Secure compound','Parking','Borehole'],
          desc: 'Spacious two-bedroom in a family-oriented Donholm court with borehole water and backup power. Secure parking, children play area, near Greenspan Mall.' }),

      // --- pending: appear in the admin verification queue ---
      L({ title: 'New 1BR, South C, just listed', type: '1 Bedroom', hood: 'South C',
          bedrooms: 1, bathrooms: 1, rent: 30000, deposit: 30000, status: 'pending',
          available: 'Immediately', landlordId: 'u_l2', createdAt: '2026-06-20',
          amenities: ['Water 24/7','Backup power','Secure compound','Parking'],
          desc: 'Brand new one-bedroom in South C with modern fittings, backup power and secure parking. Awaiting ownership verification before it goes live to renters.' }),
      L({ title: 'Parklands 2BR, lift & gym', type: '2 Bedroom', hood: 'Parklands',
          bedrooms: 2, bathrooms: 2, rent: 62000, deposit: 62000, status: 'pending', furnished: true,
          available: 'From 1 July', landlordId: 'u_l1', createdAt: '2026-06-21',
          amenities: ['Water 24/7','Backup power','Fibre internet','Secure compound','CCTV','Parking','Lift','Gym'],
          desc: 'Furnished two-bedroom in a Parklands high-rise with lift, gym and 24-hour security. Submitted with a tenancy management agreement; pending admin review.' }),

      // --- rejected: appears on the landlord dashboard with a reason ---
      L({ title: 'Cheap room city centre (no docs)', type: 'Bedsitter', hood: 'Nairobi West',
          bedrooms: 0, bathrooms: 1, rent: 6000, deposit: 6000, status: 'rejected',
          rejectReason: 'Ownership document could not be verified. Please re-upload a clear title deed or tenancy agreement.',
          available: 'Immediately', landlordId: 'u_l2', createdAt: '2026-06-09',
          amenities: ['Secure compound'],
          desc: 'A very cheap room advertised without supporting ownership documents. Held back from publication pending valid proof of ownership.' }),
    ];

    const threads = [
      { id: 't_1', listingId: 'l_01', tenantId: 'u_t1', landlordId: 'u_l1', messages: [
          { from: 'u_t1', text: 'Hi, is the 1 bedroom in Kilimani still available? I’d like to arrange a viewing.', at: '2026-06-19 09:14' },
          { from: 'u_l1', text: 'Hello Aisha! Yes it is. Are you free this weekend to come see it?', at: '2026-06-19 09:40' },
          { from: 'u_t1', text: 'Saturday morning works for me. Is the rent negotiable at all?', at: '2026-06-19 10:02' },
      ] },
      { id: 't_2', listingId: 'l_02', tenantId: 'u_t1', landlordId: 'u_a1', messages: [
          { from: 'u_t1', text: 'Is the Westlands 2BR furnished as shown in the photos?', at: '2026-06-20 16:25' },
          { from: 'u_a1', text: 'Yes, everything in the photos stays. Fibre is also included in the rent.', at: '2026-06-20 16:58' },
      ] },
    ];

    const reviews = [
      { listingId: 'l_01', by: 'Daniel K.',  date: 'May 2026', rating: 5, text: 'Lived here a year. Water never went off thanks to the borehole, and the gate is always manned. Landlord responds fast.' },
      { listingId: 'l_01', by: 'Mercy A.',   date: 'Feb 2026', rating: 4, text: 'Great location near Yaya. The lift was occasionally down but fixed quickly. Would recommend.' },
      { listingId: 'l_02', by: 'Tom W.',     date: 'Apr 2026', rating: 5, text: 'Spotless when I moved in and the gym is a real one, not just a treadmill. Worth the price for Westlands.' },
      { listingId: 'l_09', by: 'Faith N.',   date: 'Mar 2026', rating: 5, text: 'Quietest place I have rented in Nairobi. Security is excellent and the garden is lovely.' },
      { listingId: 'l_05', by: 'Kevin M.',   date: 'Jan 2026', rating: 4, text: 'Good family home, the DSQ is handy. Parking can get tight when guests visit.' },
    ];

    const favorites = { u_t1: ['l_09', 'l_06'] };

    const audit = [
      { at: '2026-06-18 11:02', who: 'Site Admin', action: 'Approved', target: 'Modern 1BR with balcony, Yaya side' },
      { at: '2026-06-15 08:47', who: 'Site Admin', action: 'Approved', target: 'Executive 2BR, Westlands, fibre + gym' },
      { at: '2026-06-09 14:20', who: 'Site Admin', action: 'Rejected', target: 'Cheap room city centre (no docs)' },
      { at: '2025-11-30 10:10', who: 'Site Admin', action: 'Verified user', target: 'Grace Wanjiru' },
    ];

    return { users, listings, threads, reviews, favorites, audit, seq: n };
  }

  /* ---- persistence ------------------------------------------------------- */

  let db = load();

  function load() {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) { /* fall through to seed */ }
    const fresh = seed();
    persist(fresh);
    return fresh;
  }

  function persist(obj) {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(obj || db)); } catch (e) {}
  }
  const save = () => persist(db);

  /* ---- session ----------------------------------------------------------- */

  function sessionId() {
    try { return localStorage.getItem(SESSION_KEY); } catch (e) { return null; }
  }
  function setSession(id) {
    try { id ? localStorage.setItem(SESSION_KEY, id) : localStorage.removeItem(SESSION_KEY); } catch (e) {}
  }

  /* ---- id helpers -------------------------------------------------------- */

  function nextListingId() {
    db.seq = (db.seq || db.listings.length + 1);
    const id = 'l_' + String(db.seq++).padStart(2, '0');
    save();
    return id;
  }
  function now() {
    const d = new Date();
    const p = (x) => String(x).padStart(2, '0');
    return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`;
  }
  function today() { return now().slice(0, 10); }

  /* ---- public API (window.KH) -------------------------------------------- */

  const KH = {
    NEIGHBORHOODS, TYPES, ALL_AMENITIES,

    /* raw access + lifecycle */
    all() { return db; },
    reset() { db = seed(); persist(db); setSession(null); return db; },

    /* ---- users / auth ---- */
    users() { return db.users; },
    user(id) { return db.users.find((u) => u.id === id) || null; },
    currentUser() { const id = sessionId(); return id ? KH.user(id) : null; },
    loginAs(id) {
      const u = KH.user(id);
      if (u) setSession(u.id);
      return u;
    },
    login(email) {
      const u = db.users.find((x) => x.email.toLowerCase() === String(email).toLowerCase());
      if (u) setSession(u.id);
      return u || null;
    },
    logout() { setSession(null); },
    register({ role, name, email, phone }) {
      const existing = db.users.find((x) => x.email.toLowerCase() === String(email).toLowerCase());
      if (existing) { setSession(existing.id); return existing; }
      const u = {
        id: 'u_' + Math.random().toString(36).slice(2, 8),
        role: role || 'tenant', name: name || 'New user',
        email: email || '', phone: phone || '',
        verified: false,
        joined: new Date().toLocaleDateString('en-KE', { month: 'short', year: 'numeric' }),
      };
      db.users.push(u);
      save();
      setSession(u.id);
      return u;
    },

    /* ---- listings ---- */
    listings(filter) {
      let arr = db.listings.slice();
      if (filter && filter.status) arr = arr.filter((l) => l.status === filter.status);
      if (filter && filter.landlordId) arr = arr.filter((l) => l.landlordId === filter.landlordId);
      return arr;
    },
    listing(id) { return db.listings.find((l) => l.id === id) || null; },
    verifiedListings() {
      return db.listings
        .filter((l) => l.status === 'verified')
        .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
    },
    addListing(data) {
      const l = Object.assign({
        id: nextListingId(),
        bathrooms: 1, deposit: 0, rating: 0, furnished: false,
        amenities: [], status: 'pending', available: 'Immediately',
        createdAt: today(),
      }, data);
      if (!l.deposit) l.deposit = l.rent;
      db.listings.unshift(l);
      save();
      return l;
    },
    updateListing(id, data) {
      const l = KH.listing(id);
      if (!l) return null;
      Object.assign(l, data);
      save();
      return l;
    },
    deleteListing(id) {
      db.listings = db.listings.filter((l) => l.id !== id);
      save();
    },
    setStatus(id, status, reason) {
      const l = KH.listing(id);
      if (!l) return null;
      l.status = status;
      if (status === 'rejected') l.rejectReason = reason || 'Listing did not meet verification requirements.';
      else delete l.rejectReason;
      const admin = KH.currentUser();
      KH.logAudit(
        status === 'verified' ? 'Approved' : status === 'rejected' ? 'Rejected' : 'Updated status',
        l.title,
        admin ? admin.name : 'Admin'
      );
      save();
      return l;
    },

    /* ---- favorites (per current user) ---- */
    _favKey() { const u = KH.currentUser(); return u ? u.id : 'guest'; },
    favorites() {
      db.favorites = db.favorites || {};
      return (db.favorites[KH._favKey()] || []).slice();
    },
    isFav(listingId) { return KH.favorites().indexOf(listingId) !== -1; },
    toggleFav(listingId) {
      db.favorites = db.favorites || {};
      const key = KH._favKey();
      const arr = db.favorites[key] || (db.favorites[key] = []);
      const i = arr.indexOf(listingId);
      let on;
      if (i === -1) { arr.push(listingId); on = true; }
      else { arr.splice(i, 1); on = false; }
      save();
      return on;
    },

    /* ---- threads / messages ---- */
    threads(userId) {
      return db.threads
        .filter((t) => t.tenantId === userId || t.landlordId === userId)
        .sort((a, b) => {
          const la = a.messages[a.messages.length - 1];
          const lb = b.messages[b.messages.length - 1];
          return (lb ? lb.at : '') < (la ? la.at : '') ? -1 : 1;
        });
    },
    thread(id) { return db.threads.find((t) => t.id === id) || null; },
    findOrCreateThread(listingId, tenantId, landlordId) {
      let t = db.threads.find(
        (x) => x.listingId === listingId && x.tenantId === tenantId && x.landlordId === landlordId
      );
      if (!t) {
        t = { id: 't_' + Math.random().toString(36).slice(2, 7), listingId, tenantId, landlordId, messages: [] };
        db.threads.push(t);
        save();
      }
      return t;
    },
    sendMessage(threadId, fromId, text) {
      const t = KH.thread(threadId);
      if (!t) return null;
      const m = { from: fromId, text: String(text || ''), at: now() };
      t.messages.push(m);
      save();
      return m;
    },

    /* ---- reviews ---- */
    reviews(listingId) { return db.reviews.filter((r) => r.listingId === listingId); },

    /* ---- audit log ---- */
    auditLog() { return db.audit.slice().sort((a, b) => (a.at < b.at ? 1 : -1)); },
    logAudit(action, target, who) {
      db.audit = db.audit || [];
      db.audit.push({ at: now(), who: who || 'Admin', action, target });
      save();
    },

    /* ---- aggregate stats (overview + landing marquee + dashboards) ---- */
    stats() {
      const ls = db.listings;
      const verified = ls.filter((l) => l.status === 'verified').length;
      const pending = ls.filter((l) => l.status === 'pending').length;
      const rejected = ls.filter((l) => l.status === 'rejected').length;
      const landlords = db.users.filter((u) => u.role === 'landlord' || u.role === 'agent').length;
      return {
        total: ls.length, verified, pending, rejected,
        users: db.users.length, landlords, threads: db.threads.length,
      };
    },
  };

  window.KH = KH;
})();
