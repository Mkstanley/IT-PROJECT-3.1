const fs = require('fs');
const path = require('path');
const { JSDOM, VirtualConsole } = require('jsdom');

const dir = __dirname;
const dataJs = fs.readFileSync(path.join(dir, 'js/data.js'), 'utf8');
const appJs  = fs.readFileSync(path.join(dir, 'js/app.js'), 'utf8');

const pages = ['index','listings','property','account','landlord','admin','login','register','messages'];
let failures = 0;

(async () => {
  for (const p of pages) {
    // property/messages read ?id / ?t — give property a real id
    const search = p === 'property' ? '?id=l_01' : p === 'messages' ? '?t=t_1' : '';
    let html = fs.readFileSync(path.join(dir, p + '.html'), 'utf8');
    html = html.replace('<script src="js/data.js"></script>', `<script>${dataJs}</script>`);
    html = html.replace('<script src="js/app.js"></script>',  `<script>${appJs}</script>`);

    const errors = [];
    const vc = new VirtualConsole();
    vc.on('jsdomError', (e) => errors.push('jsdomError: ' + (e.detail || e.message || e)));
    vc.on('error', (m) => errors.push('console.error: ' + m));

    try {
      const dom = new JSDOM(html, {
        url: 'https://kejahunt.test/' + p + '.html' + search,
        runScripts: 'dangerously',
        pretendToBeVisual: true,
        virtualConsole: vc,
      });
      dom.window.addEventListener('error', (ev) => errors.push('window.error: ' + ev.message));
      await new Promise((r) => setTimeout(r, 120));

      // sanity assertions per page
      const doc = dom.window.document;
      const checks = [];
      const navFilled = doc.querySelector('#nav .nav') || doc.querySelector('.nav');
      checks.push(['nav mounted', !!navFilled]);
      if (p === 'index')     checks.push(['featured cards', doc.querySelectorAll('#featured .listing-card').length > 0]);
      if (p === 'listings')  checks.push(['result cards',   doc.querySelectorAll('#results .listing-card').length > 0]);
      if (p === 'property')  checks.push(['prop title',     !!doc.querySelector('.prop-title')]);
      if (p === 'admin')     checks.push(['stat cards',     doc.querySelectorAll('.stat').length > 0]);
      if (p === 'landlord')  checks.push(['listing rows',   doc.querySelectorAll('.listing-row, .empty').length > 0]);
      if (p === 'messages')  checks.push(['thread list',    !!doc.querySelector('.thread-list, .inbox')]);

      const failed = checks.filter(([, ok]) => !ok).map(([n]) => n);
      if (errors.length || failed.length) {
        failures++;
        console.log(`✗ ${p}.html`);
        errors.forEach((e) => console.log('    ' + e));
        failed.forEach((f) => console.log('    assertion failed: ' + f));
      } else {
        console.log(`✓ ${p}.html  (${checks.map(c=>c[0]).join(', ')})`);
      }
    } catch (e) {
      failures++;
      console.log(`✗ ${p}.html  THREW: ${e.message}`);
    }
  }
  console.log('\n' + (failures ? `${failures} page(s) with problems` : 'All pages booted cleanly ✅'));
  process.exit(failures ? 1 : 0);
})();
