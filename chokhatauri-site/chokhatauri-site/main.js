// ჩოხატაურის ცოცხალი მემკვიდრეობა — საერთო სკრიპტი
document.documentElement.classList.add('js');

/* ---------- მობილური მენიუ ---------- */
const burger = document.querySelector('.burger');
const menu = document.querySelector('.menu');
if (burger && menu) {
  burger.setAttribute('aria-expanded', 'false');
  const setMenu = (open) => {
    menu.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.textContent = open ? '✕' : '☰';
  };
  burger.addEventListener('click', () => setMenu(!menu.classList.contains('open')));
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });
  document.addEventListener('click', e => {
    if (!menu.contains(e.target) && !burger.contains(e.target)) setMenu(false);
  });
}

/* ---------- გამოჩენის ანიმაცია ---------- */
const reveals = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }), { threshold: .08 });
  reveals.forEach(el => io.observe(el));
} else {
  reveals.forEach(el => el.classList.add('in'));
}

/* ---------- ფოტოები ----------
   თითოეული <img> ცდილობს ამ თანმიმდევრობით:
   1) assets/img/<სახელი>.jpg  (შემდეგ .jpeg / .png / .webp — რომელიც გექნებათ)
   2) data-remote-ში ჩაწერილი გარე ბმულები (თუ არის)
   3) ავტომატური ილუსტრაცია, რომ ბარათი არასდროს დარჩეს ცარიელი.
   თქვენი ფოტო რომ გამოჩნდეს, ჩააგდეთ assets/img-ში ზუსტად ამავე სახელით.
   როცა ყველა ფოტო დაგემატებათ, SHOW_HINTS შეცვალეთ false-ით. */
const SHOW_HINTS = false;
const EXTS = ['jpg', 'jpeg', 'png', 'webp'];
const PALETTE = {
  monument: ['#1f5a42', '#3e7c5f', '#c9a24a'],
  craft:    ['#8a5a2b', '#b9803f', '#e7cfa0'],
  sport:    ['#2f4a63', '#4f7392', '#c9a24a'],
  home:     ['#1f5a42', '#4f7392', '#c9a24a']
};
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const GLYPH = {
  monument: '<path d="M300 330V210l30-30v-30h20v30l30 30v-0V330zM420 330V190l25-25 25 25v140zM360 330v-50a20 20 0 0 1 40 0v50z" fill="#fff" fill-opacity=".22"/>',
  craft: '<path d="M340 150h120l-10 24c40 20 62 60 62 100 0 50-40 76-112 76s-112-26-112-76c0-40 22-80 62-100z" fill="#fff" fill-opacity=".22"/><ellipse cx="400" cy="160" rx="60" ry="12" fill="#fff" fill-opacity=".3"/>',
  sport: '<circle cx="400" cy="250" r="96" fill="#fff" fill-opacity=".2"/><path d="M304 250c60-30 130-30 192 0M304 250c60 30 130 30 192 0M400 154v192" stroke="#fff" stroke-opacity=".45" stroke-width="5" fill="none"/>',
  home: '<path d="M240 340l100-150 60 80 50-60 110 130z" fill="#fff" fill-opacity=".22"/><circle cx="500" cy="170" r="30" fill="#fff" fill-opacity=".3"/>'
};
function placeholder(img) {
  const cat = PALETTE[img.dataset.cat] ? img.dataset.cat : 'home';
  const [c1, c2, c3] = PALETTE[cat];
  const alt = img.getAttribute('alt') || '';
  const file = img.dataset.file || '';
  const words = alt.split(' ');
  let l1 = '', l2 = '';
  words.forEach(w => { if ((l1 + ' ' + w).trim().length <= 26 || !l1) l1 = (l1 + ' ' + w).trim(); else l2 = (l2 + ' ' + w).trim(); });
  const hint = SHOW_HINTS ? `<rect x="250" y="438" width="300" height="34" rx="17" fill="#000" fill-opacity=".25"/><text x="400" y="461" text-anchor="middle" font-family="sans-serif" font-size="16" fill="#fff">assets/img/${esc(file)}</text>` : '';
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" preserveAspectRatio="xMidYMid slice">
<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient></defs>
<rect width="800" height="500" fill="url(#g)"/>
<circle cx="660" cy="80" r="140" fill="${c3}" fill-opacity=".25"/>
<circle cx="80" cy="470" r="180" fill="#fff" fill-opacity=".06"/>
${GLYPH[cat]}
<path d="M0 400 Q200 350 400 390 T800 360 V500 H0Z" fill="#000" fill-opacity=".16"/>
<text x="400" y="${l2 ? 392 : 410}" text-anchor="middle" font-family="'Noto Sans Georgian',sans-serif" font-size="32" font-weight="600" fill="#fff">${esc(l1)}</text>
${l2 ? `<text x="400" y="428" text-anchor="middle" font-family="'Noto Sans Georgian',sans-serif" font-size="32" font-weight="600" fill="#fff">${esc(l2)}</text>` : ''}
${hint}</svg>`;
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
}

function chain(img) {
  const file = img.dataset.file;
  if (!file) return [];
  const base = file.replace(/\.[^.]+$/, '');
  const locals = EXTS.map(e => `assets/img/${base}.${e}`);
  const remote = (img.dataset.remote || '').split('|').filter(Boolean);
  return [...locals, ...remote];
}

function next(img) {
  if (!img._chain) { img._chain = chain(img); img._i = 0; }
  img._i += 1;
  if (img._i < img._chain.length) { img.src = img._chain[img._i]; return; }
  img.onerror = null;
  img.src = placeholder(img);
  noPhoto(img);
}

/* ფოტოს გარეშე დიდ სურათებს ვმალავთ, რომ გვერდი ცარიელი არ ჩანდეს; ბარათებზე რჩება ილუსტრაცია */
function noPhoto(img) {
  img.classList.add('noimg');
  const col = img.parentElement;
  const row = col && col.parentElement;
  if (row && row.classList.contains('row') && ![...col.children].some(c => !c.classList.contains('noimg'))) {
    col.hidden = true;
    row.classList.add('solo');
  }
}

document.querySelectorAll('img[data-file]').forEach(img => {
  img._chain = chain(img);
  img._i = 0;
  img.addEventListener('error', () => next(img));
  // თუ შეცდომა სკრიპტის ჩატვირთვამდე მოხდა
  if (img.complete && img.naturalWidth === 0) { img._i = -1; next(img); }
});

/* ---------- YouTube: ჩაწერეთ data-yt="ვიდეოს_ID" ---------- */
document.querySelectorAll('.video[data-yt]').forEach(v => {
  const id = v.dataset.yt.trim();
  if (id) v.innerHTML = `<iframe src="https://www.youtube.com/embed/${encodeURIComponent(id)}" title="ვიდეოგაკვეთილი" allowfullscreen loading="lazy"></iframe>`;
});
