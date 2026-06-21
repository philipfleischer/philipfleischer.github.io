/**
 * Topic filter — runs on any page that includes a FilterBar.
 * Cards must have [data-topics="Topic1,Topic2"] attributes.
 */
export function initFilter(filterId: string, gridSelector: string) {
  const bar = document.getElementById(filterId);
  if (!bar) return;

  const grid = document.querySelector(gridSelector);
  if (!grid) return;

  const empty = document.getElementById(`${filterId}-empty`);
  const pills = bar.querySelectorAll<HTMLButtonElement>('[data-filter]');
  const cards = grid.querySelectorAll<HTMLElement>('[data-topics]');
  const activeFilters = new Set<string>();

  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      const topic = pill.dataset.filter!;

      if (topic === 'all') {
        activeFilters.clear();
      } else if (activeFilters.has(topic)) {
        activeFilters.delete(topic);
      } else {
        activeFilters.add(topic);
      }

      // Sync pill states
      pills.forEach(p => {
        const t = p.dataset.filter!;
        p.classList.toggle(
          'filter-pill--active',
          t === 'all' ? activeFilters.size === 0 : activeFilters.has(t)
        );
      });

      // Show / hide cards
      let visible = 0;
      cards.forEach(card => {
        const cardTopics = (card.dataset.topics ?? '').split(',').map(s => s.trim());
        const show =
          activeFilters.size === 0 ||
          [...activeFilters].some(f => cardTopics.includes(f));

        card.style.display = show ? '' : 'none';
        if (show) visible++;
      });

      if (empty) empty.hidden = visible > 0;
    });
  });
}
