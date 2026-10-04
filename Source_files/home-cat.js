(function () {
  'use strict';

  var cat = document.getElementById('home-cat');
  if (!cat) return;

  var button = cat.querySelector('button');
  var speech = cat.querySelector('.home-cat__speech');
  var status = document.getElementById('home-cat-status');
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var petTimer;

  function resetLook() {
    cat.classList.remove('is-curious');
    cat.style.removeProperty('--cat-look-x');
    cat.style.removeProperty('--cat-look-y');
    cat.style.removeProperty('--cat-head-turn');
  }

  button.addEventListener('pointerenter', function (event) {
    if (event.pointerType !== 'touch') cat.classList.add('is-curious');
  });

  button.addEventListener('pointermove', function (event) {
    if (event.pointerType === 'touch' || reducedMotion.matches) return;
    var rect = button.getBoundingClientRect();
    var x = Math.max(-1, Math.min(1, (event.clientX - rect.left) / rect.width * 2 - 1));
    var y = Math.max(-1, Math.min(1, (event.clientY - rect.top) / rect.height * 2 - 1));
    cat.style.setProperty('--cat-look-x', (x * 2.5) + 'px');
    cat.style.setProperty('--cat-look-y', (y * 1.5) + 'px');
    cat.style.setProperty('--cat-head-turn', (x * 5) + 'deg');
  });

  button.addEventListener('pointerleave', resetLook);
  button.addEventListener('pointercancel', resetLook);
  button.addEventListener('blur', resetLook);

  button.addEventListener('click', function () {
    window.clearTimeout(petTimer);
    // Restart a short reaction on each pet without accumulating timers.
    cat.classList.remove('is-petted');
    void button.offsetWidth;
    cat.classList.add('is-petted');
    speech.textContent = 'purr purr ♡';
    status.textContent = 'The little cat purrs happily.';
    petTimer = window.setTimeout(function () {
      cat.classList.remove('is-petted');
      speech.textContent = 'hello, human ♡';
      status.textContent = '';
    }, 1600);
  });
})();
