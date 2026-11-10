// KontenPlan - main process
// Data tim disimpan sebagai file JSON (1 file per konten) di folder bersama
// (misalnya folder Google Drive / Dropbox / OneDrive yang sudah tersinkron).
// Pengaturan pribadi (nama, bahasa, API key AI) disimpan lokal di komputer masing-masing.

const { app, BrowserWindow, ipcMain, dialog, shell, safeStorage } = require('electron');
const path = require('path');
const fs = require('fs');
const fsp = fs.promises;

const ROOT_NAME = 'KontenPlan';
let win = null;
let watchTimer = null;
let lastSignature = '';

// ---------- Settings (lokal) ----------
const settingsPath = () => path.join(app.getPath('userData'), 'settings.json');

const DEFAULT_SETTINGS = {
  language: 'id',
  userName: '',
  dataFolder: '',
  ai: {
    provider: 'gemini',
    models: { anthropic: 'claude-sonnet-5-5', openai: 'gpt-5-mini', gemini: 'gemini-2.5-flash' },
    keys: { anthropic: '', openai: '', gemini: '' }
  }
};

function encrypt(str) {
  if (!str) return '';
  try {
    if (safeStorage.isEncryptionAvailable()) return 'enc:' + safeStorage.encryptString(str).toString('base64');
  } catch (_) {}
  return 'raw:' + Buffer.from(str, 'utf8').toString('base64');
}
function decrypt(str) {
  if (!str) return '';
  try {
    if (str.startsWith('enc:')) return safeStorage.decryptString(Buffer.from(str.slice(4), 'base64'));
    if (str.startsWith('raw:')) return Buffer.from(str.slice(4), 'base64').toString('utf8');
  } catch (_) {}
  return '';
}

function readSettings() {
  let s = {};
  try { s = JSON.parse(fs.readFileSync(settingsPath(), 'utf8')); } catch (_) {}
  const merged = {
    ...DEFAULT_SETTINGS, ...s,
    ai: {
      ...DEFAULT_SETTINGS.ai, ...(s.ai || {}),
      models: { ...DEFAULT_SETTINGS.ai.models, ...((s.ai || {}).models || {}) },
      keys: { ...DEFAULT_SETTINGS.ai.keys }
    }
  };
  const storedKeys = (s.ai || {}).keys || {};
  for (const k of Object.keys(merged.ai.keys)) merged.ai.keys[k] = decrypt(storedKeys[k]);
  return merged;
}

function writeSettings(s) {
  const toStore = JSON.parse(JSON.stringify(s));
  for (const k of Object.keys(toStore.ai.keys)) toStore.ai.keys[k] = encrypt(toStore.ai.keys[k]);
  fs.mkdirSync(path.dirname(settingsPath()), { recursive: true });
  fs.writeFileSync(settingsPath(), JSON.stringify(toStore, null, 2));
}

// ---------- Folder bersama ----------
function rootDir() {
  const s = readSettings();
  if (!s.dataFolder) return null;
  return path.join(s.dataFolder, ROOT_NAME);
}
async function ensureDirs() {
  const r = rootDir();
  if (!r) throw new Error('NO_FOLDER');
  for (const d of ['items', 'assets', 'trash']) await fsp.mkdir(path.join(r, d), { recursive: true });
  return r;
}
const safeId = (id) => String(id).replace(/[^a-zA-Z0-9_-]/g, '');

async function listItems() {
  const r = await ensureDirs();
  const dir = path.join(r, 'items');
  const files = (await fsp.readdir(dir)).filter((f) => f.endsWith('.json'));
  const items = [];
  for (const f of files) {
    try { items.push(JSON.parse(await fsp.readFile(path.join(dir, f), 'utf8'))); }
    catch (_) { /* file sedang disinkron / rusak: lewati */ }
  }
  return items;
}

async function writeAtomic(file, data) {
  const tmp = file + '.' + process.pid + '.tmp';
  await fsp.writeFile(tmp, data);
  await fsp.rename(tmp, file);
}

async function saveItem(item, baseUpdatedAt, force) {
  const r = await ensureDirs();
  const file = path.join(r, 'items', safeId(item.id) + '.json');
  if (!force && baseUpdatedAt !== undefined) {
    try {
      const current = JSON.parse(await fsp.readFile(file, 'utf8'));
      if (current.updatedAt && current.updatedAt !== baseUpdatedAt) {
        return { conflict: true, current };
      }
    } catch (_) { /* belum ada file: aman */ }
  }
  const s = readSettings();
  item.updatedAt = new Date().toISOString();
  item.updatedBy = s.userName || '';
  await writeAtomic(file, JSON.stringify(item, null, 2));
  return { ok: true, item };
}

async function deleteItem(id) {
  const r = await ensureDirs();
  const src = path.join(r, 'items', safeId(id) + '.json');
  const dst = path.join(r, 'trash', safeId(id) + '-' + Date.now() + '.json');
  try { await fsp.rename(src, dst); } catch (_) {}
  return { ok: true };
}

async function folderSignature() {
  const r = rootDir();
  if (!r) return '';
  try {
    const dir = path.join(r, 'items');
    const files = (await fsp.readdir(dir)).filter((f) => f.endsWith('.json')).sort();
    const parts = [];
    for (const f of files) {
      const st = await fsp.stat(path.join(dir, f));
      parts.push(f + ':' + st.mtimeMs + ':' + st.size);
    }
    return parts.join('|');
  } catch (_) { return ''; }
}

