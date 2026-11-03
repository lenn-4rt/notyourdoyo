/* =========================================================
   Vorschau-Sperre (TESTPHASE)
   Rein optischer Passwortschutz, KEIN echter Schutz: der
   Seiteninhalt bleibt im Quelltext lesbar.

   - Ohne Häkchen: Freigabe gilt bis der Browser geschlossen wird.
   - Mit Häkchen „30 Tage angemeldet bleiben“: Cookie für 30 Tage.
   - Zusätzlich wird die Freigabe im Browser-Speicher abgelegt,
     weil lokal (file://) keine Cookies gespeichert werden.
   - Vor dem Livegang: <script src="…/gate.js"> aus den Seiten entfernen.
   ========================================================= */
(function () {
  var PASSWORT = 'vorschau';          // hier ändern
  var KEY = 'vorschau_freigabe';
  var TAGE = 30;                      // Dauer bei „angemeldet bleiben“
  var CREDIT_NAME = 'Lennart Niehues';
  var CREDIT_URL = 'https://len-nie.de/';

  function speicher(art) {
    try { return window[art]; } catch (e) { return null; }
  }
  function istFreigegeben() {
    if (document.cookie.split('; ').indexOf(KEY + '=1') !== -1) return true;
    try {
      var s = speicher('sessionStorage');
      if (s && s.getItem(KEY) === '1') return true;
      var l = speicher('localStorage');
      var bis = l && parseInt(l.getItem(KEY), 10);
      if (bis && bis > Date.now()) return true;
    } catch (e) {}
    return false;
  }
  function freigeben(merken) {
    try {
      if (merken) {
        document.cookie = KEY + '=1; max-age=' + (TAGE * 86400) + '; path=/; SameSite=Lax';
        var l = speicher('localStorage');
        if (l) l.setItem(KEY, String(Date.now() + TAGE * 86400000));
      } else {
        document.cookie = KEY + '=1; path=/; SameSite=Lax';   // Sitzungs-Cookie
        var s = speicher('sessionStorage');
        if (s) s.setItem(KEY, '1');
      }
    } catch (e) {}
  }

  if (istFreigegeben()) return;

  // Schriftpfad relativ zu diesem Skript (assets/js/gate.js -> assets/fonts/)
  var skript = document.currentScript && document.currentScript.src;
  var fonts = skript ? new URL('../fonts/', skript).href : 'assets/fonts/';

  var root = document.documentElement;
  root.classList.add('gate-locked');

  // Styles sofort einfügen, damit der Inhalt nie ungeblurrt aufblitzt
  var style = document.createElement('style');
  style.textContent = [
    '@font-face { font-family: "Gate DM Sans"; font-weight: 400; font-display: swap; src: url("' + fonts + 'dm-sans-latin-400.woff2") format("woff2"); }',
    '@font-face { font-family: "Gate DM Sans"; font-weight: 500; font-display: swap; src: url("' + fonts + 'dm-sans-latin-500.woff2") format("woff2"); }',
    'html.gate-locked, html.gate-locked body { overflow: hidden !important; }',
    'html.gate-locked body > *:not(#gate) { filter: blur(20px); pointer-events: none; user-select: none; }',
    '#gate { position: fixed; inset: 0; z-index: 2147483647; display: grid; place-items: center; padding: 16px;',
    '  background: rgb(20 22 28 / .35); font-family: "Gate DM Sans", system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif; }',
    '#gate .gate-card { width: 100%; max-width: 380px; background: #f8f6f2; color: #1d1f24; border-radius: 24px;',
    '  padding: 36px 32px 24px; box-shadow: 0 20px 60px rgb(0 0 0 / .25); text-align: center; }',
    '#gate .gate-icon { width: 52px; height: 52px; margin: 0 auto 18px; border-radius: 50%; background: #fff;',
    '  display: grid; place-items: center; box-shadow: 0 1px 3px rgb(0 0 0 / .08); }',
    '#gate h1 { font-family: inherit; font-size: 1.3rem; line-height: 1.3; letter-spacing: 0; margin: 0 0 6px; font-weight: 500; }',
    '#gate p { font-size: .95rem; color: #5b606b; margin: 0 0 22px; }',
    '#gate input[type=password] { width: 100%; box-sizing: border-box; font: inherit; font-size: 1rem; padding: 14px 16px;',
    '  border: 1px solid #dcd8d0; border-radius: 12px; background: #fff; margin: 0 0 12px; }',
    '#gate input[type=password]:focus { outline: 2px solid #ff5900; outline-offset: 1px; border-color: transparent; }',
    '#gate .gate-remember { display: flex; align-items: center; gap: 10px; margin: 0 0 18px; padding-left: 2px;',
    '  font-size: .92rem; color: #4a4e57; cursor: pointer; text-align: left; user-select: none; }',
    '#gate .gate-remember input { width: 18px; height: 18px; margin: 0; accent-color: #ff5900; cursor: pointer; flex: none; }',
    '#gate button { width: 100%; font: inherit; font-weight: 500; font-size: 1.05rem; padding: 15px 28px; border: 0;',
    '  border-radius: 999px; background: #ff5900; color: #fff; cursor: pointer; transition: background-color .15s, transform .15s; }',
    '#gate button:hover { background: #e65000; transform: translateY(-1px); }',
    '#gate button:focus-visible { outline: 2px solid #1d1f24; outline-offset: 2px; }',
    '#gate .gate-error { color: #b42318; font-size: .9rem; min-height: 1.3em; margin: 10px 0 8px; }',
    '#gate .gate-credit { font-size: .8rem; color: #8a8e97; margin: 0; padding-top: 16px; border-top: 1px solid #e7e3dc; }',
    '#gate .gate-credit a { color: inherit; text-decoration: underline; text-underline-offset: .2em; white-space: nowrap; }',
    '#gate .gate-credit a:hover { color: #ff5900; }',
    '#gate.shake .gate-card { animation: gate-shake .35s; }',
    '@keyframes gate-shake { 25% { transform: translateX(-6px); } 50% { transform: translateX(6px); } 75% { transform: translateX(-3px); } }'
  ].join('\n');
  document.head.appendChild(style);

  function zeigeOverlay() {
    var titel = document.title;
    document.title = 'Passwortgeschützt';
    var gate = document.createElement('div');
    gate.id = 'gate';
    gate.setAttribute('role', 'dialog');
    gate.setAttribute('aria-modal', 'true');
    gate.setAttribute('aria-labelledby', 'gate-titel');
    gate.innerHTML =
      '<form class="gate-card" novalidate>' +
        '<div class="gate-icon" aria-hidden="true">' +
          '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
            '<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>' +
        '</div>' +
        '<h1 id="gate-titel">Diese Seite ist passwortgeschützt</h1>' +
        '<p>Bitte gib das Passwort ein, um fortzufahren.</p>' +
        '<label for="gate-pw" style="position:absolute;left:-9999px">Passwort</label>' +
        '<input id="gate-pw" type="password" autocomplete="current-password" placeholder="Passwort" required>' +
        '<label class="gate-remember"><input type="checkbox" id="gate-merken"> ' + TAGE + ' Tage angemeldet bleiben</label>' +
        '<button type="submit">Entsperren</button>' +
        '<p class="gate-error" aria-live="polite"></p>' +
        '<p class="gate-credit">Vorschau gestaltet und entwickelt von ' +
          '<a href="' + CREDIT_URL + '" target="_blank" rel="noopener">' + CREDIT_NAME + '</a></p>' +
      '</form>';
    document.body.appendChild(gate);

    var form = gate.querySelector('form');
    var input = gate.querySelector('#gate-pw');
    var merken = gate.querySelector('#gate-merken');
    var fehler = gate.querySelector('.gate-error');
    input.focus();

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (input.value === PASSWORT) {
        freigeben(merken.checked);
        document.title = titel;
        gate.remove();
        style.remove();
        root.classList.remove('gate-locked');
      } else {
        fehler.textContent = 'Das Passwort ist leider falsch.';
        input.select();
        gate.classList.remove('shake');
        void gate.offsetWidth; // Animation neu starten
        gate.classList.add('shake');
      }
    });
  }

  if (document.body) zeigeOverlay();
  else document.addEventListener('DOMContentLoaded', zeigeOverlay);
})();
