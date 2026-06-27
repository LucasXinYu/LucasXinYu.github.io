$(function(){
  $('[data-toggle="popover"]').popover({
    html:true,
    content:function(){
      return '<img class="img-fluid" width="100px" src="'+$(this).data('img')+'" />';
    }
  });

  var $embed = $('.visitor-widget-embed');
  var $fallback = $('.visitor-map-fallback');

  if (!$embed.length || !$fallback.length) {
    return;
  }

  function showVisitorMapFallback() {
    $fallback.show();
    $('#mapmyvisitors').hide();
    $('#mapmyvisitors-widget').hide();
  }

  if (window.location.protocol === 'file:') {
    showVisitorMapFallback();
    return;
  }

  window.setTimeout(function() {
    var $widget = $('#mapmyvisitors-widget');
    var widgetText = ($widget.text() || '').trim().toLowerCase();
    var isStuckLoading = !$widget.length || widgetText.indexOf('loading data') !== -1;

    if (isStuckLoading) {
      showVisitorMapFallback();
    }
  }, 5000);
});
