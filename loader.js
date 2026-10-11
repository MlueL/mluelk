/* MLUE intro loader: plays once per visit (first page opened in a tab).
   Logo pieces sweep in one by one, then the logo zooms down into the navbar.
   Later page changes in the same tab skip it. Always removes itself. */
(function () {
  var loader = document.getElementById('mlue-loader');
  if (!loader) return;
  var DOCK_AT = 1800, DONE_AT = 2700, REMOVE_AT = 3400;

  function remove() {
    try { loader.remove(); } catch (e) {}
    try { document.body.style.overflow = ''; } catch (e) {}
  }
  // Safety net first: the loader can never get stuck on screen.
  setTimeout(remove, REMOVE_AT + 800);

  var seen = false;
  try { seen = sessionStorage.getItem('mlue_seen') === '1'; } catch (e) {
    seen = window.name === 'mlue_seen';
  }
  if (seen) { loader.classList.add('skip'); remove(); return; }
  try { sessionStorage.setItem('mlue_seen', '1'); } catch (e) { window.name = 'mlue_seen'; }

  document.body.style.overflow = 'hidden';
  var stage = document.getElementById('loaderStage');
  var svg = document.getElementById('loaderSvg');

  setTimeout(function () {
    try {
      var navLogo = document.querySelector('.nav-logo .logo-svg-wrap svg');
      if (stage && svg && navLogo) {
        var a = svg.getBoundingClientRect(), b = navLogo.getBoundingClientRect();
        stage.style.setProperty('--tx', (b.left + b.width / 2 - (a.left + a.width / 2)) + 'px');
        stage.style.setProperty('--ty', (b.top + b.height / 2 - (a.top + a.height / 2)) + 'px');
        stage.style.setProperty('--ts', b.height / a.height);
        stage.classList.add('dock');
      }
    } catch (e) {}
  }, DOCK_AT);

  setTimeout(function () {
    loader.classList.add('loader-done');
    document.body.style.overflow = '';
  }, DONE_AT);
  setTimeout(remove, REMOVE_AT);
})();
