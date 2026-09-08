(() => {
  const translations = {
    en: {
      'nav.label': 'Primary navigation',
      'nav.menu': 'Menu',
      'nav.tracks': 'Tracks',
      'nav.novel': 'Novel',
      'nav.archive': 'Archive',
      'nav.credits': 'Credits',
      'home.heroMeta': '09 TRACKS / 09 CHAPTERS',
      'home.enterAria': 'Enter',
      'home.portal.tracks': 'Tracks',
      'home.portal.novel': 'Novel',
      'home.portal.archive': 'Archive',
      'home.tracklist': 'Tracklist',
      'home.viewAll': 'View all',
      'tracks.eyebrow': 'Nine tracks',
      'tracks.title': 'Tracklist',
      'tracks.label': 'Tracklist',
      'actions.play': 'Play — forthcoming',
      'actions.read': 'Read',
      'novel.kind': 'A NOVEL',
      'novel.chapters': 'Chapters',
      'novel.begin': 'Begin',
      'novel.languageNote': 'Original language: Chinese. English translation forthcoming.',
      'archive.eyebrow': 'Images / fragments / process',
      'archive.title': 'Archive',
      'archive.lede': 'Visual residue, indexed as the work develops.',
      'archive.label': 'Archive collections',
      'archive.status': '13 studies visible / frame · study · record · plate',
      'credits.eyebrow': 'Album / Text / Visuals',
      'credits.title': 'Credits',
      'credits.lede': 'Kaleidoscope by HazezZ.',
      'credits.label': 'Credits',
      'credits.music': 'Music',
      'credits.composition': 'Composition',
      'credits.lyrics': 'Lyrics',
      'credits.arrangement': 'Arrangement',
      'credits.bass': 'Bass',
      'credits.novel': 'Novel',
      'credits.visualDirection': 'Visual Direction',
      'credits.web': 'Website Design & Development',
      'reader.chapter': 'Chapter',
      'reader.track': 'Track',
      'reader.contents': 'Contents',
      'reader.backToTrack': 'Back to track',
      'reader.navLabel': 'Chapter navigation',
      'reader.loading': 'Loading chapter…',
      'reader.loadError': 'Start a local web server to load the Markdown chapter file.'
    },
    zh: {
      'nav.label': '主导航',
      'nav.menu': '菜单',
      'nav.tracks': '曲目',
      'nav.novel': '小说',
      'nav.archive': '档案',
      'nav.credits': '制作',
      'home.heroMeta': '09 首曲目 / 09 章',
      'home.enterAria': '进入',
      'home.portal.tracks': '曲目',
      'home.portal.novel': '小说',
      'home.portal.archive': '档案',
      'home.tracklist': '曲目列表',
      'home.viewAll': '查看全部',
      'tracks.eyebrow': '九首曲目',
      'tracks.title': '曲目列表',
      'tracks.label': '曲目列表',
      'actions.play': '播放 — 尚未发布',
      'actions.read': '阅读',
      'novel.kind': '一部小说',
      'novel.chapters': '章节',
      'novel.begin': '开始阅读',
      'novel.languageNote': '',
      'archive.eyebrow': '图像 / 碎片 / 过程',
      'archive.title': '档案',
      'archive.lede': '随着作品展开，视觉残留在此归档。',
      'archive.label': '档案图像',
      'archive.status': '已收录 13 项 / 画面 · 研究 · 记录 · 图版',
      'credits.eyebrow': '专辑 / 文本 / 视觉',
      'credits.title': '制作',
      'credits.lede': 'HazezZ 创作的《Kaleidoscope》。',
      'credits.label': '制作名单',
      'credits.music': '音乐',
      'credits.composition': '作曲',
      'credits.lyrics': '作词',
      'credits.arrangement': '编曲',
      'credits.bass': '贝斯',
      'credits.novel': '小说',
      'credits.visualDirection': '视觉指导',
      'credits.web': '网站设计与开发',
      'reader.chapter': '第',
      'reader.track': '曲目',
      'reader.contents': '目录',
      'reader.backToTrack': '返回曲目',
      'reader.navLabel': '章节导航',
      'reader.loading': '正在载入章节……',
      'reader.loadError': '请通过本地网页服务器载入 Markdown 章节文件。'
    }
  };

  const params = new URLSearchParams(window.location.search);
  const queryLang = params.get('lang');
  let storedLang = null;
  try {
    storedLang = localStorage.getItem('kaleidoscope-lang');
  } catch {
    storedLang = null;
  }
  const browserLang = navigator.language.toLowerCase().startsWith('zh') ? 'zh' : 'en';
  let currentLang = queryLang === 'zh' || queryLang === 'en'
    ? queryLang
    : (storedLang === 'zh' || storedLang === 'en' ? storedLang : browserLang);

  const t = (key) => translations[currentLang][key] ?? translations.en[key] ?? key;

  function translateStructuralUi() {
    document.querySelectorAll('.track-actions button').forEach((button) => {
      button.textContent = t('actions.play');
    });
    document.querySelectorAll('.track-actions a').forEach((link) => {
      link.textContent = t('actions.read');
    });

    const chapterState = document.querySelector('.chapter-state');
    if (chapterState) {
      const chapter = chapterState.dataset.chapter;
      const track = chapterState.dataset.track;
      chapterState.textContent = currentLang === 'zh'
        ? `第 ${chapter} 章 / 曲目 ${track}`
        : `Chapter ${chapter} / Track ${track}`;
    }

    document.querySelectorAll('.reader-nav a').forEach((link) => {
      const side = link === link.parentElement.firstElementChild ? 'previous' : 'next';
      const href = link.getAttribute('href') || '';
      const chapterMatch = href.match(/(?:^|\/)(\d{2})-[^/]+\.html/);
      let label = t('reader.contents');
      if (chapterMatch) {
        const roman = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX'][Number(chapterMatch[1]) - 1];
        label = currentLang === 'zh' ? `第 ${roman} 章` : `Chapter ${roman}`;
      }
      link.textContent = side === 'previous' ? `← ${label}` : `${label} →`;
    });

    const backTrack = document.querySelector('.back-track');
    if (backTrack) {
      const match = (backTrack.getAttribute('href') || '').match(/track-(\d{2})/);
      backTrack.textContent = `${t('reader.backToTrack')} ${match ? match[1] : ''}`.trim();
    }
  }

  function syncInternalLinks() {
    document.querySelectorAll('a[href]').forEach((link) => {
      const href = link.getAttribute('href');
      if (!href || /^(?:[a-z][a-z0-9+.-]*:|\/\/|#)/i.test(href)) return;

      const hashIndex = href.indexOf('#');
      const hash = hashIndex >= 0 ? href.slice(hashIndex) : '';
      const withoutHash = hashIndex >= 0 ? href.slice(0, hashIndex) : href;
      const queryIndex = withoutHash.indexOf('?');
      const path = queryIndex >= 0 ? withoutHash.slice(0, queryIndex) : withoutHash;
      const query = queryIndex >= 0 ? withoutHash.slice(queryIndex + 1) : '';
      const linkParams = new URLSearchParams(query);
      linkParams.set('lang', currentLang);
      link.setAttribute('href', `${path}?${linkParams.toString()}${hash}`);
    });
  }

  function applyLanguage(lang, updateUrl = false) {
    currentLang = lang === 'zh' ? 'zh' : 'en';
    try {
      localStorage.setItem('kaleidoscope-lang', currentLang);
    } catch {
      // The query parameter and browser language still provide a stable fallback.
    }
    document.documentElement.lang = currentLang === 'zh' ? 'zh-Hans' : 'en';
    document.documentElement.dataset.language = currentLang;

    document.querySelectorAll('[data-i18n]').forEach((element) => {
      element.textContent = t(element.dataset.i18n);
    });
    document.querySelectorAll('[data-i18n-aria-label]').forEach((element) => {
      element.setAttribute('aria-label', t(element.dataset.i18nAriaLabel));
    });
    document.querySelectorAll('[data-lang-only]').forEach((element) => {
      element.hidden = element.dataset.langOnly !== currentLang;
    });
    document.querySelectorAll('[data-lang]').forEach((button) => {
      const active = button.dataset.lang === currentLang;
      button.setAttribute('aria-pressed', String(active));
      button.classList.toggle('is-active', active);
    });
    document.querySelectorAll('.language-switch').forEach((group) => {
      group.setAttribute('aria-label', currentLang === 'zh' ? '语言' : 'Language');
    });
    document.querySelectorAll('.reader-nav').forEach((readerNav) => {
      readerNav.setAttribute('aria-label', t('reader.navLabel'));
    });
    translateStructuralUi();
    syncInternalLinks();

    if (updateUrl) {
      const url = new URL(window.location.href);
      url.searchParams.set('lang', currentLang);
      history.replaceState({}, '', url);
    }

    window.dispatchEvent(new CustomEvent('kaleidoscope:languagechange', {
      detail: { lang: currentLang }
    }));
  }

  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-lang]').forEach((button) => {
      button.addEventListener('click', () => applyLanguage(button.dataset.lang, true));
    });
    applyLanguage(currentLang);
  });

  window.KaleidoscopeI18n = {
    get lang() { return currentLang; },
    t,
    setLanguage: (lang) => applyLanguage(lang, true)
  };
})();
