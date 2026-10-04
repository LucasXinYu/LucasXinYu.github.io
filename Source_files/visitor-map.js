(function () {
  'use strict';

  var embed = document.querySelector('.visitor-widget-embed');
  if (!embed) return;
  var mount = embed.querySelector('.visitor-map-mount');
  var loading = embed.querySelector('.visitor-map-loading');
  var fallback = embed.querySelector('.visitor-map-fallback');
  var note = embed.querySelector('.visitor-map-note');
  if (!mount || mount.dataset.initialized) return;
  mount.dataset.initialized = 'true';

  function showFallback() {
    loading.hidden = true;
    fallback.hidden = false;
  }

  // Previewing a file or localhost must not create visits in the live counter.
  if (!/^https?:$/.test(window.location.protocol) ||
      window.location.hostname.toLowerCase() !== 'lucasxinyu.github.io') {
    fallback.querySelector('p').textContent = 'Visitor tracking is disabled in this preview.';
    showFallback();
    return;
  }

  var timeout = window.setTimeout(showFallback, 10000);

  function syncMap() {
    var widget = mount.querySelector('#mapmyvisitors-widget');
    var canvas = widget && widget.querySelector('.jvectormap-container');
    var jq = window.vmap_jq;
    var map = canvas && jq && jq(canvas).data('mapObject');
    var count = widget && widget.querySelector('.mapmyvisitors-visitors');
    if (!map || !map.markers || typeof map.removeMarkers !== 'function' ||
        !count || !count.textContent.trim() ||
        !canvas.querySelector('svg') || widget.querySelector('.mapmyvisitors-loading')) return;

    // The provider plots explicitly unknown locations at an Atlantic placeholder.
    // Remove only those labeled markers; never alter counts or guess locations.
    var unknown = Object.keys(map.markers).filter(function (id) {
      var config = map.markers[id].config;
      return config && /\bunknown\s+location\b/i.test(config.name || '');
    });
    if (unknown.length) map.removeMarkers(unknown);

    // The vendor writes an HTTP URL even when embedded on an HTTPS page.
    widget.href = 'https://mapmyvisitors.com/web/1c8li';
    widget.target = '_blank';
    widget.rel = 'noopener';
    window.clearTimeout(timeout);
    loading.hidden = true;
    fallback.hidden = true;
    note.hidden = false;
    embed.classList.add('is-ready');
  }

  // Keep watching: recent markers arrive after the initial map and may replace
  // earlier markers during the provider's short blinking animation.
  new MutationObserver(syncMap).observe(mount, {
    childList: true, subtree: true, characterData: true
  });

  var script = document.createElement('script');
  script.id = 'mapmyvisitors';
  script.async = true;
  script.src = mount.dataset.mapSrc;
  script.addEventListener('error', showFallback);
  mount.appendChild(script);
})();