function startWatching() {
  clearInterval(watchTimer);
  folderSignature().then((sig) => { lastSignature = sig; });
  watchTimer = setInterval(async () => {
    const sig = await folderSignature();
    if (sig !== lastSignature) {
      lastSignature = sig;
      if (win && !win.isDestroyed()) win.webContents.send('items:changed');
    }
  }, 4000);
}

// ---------- AI ----------
async function aiGenerate({ system, prompt, maxTokens }) {
  const s = readSettings();
  const provider = s.ai.provider;
  const key = s.ai.keys[provider];
  const model = s.ai.models[provider];
  if (!key) throw new Error('NO_KEY');
  const max = maxTokens || 2000;
  let res, data;

  if (provider === 'anthropic') {
    res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-api-key': key, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({ model, max_tokens: max, system, messages: [{ role: 'user', content: prompt }] })
    });
    data = await res.json();
    if (!res.ok) throw new Error((data.error && data.error.message) || res.statusText);
    return (data.content || []).filter((c) => c.type === 'text').map((c) => c.text).join('\n');
  }

  if (provider === 'openai') {
    res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: 'Bearer ' + key },
      body: JSON.stringify({ model, messages: [{ role: 'system', content: system }, { role: 'user', content: prompt }] })
    });
    data = await res.json();
    if (!res.ok) throw new Error((data.error && data.error.message) || res.statusText);
    return data.choices[0].message.content;
  }

  if (provider === 'gemini') {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`;
    res = await fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-goog-api-key': key },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: system }] },
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: { maxOutputTokens: max }
      })
    });
    data = await res.json();
    if (!res.ok) throw new Error((data.error && data.error.message) || res.statusText);
    const parts = (((data.candidates || [])[0] || {}).content || {}).parts || [];
    return parts.map((p) => p.text || '').join('\n');
  }
  throw new Error('Unknown provider');
}

// ---------- Window ----------
function createWindow() {
  win = new BrowserWindow({
    width: 1360,
    height: 860,
    minWidth: 1024,
    minHeight: 680,
    title: 'KontenPlan',
    backgroundColor: '#f6f5f2',
    icon: path.join(__dirname, 'build', 'icon.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });
  win.setMenuBarVisibility(false);
  win.loadFile(path.join(__dirname, 'src', 'index.html'));
  win.webContents.setWindowOpenHandler(({ url }) => { shell.openExternal(url); return { action: 'deny' }; });
}

// ---------- IPC ----------
function handle(channel, fn) {
  ipcMain.handle(channel, async (_e, ...args) => {
    try { return { ok: true, data: await fn(...args) }; }
    catch (err) { return { ok: false, error: err.message || String(err) }; }
  });
}

handle('settings:get', async () => readSettings());
handle('settings:set', async (s) => {
  const before = readSettings();
  writeSettings(s);
  if (before.dataFolder !== s.dataFolder) startWatching();
  return readSettings();
});
handle('folder:choose', async () => {
  const r = await dialog.showOpenDialog(win, { properties: ['openDirectory', 'createDirectory'] });
  return r.canceled ? null : r.filePaths[0];
});
handle('folder:open', async () => { const r = await ensureDirs(); shell.openPath(r); return true; });
handle('items:list', async () => listItems());
handle('items:save', async (item, base, force) => saveItem(item, base, force));
handle('items:delete', async (id) => deleteItem(id));
handle('assets:add', async () => {
  const r = await ensureDirs();
  const pick = await dialog.showOpenDialog(win, {
    properties: ['openFile', 'multiSelections'],
    filters: [{ name: 'Images', extensions: ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'] }]
  });
  if (pick.canceled) return [];
  const out = [];
  for (const src of pick.filePaths) {
    const name = Date.now() + '-' + Math.random().toString(36).slice(2, 7) + path.extname(src).toLowerCase();
    await fsp.copyFile(src, path.join(r, 'assets', name));
    out.push(name);
  }
  return out;
});
handle('assets:url', async (name) => {
  const r = rootDir();
  if (!r) return '';
  return 'file://' + path.join(r, 'assets', path.basename(name)).replace(/\\/g, '/');
});
handle('ai:generate', async (opts) => aiGenerate(opts));
handle('export:csv', async (csv) => {
  const r = await dialog.showSaveDialog(win, { defaultPath: 'kontenplan.csv', filters: [{ name: 'CSV', extensions: ['csv'] }] });
  if (r.canceled) return false;
  await fsp.writeFile(r.filePath, '﻿' + csv, 'utf8');
  return r.filePath;
});
handle('export:pdf', async (html, fileName) => {
  const r = await dialog.showSaveDialog(win, { defaultPath: (fileName || 'brief') + '.pdf', filters: [{ name: 'PDF', extensions: ['pdf'] }] });
  if (r.canceled) return false;
  const pw = new BrowserWindow({ show: false, webPreferences: { offscreen: true } });
  await pw.loadURL('data:text/html;charset=utf-8,' + encodeURIComponent(html));
  const pdf = await pw.webContents.printToPDF({ printBackground: true, pageSize: 'A4' });
  pw.destroy();
  await fsp.writeFile(r.filePath, pdf);
  shell.openPath(r.filePath);
  return r.filePath;
});

app.whenReady().then(() => {
  createWindow();
  startWatching();
  app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });
});
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
