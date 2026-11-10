/* KontenPlan - renderer */
(() => {
  const api = window.api;
  const $ = (sel, el = document) => el.querySelector(sel);
  const $$ = (sel, el = document) => [...el.querySelectorAll(sel)];

  // ---------- Konstanta ----------
  const STATUSES = ['idea', 'script', 'production', 'editing', 'review', 'scheduled', 'published'];
  const PLATFORMS = ['TikTok', 'Instagram Reels', 'Instagram Feed', 'Instagram Story', 'YouTube', 'YouTube Shorts', 'Facebook', 'X / Twitter', 'LinkedIn', 'Print / Cetak'];
  const RATIOS = ['9:16', '16:9', '1:1', '4:5'];
  const SIZES = [
    { v: '1080x1080', l: 'Instagram Feed 1080×1080' },
    { v: '1080x1350', l: 'Instagram Portrait 1080×1350' },
    { v: '1080x1920', l: 'Story / Reels 1080×1920' },
    { v: '1280x720', l: 'YouTube Thumbnail 1280×720' },
    { v: '1200x628', l: 'Facebook / LinkedIn 1200×628' },
    { v: '2480x3508', l: 'A4 (300dpi)' },
    { v: '3508x4961', l: 'A3 (300dpi)' }
  ];
  const AI_LANG = { id: 'Bahasa Indonesia', en: 'English', ms: 'Bahasa Melayu (Malaysia)' };
  const KEY_LINKS = {
    anthropic: 'https://console.anthropic.com/settings/keys',
    openai: 'https://platform.openai.com/api-keys',
    gemini: 'https://aistudio.google.com/apikey'
  };

  const ICON = {
    calendar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4.5" width="18" height="16" rx="2.5"/><path d="M3 9.5h18M8 3v3M16 3v3"/></svg>',
    board: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="5" height="16" rx="1.5"/><rect x="10" y="4" width="5" height="11" rx="1.5"/><rect x="17" y="4" width="4" height="7" rx="1.5"/></svg>',
    list: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M9 6h12M9 12h12M9 18h12M4 6h.01M4 12h.01M4 18h.01"/></svg>',
    spark: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z"/><path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z"/></svg>',
    gear: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></svg>',
    plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
    video: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2.5" y="5.5" width="14" height="13" rx="2.5"/><path d="M16.5 10l5-3v10l-5-3z"/></svg>',
    poster: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2.5" width="16" height="19" rx="2"/><circle cx="9.5" cy="8.5" r="2"/><path d="M20 15l-4.5-4.5L6 20"/></svg>',
    left: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M15 18l-6-6 6-6"/></svg>',
    right: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M9 18l6-6-6-6"/></svg>',
    folder: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>'
  };

  // ---------- State ----------
  const state = {
    settings: null,
    items: [],
    view: 'calendar',
    filters: { type: 'all', platform: 'all', assignee: 'all', q: '' },
    month: startOfMonth(new Date()),
    draft: null,
    draftBase: undefined,
    draftIsNew: false,
    tab: 'general',
    ideas: [],
    ideasForm: { niche: '', audience: '', platform: 'TikTok', type: 'video', tone: '', count: 6 },
    ideasLoading: false
  };

  // ---------- Util ----------
  const L = () => window.I18N[state.settings?.language] || window.I18N.id;
  function t(key, vars) {
    let s = L()[key];
    if (s === undefined) s = window.I18N.id[key] ?? key;
    if (vars) for (const k in vars) s = s.replace('{' + k + '}', vars[k]);
    return s;
  }
  function esc(s) {
    return String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }
  function startOfMonth(d) { return new Date(d.getFullYear(), d.getMonth(), 1); }
  function ymd(d) { return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }
  function fmtDate(s) {
    if (!s) return '';
    const [y, m, d] = s.split('-').map(Number);
    return d + ' ' + L().months[m - 1].slice(0, 3) + ' ' + y;
  }
  function initials(name) {
    return (name || '?').trim().split(/\s+/).slice(0, 2).map((w) => w[0]).join('').toUpperCase() || '?';
  }
  function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 8); }
  function getPath(obj, path) { return path.split('.').reduce((o, k) => (o == null ? o : o[k]), obj); }
  function setPath(obj, path, val) {
    const ks = path.split('.');
    let o = obj;
    ks.slice(0, -1).forEach((k) => { if (o[k] == null) o[k] = {}; o = o[k]; });
    o[ks[ks.length - 1]] = val;
  }
  async function call(fn, ...args) {
    const r = await fn(...args);
    if (!r.ok) throw new Error(r.error);
    return r.data;
  }
  function toast(msg, err) {
    const el = document.createElement('div');
    el.className = 'toast' + (err ? ' err' : '');
    el.textContent = msg;
    $('#toast-root').appendChild(el);
    setTimeout(() => el.remove(), err ? 5000 : 2200);
  }
  function opts(list, cur) {
    return list.map((o) => {
      const v = typeof o === 'object' ? o.v : o;
      const l = typeof o === 'object' ? o.l : o;
      return `<option value="${esc(v)}" ${v === cur ? 'selected' : ''}>${esc(l)}</option>`;
    }).join('');
  }

  function newItem(type, date) {
    const me = state.settings.userName || '';
    return {
      id: uid(), type, title: '', platform: type === 'video' ? 'TikTok' : 'Instagram Feed',
      status: 'idea', publishDate: date || '', assignee: me, tags: [], notes: '',
      createdAt: new Date().toISOString(), createdBy: me,
      caption: '', hashtags: '',
      video: { ratio: '9:16', duration: 30, hook: '', cta: '', scenes: [] },
      poster: { size: '1080x1350', purpose: '', audience: '', message: '', headline: '', subheadline: '', body: '', cta: '', colors: ['#1d1b20', '#e8572e', '#fdf3e7'], fonts: '', moodboard: [] }
    };
  }
  function normalize(it) {
    const base = newItem(it.type || 'video');
    return { ...base, ...it, video: { ...base.video, ...(it.video || {}) }, poster: { ...base.poster, ...(it.poster || {}) } };
  }

  function filtered() {
    const f = state.filters;
    const q = f.q.trim().toLowerCase();
    return state.items.filter((it) =>
      (f.type === 'all' || it.type === f.type) &&
      (f.platform === 'all' || it.platform === f.platform) &&
      (f.assignee === 'all' || (it.assignee || '') === f.assignee) &&
      (!q || [it.title, it.notes, (it.tags || []).join(' '), it.caption].join(' ').toLowerCase().includes(q))
    );
  }
  const assignees = () => [...new Set(state.items.map((i) => i.assignee).filter(Boolean))].sort();

  // ---------- Data ----------
  async function loadItems() {
    if (!state.settings.dataFolder) { state.items = []; return; }
    try {
      const list = await call(api.listItems);
      state.items = list.map(normalize).sort((a, b) => (a.publishDate || '9').localeCompare(b.publishDate || '9'));
    } catch (e) { toast(e.message, true); }
  }

  async function persist(item, base, force) {
    const r = await call(api.saveItem, item, base, force);
    if (r.conflict) return r;
    const saved = normalize(r.item);
    const i = state.items.findIndex((x) => x.id === saved.id);
    if (i >= 0) state.items[i] = saved; else state.items.push(saved);
    return { ok: true, item: saved };
  }

  async function quickUpdate(id, patch) {
    const it = state.items.find((x) => x.id === id);
    if (!it) return;
    const next = { ...it, ...patch };
    try {
      const r = await persist(next, it.updatedAt);
      if (r.conflict) { toast(t('conflict', { name: r.current.updatedBy || '?' }), true); await loadItems(); }
    } catch (e) { toast(e.message, true); }
    render();
  }

  // ---------- Render: shell ----------
  function render() {
    document.documentElement.lang = state.settings.language;
    renderSidebar();
    const v = state.view;
    if (v === 'calendar') renderCalendar();
    else if (v === 'board') renderBoard();
    else if (v === 'list') renderList();
    else if (v === 'ideas') renderIdeas();
    else if (v === 'settings') renderSettings();
  }

  function renderSidebar() {
    const nav = [
      ['calendar', 'nav_calendar', ICON.calendar], ['board', 'nav_board', ICON.board], ['list', 'nav_list', ICON.list],
      ['ideas', 'nav_ideas', ICON.spark], ['settings', 'nav_settings', ICON.gear]
    ];
    const s = state.settings;
    const folderName = s.dataFolder ? s.dataFolder.split(/[\\/]/).filter(Boolean).pop() : t('no_folder');
    $('#sidebar').innerHTML = `
      <div class="brand"><div class="brand-mark">K</div>KontenPlan</div>
      ${nav.map(([k, l, ic]) => `<button class="nav-btn ${state.view === k ? 'active' : ''}" data-nav="${k}">${ic}${esc(t(l))}</button>`).join('')}
      <div class="sidebar-foot">
        <div class="row"><span class="avatar">${esc(initials(s.userName))}</span><span class="who">${esc(s.userName || '—')}</span></div>
        <div class="folder-pill" title="${esc(s.dataFolder)}"><span class="dot" style="background:${s.dataFolder ? 'var(--ok)' : 'var(--warn)'}"></span>${esc(folderName)}</div>
        <div>${esc(t('items_count', { n: state.items.length }))}</div>
      </div>`;
    $$('[data-nav]', $('#sidebar')).forEach((b) => b.onclick = () => { state.view = b.dataset.nav; render(); });
  }

  function topbar(title, extra = '', showFilters = true) {
    const f = state.filters;
    const filters = showFilters ? `
      <input class="input search" id="f-q" placeholder="${esc(t('search'))}" value="${esc(f.q)}" />
      <select class="select compact" id="f-type">${opts([{ v: 'all', l: t('type') + ': ' + t('all') }, { v: 'video', l: t('video') }, { v: 'poster', l: t('poster') }], f.type)}</select>
      <select class="select compact" id="f-platform">${opts([{ v: 'all', l: t('platform') + ': ' + t('all') }, ...PLATFORMS], f.platform)}</select>
      <select class="select compact" id="f-assignee">${opts([{ v: 'all', l: t('assignee') + ': ' + t('all') }, ...assignees()], f.assignee)}</select>` : '';
    return `<div class="topbar"><h1>${esc(title)}</h1>${extra}<div class="spacer"></div>${filters}
      <button class="btn primary" id="btn-new">${ICON.plus}${esc(t('new_content'))}</button></div>`;
  }
  function bindTopbar() {
    const q = $('#f-q');
    if (q) {
      q.oninput = () => { state.filters.q = q.value; const pos = q.selectionStart; render(); const nq = $('#f-q'); nq.focus(); nq.setSelectionRange(pos, pos); };
      $('#f-type').onchange = (e) => { state.filters.type = e.target.value; render(); };
      $('#f-platform').onchange = (e) => { state.filters.platform = e.target.value; render(); };
      $('#f-assignee').onchange = (e) => { state.filters.assignee = e.target.value; render(); };
    }
    $('#btn-new').onclick = () => chooseNew();
  }

  function chooseNew(date) {
    const m = modal(`
      <h2>${esc(t('new_content'))}</h2>
      <div class="new-choice">
        <button data-type="video"><span class="ic" style="background:var(--video-soft);color:var(--video)">${ICON.video}</span>${esc(t('new_video'))}<small>${esc(t('tab_script'))}</small></button>
        <button data-type="poster"><span class="ic" style="background:var(--poster-soft);color:var(--poster)">${ICON.poster}</span>${esc(t('new_poster'))}<small>${esc(t('tab_brief'))}</small></button>
      </div>`);
    $$('[data-type]', m).forEach((b) => b.onclick = () => { closeModal(); openEditor(newItem(b.dataset.type, date), true); });
  }

  function chip(it) {
    return `<div class="chip ${it.type} st-${it.status}" draggable="true" data-id="${esc(it.id)}" title="${esc(it.title)}">
      <span class="st-dot"></span><span class="t">${esc(it.title || t('untitled'))}</span></div>`;
  }
  function bindOpen(root) {
    $$('[data-id]', root).forEach((el) => {
      el.addEventListener('click', (e) => { e.stopPropagation(); const it = state.items.find((x) => x.id === el.dataset.id); if (it) openEditor(it); });
      el.addEventListener('dragstart', (e) => { e.dataTransfer.setData('text/plain', el.dataset.id); el.classList.add('dragging'); });
      el.addEventListener('dragend', () => el.classList.remove('dragging'));
    });
  }
  function bindDrop(el, onDrop) {
    el.addEventListener('dragover', (e) => { e.preventDefault(); el.classList.add('drop'); });
    el.addEventListener('dragleave', () => el.classList.remove('drop'));
    el.addEventListener('drop', (e) => { e.preventDefault(); el.classList.remove('drop'); const id = e.dataTransfer.getData('text/plain'); if (id) onDrop(id); });
  }

  // ---------- Kalender ----------
  function renderCalendar() {
    const m = state.month;
    const title = L().months[m.getMonth()] + ' ' + m.getFullYear();
    const nav = `<div class="row"><button class="btn ghost sm" id="m-prev">${ICON.left}</button><button class="btn sm" id="m-today">${esc(t('today'))}</button><button class="btn ghost sm" id="m-next">${ICON.right}</button></div>`;
    const items = filtered();
    const byDate = {};
    items.forEach((it) => { if (it.publishDate) (byDate[it.publishDate] = byDate[it.publishDate] || []).push(it); });
    const offset = (m.getDay() + 6) % 7; // minggu mulai Senin
    const start = new Date(m.getFullYear(), m.getMonth(), 1 - offset);
    const todayS = ymd(new Date());
    const cells = [];
    const daysInMonth = new Date(m.getFullYear(), m.getMonth() + 1, 0).getDate();
    const totalCells = Math.ceil((offset + daysInMonth) / 7) * 7;
    for (let i = 0; i < totalCells; i++) {
      const d = new Date(start.getFullYear(), start.getMonth(), start.getDate() + i);
      const ds = ymd(d);
      const list = byDate[ds] || [];
      cells.push(`<div class="cal-day ${d.getMonth() !== m.getMonth() ? 'out' : ''} ${ds === todayS ? 'today' : ''}" data-date="${ds}">
        <div class="num"><span>${d.getDate()}</span><button class="add" data-add="${ds}" title="${esc(t('new_content'))}">+</button></div>
        ${list.slice(0, 4).map(chip).join('')}${list.length > 4 ? `<div class="muted" style="font-size:12px;padding-left:4px">+${list.length - 4}</div>` : ''}
      </div>`);
    }
    const days = L().days; const head = [1, 2, 3, 4, 5, 6, 0].map((i) => `<div>${esc(days[i])}</div>`).join('');
    const unsched = items.filter((it) => !it.publishDate);
    $('#main').innerHTML = topbar(title, nav) + `<div class="content">
      <div class="cal-head">${head}</div><div class="cal-grid">${cells.join('')}</div>
      <div class="unscheduled" id="unsched"><h3>${esc(t('no_date'))} (${unsched.length})</h3><div class="chip-row">${unsched.map(chip).join('') || `<span class="muted">—</span>`}</div></div>
    </div>`;
    bindTopbar();
    $('#m-prev').onclick = () => { state.month = new Date(m.getFullYear(), m.getMonth() - 1, 1); render(); };
    $('#m-next').onclick = () => { state.month = new Date(m.getFullYear(), m.getMonth() + 1, 1); render(); };
    $('#m-today').onclick = () => { state.month = startOfMonth(new Date()); render(); };
    bindOpen($('#main'));
    $$('[data-add]').forEach((b) => b.onclick = (e) => { e.stopPropagation(); chooseNew(b.dataset.add); });
    $$('.cal-day').forEach((c) => bindDrop(c, (id) => quickUpdate(id, { publishDate: c.dataset.date })));
    bindDrop($('#unsched'), (id) => quickUpdate(id, { publishDate: '' }));
  }

  // ---------- Papan ----------
  function card(it) {
    return `<div class="card" draggable="true" data-id="${esc(it.id)}">
      <div class="row"><span class="badge ${it.type}">${esc(t(it.type))}</span><span class="muted" style="font-size:12px">${esc(it.platform)}</span></div>
      <div class="ttl">${esc(it.title || t('untitled'))}</div>
      <div class="meta">${it.publishDate ? ICON.calendar.replace('<svg', '<svg width="13" height="13"') + esc(fmtDate(it.publishDate)) : esc(t('no_date'))}
        <span class="avatar" title="${esc(it.assignee || t('unassigned'))}">${esc(initials(it.assignee))}</span></div>
    </div>`;
  }
  function renderBoard() {
    const items = filtered();
    const cols = STATUSES.map((s) => {
      const list = items.filter((i) => i.status === s);
      return `<div class="col st-${s}" data-status="${s}"><div class="col-head"><span class="st-dot"></span>${esc(t('st_' + s))}<span class="count">${list.length}</span></div>${list.map(card).join('')}</div>`;
    }).join('');
    $('#main').innerHTML = topbar(t('nav_board')) + `<div class="content"><div class="board">${cols}</div></div>`;
    bindTopbar();
    bindOpen($('#main'));
    $$('.col').forEach((c) => bindDrop(c, (id) => quickUpdate(id, { status: c.dataset.status })));
  }

  // ---------- Daftar ----------
  function renderList() {
    const items = filtered();
    const rows = items.map((it) => `<tr data-id="${esc(it.id)}">
      <td><b>${esc(it.title || t('untitled'))}</b></td>
      <td><span class="badge ${it.type}">${esc(t(it.type))}</span></td>
      <td>${esc(it.platform)}</td>
      <td class="st-${it.status}"><span class="row" style="gap:6px"><span class="st-dot"></span>${esc(t('st_' + it.status))}</span></td>
      <td>${esc(fmtDate(it.publishDate) || '—')}</td>
      <td><span class="row" style="gap:6px"><span class="avatar">${esc(initials(it.assignee))}</span>${esc(it.assignee || '—')}</span></td>
      <td class="muted">${esc(it.updatedBy || '')}</td></tr>`).join('');
    $('#main').innerHTML = topbar(t('nav_list'), `<button class="btn sm" id="btn-csv">${esc(t('export_csv'))}</button>`) + `<div class="content">
      ${items.length ? `<table class="table"><thead><tr><th>${esc(t('title'))}</th><th>${esc(t('type'))}</th><th>${esc(t('platform'))}</th><th>${esc(t('status'))}</th><th>${esc(t('publish_date'))}</th><th>${esc(t('assignee'))}</th><th>${esc(t('updated_by'))}</th></tr></thead><tbody>${rows}</tbody></table>`
        : `<div class="empty">${esc(t('empty'))}</div>`}</div>`;
    bindTopbar();
    $$('tr[data-id]').forEach((tr) => tr.onclick = () => openEditor(state.items.find((x) => x.id === tr.dataset.id)));
    $('#btn-csv').onclick = exportCsv;
  }

  async function exportCsv() {
    const cols = ['title', 'type', 'platform', 'status', 'publishDate', 'assignee', 'tags', 'hook', 'cta', 'caption', 'hashtags', 'notes', 'updatedBy'];
    const q = (v) => '"' + String(v ?? '').replace(/"/g, '""') + '"';
    const lines = [cols.join(',')].concat(filtered().map((it) => [
      it.title, t(it.type), it.platform, t('st_' + it.status), it.publishDate, it.assignee, (it.tags || []).join('; '),
      it.type === 'video' ? it.video.hook : it.poster.headline, it.type === 'video' ? it.video.cta : it.poster.cta,
      it.caption, it.hashtags, it.notes, it.updatedBy
    ].map(q).join(',')));
    try { const p = await call(api.exportCsv, lines.join('\n')); if (p) toast(t('saved')); } catch (e) { toast(e.message, true); }
  }

  // ---------- AI ----------
  function aiSystem() {
    return `You are an expert social media content strategist, scriptwriter and creative director helping a content team plan videos and posters. Always write all text in ${AI_LANG[state.settings.language] || 'Bahasa Indonesia'}. Respond with ONLY valid JSON matching the requested shape. No markdown fences, no commentary.`;
  }
  function parseJSON(text) {
    const cleaned = String(text).replace(/```(?:json)?/gi, '').trim();
    try { return JSON.parse(cleaned); } catch (_) {}
    const s = cleaned.search(/[\[{]/);
    const e = Math.max(cleaned.lastIndexOf('}'), cleaned.lastIndexOf(']'));
    if (s >= 0 && e > s) return JSON.parse(cleaned.slice(s, e + 1));
    throw new Error('Invalid JSON from AI');
  }
  async function ai(prompt, maxTokens) {
    const s = state.settings;
    if (!s.ai.keys[s.ai.provider]) { toast(t('ai_no_key'), true); throw new Error('NO_KEY'); }
    const text = await call(api.aiGenerate, { system: aiSystem(), prompt, maxTokens });
    return parseJSON(text);
  }
  function itemContext(it) {
    const lines = [
      `Content type: ${it.type}`, `Platform: ${it.platform}`, `Title / idea: ${it.title || '-'}`,
      `Notes: ${it.notes || '-'}`, `Tags: ${(it.tags || []).join(', ') || '-'}`
    ];
    if (it.type === 'video') lines.push(`Aspect ratio: ${it.video.ratio}`, `Target duration: ${it.video.duration} seconds`, `Hook: ${it.video.hook || '-'}`, `CTA: ${it.video.cta || '-'}`,
      `Storyboard: ${it.video.scenes.map((s, i) => `${i + 1}. ${s.visual} / ${s.audio}`).join(' | ') || '-'}`);
    else lines.push(`Size: ${it.poster.size}`, `Goal: ${it.poster.purpose || '-'}`, `Audience: ${it.poster.audience || '-'}`, `Key message: ${it.poster.message || '-'}`, `Headline: ${it.poster.headline || '-'}`);
    return lines.join('\n');
  }
  async function withBusy(btn, fn) {
    const html = btn.innerHTML;
    btn.disabled = true; btn.innerHTML = `<span class="spinner"></span>${esc(t('ai_working'))}`;
    try { await fn(); }
    catch (e) { if (e.message !== 'NO_KEY') toast(t('ai_error') + e.message, true); }
    finally { btn.disabled = false; btn.innerHTML = html; }
  }
  function pickModal(options, render, onPick) {
    const m = modal(`<h2>${esc(t('ai_pick'))}</h2><div class="opt-list">${options.map((o, i) =>
      `<div class="opt"><div class="txt">${render(o)}</div><button class="btn sm accent" data-pick="${i}">${esc(t('ai_use'))}</button></div>`).join('')}</div>
      <div class="actions"><button class="btn" data-close>${esc(t('cancel'))}</button></div>`);
    $$('[data-pick]', m).forEach((b) => b.onclick = () => { onPick(options[+b.dataset.pick]); closeModal(); renderEditor(); });
  }

  const AI_ACTIONS = {
    async hooks() {
      const r = await ai(`${itemContext(state.draft)}\n\nWrite 5 different scroll-stopping hooks (first 3 seconds of the video) for this content. Shape: {"hooks": ["..."]}`);
      pickModal(r.hooks || [], (h) => esc(h), (h) => { state.draft.video.hook = h; });
    },
    async script() {
      const d = state.draft;
      const r = await ai(`${itemContext(d)}\n\nWrite a complete video script as a shot-by-shot storyboard. The sum of scene durations should be about ${d.video.duration} seconds. Each scene: "visual" (what is on screen / camera shot), "audio" (voice-over or dialogue), "duration" (seconds, number), "notes" (on-screen text, music, B-roll). Shape: {"hook": "...", "scenes": [{"visual":"","audio":"","duration":5,"notes":""}], "cta": "..."}`, 3000);
      if (d.video.scenes.length && !confirm(t('ai_replace_scenes'))) return;
      d.video.scenes = (r.scenes || []).map((s) => ({ id: uid(), visual: s.visual || '', audio: s.audio || '', duration: Number(s.duration) || 3, notes: s.notes || '' }));
      if (r.hook && !d.video.hook) d.video.hook = r.hook;
      if (r.cta && !d.video.cta) d.video.cta = r.cta;
      renderEditor();
    },
    async caption() {
      const r = await ai(`${itemContext(state.draft)}\n\nWrite 3 alternative captions suitable for ${state.draft.platform}, each with relevant hashtags (8-15, mix of broad and niche). Shape: {"options": [{"caption": "...", "hashtags": ["#..."]}]}`);
      pickModal(r.options || [], (o) => esc(o.caption) + '\n\n<span class="muted">' + esc((o.hashtags || []).join(' ')) + '</span>',
        (o) => { state.draft.caption = o.caption || ''; state.draft.hashtags = (o.hashtags || []).join(' '); });
    },
    async copy() {
      const r = await ai(`${itemContext(state.draft)}\n\nWrite 3 alternative copy options for this poster. Keep the headline short and punchy. Shape: {"options": [{"headline":"","subheadline":"","body":"","cta":""}]}`);
      pickModal(r.options || [], (o) => `<b>${esc(o.headline)}</b>\n${esc(o.subheadline)}\n<span class="muted">${esc(o.body)}</span>\n→ ${esc(o.cta)}`,
        (o) => { Object.assign(state.draft.poster, { headline: o.headline || '', subheadline: o.subheadline || '', body: o.body || '', cta: o.cta || '' }); });
    },
    async palette() {
      const r = await ai(`${itemContext(state.draft)}\n\nSuggest 3 color palettes (4-5 hex colors each) and a font pairing (free Google Fonts) for this poster, with a one-sentence reason. Shape: {"options": [{"colors":["#RRGGBB"],"fonts":"Heading: ..., Body: ...","reason":"..."}]}`);
      pickModal(r.options || [], (o) => `<div class="swatches">${(o.colors || []).map((c) => `<span style="width:34px;height:34px;border-radius:7px;background:${esc(c)};border:1px solid #0001;display:inline-block"></span>`).join('')}</div>\n<b>${esc(o.fonts)}</b>\n<span class="muted">${esc(o.reason)}</span>`,
        (o) => { state.draft.poster.colors = (o.colors || []).filter((c) => /^#[0-9a-f]{6}$/i.test(c)); state.draft.poster.fonts = o.fonts || ''; });
    }
  };

  // ---------- Editor ----------
  function openEditor(item, isNew) {
    state.draft = JSON.parse(JSON.stringify(normalize(item)));
    state.draftBase = isNew ? undefined : item.updatedAt;
    state.draftIsNew = !!isNew;
    state.tab = 'general';
    renderEditor();
  }
  function closeEditor() { state.draft = null; $('#drawer-root').innerHTML = ''; }

  function field(label, path, type = 'text', extra = '') {
    const v = getPath(state.draft, path) ?? '';
    if (type === 'textarea') return `<label class="field">${esc(label)}<textarea class="textarea" data-f="${path}" ${extra}>${esc(v)}</textarea></label>`;
    return `<label class="field">${esc(label)}<input class="input" type="${type}" data-f="${path}" value="${esc(v)}" ${extra}/></label>`;
  }
  function selectField(label, path, list) {
    return `<label class="field">${esc(label)}<select class="select" data-f="${path}">${opts(list, getPath(state.draft, path))}</select></label>`;
  }

  function tabGeneral() {
    const d = state.draft;
    return `<div class="stack">
      <div class="grid-3">
        ${selectField(t('status'), 'status', STATUSES.map((s) => ({ v: s, l: t('st_' + s) })))}
        ${selectField(t('platform'), 'platform', PLATFORMS)}
        ${field(t('publish_date'), 'publishDate', 'date')}
      </div>
      <div class="grid-2">
        <label class="field">${esc(t('assignee'))}<input class="input" data-f="assignee" list="dl-assignee" value="${esc(d.assignee)}"/>
          <datalist id="dl-assignee">${assignees().map((a) => `<option value="${esc(a)}">`).join('')}</datalist></label>
        <label class="field">${esc(t('tags'))} <span class="hint">${esc(t('tags_hint'))}</span><input class="input" data-tags value="${esc((d.tags || []).join(', '))}"/></label>
      </div>
      ${field(t('notes'), 'notes', 'textarea', 'rows="6"')}
    </div>`;
  }

  function aiBar(buttons) {
    return `<div class="ai-bar"><span class="lbl">${ICON.spark.replace('<svg', '<svg width="15" height="15"')}${esc(t('ai'))}</span>${buttons.map(([k, l]) => `<button class="btn ai sm" data-ai="${k}">${esc(t(l))}</button>`).join('')}</div>`;
  }

  function tabScript() {
    const v = state.draft.video;
    const total = v.scenes.reduce((a, s) => a + (Number(s.duration) || 0), 0);
    return `<div class="stack">
      ${aiBar([['hooks', 'ai_hooks'], ['script', 'ai_script']])}
      <div class="grid-2">
        ${selectField(t('ratio'), 'video.ratio', RATIOS)}
        ${field(t('duration') + ' (' + t('sec') + ')', 'video.duration', 'number', 'min="1"')}
      </div>
      ${field(t('hook'), 'video.hook', 'textarea', 'rows="2"')}
      <div>
        <div class="row" style="margin:6px 0 10px"><h3 class="section-title" style="margin:0">${esc(t('scenes'))}</h3><span class="muted">${esc(t('total_duration'))}: <b id="total-dur">${total}</b> ${esc(t('sec'))}</span><div class="spacer"></div><button class="btn sm" id="add-scene">${ICON.plus}${esc(t('add_scene'))}</button></div>
        ${v.scenes.length ? `<div class="scene-head"><span>#</span><span>${esc(t('visual'))}</span><span>${esc(t('audio'))}</span><span>${esc(t('sec'))}</span><span></span></div>` : ''}
        <div class="scenes">${v.scenes.map((s, i) => `
          <div class="scene">
            <div class="n">${i + 1}</div>
            <textarea class="textarea" data-f="video.scenes.${i}.visual" placeholder="${esc(t('visual'))}">${esc(s.visual)}</textarea>
            <textarea class="textarea" data-f="video.scenes.${i}.audio" placeholder="${esc(t('audio'))}">${esc(s.audio)}</textarea>
            <input class="input" type="number" min="0" data-f="video.scenes.${i}.duration" value="${esc(s.duration)}"/>
            <button class="x" data-rm-scene="${i}" title="${esc(t('delete'))}">×</button>
            <input class="input notes" data-f="video.scenes.${i}.notes" placeholder="${esc(t('scene_notes'))}" value="${esc(s.notes)}"/>
          </div>`).join('')}</div>
      </div>
      ${field(t('cta'), 'video.cta')}
    </div>`;
  }

  function tabBrief() {
    const p = state.draft.poster;
    const [w, h] = (p.size || '1080x1080').split('x').map(Number);
    const sc = 84 / Math.max(w, h);
    return `<div class="stack">
      ${aiBar([['copy', 'ai_copy'], ['palette', 'ai_palette']])}
      <div class="preview-frame">
        <div class="preview-box" style="width:${Math.round(w * sc)}px;height:${Math.round(h * sc)}px">${w}×${h}</div>
        <div style="flex:1">${selectField(t('size'), 'poster.size', SIZES)}</div>
      </div>
      <div class="grid-2">${field(t('purpose'), 'poster.purpose', 'textarea', 'rows="2"')}${field(t('audience'), 'poster.audience', 'textarea', 'rows="2"')}</div>
      ${field(t('key_message'), 'poster.message', 'textarea', 'rows="2"')}
      <div class="grid-2">${field(t('headline'), 'poster.headline')}${field(t('subheadline'), 'poster.subheadline')}</div>
      <div class="grid-2">${field(t('body_copy'), 'poster.body', 'textarea', 'rows="3"')}${field(t('cta'), 'poster.cta', 'textarea', 'rows="3"')}</div>
      <div><h3 class="section-title">${esc(t('colors'))}</h3><div class="swatches">
        ${p.colors.map((c, i) => `<div class="swatch"><input type="color" data-color="${i}" value="${esc(c)}"/><div class="hex">${esc(c.toUpperCase())}</div><button class="rm" data-rm-color="${i}">×</button></div>`).join('')}
        <button class="btn sm" id="add-color" style="height:48px">${ICON.plus}</button></div></div>
      ${field(t('fonts'), 'poster.fonts')}
      <div><h3 class="section-title">${esc(t('moodboard'))}</h3><div class="mood" id="mood">
        ${p.moodboard.map((m, i) => `<div class="img"><img data-asset="${esc(m)}" alt=""/><button class="rm" data-rm-img="${i}">×</button></div>`).join('')}
        <button class="addimg" id="add-img">${ICON.plus.replace('<svg', '<svg width="22" height="22"')}</button></div></div>
    </div>`;
  }

  function tabCaption() {
    return `<div class="stack">${aiBar([['caption', 'ai_caption']])}
      ${field(t('caption'), 'caption', 'textarea', 'rows="9"')}
      ${field(t('hashtags'), 'hashtags', 'textarea', 'rows="3"')}</div>`;
  }

  function renderEditor() {
    const d = state.draft;
    if (!d) return;
    const tabs = [['general', 'tab_general'], [d.type === 'video' ? 'script' : 'brief', d.type === 'video' ? 'tab_script' : 'tab_brief'], ['caption', 'tab_caption']];
    if (!tabs.some(([k]) => k === state.tab)) state.tab = 'general';
    const body = { general: tabGeneral, script: tabScript, brief: tabBrief, caption: tabCaption }[state.tab]();
    const scroll = $('.drawer-body')?.scrollTop || 0;
    $('#drawer-root').innerHTML = `<div class="overlay" id="ov"></div>
      <div class="drawer">
        <div class="drawer-head">
          <div class="row1"><span class="badge ${d.type}">${d.type === 'video' ? ICON.video.replace('<svg', '<svg width="13" height="13"') : ICON.poster.replace('<svg', '<svg width="13" height="13"')}${esc(t(d.type))}</span>
            <input class="title-input" data-f="title" placeholder="${esc(t('title'))}…" value="${esc(d.title)}"/>
            <button class="btn ghost sm" id="ed-close">${esc(t('close'))}</button></div>
          <div class="tabs">${tabs.map(([k, l]) => `<button class="tab ${state.tab === k ? 'on' : ''}" data-tab="${k}">${esc(t(l))}</button>`).join('')}</div>
        </div>
        <div class="drawer-body">${body}</div>
        <div class="drawer-foot">
          <span class="info">${d.updatedBy ? esc(t('updated_by')) + ' ' + esc(d.updatedBy) + ' · ' + esc(new Date(d.updatedAt).toLocaleString()) : ''}</span>
          ${state.draftIsNew ? '' : `<button class="btn danger" id="ed-del">${esc(t('delete'))}</button>`}
          <button class="btn" id="ed-pdf">${esc(t('export_pdf'))}</button>
          <button class="btn primary" id="ed-save">${esc(t('save'))}</button>
        </div>
      </div>`;
    $('.drawer-body').scrollTop = scroll;
    bindEditor();
  }

  function bindEditor() {
    const root = $('#drawer-root');
    const d = state.draft;
    $$('[data-f]', root).forEach((el) => {
      el.addEventListener('input', () => {
        let v = el.value;
        if (el.type === 'number') v = Number(v) || 0;
        setPath(d, el.dataset.f, v);
        if (el.dataset.f.includes('.duration') && el.dataset.f.startsWith('video.scenes')) {
          const tot = $('#total-dur'); if (tot) tot.textContent = d.video.scenes.reduce((a, s) => a + (Number(s.duration) || 0), 0);
        }
        if (el.dataset.f === 'poster.size') renderEditor();
      });
    });
    const tags = $('[data-tags]', root);
    if (tags) tags.oninput = () => { d.tags = tags.value.split(',').map((s) => s.trim()).filter(Boolean); };
    $$('[data-tab]', root).forEach((b) => b.onclick = () => { state.tab = b.dataset.tab; renderEditor(); $('.drawer-body').scrollTop = 0; });
    $$('[data-ai]', root).forEach((b) => b.onclick = () => withBusy(b, AI_ACTIONS[b.dataset.ai]));
    $('#ed-close').onclick = closeEditor;
    $('#ov').onclick = closeEditor;
    $('#ed-save').onclick = saveDraft;
    $('#ed-pdf').onclick = exportPdf;
    const del = $('#ed-del');
    if (del) del.onclick = async () => {
      if (!confirm(t('confirm_delete'))) return;
      try { await call(api.deleteItem, d.id); state.items = state.items.filter((x) => x.id !== d.id); closeEditor(); render(); }
      catch (e) { toast(e.message, true); }
    };
    // video
    const addScene = $('#add-scene');
    if (addScene) addScene.onclick = () => { d.video.scenes.push({ id: uid(), visual: '', audio: '', duration: 3, notes: '' }); renderEditor(); };
    $$('[data-rm-scene]', root).forEach((b) => b.onclick = () => { d.video.scenes.splice(+b.dataset.rmScene, 1); renderEditor(); });
    // poster
    $$('[data-color]', root).forEach((el) => el.oninput = () => { d.poster.colors[+el.dataset.color] = el.value; el.nextElementSibling.textContent = el.value.toUpperCase(); });
    $$('[data-rm-color]', root).forEach((b) => b.onclick = () => { d.poster.colors.splice(+b.dataset.rmColor, 1); renderEditor(); });
    const addColor = $('#add-color');
    if (addColor) addColor.onclick = () => { d.poster.colors.push('#cccccc'); renderEditor(); };
    const addImg = $('#add-img');
    if (addImg) addImg.onclick = async () => {
      try { const names = await call(api.addAssets); d.poster.moodboard.push(...names); renderEditor(); } catch (e) { toast(e.message, true); }
    };
    $$('[data-rm-img]', root).forEach((b) => b.onclick = () => { d.poster.moodboard.splice(+b.dataset.rmImg, 1); renderEditor(); });
    $$('img[data-asset]', root).forEach(async (img) => { try { img.src = await call(api.assetUrl, img.dataset.asset); } catch (_) {} });
    // shortcut simpan
    root.onkeydown = (e) => { if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') { e.preventDefault(); saveDraft(); } };
  }

  async function saveDraft(force) {
    const d = state.draft;
    try {
      const r = await persist(JSON.parse(JSON.stringify(d)), state.draftBase, force === true);
      if (r.conflict) {
        const m = modal(`<h2>⚠️</h2><p>${esc(t('conflict', { name: r.current.updatedBy || '?' }))}</p>
          <div class="actions"><button class="btn" id="c-reload">${esc(t('conflict_reload'))}</button><button class="btn primary" id="c-over">${esc(t('conflict_overwrite'))}</button></div>`);
        $('#c-over', m).onclick = () => { closeModal(); saveDraft(true); };
        $('#c-reload', m).onclick = () => { closeModal(); openEditor(r.current); };
        return;
      }
      state.draft = JSON.parse(JSON.stringify(r.item));
      state.draftBase = r.item.updatedAt;
      state.draftIsNew = false;
      toast(t('saved'));
      render();
      renderEditor();
    } catch (e) { toast(e.message, true); }
  }

  async function exportPdf() {
    const d = state.draft;
    const row = (k, v) => v ? `<tr><th>${esc(k)}</th><td>${esc(v).replace(/\n/g, '<br>')}</td></tr>` : '';
    let detail = '';
    if (d.type === 'video') {
      detail = `<table class="kv">${row(t('ratio'), d.video.ratio)}${row(t('duration'), d.video.duration + ' ' + t('sec'))}${row(t('hook'), d.video.hook)}${row(t('cta'), d.video.cta)}</table>
        <h2>${esc(t('scenes'))}</h2><table class="sb"><tr><th>#</th><th>${esc(t('visual'))}</th><th>${esc(t('audio'))}</th><th>${esc(t('sec'))}</th></tr>
        ${d.video.scenes.map((s, i) => `<tr><td>${i + 1}</td><td>${esc(s.visual)}${s.notes ? `<div class="n">${esc(s.notes)}</div>` : ''}</td><td>${esc(s.audio)}</td><td>${esc(s.duration)}</td></tr>`).join('')}</table>`;
    } else {
      const p = d.poster;
      detail = `<table class="kv">${row(t('size'), p.size)}${row(t('purpose'), p.purpose)}${row(t('audience'), p.audience)}${row(t('key_message'), p.message)}
        ${row(t('headline'), p.headline)}${row(t('subheadline'), p.subheadline)}${row(t('body_copy'), p.body)}${row(t('cta'), p.cta)}${row(t('fonts'), p.fonts)}</table>
        <h2>${esc(t('colors'))}</h2><div>${p.colors.map((c) => `<span class="sw"><i style="background:${esc(c)}"></i>${esc(c.toUpperCase())}</span>`).join('')}</div>`;
    }
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
      body{font-family:-apple-system,Segoe UI,Roboto,Arial,sans-serif;color:#1d1b20;padding:36px;font-size:12px}
      h1{font-size:22px;margin:0 0 4px} h2{font-size:14px;margin:22px 0 8px;text-transform:uppercase;letter-spacing:.04em;color:#48454e}
      .meta{color:#7a7680;margin-bottom:18px} table{border-collapse:collapse;width:100%} th,td{text-align:left;vertical-align:top;padding:7px 8px;border-bottom:1px solid #e8e5df}
      .kv th{width:28%;color:#48454e} .sb th{background:#f6f5f2} .n{color:#7a7680;margin-top:4px;font-size:11px}
      .sw{display:inline-flex;align-items:center;gap:6px;margin:0 12px 6px 0;font-family:monospace} .sw i{width:22px;height:22px;border-radius:5px;display:inline-block;border:1px solid #0002}
      .cap{white-space:pre-wrap;line-height:1.5}</style></head><body>
      <h1>${esc(d.title || t('untitled'))}</h1>
      <div class="meta">${esc(t(d.type))} · ${esc(d.platform)} · ${esc(t('st_' + d.status))} · ${esc(fmtDate(d.publishDate) || t('no_date'))} · ${esc(t('assignee'))}: ${esc(d.assignee || '—')}</div>
      ${d.notes ? `<div class="cap">${esc(d.notes)}</div>` : ''}
      ${detail}
      ${d.caption || d.hashtags ? `<h2>${esc(t('caption'))}</h2><div class="cap">${esc(d.caption)}</div><p style="color:#5b4cf0">${esc(d.hashtags)}</p>` : ''}
      </body></html>`;
    try { await call(api.exportPdf, html, (d.title || 'brief').replace(/[^\w\- ]+/g, '').slice(0, 60) || 'brief'); } catch (e) { toast(e.message, true); }
  }

  // ---------- Ide AI ----------
  function renderIdeas() {
    const f = state.ideasForm;
    const list = state.ideas.map((idea, i) => `<div class="idea-card">
      <div class="row"><span class="badge ${idea.type === 'poster' ? 'poster' : 'video'}">${esc(t(idea.type === 'poster' ? 'poster' : 'video'))}</span><span class="muted">${esc(idea.platform || '')}</span><div class="spacer"></div>
        <button class="btn sm ${idea._added ? '' : 'accent'}" data-add-idea="${i}" ${idea._added ? 'disabled' : ''}>${esc(idea._added ? t('added') : t('add_to_board'))}</button></div>
      <div class="ttl">${esc(idea.title)}</div>
      ${idea.hook ? `<div class="hook">“${esc(idea.hook)}”</div>` : ''}
      ${idea.angle ? `<div class="muted">${esc(t('angle'))}: ${esc(idea.angle)}</div>` : ''}
    </div>`).join('');
    $('#main').innerHTML = topbar(t('nav_ideas'), '', false) + `<div class="content"><div class="ideas-wrap">
      <div class="panel stack">
        <div><h2>${esc(t('ideas_title'))}</h2><p class="sub" style="margin:0">${esc(t('ideas_sub'))}</p></div>
        <label class="field">${esc(t('niche'))}<textarea class="textarea" id="i-niche" rows="3" placeholder="${esc(t('niche_ph'))}">${esc(f.niche)}</textarea></label>
        <label class="field">${esc(t('audience'))}<input class="input" id="i-aud" value="${esc(f.audience)}"/></label>
        <div class="grid-2">
          <label class="field">${esc(t('type'))}<select class="select" id="i-type">${opts([{ v: 'video', l: t('video') }, { v: 'poster', l: t('poster') }, { v: 'mix', l: t('video') + ' + ' + t('poster') }], f.type)}</select></label>
          <label class="field">${esc(t('platform'))}<select class="select" id="i-plat">${opts(PLATFORMS, f.platform)}</select></label>
        </div>
        <div class="grid-2">
          <label class="field">${esc(t('tone'))}<input class="input" id="i-tone" placeholder="${esc(t('tone_ph'))}" value="${esc(f.tone)}"/></label>
          <label class="field">${esc(t('count'))}<input class="input" id="i-count" type="number" min="1" max="20" value="${esc(f.count)}"/></label>
        </div>
        <button class="btn accent" id="i-go">${ICON.spark}${esc(t('generate'))}</button>
      </div>
      <div class="ideas-list">${list || `<div class="empty">${ICON.spark.replace('<svg', '<svg width="34" height="34"')}<p>${esc(t('ideas_sub'))}</p></div>`}</div>
    </div></div>`;
    bindTopbar();
    const sync = () => Object.assign(f, { niche: $('#i-niche').value, audience: $('#i-aud').value, type: $('#i-type').value, platform: $('#i-plat').value, tone: $('#i-tone').value, count: Number($('#i-count').value) || 6 });
    $$('#i-niche,#i-aud,#i-type,#i-plat,#i-tone,#i-count').forEach((el) => el.addEventListener('input', sync));
    $('#i-go').onclick = (e) => withBusy(e.currentTarget, async () => {
      sync();
      const typeTxt = f.type === 'mix' ? 'a mix of short videos and posters' : f.type === 'poster' ? 'posters / static graphics' : 'short videos';
      const r = await ai(`Brand / topic / niche: ${f.niche || '-'}\nTarget audience: ${f.audience || '-'}\nMain platform: ${f.platform}\nTone: ${f.tone || '-'}\n\nGenerate ${f.count} fresh, specific, non-generic content ideas as ${typeTxt}. For each: "title" (working title), "hook" (opening line or visual hook), "angle" (why it works / the content pillar), "type" ("video" or "poster"), "platform". Shape: {"ideas": [{"title":"","hook":"","angle":"","type":"video","platform":""}]}`, 3000);
      state.ideas = (r.ideas || []).map((x) => ({ ...x, type: x.type === 'poster' ? 'poster' : 'video', platform: PLATFORMS.includes(x.platform) ? x.platform : f.platform }));
      renderIdeas();
    });
    $$('[data-add-idea]').forEach((b) => b.onclick = async () => {
      const idea = state.ideas[+b.dataset.addIdea];
      const it = newItem(idea.type);
      it.title = idea.title; it.platform = idea.platform;
      it.notes = [idea.angle && t('angle') + ': ' + idea.angle].filter(Boolean).join('\n');
      if (idea.type === 'video') it.video.hook = idea.hook || ''; else it.poster.headline = idea.hook || '';
      try { await persist(it); idea._added = true; toast(t('added')); render(); } catch (e) { toast(e.message, true); }
    });
  }

  // ---------- Pengaturan ----------
  function renderSettings() {
    const s = state.settings;
    const prov = [['anthropic', 'Claude', 'Anthropic'], ['openai', 'ChatGPT', 'OpenAI'], ['gemini', 'Gemini', 'Google']];
    $('#main').innerHTML = topbar(t('nav_settings'), '', false) + `<div class="content"><div class="settings-wrap">
      <div class="panel stack"><h2>${esc(t('set_profile'))}</h2>
        <div class="grid-2">
          <label class="field">${esc(t('your_name'))}<input class="input" id="s-name" value="${esc(s.userName)}"/><span class="hint">${esc(t('your_name_hint'))}</span></label>
          <label class="field">${esc(t('set_language'))}<select class="select" id="s-lang">${Object.keys(window.I18N).map((k) => `<option value="${k}" ${k === s.language ? 'selected' : ''}>${esc(window.I18N[k].langName)}</option>`).join('')}</select></label>
        </div></div>
      <div class="panel"><h2>${esc(t('set_folder'))}</h2><p class="sub">${esc(t('folder_hint'))}</p>
        <div class="row"><div class="input" style="flex:1;color:${s.dataFolder ? 'inherit' : 'var(--muted)'};overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(s.dataFolder || t('no_folder'))}</div>
        <button class="btn" id="s-folder">${ICON.folder}${esc(t('choose_folder'))}</button>${s.dataFolder ? `<button class="btn ghost" id="s-open">${esc(t('open_folder'))}</button>` : ''}</div></div>
      <div class="panel stack"><div><h2>${esc(t('set_ai'))}</h2><p class="sub" style="margin:0">${esc(t('key_hint'))}</p></div>
        <div class="provider-opts">${prov.map(([k, n, c]) => `<div class="provider-opt ${s.ai.provider === k ? 'on' : ''}" data-prov="${k}"><b>${n}</b><small>${c}${s.ai.keys[k] ? ' · ✓' : ''}</small></div>`).join('')}</div>
        <div class="grid-2">
          <label class="field">${esc(t('api_key'))}<input class="input" type="password" id="s-key" value="${esc(s.ai.keys[s.ai.provider])}" placeholder="••••••••"/>
            <a class="hint" href="${KEY_LINKS[s.ai.provider]}" target="_blank">${esc(t('get_key'))} ↗</a></label>
          <label class="field">${esc(t('model'))}<input class="input" id="s-model" value="${esc(s.ai.models[s.ai.provider])}"/></label>
        </div></div>
      <div class="row"><button class="btn primary" id="s-save">${esc(t('save'))}</button></div>
    </div></div>`;
    bindTopbar();
    const draft = JSON.parse(JSON.stringify(s));
    const pull = () => {
      draft.userName = $('#s-name').value.trim();
      draft.ai.keys[draft.ai.provider] = $('#s-key').value.trim();
      draft.ai.models[draft.ai.provider] = $('#s-model').value.trim();
    };
    $$('[data-prov]').forEach((el) => el.onclick = () => {
      pull(); draft.ai.provider = el.dataset.prov;
      $$('[data-prov]').forEach((x) => x.classList.toggle('on', x === el));
      $('#s-key').value = draft.ai.keys[draft.ai.provider];
      $('#s-model').value = draft.ai.models[draft.ai.provider];
      $('#s-key').nextElementSibling.href = KEY_LINKS[draft.ai.provider];
    });
    $('#s-folder').onclick = async () => {
      const p = await call(api.chooseFolder);
      if (p) { pull(); draft.dataFolder = p; await saveSettings(draft); await loadItems(); render(); }
    };
    const open = $('#s-open'); if (open) open.onclick = () => call(api.openFolder);
    $('#s-lang').onchange = async (e) => { pull(); draft.language = e.target.value; await saveSettings(draft); render(); };
    $('#s-save').onclick = async () => { pull(); await saveSettings(draft); toast(t('settings_saved')); render(); };
  }
  async function saveSettings(s) {
    try { state.settings = await call(api.setSettings, s); } catch (e) { toast(e.message, true); }
  }

  // ---------- Modal ----------
  function modal(html) {
    $('#modal-root').innerHTML = `<div class="modal-overlay"></div><div class="modal">${html}</div>`;
    const m = $('.modal', $('#modal-root'));
    $('.modal-overlay').onclick = closeModal;
    $$('[data-close]', m).forEach((b) => b.onclick = closeModal);
    return m;
  }
  function closeModal() { $('#modal-root').innerHTML = ''; }

  function welcome() {
    const s = state.settings;
    const m = modal(`<h2>${esc(t('welcome_title'))}</h2><p class="muted">${esc(t('welcome_sub'))}</p>
      <div class="stack" style="margin-top:14px">
        <label class="field">${esc(t('set_language'))}<select class="select" id="w-lang">${Object.keys(window.I18N).map((k) => `<option value="${k}" ${k === s.language ? 'selected' : ''}>${esc(window.I18N[k].langName)}</option>`).join('')}</select></label>
        <label class="field">${esc(t('your_name'))}<input class="input" id="w-name" value="${esc(s.userName)}"/></label>
        <label class="field">${esc(t('set_folder'))}<span class="hint">${esc(t('folder_hint'))}</span>
          <div class="row"><div class="input" id="w-path" style="flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(s.dataFolder || t('no_folder'))}</div><button class="btn" id="w-folder">${ICON.folder}${esc(t('choose_folder'))}</button></div></label>
      </div>
      <div class="actions"><button class="btn primary" id="w-start">${esc(t('start'))}</button></div>`);
    $('.modal-overlay').onclick = null;
    let folder = s.dataFolder;
    $('#w-lang', m).onchange = async (e) => { await saveSettings({ ...state.settings, language: e.target.value, userName: $('#w-name').value }); welcome(); render(); };
    $('#w-folder', m).onclick = async () => { const p = await call(api.chooseFolder); if (p) { folder = p; $('#w-path').textContent = p; } };
    $('#w-start', m).onclick = async () => {
      const name = $('#w-name').value.trim();
      if (!name) { $('#w-name').focus(); return; }
      if (!folder) { $('#w-folder').focus(); return; }
      await saveSettings({ ...state.settings, userName: name, dataFolder: folder });
      closeModal(); await loadItems(); render();
    };
  }

  // ---------- Start ----------
  async function init() {
    state.settings = await call(api.getSettings);
    await loadItems();
    render();
    if (!state.settings.dataFolder || !state.settings.userName) welcome();
    api.onItemsChanged(async () => {
      const before = JSON.stringify(state.items.map((i) => i.updatedAt));
      await loadItems();
      if (JSON.stringify(state.items.map((i) => i.updatedAt)) !== before) {
        if (!$('#modal-root').innerHTML) render();
        if (!state.draft) toast(t('synced'));
      }
    });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') { if ($('#modal-root').innerHTML) closeModal(); else if (state.draft) closeEditor(); } });
  }
  init();
})();
