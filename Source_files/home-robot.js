(function () {
  'use strict';

  var robot = document.getElementById('home-robot');
  if (!robot) return;

  var button = robot.querySelector('button');
  var speech = robot.querySelector('.home-robot__speech');
  var status = document.getElementById('home-robot-status');
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var moves = {
    wave: { duration: 1700, label: 'hey, explorer', announcement: 'The robot waves and nods hello.' },
    charge: { duration: 2300, label: 'energy online', announcement: 'The robot forms a floating energy orb.' },
    boost: { duration: 1500, label: 'thrusters ready', announcement: 'The robot makes a short jet-powered dash.' },
    shield: { duration: 2400, label: 'shield online', announcement: 'The robot projects a holographic shield and scans its armor.' },
    blade: { duration: 1300, label: 'blade online', announcement: 'The robot summons an energy blade and performs a flourish.' }
  };
  var sequence = ['charge', 'boost', 'shield', 'blade', 'wave'];
  var nextMove = 0;
  var reactionTimer;
  var inView = true;

  function resetLook() {
    robot.classList.remove('is-awake');
    robot.style.removeProperty('--robot-look-x');
    robot.style.removeProperty('--robot-look-y');
    robot.style.removeProperty('--robot-head-turn');
  }

  function finishMove() {
    window.clearTimeout(reactionTimer);
    robot.removeAttribute('data-action');
    robot.style.removeProperty('--robot-action-duration');
    speech.textContent = 'click for another move';
    status.textContent = '';
  }

  function playMove(name, announce) {
    if (robot.classList.contains('is-paused')) return;
    var move = moves[name];
    finishMove();
    // Clear the old animation before starting; rapid clicks never queue moves.
    void button.offsetWidth;
    robot.style.setProperty('--robot-action-duration', move.duration + 'ms');
    robot.setAttribute('data-action', name);
    speech.textContent = move.label;
    if (announce) status.textContent = move.announcement;
    reactionTimer = window.setTimeout(finishMove, move.duration);
  }

  button.addEventListener('pointerenter', function (event) {
    if (event.pointerType === 'touch') return;
    robot.classList.add('is-awake');
    if (!robot.hasAttribute('data-action')) playMove('wave', false);
  });

  button.addEventListener('pointermove', function (event) {
    if (event.pointerType === 'touch' || reducedMotion.matches) return;
    var rect = button.getBoundingClientRect();
    var x = Math.max(-1, Math.min(1, (event.clientX - rect.left) / rect.width * 2 - 1));
    var y = Math.max(-1, Math.min(1, (event.clientY - rect.top) / rect.height * 2 - 1));
    robot.style.setProperty('--robot-look-x', (x * 1.5) + 'px');
    robot.style.setProperty('--robot-look-y', y + 'px');
    robot.style.setProperty('--robot-head-turn', (x * 4) + 'deg');
  });

  button.addEventListener('pointerleave', resetLook);
  button.addEventListener('pointercancel', resetLook);
  button.addEventListener('blur', resetLook);
  button.addEventListener('focus', function () {
    if (button.matches(':focus-visible') && !robot.hasAttribute('data-action')) playMove('wave', false);
  });
  reducedMotion.addEventListener('change', function () {
    resetLook();
    finishMove();
  });

  button.addEventListener('click', function () {
    playMove(sequence[nextMove], true);
    nextMove = (nextMove + 1) % sequence.length;
  });

  function updateVisibility() {
    var paused = document.hidden || !inView;
    robot.classList.toggle('is-paused', paused);
    if (paused) {
      finishMove();
      resetLook();
    }
  }
  document.addEventListener('visibilitychange', updateVisibility);
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      inView = entries[0].isIntersecting;
      updateVisibility();
    }).observe(robot);
  }
  updateVisibility();
})();
