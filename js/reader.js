const contentRoot = document.querySelector('[data-content]');
const progressLabel = document.querySelector('[data-progress-label]');

function renderMarkdown(markdown) {
  return markdown
    .split(/\n{2,}/)
    .map((block) => {
      const text = block.trim();
      if (!text) return '';
      if (text.startsWith('# ')) return `<h1>${text.slice(2)}</h1>`;
      if (text.startsWith('> ')) return `<p class="placeholder-note">${text.slice(2)}</p>`;
      return `<p>${text.replace(/\n/g, '<br>')}</p>`;
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
    contentRoot.innerHTML = '<p class="placeholder-note">Start a local web server to load the Markdown chapter file.</p>';
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
