$(function(){
  $('[data-toggle="popover"]').popover({
    html:true,
    content:function(){
      return '<img class="img-fluid" width="100px" src="'+$(this).data('img')+'" />';
    }
  });

});

(function() {
  var embed = document.querySelector('.visitor-widget-embed');
  var fallback = document.querySelector('.visitor-map-fallback');

  if (!embed || !fallback) {
    return;
  }

  function showVisitorMapFallback() {
    fallback.hidden = false;
    embed.classList.add('is-unavailable');
  }

  if (window.location.protocol === 'file:') {
    showVisitorMapFallback();
    return;
  }

  function isVisitorMapReady() {
    var widget = document.getElementById('mapmyvisitors-widget');
    var visitors = widget && widget.querySelector('.mapmyvisitors-visitors');
    return Boolean(visitors && visitors.textContent.trim() &&
      widget.querySelector('.mapmyvisitors-map') &&
      !widget.querySelector('.mapmyvisitors-loading'));
  }

  var timeout = window.setTimeout(function() {
    if (!isVisitorMapReady()) {
      showVisitorMapFallback();
    }
  }, 8000);

  // A slow response may still succeed after the fallback is shown.
  var observer = new MutationObserver(function() {
    if (isVisitorMapReady()) {
      window.clearTimeout(timeout);
      observer.disconnect();
      fallback.hidden = true;
      embed.classList.remove('is-unavailable');
    }
  });
  observer.observe(embed, {childList:true, subtree:true, characterData:true});

  if (isVisitorMapReady()) {
    window.clearTimeout(timeout);
    observer.disconnect();
  }
})();
