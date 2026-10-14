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

function showPage(id) {
  if (!document.getElementById(id)) id = 'accueil';
  pages.forEach(p => p.classList.toggle('active', p.id === id));
  tabs.forEach(t => t.classList.toggle('active', t.dataset.page === id));
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
