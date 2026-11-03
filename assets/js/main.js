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
