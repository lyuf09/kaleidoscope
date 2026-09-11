const contentRoot = document.querySelector('[data-content]');
const progressLabel = document.querySelector('[data-progress-label]');

const chapterVisuals = {
  'archive-box': {
    src: '../assets/images/archive-box.jpg',
    alt: 'An open gray archive box holding folders, printouts, and a transparent photograph sleeve',
    label: 'RECORD 06 / COLLECTIONS OFFICE'
  },
  'orchid-corridor': {
    src: '../assets/images/orchid-corridor.jpg',
    alt: 'An empty cold-white research corridor leading through a partly open glass door',
    label: 'FRAME 07 / WITHDRAWN ROUTE'
  },
  'mesh-glass': {
    src: '../assets/images/fragment-mesh-glass.jpg',
    alt: 'Weathered wire mesh and old greenhouse glass',
    label: 'FRAME 02 / WEST GLASSHOUSE'
  },
  'h17-label': {
    src: '../assets/images/h17-label.jpg',
    alt: 'A weathered plant label marked WGH H17 with a partial accession number',
    label: 'RECORD 08 / LOCATION ≠ INDIVIDUAL'
  },
  'winter-beds': {
    src: '../assets/images/winter-trial-beds.jpg',
    alt: 'Empty-looking winter nursery beds with B03, B04, and B05 markers',
    label: 'RECORD 09 / RENA WINTER INVENTORY'
  },
  'condition-survey': {
    src: '../assets/images/condition-survey.jpg',
    alt: 'A sharply recorded corroded greenhouse truss joint beside a measurement scale',
    label: 'FRAME 10 / CONDITION BEFORE INTERVENTION'
  },
  'paper-wall': {
    src: '../assets/images/fragment-paper-wall.jpg',
    alt: 'A torn paper edge crossing a pale weathered wall',
    label: 'RESIDUE 03 / SURFACE REMAINS'
  }
};

function renderMarkdown(markdown) {
  const renderInline = (text) => text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\\\*/g, '*')
    .replace(/\*\*(.+?)\*\*/g, '$1');

  return markdown
    .split(/\n{2,}/)
    .map((block) => {
      const text = block.trim();
      if (!text) return '';
      const visualMatch = text.match(/^\[\[visual:([a-z0-9-]+)\]\]$/);
      if (visualMatch && chapterVisuals[visualMatch[1]]) {
        const visual = chapterVisuals[visualMatch[1]];
        return `<figure class="chapter-visual chapter-visual--${visualMatch[1]}"><img src="${visual.src}" alt="${visual.alt}" loading="lazy"><figcaption>${visual.label}</figcaption></figure>`;
      }
      const recordMatch = text.match(/^\[\[record\]\]\n([\s\S]+)\n\[\[\/record\]\]$/);
      if (recordMatch) {
        const lines = recordMatch[1]
          .split('\n')
          .map((line) => `<span>${renderInline(line)}</span>`)
          .join('');
        return `<div class="document-record">${lines}</div>`;
      }
      const revisionMatch = text.match(/^\[\[revision:(version|later)\]\]\n([\s\S]+)\n\[\[\/revision\]\]$/);
      if (revisionMatch) {
        const lines = revisionMatch[2].split('\n');
        const title = renderInline(lines.shift() || '');
        const body = lines.map((line) => {
          if (line.startsWith('META|')) return `<span class="revision-meta">${renderInline(line.slice(5))}</span>`;
          if (line.startsWith('DEL|')) return `<span class="revision-deleted">${renderInline(line.slice(4))}</span>`;
          if (line.startsWith('NOTE|')) return `<span class="revision-note">${renderInline(line.slice(5))}</span>`;
          if (line.startsWith('ADD|')) return `<span class="revision-replacement">${renderInline(line.slice(4))}</span>`;
          return `<span class="revision-line">${renderInline(line)}</span>`;
        }).join('');
        return `<section class="revision-record revision-record--${revisionMatch[1]}"><div class="revision-heading">${title}</div>${body}</section>`;
      }
      if (text.startsWith('# ')) return `<h1>${renderInline(text.slice(2))}</h1>`;
      if (text.startsWith('> ')) return `<p class="placeholder-note">${renderInline(text.slice(2))}</p>`;
      return `<p>${renderInline(text).replace(/\n/g, '<br>')}</p>`;
    })
    .join('');
}

async function loadChapter() {
  if (!contentRoot) return;
  try {
    const response = await fetch(contentRoot.dataset.content);
    if (!response.ok) throw new Error('Chapter unavailable');
    contentRoot.innerHTML = renderMarkdown(await response.text());
  } catch {
    const message = window.KaleidoscopeI18n?.t('reader.loadError')
      || 'Start a local web server to load the Markdown chapter file.';
    contentRoot.innerHTML = `<p class="placeholder-note" data-i18n="reader.loadError">${message}</p>`;
  }
}

function updateProgress() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const percentage = max > 0 ? Math.min(100, Math.max(0, (window.scrollY / max) * 100)) : 0;
  document.documentElement.style.setProperty('--reading-progress', `${percentage}%`);
  if (progressLabel) progressLabel.textContent = `${Math.round(percentage)}%`;
}

loadChapter();
updateProgress();
window.addEventListener('scroll', updateProgress, { passive: true });
