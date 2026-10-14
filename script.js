// ===== TOUTES LES PHOTOS DU SITE (change seulement les noms ici) =====
const PHOTOS = {
  'accueil': 'photos/DBI.png',
  'dbi-01': 'photos/DBI.png',
  'dbi-03': 'photos/StartMTPconnection.png',
  'dbi-05': 'photos/SDcardInstall.png',
  'archive-01': 'photos/Archivage.png',
  'tegra-01': 'photos/tegra1.png',
  'rcm-01': 'photos/rcm.jpg',
  'rcm-02': 'photos/+power.png',
  'rcm-04': 'photos/tegra2.jpg',
  'rcm-06': 'photos/hekate.png',
  'rcm-07': 'photos/emummc.png',
  'hb-03': 'photos/SDcard.png',
  'hb-04': 'photos/filesswitch.jpg',
  'store-01': 'photos/app.png',
};
// =====================================================================

const tabs = document.querySelectorAll('.tab');
const pages = document.querySelectorAll('.page');
const topbar = document.getElementById('topbar');
const menu = document.querySelector('.menu');
const order = [...tabs].map(t => t.dataset.page);
let currentId = null;

// Petits points en bas de la barre : indiquent la page actuelle (mobile)
const dots = document.createElement('div');
dots.className = 'dots';
order.forEach(() => dots.appendChild(document.createElement('span')));
topbar.appendChild(dots);

function centerActiveTab() {
  const t = document.querySelector('.tab.active');
  if (!t || !menu) return;
  const left = t.getBoundingClientRect().left - menu.getBoundingClientRect().left + menu.scrollLeft;
  menu.scrollTo({ left: left - (menu.clientWidth - t.offsetWidth) / 2, behavior: 'smooth' });
}

function showPage(id) {
  if (!document.getElementById(id)) id = 'accueil';
  const prev = currentId;
  currentId = id;
  const dir = prev && prev !== id ? (order.indexOf(id) > order.indexOf(prev) ? 'from-right' : 'from-left') : '';
  pages.forEach(p => {
    p.classList.remove('from-left', 'from-right');
    p.classList.toggle('active', p.id === id);
  });
  if (dir) document.getElementById(id).classList.add(dir);
  tabs.forEach(t => t.classList.toggle('active', t.dataset.page === id));
  [...dots.children].forEach((d, i) => d.classList.toggle('on', order[i] === id));
  centerActiveTab();
  history.replaceState(null, '', '#' + id);
  window.scrollTo({ top: 0 });
}

tabs.forEach(t => t.addEventListener('click', () => showPage(t.dataset.page)));
document.querySelectorAll('[data-go]').forEach(b =>
  b.addEventListener('click', () => showPage(b.dataset.go)));

showPage(location.hash.slice(1) || 'accueil');

// Photos manquantes : emplacement clair en attendant
document.querySelectorAll('.photo img').forEach(img => {
  const fig = img.closest('.photo');
  const markMissing = () => {
    fig.classList.add('missing');
    fig.innerHTML = '<span>Photo à ajouter :<br><b>' + (img.dataset.label || img.alt) +
      '</b><br><small>' + img.getAttribute('src') + '</small></span>';
  };
  img.addEventListener('error', markMissing);
  img.src = PHOTOS[img.dataset.photo];
  if (img.complete && img.naturalWidth === 0) markMissing();
});

// Zoom au clic
const lb = document.getElementById('lightbox');
document.addEventListener('click', e => {
  const img = e.target.closest('.photo:not(.missing) img');
  if (img) { lb.querySelector('img').src = img.src; lb.classList.add('open'); }
  else if (e.target.closest('#lightbox')) lb.classList.remove('open');
});
document.addEventListener('keydown', e => { if (e.key === 'Escape') lb.classList.remove('open'); });

// Menu qui se cache en descendant, réapparaît en remontant
let lastY = 0;
window.addEventListener('scroll', () => {
  const y = window.scrollY;
  if (y > lastY && y > 120) topbar.classList.add('hidden');
  else topbar.classList.remove('hidden');
  lastY = y;
}, { passive: true });

// Glisser à gauche / à droite pour changer de page (téléphone)
let sx = 0, sy = 0, tracking = false;
const hint = document.createElement('div');
hint.className = 'swipe-hint';
hint.textContent = '← Glissez pour changer de page →';
document.body.appendChild(hint);

function hideHint() { hint.classList.remove('show'); }

document.addEventListener('touchstart', e => {
  tracking = e.touches.length === 1 && !lb.classList.contains('open') && !e.target.closest('.menu');
  if (tracking) { sx = e.touches[0].clientX; sy = e.touches[0].clientY; }
}, { passive: true });

document.addEventListener('touchend', e => {
  if (!tracking) return;
  tracking = false;
  const t = e.changedTouches[0];
  const dx = t.clientX - sx, dy = t.clientY - sy;
  if (Math.abs(dx) < 60 || Math.abs(dx) < Math.abs(dy) * 1.5) return;
  const next = order.indexOf(currentId) + (dx < 0 ? 1 : -1);
  if (next >= 0 && next < order.length) { hideHint(); showPage(order[next]); }
}, { passive: true });

// Petite indication au premier affichage sur téléphone
if (window.matchMedia('(pointer: coarse)').matches) {
  let seen = false;
  try { seen = sessionStorage.getItem('swipeHint') === '1'; sessionStorage.setItem('swipeHint', '1'); } catch (e) {}
  if (!seen) {
    setTimeout(() => hint.classList.add('show'), 800);
    setTimeout(hideHint, 5000);
  }
}
