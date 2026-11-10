/* KontenPlan - renderer */
(() => {
  const api = window.api;
  const $ = (sel, el = document) => el.querySelector(sel);
  const $$ = (sel, el = document) => [...el.querySelectorAll(sel)];

  // ---------- Tema (diterapkan sedini mungkin supaya tidak berkedip) ----------
  const THEME_KEY = 'kontenplan-theme';
  const SEEN_KEY = 'kontenplan-seen';
  function applyTheme(th) {
    const v = th === 'dark' ? 'dark' : 'light';
    document.documentElement.dataset.theme = v;
    try { localStorage.setItem(THEME_KEY, v); } catch (_) {}
  }
  const currentTheme = () => document.documentElement.dataset.theme || 'light';
  try { applyTheme(localStorage.getItem(THEME_KEY) || 'light'); } catch (_) { applyTheme('light'); }

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
  const CONTENT_VIEWS = ['dashboard', 'calendar', 'board', 'list'];

  const ICON = {
    grid: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><rect x="3.5" y="3.5" width="7" height="7" rx="2"/><rect x="13.5" y="3.5" width="7" height="7" rx="3.5"/><rect x="3.5" y="13.5" width="7" height="7" rx="2"/><rect x="13.5" y="13.5" width="7" height="7" rx="2"/></svg>',
    calendar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4.5" width="18" height="16" rx="3"/><path d="M3 9.5h18M8 3v3M16 3v3"/></svg>',
    board: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="5" height="16" rx="1.5"/><rect x="10" y="4" width="5" height="11" rx="1.5"/><rect x="17" y="4" width="4" height="7" rx="1.5"/></svg>',
    list: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M9 6h12M9 12h12M9 18h12M4 6h.01M4 12h.01M4 18h.01"/></svg>',
    spark: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z"/><path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z"/></svg>',
    gear: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></svg>',
    plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
    video: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2.5" y="5.5" width="14" height="13" rx="2.5"/><path d="M16.5 10l5-3v10l-5-3z"/></svg>',
    poster: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2.5" width="16" height="19" rx="2"/><circle cx="9.5" cy="8.5" r="2"/><path d="M20 15l-4.5-4.5L6 20"/></svg>',
    left: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>',
    right: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>',
    folder: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>',
    bell: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 16v-5a6 6 0 1 1 12 0v5l1.5 2h-15z"/><path d="M10 20.5a2.2 2.2 0 0 0 4 0"/></svg>',
    sun: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4"/></svg>',
    moon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/></svg>',
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="6.5"/><path d="M20 20l-4-4"/></svg>',
    download: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4v11M7 10.5l5 5 5-5M5 20h14"/></svg>',
    dots: '<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="1.8"/><circle cx="12" cy="12" r="1.8"/><circle cx="19" cy="12" r="1.8"/></svg>',
    dotsV: '<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="1.8"/><circle cx="12" cy="12" r="1.8"/><circle cx="12" cy="19" r="1.8"/></svg>',
    edit: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20h4L19 9a2.8 2.8 0 0 0-4-4L4 16z"/><path d="M13.5 6.5l4 4"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
    share: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 4h6v6M20 4l-9 9"/><path d="M18 14v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4"/></svg>'
  };

  // Ilustrasi garis (warna mengikuti tema lewat kelas .p/.s/.b/.k/.c/.t di styles.css)
  const SV = '<svg class="illu" viewBox="0 0 140 100" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">';
  const ILLU = {
    video: SV + `
      <g transform="rotate(10 104 44)"><rect class="s" x="82" y="16" width="44" height="56" rx="6"/><path d="M90 16v56M118 16v56M84 26h4M84 36h4M84 46h4M84 56h4M120 26h4M120 36h4M120 46h4M120 56h4"/></g>
      <rect class="p" x="22" y="42" width="72" height="48" rx="7"/>
      <path class="k" d="M20 40.5l68.5-14 2.6 11.6L22.6 52z"/>
      <path class="p" stroke="none" d="M30.3 38.4l6.8-1.4-2.9 12.6-6.8 1.4zM50.8 34.2l6.9-1.4-2.9 12.7-6.8 1.4zM71.4 30l6.8-1.4-2.9 12.7-6.8 1.4z"/>
      <circle class="b" cx="58" cy="68" r="12"/><path class="p" stroke="none" d="M54 62v12l10-6z"/>
      <path d="M32 82h10"/>
      <path class="b" stroke="none" d="M120 80l2 5 5 2-5 2-2 5-2-5-5-2 5-2z"/><circle class="s" cx="12" cy="24" r="4" stroke="none"/></svg>`,
    poster: SV + `
      <path d="M8 13c30 11 94 11 124 0"/>
      <g transform="rotate(9 96 50)"><rect class="s" x="74" y="18" width="44" height="62" rx="5"/><path d="M82 66h28M82 72h18"/></g>
      <g transform="rotate(-7 52 54)"><rect class="p" x="28" y="20" width="50" height="68" rx="5"/><rect class="s" x="34" y="27" width="38" height="30" rx="3" stroke="none"/>
        <circle class="c" cx="62" cy="35" r="5" stroke="none"/><path d="M35 55l11-12 8 8 6-5 11 9M36 66h30M36 73h20"/><rect class="b" x="36" y="78" width="16" height="5" rx="2.5" stroke="none"/></g>
      <rect class="k" x="47" y="14" width="6" height="11" rx="2" transform="rotate(-7 50 19)"/><rect class="k" x="93" y="13" width="6" height="11" rx="2" transform="rotate(9 96 18)"/>
      <circle class="p" cx="114" cy="82" r="10"/><path d="M109.5 82l3 3 6-6"/></svg>`,
    ai: SV + `
      <rect class="p" x="70" y="24" width="56" height="40" rx="7"/><path d="M80 36h26M80 44h36M80 52h18"/>
      <path class="s" d="M44 18a22 22 0 0 0-13 39.7c2.6 2 4 4.6 4 7.3v3h18v-3c0-2.7 1.4-5.3 4-7.3A22 22 0 0 0 44 18z"/>
      <path d="M38 53l3-8 3 5 3-5 3 8"/><rect class="k" x="35" y="70" width="18" height="8" rx="3"/><path d="M39 83h10M44 6v5M19 17l3.5 3.5M69 17l-3.5 3.5M10 40h5"/>
      <rect class="b" x="82" y="70" width="40" height="18" rx="9" stroke="none"/><circle class="p" cx="93" cy="79" r="2" stroke="none"/><circle class="p" cx="102" cy="79" r="2" stroke="none"/><circle class="p" cx="111" cy="79" r="2" stroke="none"/>
      <path class="b" stroke="none" d="M122 6l1.8 4.6 4.6 1.8-4.6 1.8L122 19l-1.8-4.6-4.6-1.8 4.6-1.8z"/></svg>`,
    wand: SV + `
      <rect class="wf" x="34" y="14" width="50" height="64" rx="8"/><path d="M44 28h22M44 37h30M44 46h26M44 55h16"/>
      <path d="M74 90l32-37" stroke-width="5"/><path class="w" stroke="none" d="M112 24l3 7.5 7.5 3-7.5 3-3 7.5-3-7.5-7.5-3 7.5-3z"/>
      <path d="M20 26v9M15.5 30.5h9M126 62v7M122.5 65.5h7"/><circle class="w" cx="96" cy="14" r="2.5" stroke="none"/><circle cx="24" cy="76" r="3"/></svg>`
  };

  // ---------- State ----------
  const state = {
    settings: null,
    items: [],
    view: 'dashboard',
    filters: { type: 'all', platform: 'all', assignee: 'all', q: '' },
    month: startOfMonth(new Date()),
    dashDay: '',
    bellOpen: false,
    lastSeen: (() => { try { return localStorage.getItem(SEEN_KEY) || ''; } catch (_) { return ''; } })(),
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
  function parseYmd(s) { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); }
  function addDays(d, n) { return new Date(d.getFullYear(), d.getMonth(), d.getDate() + n); }
  function fmtDate(s) {
    if (!s) return '';
    const [y, m, d] = s.split('-').map(Number);
    return d + ' ' + L().months[m - 1].slice(0, 3) + ' ' + y;
  }
  function fmtShort(s) { const d = parseYmd(s); return d.getDate() + ' ' + L().months[d.getMonth()].slice(0, 3); }
  function fmtDay(s) { return L().days[parseYmd(s).getDay()] + ', ' + fmtShort(s); }
  function dueInfo(s) {
    if (!s) return { label: t('no_date'), cls: '' };
    const today = ymd(new Date());
    if (s < today) return { label: t('overdue'), cls: 'late' };
    if (s === today) return { label: t('today'), cls: 'today' };
    if (s === ymd(addDays(new Date(), 1))) return { label: t('tomorrow'), cls: '' };
    return { label: fmtShort(s), cls: '' };
  }
  function ago(iso) {
    if (!iso) return '';
    const diff = (Date.parse(iso) - Date.now()) / 1000;
    const units = [['year', 31536000], ['month', 2592000], ['week', 604800], ['day', 86400], ['hour', 3600], ['minute', 60]];
    try {
      const rtf = new Intl.RelativeTimeFormat(state.settings.language, { numeric: 'auto' });
      for (const [u, sec] of units) if (Math.abs(diff) >= sec) return rtf.format(Math.round(diff / sec), u);
      return rtf.format(0, 'second');
    } catch (_) { return new Date(iso).toLocaleString(); }
  }
  const progress = (st) => Math.round(Math.max(0, STATUSES.indexOf(st)) / (STATUSES.length - 1) * 100);
  const nextStatus = (st) => STATUSES[Math.min(STATUSES.indexOf(st) + 1, STATUSES.length - 1)];
  function initials(name) {
    return (name || '?').trim().split(/\s+/).slice(0, 2).map((w) => w[0]).join('').toUpperCase() || '?';
  }
  function hue(name) { let h = 0; for (const c of String(name || '?')) h = (h * 31 + c.charCodeAt(0)) % 360; return h; }
  function avatar(name, cls = '') {
    return `<span class="avatar ${cls}" style="--h:${hue(name)}" title="${esc(name || t('unassigned'))}">${esc(initials(name))}</span>`;
  }
  function avatarStack(names, max = 3) { return `<span class="avatars">${names.slice(0, max).map((n) => avatar(n)).join('')}</span>`; }
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
  const typeIcon = (type) => (type === 'video' ? ICON.video : ICON.poster);

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

  // typeAndQueryOnly: dashboard hanya memakai filter jenis + pencarian
  function filtered(typeAndQueryOnly) {
    const f = state.filters;
    const q = f.q.trim().toLowerCase();
    return state.items.filter((it) =>
      (f.type === 'all' || it.type === f.type) &&
      (typeAndQueryOnly || f.platform === 'all' || it.platform === f.platform) &&
      (typeAndQueryOnly || f.assignee === 'all' || (it.assignee || '') === f.assignee) &&
      (!q || [it.title, it.notes, (it.tags || []).join(' '), it.caption].join(' ').toLowerCase().includes(q))
    );
  }
  const assignees = () => [...new Set(state.items.map((i) => i.assignee).filter(Boolean))].sort();
  const team = () => [...new Set([state.settings.userName, ...assignees()].filter(Boolean))];

  // ---------- Notifikasi / aktivitas ----------
  function isUnread(it) {
    const me = state.settings.userName || '';
    return !!it.updatedAt && !!it.updatedBy && it.updatedBy !== me && it.updatedAt > state.lastSeen;
  }
  function markSeen() {
    state.lastSeen = new Date().toISOString();
    try { localStorage.setItem(SEEN_KEY, state.lastSeen); } catch (_) {}
  }
  const byRecent = (list) => list.filter((i) => i.updatedAt).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));

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

  // ---------- Render: kerangka ----------
  function render() {
    document.documentElement.lang = state.settings.language;
    renderSidebar();
    renderTopbar();
    renderView();
  }
  function renderView() {
    const v = state.view;
    if (v === 'dashboard') renderDashboard();
    else if (v === 'calendar') renderCalendar();
    else if (v === 'board') renderBoard();
    else if (v === 'list') renderList();
    else if (v === 'ideas') renderIdeas();
    else if (v === 'settings') renderSettings();
  }
  function go(view) {
    state.view = view;
    state.bellOpen = false;
    render();
    $('#shell').scrollTop = 0;
  }

  const NAV = [
    ['dashboard', 'nav_dashboard', ICON.grid],
    ['calendar', 'nav_calendar', ICON.calendar],
    ['board', 'nav_board', ICON.board],
    ['list', 'nav_list', ICON.list],
    ['ideas', 'nav_ideas', ICON.spark, 'AI']
  ];
  function renderSidebar() {
    const s = state.settings;
    const folderName = s.dataFolder ? s.dataFolder.split(/[\\/]/).filter(Boolean).pop() : t('no_folder');
    const btn = (k, label, ic, badge) => `<button class="rail-btn ${state.view === k ? 'active' : ''}" data-nav="${k}" data-tip="${esc(t(label))}" aria-label="${esc(t(label))}">${ic}${badge ? `<span class="rail-badge">${badge}</span>` : ''}</button>`;
    $('#sidebar').innerHTML = `
      <div class="logo" title="KontenPlan">K</div>
      <nav class="rail">
        ${NAV.map(([k, l, ic, b]) => btn(k, l, ic, b)).join('')}
        <span class="rail-sep"></span>
        ${btn('settings', 'nav_settings', ICON.gear)}
      </nav>
      <div class="side-foot">
        <button class="me avatar lg" style="--h:${hue(s.userName)}" data-nav="settings" title="${esc((s.userName || '—') + ' · ' + folderName + ' · ' + t('items_count', { n: state.items.length }))}">${esc(initials(s.userName))}<span class="sync" style="background:${s.dataFolder ? 'var(--ok)' : 'var(--warn)'}"></span></button>
      </div>`;
    $$('[data-nav]', $('#sidebar')).forEach((b) => b.onclick = () => go(b.dataset.nav));
  }

  function renderTopbar() {
    const v = state.view;
    const f = state.filters;
    const th = currentTheme();
    const left = CONTENT_VIEWS.includes(v)
      ? `<nav class="ttabs">${[['all', ICON.grid, t('all')], ['video', ICON.video, t('video')], ['poster', ICON.poster, t('poster')]]
        .map(([k, ic, l]) => `<button class="ttab ${f.type === k ? 'on' : ''}" data-type-tab="${k}">${ic}${esc(l)}</button>`).join('')}</nav>`
      : `<nav class="ttabs"><span class="ttab on">${v === 'ideas' ? ICON.spark : ICON.gear}${esc(t('nav_' + v))}</span></nav>`;
    const unread = state.items.some(isUnread);
    $('#topbar').innerHTML = `<div class="topbar">
      ${left}
      <label class="search">${ICON.search}<input id="f-q" placeholder="${esc(t('search'))}" value="${esc(f.q)}" /></label>
      <div class="spacer"></div>
      <div class="theme-switch" role="group" aria-label="Theme">
        <button data-theme-set="light" class="${th === 'light' ? 'on' : ''}" title="${esc(t('theme_light'))}">${ICON.sun}<span>${esc(t('theme_light'))}</span></button>
        <button data-theme-set="dark" class="${th === 'dark' ? 'on' : ''}" title="${esc(t('theme_dark'))}">${ICON.moon}<span>${esc(t('theme_dark'))}</span></button>
      </div>
      <div class="bell-wrap"><button class="icon-btn" id="btn-bell" title="${esc(t('notifications'))}" aria-label="${esc(t('notifications'))}">${ICON.bell}${unread ? '<span class="ping"></span>' : ''}</button>${state.bellOpen ? bellPopover() : ''}</div>
      <button class="icon-btn" data-nav="settings" title="${esc(t('nav_settings'))}" aria-label="${esc(t('nav_settings'))}">${ICON.gear}</button>
      <button class="export-pill" id="btn-export" title="${esc(t('export_csv'))}">${ICON.download}<span>${esc(t('export_data'))}</span><b>csv</b></button>
      <button class="btn primary" id="btn-new">${ICON.plus}${esc(t('new_content'))}</button>
    </div>`;
    const top = $('#topbar');
    const q = $('#f-q', top);
    q.oninput = () => {
      state.filters.q = q.value;
      if (CONTENT_VIEWS.includes(state.view)) { renderView(); return; }
      state.view = 'list';
      render();
      const nq = $('#f-q'); nq.focus(); nq.setSelectionRange(nq.value.length, nq.value.length);
    };
    $$('[data-type-tab]', top).forEach((b) => b.onclick = () => { state.filters.type = b.dataset.typeTab; renderTopbar(); renderView(); });
    $$('[data-theme-set]', top).forEach((b) => b.onclick = () => setTheme(b.dataset.themeSet));
    $$('[data-nav]', top).forEach((b) => b.onclick = () => go(b.dataset.nav));
    $('#btn-bell', top).onclick = () => { state.bellOpen = !state.bellOpen; renderTopbar(); };
    $('#btn-export', top).onclick = exportCsv;
    $('#btn-new', top).onclick = () => chooseNew();
    const read = $('#pop-read', top);
    if (read) read.onclick = () => { markSeen(); renderTopbar(); if (state.view === 'dashboard') renderView(); };
    $$('.pop [data-open]', top).forEach((el) => el.onclick = () => {
      const it = state.items.find((x) => x.id === el.dataset.open);
      state.bellOpen = false; renderTopbar();
      if (it) openEditor(it);
    });
  }

  function bellPopover() {
    const list = byRecent([...state.items]).slice(0, 8);
    return `<div class="pop">
      <div class="pop-head"><b>${esc(t('notifications'))}</b><div class="spacer"></div><button class="link-btn" id="pop-read">${ICON.check}${esc(t('mark_all_read'))}</button></div>
      <div class="pop-list">${list.length ? list.map((it) => `<button class="pop-item ${isUnread(it) ? 'unread' : ''}" data-open="${esc(it.id)}">${avatar(it.updatedBy)}
        <span class="txt"><b>${esc(it.updatedBy || '—')}</b> ${esc(t('edited'))} <b>${esc(it.title || t('untitled'))}</b><small>${esc(ago(it.updatedAt))} · ${esc(t('st_' + it.status))}</small></span>
        ${isUnread(it) ? '<i class="dot-new"></i>' : ''}</button>`).join('') : `<div class="empty sm">${esc(t('no_activity'))}</div>`}</div>
    </div>`;
  }

  function setTheme(th) {
    applyTheme(th);
    renderTopbar();
    saveSettings({ ...state.settings, theme: currentTheme() });
  }

  function pageHead(title, sub, right = '') {
    return `<div class="page-head"><div><h1>${esc(title)}</h1>${sub ? `<p>${esc(sub)}</p>` : ''}</div><div class="spacer"></div><div class="row">${right}</div></div>`;
  }
  function filterBar() {
    const f = state.filters;
    return `<select class="pill-select" id="f-platform" aria-label="${esc(t('platform'))}">${opts([{ v: 'all', l: t('platform') + ': ' + t('all') }, ...PLATFORMS], f.platform)}</select>
      <select class="pill-select" id="f-assignee" aria-label="${esc(t('assignee'))}">${opts([{ v: 'all', l: t('assignee') + ': ' + t('all') }, ...assignees()], f.assignee)}</select>`;
  }
  function bindFilterBar() {
    const p = $('#f-platform');
    if (p) p.onchange = (e) => { state.filters.platform = e.target.value; renderView(); };
    const a = $('#f-assignee');
    if (a) a.onchange = (e) => { state.filters.assignee = e.target.value; renderView(); };
  }

  function chooseNew(date) {
    const m = modal(`
      <h2>${esc(t('new_content'))}</h2>
      <div class="new-choice">
        <button data-type="video">${ILLU.video}${esc(t('new_video'))}<small>${esc(t('tab_script'))}</small></button>
        <button data-type="poster">${ILLU.poster}${esc(t('new_poster'))}<small>${esc(t('tab_brief'))}</small></button>
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

  // ---------- Dashboard ----------
  function ring(pct, color) {
    const r = 24;
    const c = 2 * Math.PI * r;
    return `<svg class="ring" viewBox="0 0 60 60" style="--rc:${color}" aria-hidden="true"><circle class="trk" cx="30" cy="30" r="${r}"/>
      ${pct > 0 ? `<circle class="val" cx="30" cy="30" r="${r}" stroke-dasharray="${c.toFixed(2)}" stroke-dashoffset="${(c * (1 - pct / 100)).toFixed(2)}" transform="rotate(-90 30 30)"/>` : ''}
      <text x="30" y="34.5" text-anchor="middle">${pct}%</text></svg>`;
  }

  function renderDashboard() {
    const s = state.settings;
    const me = s.userName || '';
    const items = filtered(true);
    const todayS = ymd(new Date());
    const people = team();
    const firstName = me.split(/\s+/)[0];

    // Baris 1: sapaan + aksi cepat
    const hero = `<section class="hero">
        <h1>${esc(firstName ? t('hello', { name: firstName }) : t('hello_anon'))}${people.length ? avatarStack(people, 3) : ''}<br>${esc(t('hero_q'))}</h1>
        <p>${esc(t('hero_sub'))}</p>
      </section>
      <button class="tile-add" id="d-new" title="${esc(t('new_content'))}" aria-label="${esc(t('new_content'))}"><span>${ICON.plus}</span></button>
      <button class="feat" data-feat="video">${ILLU.video}<b>${esc(t('feat_video_t'))}</b><small>${esc(t('feat_video_s'))}</small></button>
      <button class="feat" data-feat="poster">${ILLU.poster}<b>${esc(t('feat_poster_t'))}</b><small>${esc(t('feat_poster_s'))}</small></button>
      <button class="feat" data-feat="ai">${ILLU.ai}<b>${esc(t('feat_ai_t'))}</b><small>${esc(t('feat_ai_s'))}</small></button>`;

    // Aktivitas tim
    const acts = byRecent(items).slice(0, 2);
    const actHtml = acts.length ? acts.map((it, i) => {
      const id = esc(it.id);
      const body = `<div class="act-title"><b>${esc(it.title || t('untitled'))}</b>${isUnread(it) ? '<i class="dot-new"></i>' : ''}</div>
        <div class="act-sub">${esc(t('updated_by'))} ${esc(it.updatedBy || '—')} · ${esc(ago(it.updatedAt))}</div>`;
      if (i === 0) {
        return `<div class="act-lead">
          <div class="act-actions"><button data-open="${id}" title="${esc(t('open'))}" aria-label="${esc(t('open'))}">${ICON.edit}</button><button data-read title="${esc(t('mark_read'))}" aria-label="${esc(t('mark_read'))}">${ICON.check}</button></div>
          <div class="act pop-card" data-open="${id}">${body}
            <div class="act-meta"><span>${ICON.calendar}${esc(it.publishDate ? fmtDay(it.publishDate) : t('no_date'))}</span><span class="st-${it.status}"><i class="st-dot"></i>${esc(t('st_' + it.status))}</span></div></div>
        </div>`;
      }
      const quote = String(it.notes || it.caption || (it.type === 'video' ? it.video.hook : it.poster.headline) || '').split('\n')[0];
      return `<div class="act" data-open="${id}">${body}${quote ? `<div class="act-quote">${esc(quote)}</div>` : ''}</div>`;
    }).join('') : `<div class="empty sm">${esc(t('no_activity'))}</div>`;
    const activity = `<section class="card span-2">
      <div class="card-head"><h2>${esc(t('activity'))}</h2><div class="spacer"></div><button class="link-btn" data-read>${ICON.check}${esc(t('mark_read'))}</button></div>
      <div class="act-list">${actHtml}</div></section>`;

    // Tugas saya
    const mine = items.filter((i) => me && i.assignee === me && i.status !== 'published')
      .sort((a, b) => (a.publishDate || '9').localeCompare(b.publishDate || '9'));
    const tm = mine[0];
    let taskHtml = `<div class="empty sm">${esc(t('no_tasks'))}</div>`;
    if (tm) {
      const due = dueInfo(tm.publishDate);
      taskHtml = `<div class="task-card" data-open="${esc(tm.id)}">
        <div class="tc-top"><span class="kicker ${tm.type}">${esc(t(tm.type))}</span><span class="kicker-2">${esc(tm.platform)}</span><div class="spacer"></div><span class="dots">${ICON.dots}</span></div>
        <div class="tc-body"><b>${esc(tm.title || t('untitled'))}</b><span class="due ${due.cls}">${esc(due.label)}</span></div>
        <div class="tc-foot"><span class="st-pill st-${tm.status}">${esc(t('st_' + tm.status))}</span><span class="who"><span class="ellipsis">${esc(tm.assignee)}</span>${avatar(tm.assignee)}</span></div>
      </div>`;
    }
    const mineCard = `<section class="card span-2">
      <div class="card-head"><h2>${esc(t('my_tasks'))}</h2>${mine.length ? `<span class="count-pill">${mine.length}</span>` : ''}<div class="spacer"></div><button class="link-btn" data-mine>${ICON.edit}${esc(t('see_all'))}</button></div>
      ${taskHtml}
      <button class="add-dashed" id="d-new2"><span>${ICON.plus}</span>${esc(t('new_content'))}</button>
      ${mine.length > 1 ? `<button class="link-btn more-link" data-mine>${esc(t('more_tasks', { n: mine.length - 1 }))}</button>` : ''}
    </section>`;

    // Minggu ini + agenda
    const sel = state.dashDay || todayS;
    const selD = parseYmd(sel);
    const weekStart = addDays(selD, -((selD.getDay() + 6) % 7));
    const byDate = {};
    items.forEach((it) => { if (it.publishDate) (byDate[it.publishDate] = byDate[it.publishDate] || []).push(it); });
    const weekHtml = Array.from({ length: 7 }, (_, i) => {
      const d = addDays(weekStart, i);
      const ds = ymd(d);
      return `<button class="wd ${ds === sel ? 'sel' : ''} ${ds === todayS ? 'today' : ''}" data-day="${ds}"><span>${esc(L().days[d.getDay()])}</span><b>${d.getDate()}</b><i class="${byDate[ds] ? 'has' : ''}"></i></button>`;
    }).join('');
    const agItem = (it) => `<div class="ag-item" data-open="${esc(it.id)}"><span class="ag-ic ${it.type}">${typeIcon(it.type)}</span>
      <div class="ag-txt"><b>${esc(it.title || t('untitled'))}</b><small class="st-${it.status}">${esc(it.platform)} <i class="st-dot"></i> ${esc(t('st_' + it.status))}</small></div>
      <span class="dots">${ICON.dotsV}</span></div>`;
    const dayLabel = (ds) => (ds === todayS ? t('today') + ' · ' + fmtShort(ds) : fmtDay(ds));
    const parts = [];
    let shown = 0;
    const pushGroup = (ds, list) => {
      const take = list.slice(0, 3 - shown);
      shown += take.length;
      parts.push(`<div class="ag-sep">${esc(dayLabel(ds))}</div>${take.map(agItem).join('')}`);
    };
    if (byDate[sel]) pushGroup(sel, byDate[sel]);
    else parts.push(`<div class="ag-sep">${esc(dayLabel(sel))}</div><div class="ag-empty">${esc(t('no_schedule_day'))}<button class="link-btn" data-new-on="${sel}">${ICON.plus}${esc(t('schedule_one'))}</button></div>`);
    for (const ds of Object.keys(byDate).filter((d) => d > sel).sort()) {
      if (shown >= 2 || parts.length >= 2) break;
      pushGroup(ds, byDate[ds]);
    }
    const weekCard = `<section class="card span-2">
      <div class="card-head"><h2>${esc(L().months[selD.getMonth()] + ' ' + selD.getFullYear())}</h2><div class="spacer"></div>
        <button class="icon-btn sm" id="w-prev" aria-label="‹">${ICON.left}</button><button class="icon-btn sm" id="w-next" aria-label="›">${ICON.right}</button></div>
      <div class="week">${weekHtml}</div>
      <div class="agenda">${parts.join('')}</div></section>`;

    // Tenggat terdekat
    const dl = items.filter((i) => i.publishDate && i.status !== 'published')
      .sort((a, b) => a.publishDate.localeCompare(b.publishDate)).slice(0, 4);
    const dlHtml = dl.length ? dl.map((it, i) => {
      const p = progress(it.status);
      const late = it.publishDate < todayS;
      return `<div class="dl-row st-${it.status} ${i === 0 ? 'pop-card' : ''}" data-open="${esc(it.id)}">
        <div><b title="${esc(it.title)}">${esc(it.title || t('untitled'))}</b><small class="${late ? 'late' : ''}">${esc(fmtDay(it.publishDate))} · ${esc(late ? t('overdue') : it.platform)}</small></div>
        <div class="dl-col"><small>${esc(t('status'))}</small><b>${esc(t('st_' + it.status))}</b></div>
        <div class="dl-prog"><span>${p}%</span><div class="bar"><i style="width:${p}%"></i></div></div>
        <div class="dl-meta" title="${esc(it.platform)}">${typeIcon(it.type)}${avatar(it.assignee)}</div>
      </div>`;
    }).join('') : `<div class="empty sm">${esc(t('no_deadlines'))}</div>`;
    const dlCard = `<section class="card span-3 d-deadline">
      <div class="card-head"><h2>${esc(t('deadlines'))}</h2>${people.length ? avatarStack(people, 4) : ''}<button class="mini-add" id="d-new3" title="${esc(t('new_content'))}" aria-label="${esc(t('new_content'))}">${ICON.plus}</button>
        <div class="spacer"></div><button class="link-btn" data-go="list">${ICON.list}${esc(t('see_all'))}</button><button class="link-btn" id="d-export">${ICON.share}${esc(t('export'))}</button></div>
      <div class="dl-list">${dlHtml}</div></section>`;

    // Asisten AI
    const hasKey = !!s.ai.keys[s.ai.provider];
    const aiCard = `<section class="ai-card span-1 d-ai">${ILLU.wand}<h3>${esc(t('set_ai'))}</h3><p>${esc(t('ai_card_s'))}</p>
      <button class="btn sm" id="d-ai">${esc(hasKey ? t('try_now') : t('connect_ai'))}</button></section>`;

    // Progres bulan ini
    const ym = todayS.slice(0, 7);
    const ringCard = (type) => {
      const list = state.items.filter((i) => i.type === type && (i.publishDate || '').startsWith(ym));
      const done = list.filter((i) => i.status === 'published').length;
      const pct = list.length ? Math.round(done / list.length * 100) : 0;
      const left = list.length - done;
      return `<section class="card ring-card">
        <div class="ring-top">${ring(pct, type === 'video' ? 'var(--video)' : 'var(--poster)')}<div><span class="kicker caps ${type}">${esc(t(type))}</span><b>${esc(t('this_month'))}</b></div></div>
        <div class="ring-foot"><div>${list.length ? `<span>${esc(t('published_n', { a: done, b: list.length }))}</span><span>${esc(left ? t('n_left', { n: left }) : t('all_published'))}</span>` : `<span>${esc(t('none_this_month'))}</span>`}</div>
          ${left ? `<button class="btn accent xs" data-check="${type}">${esc(t('check'))}</button>` : ''}</div>
      </section>`;
    };

    // Konten berikutnya
    const nx = items.filter((i) => i.publishDate && i.publishDate >= todayS && i.status !== 'published')
      .sort((a, b) => a.publishDate.localeCompare(b.publishDate))[0];
    let nextCard = `<section class="card next-card"><span class="kicker caps video">${esc(t('next_up'))}</span>
      <div class="empty sm">${esc(t('no_next'))}<button class="btn accent sm" id="d-new4">${ICON.plus}${esc(t('schedule_one'))}</button></div></section>`;
    if (nx) {
      const ns = nextStatus(nx.status);
      const id = esc(nx.id);
      nextCard = `<section class="card next-card">
        <span class="kicker caps ${nx.type}">${esc(t('next_up'))}</span>
        <div class="card-head"><h2 class="ellipsis">${esc(nx.title || t('untitled'))}</h2><div class="spacer"></div><button class="link-btn" data-open="${id}">${ICON.edit}${esc(t('open'))}</button></div>
        <div class="next-when"><i class="dot" style="background:var(--brand)"></i>${esc(dayLabel(nx.publishDate))} · ${esc(nx.platform)}</div>
        <div class="next-row"><p>${esc(t(nx.type))} · ${esc(t('st_' + nx.status))}<br>${esc(t('assignee'))}: ${esc(nx.assignee || t('unassigned'))}</p>
          <div class="row"><button class="btn soft sm" data-open="${id}">${esc(t('reschedule'))}</button>${ns !== nx.status ? `<button class="btn accent sm" data-advance="${id}">→ ${esc(t('st_' + ns))}</button>` : ''}</div></div>
      </section>`;
    }
    const side = `<div class="d-side span-2"><div class="d-rings">${ringCard('video')}${ringCard('poster')}</div>${nextCard}</div>`;

    $('#main').innerHTML = `<div class="page"><div class="dash">${hero}${activity}${mineCard}${weekCard}${dlCard}${aiCard}${side}</div></div>`;

    const main = $('#main');
    const find = (id) => state.items.find((x) => x.id === id);
    $$('[data-open]', main).forEach((el) => el.onclick = (e) => { e.stopPropagation(); const it = find(el.dataset.open); if (it) openEditor(it); });
    $$('[data-feat]', main).forEach((b) => b.onclick = () => { const k = b.dataset.feat; if (k === 'ai') go('ideas'); else openEditor(newItem(k), true); });
    ['#d-new', '#d-new2', '#d-new3', '#d-new4'].forEach((sl) => { const b = $(sl, main); if (b) b.onclick = () => chooseNew(); });
    $$('[data-new-on]', main).forEach((b) => b.onclick = (e) => { e.stopPropagation(); chooseNew(b.dataset.newOn); });
    $$('[data-read]', main).forEach((b) => b.onclick = (e) => { e.stopPropagation(); markSeen(); renderTopbar(); renderDashboard(); });
    $$('[data-day]', main).forEach((b) => b.onclick = () => { state.dashDay = b.dataset.day; renderDashboard(); });
    $('#w-prev', main).onclick = () => { state.dashDay = ymd(addDays(selD, -7)); renderDashboard(); };
    $('#w-next', main).onclick = () => { state.dashDay = ymd(addDays(selD, 7)); renderDashboard(); };
    $$('[data-mine]', main).forEach((b) => b.onclick = () => { Object.assign(state.filters, { assignee: me || 'all', platform: 'all' }); go('board'); });
    $$('[data-go]', main).forEach((b) => b.onclick = () => go(b.dataset.go));
    $('#d-export', main).onclick = exportCsv;
    $('#d-ai', main).onclick = () => go(hasKey ? 'ideas' : 'settings');
    $$('[data-check]', main).forEach((b) => b.onclick = () => { Object.assign(state.filters, { type: b.dataset.check, platform: 'all', assignee: 'all' }); go('board'); });
    $$('[data-advance]', main).forEach((b) => b.onclick = (e) => { e.stopPropagation(); const it = find(b.dataset.advance); if (it) quickUpdate(it.id, { status: nextStatus(it.status) }); });
  }

  // ---------- Kalender ----------
  function renderCalendar() {
    const m = state.month;
    const title = L().months[m.getMonth()] + ' ' + m.getFullYear();
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
        ${list.slice(0, 3).map(chip).join('')}${list.length > 3 ? `<div class="more-n">+${list.length - 3}</div>` : ''}
      </div>`);
    }
    const days = L().days;
    const head = [1, 2, 3, 4, 5, 6, 0].map((i) => `<div>${esc(days[i])}</div>`).join('');
    const unsched = items.filter((it) => !it.publishDate);
    $('#main').innerHTML = `<div class="page">
      ${pageHead(t('nav_calendar'), t('cal_sub'), filterBar())}
      <section class="card cal-card">
        <div class="cal-toolbar"><h2>${esc(title)}</h2><button class="icon-btn sm" id="m-prev" aria-label="‹">${ICON.left}</button><button class="icon-btn sm" id="m-next" aria-label="›">${ICON.right}</button>
          <div class="spacer"></div><button class="btn soft sm" id="m-today">${esc(t('today'))}</button></div>
        <div class="cal-head">${head}</div><div class="cal-grid">${cells.join('')}</div>
      </section>
      <section class="card unscheduled" id="unsched"><h3 class="section-title">${esc(t('no_date'))} (${unsched.length})</h3>
        <div class="chip-row">${unsched.map(chip).join('') || '<span class="muted">—</span>'}</div></section>
    </div>`;
    bindFilterBar();
    $('#m-prev').onclick = () => { state.month = new Date(m.getFullYear(), m.getMonth() - 1, 1); renderView(); };
    $('#m-next').onclick = () => { state.month = new Date(m.getFullYear(), m.getMonth() + 1, 1); renderView(); };
    $('#m-today').onclick = () => { state.month = startOfMonth(new Date()); renderView(); };
    bindOpen($('#main'));
    $$('[data-add]').forEach((b) => b.onclick = (e) => { e.stopPropagation(); chooseNew(b.dataset.add); });
    $$('.cal-day').forEach((c) => bindDrop(c, (id) => quickUpdate(id, { publishDate: c.dataset.date })));
    bindDrop($('#unsched'), (id) => quickUpdate(id, { publishDate: '' }));
  }

  // ---------- Papan ----------
  function bcard(it) {
    const p = progress(it.status);
    return `<div class="bcard st-${it.status}" draggable="true" data-id="${esc(it.id)}">
      <div class="bc-top"><span class="kicker ${it.type}">${esc(t(it.type))}</span><span class="kicker-2">${esc(it.platform)}</span></div>
      <div class="ttl">${esc(it.title || t('untitled'))}</div>
      <div class="bar"><i style="width:${Math.max(p, 4)}%"></i></div>
      <div class="meta">${it.publishDate ? ICON.calendar + esc(fmtDate(it.publishDate)) : esc(t('no_date'))}${avatar(it.assignee)}</div>
    </div>`;
  }
  function renderBoard() {
    const items = filtered();
    const cols = STATUSES.map((s) => {
      const list = items.filter((i) => i.status === s);
      return `<div class="col st-${s}" data-status="${s}"><div class="col-head"><span class="st-dot"></span>${esc(t('st_' + s))}<span class="count">${list.length}</span></div>${list.map(bcard).join('')}</div>`;
    }).join('');
    $('#main').innerHTML = `<div class="page">${pageHead(t('nav_board'), t('board_sub'), filterBar())}<div class="board">${cols}</div></div>`;
    bindFilterBar();
    bindOpen($('#main'));
    $$('.col').forEach((c) => bindDrop(c, (id) => quickUpdate(id, { status: c.dataset.status })));
  }

  // ---------- Daftar ----------
  function renderList() {
    const items = filtered();
    const rows = items.map((it) => `<tr data-id="${esc(it.id)}">
      <td><div class="row" style="gap:12px;flex-wrap:nowrap"><span class="ag-ic ${it.type}">${typeIcon(it.type)}</span><b>${esc(it.title || t('untitled'))}</b></div></td>
      <td><span class="badge ${it.type}">${esc(t(it.type))}</span></td>
      <td>${esc(it.platform)}</td>
      <td><span class="st-pill st-${it.status}">${esc(t('st_' + it.status))}</span></td>
      <td>${esc(fmtDate(it.publishDate) || '—')}</td>
      <td><span class="row" style="gap:8px;flex-wrap:nowrap">${avatar(it.assignee)}${esc(it.assignee || '—')}</span></td>
      <td class="muted">${esc(it.updatedBy || '')}${it.updatedAt ? ' · ' + esc(ago(it.updatedAt)) : ''}</td></tr>`).join('');
    $('#main').innerHTML = `<div class="page">${pageHead(t('nav_list'), t('items_count', { n: items.length }), filterBar())}
      ${items.length ? `<section class="card table-card"><table class="table"><thead><tr><th>${esc(t('title'))}</th><th>${esc(t('type'))}</th><th>${esc(t('platform'))}</th><th>${esc(t('status'))}</th><th>${esc(t('publish_date'))}</th><th>${esc(t('assignee'))}</th><th>${esc(t('updated_by'))}</th></tr></thead><tbody>${rows}</tbody></table></section>`
        : `<section class="card"><div class="empty">${esc(t('empty'))}</div></section>`}</div>`;
    bindFilterBar();
    $$('tr[data-id]').forEach((tr) => tr.onclick = () => openEditor(state.items.find((x) => x.id === tr.dataset.id)));
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
      pickModal(r.options || [], (o) => `<div class="swatches">${(o.colors || []).map((c) => `<span style="width:34px;height:34px;border-radius:9px;background:${esc(c)};box-shadow:inset 0 0 0 1px #0001;display:inline-block"></span>`).join('')}</div>\n<b>${esc(o.fonts)}</b>\n<span class="muted">${esc(o.reason)}</span>`,
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
        <label class="field"><span>${esc(t('tags'))} <span class="hint">· ${esc(t('tags_hint'))}</span></span><input class="input" data-tags value="${esc((d.tags || []).join(', '))}"/></label>
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
          <div class="row1"><span class="badge ${d.type}">${typeIcon(d.type).replace('<svg', '<svg width="13" height="13"')}${esc(t(d.type))}</span>
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
      body{font-family:-apple-system,Segoe UI,Roboto,Arial,sans-serif;color:#1c1c3b;padding:36px;font-size:12px}
      h1{font-size:22px;margin:0 0 4px} h2{font-size:14px;margin:22px 0 8px;text-transform:uppercase;letter-spacing:.04em;color:#4b4b69}
      .meta{color:#7a7a96;margin-bottom:18px} table{border-collapse:collapse;width:100%} th,td{text-align:left;vertical-align:top;padding:7px 8px;border-bottom:1px solid #ececf4}
      .kv th{width:28%;color:#4b4b69} .sb th{background:#f5f5fb} .n{color:#7a7a96;margin-top:4px;font-size:11px}
      .sw{display:inline-flex;align-items:center;gap:6px;margin:0 12px 6px 0;font-family:monospace} .sw i{width:22px;height:22px;border-radius:5px;display:inline-block;border:1px solid #0002}
      .cap{white-space:pre-wrap;line-height:1.5}</style></head><body>
      <h1>${esc(d.title || t('untitled'))}</h1>
      <div class="meta">${esc(t(d.type))} · ${esc(d.platform)} · ${esc(t('st_' + d.status))} · ${esc(fmtDate(d.publishDate) || t('no_date'))} · ${esc(t('assignee'))}: ${esc(d.assignee || '—')}</div>
      ${d.notes ? `<div class="cap">${esc(d.notes)}</div>` : ''}
      ${detail}
      ${d.caption || d.hashtags ? `<h2>${esc(t('caption'))}</h2><div class="cap">${esc(d.caption)}</div><p style="color:#6e61f0">${esc(d.hashtags)}</p>` : ''}
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
    $('#main').innerHTML = `<div class="page">${pageHead(t('ideas_title'), t('ideas_sub'))}<div class="ideas-wrap">
      <section class="card stack">
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
      </section>
      <div class="ideas-list">${list || `<div class="empty">${ICON.spark.replace('<svg', '<svg width="34" height="34"')}<p>${esc(t('ideas_sub'))}</p></div>`}</div>
    </div></div>`;
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
    $('#main').innerHTML = `<div class="page">${pageHead(t('nav_settings'), '')}<div class="settings-wrap">
      <section class="card stack"><h2>${esc(t('set_profile'))}</h2>
        <div class="grid-2">
          <label class="field">${esc(t('your_name'))}<input class="input" id="s-name" value="${esc(s.userName)}"/><span class="hint">${esc(t('your_name_hint'))}</span></label>
          <label class="field">${esc(t('set_language'))}<select class="select" id="s-lang">${Object.keys(window.I18N).map((k) => `<option value="${k}" ${k === s.language ? 'selected' : ''}>${esc(window.I18N[k].langName)}</option>`).join('')}</select></label>
        </div></section>
      <section class="card"><h2>${esc(t('set_folder'))}</h2><p class="sub">${esc(t('folder_hint'))}</p>
        <div class="row"><div class="input" style="flex:1;color:${s.dataFolder ? 'inherit' : 'var(--muted)'};overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(s.dataFolder || t('no_folder'))}</div>
        <button class="btn" id="s-folder">${ICON.folder}${esc(t('choose_folder'))}</button>${s.dataFolder ? `<button class="btn ghost" id="s-open">${esc(t('open_folder'))}</button>` : ''}</div></section>
      <section class="card stack"><div><h2>${esc(t('set_ai'))}</h2><p class="sub" style="margin:0">${esc(t('key_hint'))}</p></div>
        <div class="provider-opts">${prov.map(([k, n, c]) => `<div class="provider-opt ${s.ai.provider === k ? 'on' : ''}" data-prov="${k}"><b>${n}</b><small>${c}${s.ai.keys[k] ? ' · ✓' : ''}</small></div>`).join('')}</div>
        <div class="grid-2">
          <label class="field">${esc(t('api_key'))}<input class="input" type="password" id="s-key" value="${esc(s.ai.keys[s.ai.provider])}" placeholder="••••••••"/>
            <a class="hint" href="${KEY_LINKS[s.ai.provider]}" target="_blank">${esc(t('get_key'))} ↗</a></label>
          <label class="field">${esc(t('model'))}<input class="input" id="s-model" value="${esc(s.ai.models[s.ai.provider])}"/></label>
        </div></section>
      <div class="row"><button class="btn primary" id="s-save">${esc(t('save'))}</button></div>
    </div></div>`;
    const draft = JSON.parse(JSON.stringify(s));
    const pull = () => {
      draft.userName = $('#s-name').value.trim();
      draft.ai.keys[draft.ai.provider] = $('#s-key').value.trim();
      draft.ai.models[draft.ai.provider] = $('#s-model').value.trim();
      draft.theme = currentTheme();
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
    if (state.settings.theme) applyTheme(state.settings.theme);
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
    document.addEventListener('mousedown', (e) => {
      if (state.bellOpen && !e.target.closest('.bell-wrap')) { state.bellOpen = false; renderTopbar(); }
    });
    document.addEventListener('keydown', (e) => {
      if (e.key !== 'Escape') return;
      if (state.bellOpen) { state.bellOpen = false; renderTopbar(); }
      else if ($('#modal-root').innerHTML) closeModal();
      else if (state.draft) closeEditor();
    });
  }
  init();
})();
