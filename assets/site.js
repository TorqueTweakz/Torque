// TORQUE website: mobile menu, reveal on scroll, copy buttons, tweak filter. No tracking, no third parties.
(() => {
  const nav = document.querySelector('.nav');
  const menu = document.querySelector('.menu');
  if (menu) menu.addEventListener('click', () => { const o = nav.classList.toggle('open'); menu.setAttribute('aria-expanded', o); });

  const io = 'IntersectionObserver' in window ? new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px' }) : null;
  document.querySelectorAll('.rv').forEach(el => io ? io.observe(el) : el.classList.add('in'));

  document.querySelectorAll('[data-copy]').forEach(b => b.addEventListener('click', async () => {
    const t = document.getElementById(b.dataset.copy)?.textContent.trim() || '';
    try { await navigator.clipboard.writeText(t); b.textContent = 'Copied'; setTimeout(() => (b.textContent = 'Copy'), 1600); } catch { }
  }));

  // tweak reference filter
  const list = document.getElementById('tweaks');
  if (list) {
    const q = document.getElementById('q'); let lvl = 'all', ed = 'all';
    const items = [...list.querySelectorAll('.tw')], cats = [...list.querySelectorAll('.tw-cat')];
    const count = document.getElementById('count'), empty = document.getElementById('empty');
    const run = () => {
      const s = (q.value || '').toLowerCase().trim(); let n = 0;
      items.forEach(i => { const ok = (lvl === 'all' || i.dataset.level === lvl) && (ed === 'all' || i.dataset.ed === ed) && (!s || i.textContent.toLowerCase().includes(s)); i.hidden = !ok; if (ok) n++; });
      cats.forEach(c => { let el = c.nextElementSibling, any = false; while (el && !el.classList.contains('tw-cat')) { if (!el.hidden) any = true; el = el.nextElementSibling; } c.hidden = !any; });
      count.textContent = n + (n === 1 ? ' tweak' : ' tweaks'); empty.hidden = n > 0;
    };
    const seg = (id, set) => document.querySelectorAll('#' + id + ' button').forEach(b => b.addEventListener('click', () => {
      document.querySelectorAll('#' + id + ' button').forEach(x => x.setAttribute('aria-pressed', x === b)); set(b.dataset.v); run();
    }));
    seg('lv', v => (lvl = v)); seg('ed', v => (ed = v));
    q.addEventListener('input', run); run();
  }
})();
