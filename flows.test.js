const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');
const dataJs = fs.readFileSync(path.join(__dirname, 'js/data.js'), 'utf8');

const dom = new JSDOM('<!doctype html><body>', { url: 'https://kejahunt.test/', runScripts: 'outside-only' });
const win = dom.window;
win.eval(dataJs);
const KH = win.KH;

let pass = 0, fail = 0;
const ok = (name, cond) => { cond ? (pass++, console.log('✓ ' + name)) : (fail++, console.log('✗ ' + name)); };
const raw = () => JSON.parse(win.localStorage.getItem('kejahunt_v1'));

KH.reset();

// 1. seed integrity
const s0 = KH.stats();
ok(`seed: ${s0.total} listings (12 verified / 2 pending / 1 rejected)`,
   s0.verified === 12 && s0.pending === 2 && s0.rejected === 1 && s0.total === 15);
ok('seed: verifiedListings only returns verified', KH.verifiedListings().every(l => l.status === 'verified'));
ok('seed: admin user exists', KH.user('u_admin') && KH.user('u_admin').role === 'admin');

// 2. landlord submits a listing -> enters pending queue
KH.loginAs('u_l1');
const created = KH.addListing({ title: 'Test 1BR Kilimani', type: '1 Bedroom', hood: 'Kilimani',
  bedrooms: 1, bathrooms: 1, rent: 33000, desc: 'Test listing for the verification queue.', amenities: ['Water 24/7'], landlordId: 'u_l1' });
ok('addListing: defaults to pending', created.status === 'pending');
ok('addListing: deposit defaults to rent', created.deposit === 33000);
ok('addListing: appears in pending filter', KH.listings({ status: 'pending' }).some(l => l.id === created.id));
ok('addListing: persisted to storage', raw().listings.some(l => l.id === created.id));

// 3. admin approves -> verified + audit entry
KH.loginAs('u_admin');
const auditBefore = KH.auditLog().length;
KH.setStatus(created.id, 'verified');
ok('approve: now verified', KH.listing(created.id).status === 'verified');
ok('approve: shows on public verified list', KH.verifiedListings().some(l => l.id === created.id));
ok('approve: wrote an "Approved" audit entry', KH.auditLog().length === auditBefore + 1 && /Approved/.test(KH.auditLog()[0].action));
ok('approve: audit attributes the admin', KH.auditLog()[0].who === 'Site Admin');

// 4. admin rejects another -> reason stored
const pend = KH.listings({ status: 'pending' })[0];
KH.setStatus(pend.id, 'rejected', 'Docs unclear — re-upload deed.');
ok('reject: status rejected + reason saved', KH.listing(pend.id).status === 'rejected' && /re-upload/.test(KH.listing(pend.id).rejectReason));
ok('reject: logged as Rejected', /Rejected/.test(KH.auditLog()[0].action));

// 5. favorites are per-user and persist
KH.loginAs('u_t2');
ok('favorites: start empty for new user', KH.favorites().length === 0);
const on = KH.toggleFav('l_02');
ok('favorites: toggle returns true on add', on === true);
ok('favorites: isFav reflects state', KH.isFav('l_02') === true);
ok('favorites: persisted under the user key', raw().favorites['u_t2'].includes('l_02'));
KH.toggleFav('l_02');
ok('favorites: toggle off removes it', KH.isFav('l_02') === false);

// 6. messaging: find-or-create thread is idempotent, messages append
KH.loginAs('u_t2');
const t1 = KH.findOrCreateThread('l_05', 'u_t2', 'u_a1');
const t2 = KH.findOrCreateThread('l_05', 'u_t2', 'u_a1');
ok('threads: findOrCreate is idempotent', t1.id === t2.id);
const n0 = KH.thread(t1.id).messages.length;
KH.sendMessage(t1.id, 'u_t2', 'Is this still available?');
ok('messaging: message appended', KH.thread(t1.id).messages.length === n0 + 1);
ok('messaging: thread shows for both parties', KH.threads('u_t2').some(t => t.id === t1.id) && KH.threads('u_a1').some(t => t.id === t1.id));

// 7. register + session
const nu = KH.register({ role: 'landlord', name: 'New Owner', email: 'newowner@example.com', phone: '0700000001' });
ok('register: creates user and signs in', KH.currentUser() && KH.currentUser().id === nu.id);
ok('register: new landlord is unverified', nu.verified === false);

// 8. delete + reset
KH.deleteListing(created.id);
ok('delete: listing removed', !KH.listing(created.id));
KH.reset();
ok('reset: returns to seed counts', KH.stats().total === 15 && KH.currentUser() === null);

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
