// Mobiles Menü ein-/ausklappen
const toggle = document.querySelector('.nav-toggle');
const nav = document.getElementById('hauptnavigation');

if (toggle && nav) {
  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!open));
    nav.classList.toggle('is-open', !open);
  });
}

/* =========================================================
   Hero-Einstieg: erst hüpfen die Tauben herein, dann werden
   Headline, Text und Buttons eingeblendet.
   - Wer „Bewegung reduzieren“ eingestellt hat, sieht alles sofort.
   - Bei aktivem Passwort-Overlay startet es erst nach dem Entsperren.
   ========================================================= */
const hero = document.querySelector('.hero');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (hero && !reduceMotion) {
  const root = document.documentElement;
  root.classList.add('js-motion');

  hero.querySelectorAll('.hero-flock img').forEach((el, i) => el.style.setProperty('--i', i));
  hero.querySelectorAll('.hero-text > *').forEach((el, i) => el.style.setProperty('--i', i));

  const start = () => hero.classList.add('is-visible');

  if (root.classList.contains('gate-locked')) {
    document.addEventListener('vorschau:freigegeben', start, { once: true });
  } else {
    start();
  }
}
