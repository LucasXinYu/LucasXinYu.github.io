(function () {
  'use strict';

  var robot = document.getElementById('home-robot');
  if (!robot) return;

  var button = robot.querySelector('button');
  var speech = robot.querySelector('.home-robot__speech');
  var status = document.getElementById('home-robot-status');
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var reactionTimer;

  function resetLook() {
    robot.classList.remove('is-awake');
    robot.style.removeProperty('--robot-look-x');
    robot.style.removeProperty('--robot-look-y');
    robot.style.removeProperty('--robot-head-turn');
  }

  button.addEventListener('pointerenter', function (event) {
    if (event.pointerType !== 'touch') robot.classList.add('is-awake');
  });

  button.addEventListener('pointermove', function (event) {
    if (event.pointerType === 'touch' || reducedMotion.matches) return;
    var rect = button.getBoundingClientRect();
    var x = Math.max(-1, Math.min(1, (event.clientX - rect.left) / rect.width * 2 - 1));
    var y = Math.max(-1, Math.min(1, (event.clientY - rect.top) / rect.height * 2 - 1));
    robot.style.setProperty('--robot-look-x', (x * 3) + 'px');
    robot.style.setProperty('--robot-look-y', (y * 2) + 'px');
    robot.style.setProperty('--robot-head-turn', (x * 5) + 'deg');
  });

  button.addEventListener('pointerleave', resetLook);
  button.addEventListener('pointercancel', resetLook);
  button.addEventListener('blur', resetLook);
  reducedMotion.addEventListener('change', resetLook);

  button.addEventListener('click', function () {
    window.clearTimeout(reactionTimer);
    // Restart one short reaction, including on keyboard activation and touch.
    robot.classList.remove('is-boosting');
    void button.offsetWidth;
    robot.classList.add('is-boosting');
    speech.textContent = "let's build something!";
    status.textContent = 'The robot waves hello.';
    reactionTimer = window.setTimeout(function () {
      robot.classList.remove('is-boosting');
      speech.textContent = 'hello, human';
      status.textContent = '';
    }, 1800);
  });
})();
