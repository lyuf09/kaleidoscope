const header = document.querySelector('[data-header]');
const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.site-nav');
const parallaxLayer = document.querySelector('[data-parallax]');

const syncHeader = () => header?.classList.toggle('is-scrolled', window.scrollY > 24);
syncHeader();
window.addEventListener('scroll', syncHeader, { passive: true });

menuToggle?.addEventListener('click', () => {
  const open = menuToggle.getAttribute('aria-expanded') === 'true';
  menuToggle.setAttribute('aria-expanded', String(!open));
  nav?.classList.toggle('is-open', !open);
});

if (parallaxLayer && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  window.addEventListener('pointermove', (event) => {
    const x = ((event.clientX / window.innerWidth) - 0.5) * 6;
    const y = ((event.clientY / window.innerHeight) - 0.5) * 6;
    parallaxLayer.style.setProperty('--parallax-x', `${x.toFixed(2)}px`);
    parallaxLayer.style.setProperty('--parallax-y', `${y.toFixed(2)}px`);
  }, { passive: true });
}
