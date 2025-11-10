(function () {
  'use strict';

  // Elements
  const listEl = document.getElementById('mdList');
  const contentEl = document.getElementById('mdContent');
  const panelEl = document.getElementById('mdPanel');

  if (!listEl || !contentEl) {
    // Panel not present on page
    return;
  }

  const INDEX_URL = './assets/articles/index.json';

  async function fetchJSON(url) {
    const res = await fetch(url, { cache: 'no-cache' });
    if (!res.ok) throw new Error('Failed to load: ' + url);
    return await res.json();
  }

  async function fetchText(url) {
    const res = await fetch(url, { cache: 'no-cache' });
    if (!res.ok) throw new Error('Failed to load: ' + url);
    return await res.text();
  }

  function setActiveItem(id) {
    const items = listEl.querySelectorAll('[data-id]');
    items.forEach(it => it.classList.toggle('active', it.dataset.id === id));
  }

  async function loadDoc(item) {
    try {
      setActiveItem(item.id);
      const md = await fetchText(item.path);
      // marked must be loaded from CDN in the page
      const html = window.marked.parse(md);
      contentEl.innerHTML = html;
      contentEl.scrollTop = 0;
    } catch (err) {
      contentEl.innerHTML = `<div style="color:#f78;">文档加载失败：${escapeHtml(err.message || err)}</div>`;
    }
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str).replace(/[&<>"']/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[s]));
  }

  async function init() {
    try {
      const index = await fetchJSON(INDEX_URL);
      listEl.innerHTML = '';
      index.forEach((item, i) => {
        const li = document.createElement('div');
        li.className = 'md-item';
        li.dataset.id = item.id;
        li.textContent = item.title || item.id;
        li.tabIndex = 0;
        li.addEventListener('click', () => loadDoc(item));
        li.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            loadDoc(item);
          }
        });
        listEl.appendChild(li);
        if (i === 0) setTimeout(() => loadDoc(item), 0);
      });
    } catch (err) {
      listEl.innerHTML = `<div style="color:#f78;">目录加载失败：${escapeHtml(err.message || err)}</div>`;
    }
  }

  // When docs panel is present, initialize
  if (panelEl) {
    // If the panel is hidden initially, still init (content loads on demand)
    init();
  }
})();


