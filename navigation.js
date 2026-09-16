// Local reading-position indicator only. No storage or network requests.
(() => {
  const contents = document.querySelector('.contents');
  const compact = window.matchMedia('(max-width: 900px)');
  const adaptContents = () => { if (contents) contents.open = !compact.matches; };
  adaptContents();
  compact.addEventListener('change', adaptContents);
  const links = [...document.querySelectorAll('.nav-links a[href^="#section-"]')];
  const sections = links.map(link => document.getElementById(link.hash.slice(1)));
  if (!links.length || sections.some(section => !section)) return;
  links.forEach(link => link.addEventListener('click', () => {
    if (compact.matches && contents) {
      contents.open = false;
      // Reposition after the expanded menu has collapsed, including repeated links.
      requestAnimationFrame(() => {
        document.getElementById(link.hash.slice(1)).scrollIntoView({ block: 'start' });
        schedule();
      });
    }
  }));
  contents?.addEventListener('keydown', event => {
    if (event.key === 'Escape' && compact.matches) {
      contents.open = false;
      contents.querySelector('summary').focus();
    }
  });
  let scheduled = false;
  function update() {
    scheduled = false;
    const readingLine = Math.min(180, window.innerHeight * 0.25);
    let current = -1;
    sections.forEach((section, index) => {
      if (section.getBoundingClientRect().top <= readingLine) current = index;
    });
    if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2) current = sections.length - 1;
    links.forEach((link, index) => {
      if (index === current) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }
  function schedule() {
    if (!scheduled) { scheduled = true; requestAnimationFrame(update); }
  }
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule);
  window.addEventListener('hashchange', schedule);
  window.addEventListener('pageshow', schedule);
  update();
})();
