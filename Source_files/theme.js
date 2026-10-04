(function () {
  'use strict';

  var root = document.documentElement;
  var key = 'homepage-theme';
  var system = window.matchMedia('(prefers-color-scheme: dark)');
  var preference = null;
  var button;

  function validTheme(value) {
    return value === 'light' || value === 'dark' ? value : null;
  }

  // Storage may be unavailable in privacy-restricted browsers.
  try { preference = validTheme(window.localStorage.getItem(key)); } catch (_) {}

  function applyTheme() {
    var theme = preference || (system.matches ? 'dark' : 'light');
    root.dataset.theme = theme;
    if (button) {
      button.setAttribute('aria-pressed', String(theme === 'dark'));
      button.title = theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';
    }
  }

  applyTheme();

  function bindToggle() {
    button = document.getElementById('theme-toggle');
    if (!button) return;
    applyTheme();
    button.hidden = false;
    button.addEventListener('click', function () {
      preference = root.dataset.theme === 'dark' ? 'light' : 'dark';
      applyTheme();
      try { window.localStorage.setItem(key, preference); } catch (_) {}
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bindToggle, { once: true });
  } else {
    bindToggle();
  }

  // Follow system changes until the visitor makes an explicit choice.
  system.addEventListener('change', applyTheme);
  window.addEventListener('storage', function (event) {
    if (event.key !== key && event.key !== null) return;
    try {
      if (event.storageArea !== window.localStorage) return;
      preference = validTheme(window.localStorage.getItem(key));
      applyTheme();
    } catch (_) {}
  });
})();
