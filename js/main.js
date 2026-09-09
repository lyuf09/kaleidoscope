const header = document.querySelector('[data-header]');
const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.site-nav');
const parallaxLayer = document.querySelector('[data-parallax]');
const scriptPath = document.currentScript?.getAttribute('src') || '';
const rootPrefix = scriptPath.startsWith('../') ? '../' : '';

const footer = document.createElement('footer');
footer.className = 'site-footer';
footer.innerHTML = `
  <p>KALEIDOSCOPE · HAZEZZ · 2026—2027</p>
  <a href="${rootPrefix}credits.html"><span data-i18n="footer.credits">Credits</span> →</a>
`;
document.body.append(footer);

const syncHeader = () => header?.classList.toggle('is-scrolled', window.scrollY > 24);
syncHeader();
window.addEventListener('scroll', syncHeader, { passive: true });

menuToggle?.addEventListener('click', () => {
  const open = menuToggle.getAttribute('aria-expanded') === 'true';
  menuToggle.setAttribute('aria-expanded', String(!open));
  nav?.classList.toggle('is-open', !open);
});

nav?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    menuToggle?.setAttribute('aria-expanded', 'false');
    nav.classList.remove('is-open');
  });
});

if (parallaxLayer && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  window.addEventListener('pointermove', (event) => {
    const x = ((event.clientX / window.innerWidth) - 0.5) * 6;
    const y = ((event.clientY / window.innerHeight) - 0.5) * 6;
    parallaxLayer.style.setProperty('--parallax-x', `${x.toFixed(2)}px`);
    parallaxLayer.style.setProperty('--parallax-y', `${y.toFixed(2)}px`);
  }, { passive: true });
}

const trackRows = document.querySelectorAll('[data-track-preview]');
const trackPreviewImage = document.querySelector('[data-track-preview-image]');
const trackPreviewCaption = document.querySelector('[data-track-preview-caption]');

function activateTrackPreview(row) {
  if (!row || !trackPreviewImage || !trackPreviewCaption) return;
  trackRows.forEach((item) => item.classList.toggle('is-active', item === row));
  trackPreviewImage.classList.add('is-changing');
  window.setTimeout(() => {
    trackPreviewImage.src = row.dataset.trackPreview;
    trackPreviewImage.alt = '';
    trackPreviewCaption.textContent = row.dataset.trackCaption;
    trackPreviewImage.classList.toggle('is-plate', row.dataset.trackPreview.endsWith('.svg'));
    trackPreviewImage.classList.remove('is-changing');
  }, 90);
}

trackRows.forEach((row) => {
  row.addEventListener('pointerenter', () => activateTrackPreview(row));
  row.addEventListener('focusin', () => activateTrackPreview(row));
});

const archiveDialog = document.querySelector('[data-archive-dialog]');
const archiveVisual = archiveDialog?.querySelector('[data-archive-dialog-visual]');
const archiveId = archiveDialog?.querySelector('[data-archive-dialog-id]');
const archiveTitle = archiveDialog?.querySelector('[data-archive-dialog-title]');
const archiveAppears = archiveDialog?.querySelector('[data-archive-dialog-appears]');
let activeArchiveCard = null;

function openArchiveItem(card) {
  if (!archiveDialog || !archiveVisual || !archiveId || !archiveTitle || !archiveAppears) return;
  activeArchiveCard = card;
  archiveVisual.replaceChildren();
  if (card.dataset.archiveKind === 'marks') {
    const marks = card.querySelector('.archive-mark-set')?.cloneNode(true);
    if (marks) archiveVisual.append(marks);
  } else {
    const image = document.createElement('img');
    image.src = card.dataset.archiveImage;
    image.alt = card.querySelector('img')?.alt || '';
    archiveVisual.append(image);
  }
  archiveId.textContent = card.dataset.archiveId;
  archiveTitle.textContent = card.dataset.archiveTitle;
  archiveAppears.textContent = card.dataset.archiveAppears;
  archiveDialog.showModal();
}

document.querySelectorAll('[data-archive-item]').forEach((card) => {
  card.setAttribute('aria-label', `${card.dataset.archiveId}: ${card.dataset.archiveTitle}`);
  card.addEventListener('click', () => openArchiveItem(card));
  card.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    openArchiveItem(card);
  });
});

archiveDialog?.querySelector('[data-archive-close]')?.addEventListener('click', () => archiveDialog.close());
archiveDialog?.addEventListener('click', (event) => {
  if (event.target === archiveDialog) archiveDialog.close();
});
archiveDialog?.addEventListener('close', () => activeArchiveCard?.focus());
