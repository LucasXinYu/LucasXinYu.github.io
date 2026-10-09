(function () {
  'use strict';
  const tools = document.querySelector('.publication-tools');
  const search = document.getElementById('paper-search');
  const papers = Array.from(document.querySelectorAll('.publication'));
  const buttons = Array.from(document.querySelectorAll('[data-filter]'));
  const count = document.getElementById('paper-count');
  const empty = document.getElementById('no-papers');
  if (!tools || !search || !count || !empty) return;
  let topic = 'All';
  function update() {
    const words = search.value.trim().toLowerCase().split(/\s+/).filter(Boolean);
    let matches = 0;
    papers.forEach(function (paper) {
      const text = (paper.textContent + ' ' + paper.dataset.topic).toLowerCase();
      const visible = (topic === 'All' || paper.dataset.topic === topic) && words.every(word => text.includes(word));
      paper.hidden = !visible;
      if (visible) matches++;
    });
    buttons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.filter === topic)));
    count.textContent = matches + ' of ' + papers.length + ' selected papers';
    empty.hidden = matches !== 0;
  }
  search.addEventListener('input', update);
  buttons.forEach(button => button.addEventListener('click', function () { topic = button.dataset.filter; update(); }));
  document.getElementById('reset-papers').addEventListener('click', function () { topic = 'All'; search.value = ''; update(); search.focus(); });
  // A research-focus link must still reveal its target after a filter was applied.
  function revealLinkedPaper() {
    const paper = papers.find(item => '#' + item.id === window.location.hash);
    if (paper && paper.hidden) {
      topic = 'All'; search.value = ''; update(); paper.scrollIntoView();
    }
  }
  document.addEventListener('click', function (event) {
    const link = event.target.closest('a[href^="#paper-"]');
    if (!link) return;
    const target = papers.find(paper => '#' + paper.id === link.hash);
    if (target && target.hidden) { topic = 'All'; search.value = ''; update(); }
  });
  window.addEventListener('hashchange', revealLinkedPaper);
  tools.hidden = false;
  update();
  revealLinkedPaper();
})();
