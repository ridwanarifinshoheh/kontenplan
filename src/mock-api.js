// Mode pratinjau: hanya aktif kalau dibuka di browser biasa (bukan di aplikasi desktop).
// Di aplikasi desktop, window.api disediakan oleh preload.js.
(() => {
  if (window.api) return;
  const ok = (data) => Promise.resolve({ ok: true, data });
  const LS = 'kontenplan-demo-v2';
  const now = new Date();
  // tanggal relatif terhadap hari ini (0 = hari ini, -1 = kemarin, dst.)
  const d = (off) => { const x = new Date(now.getFullYear(), now.getMonth(), now.getDate() + off); return `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, '0')}-${String(x.getDate()).padStart(2, '0')}`; };
  const hoursAgo = (h) => new Date(now.getTime() - h * 3600e3).toISOString();
  const sample = [
    { id: 'a1', type: 'video', title: '3 kesalahan seduh kopi di rumah', platform: 'TikTok', status: 'script', publishDate: d(0), assignee: 'Rina', updatedBy: 'Dimas', updatedAt: hoursAgo(0.3), notes: 'Ambil footage di bar depan, pagi hari biar cahayanya bagus.',
      video: { ratio: '9:16', duration: 30, hook: 'Kopi kamu pahit? Bisa jadi gara-gara ini.', cta: 'Follow buat tips seduh lainnya', scenes: [
        { id: 's1', visual: 'Close-up kopi tumpah dari V60, ekspresi kecewa', audio: 'Kopi kamu pahit? Bisa jadi gara-gara ini.', duration: 3, notes: 'Teks: "Kesalahan #1"' },
        { id: 's2', visual: 'Termometer di air mendidih', audio: 'Pertama, air terlalu panas. Idealnya 90–96 derajat.', duration: 7, notes: '' },
        { id: 's3', visual: 'Gilingan kasar vs halus side-by-side', audio: 'Kedua, gilingan terlalu halus bikin over-ekstraksi.', duration: 8, notes: 'B-roll grinder' } ] } },
    { id: 'a2', type: 'poster', title: 'Promo Kopi Susu Gula Aren 1+1', platform: 'Instagram Feed', status: 'production', publishDate: d(2), assignee: 'Dimas', updatedBy: 'Arif', updatedAt: hoursAgo(2), notes: 'Tim, warna gula aren-nya tolong dibuat lebih hangat ya.',
      poster: { size: '1080x1350', purpose: 'Naikkan penjualan hari kerja', audience: 'Pekerja kantor 22–35', message: 'Beli 1 gratis 1 setiap Senin', headline: 'Senin Lebih Manis', subheadline: 'Beli 1 gratis 1 Kopi Susu Gula Aren', body: '', cta: 'Tunjukkan poster ini di kasir', colors: ['#3b2417', '#c8813a', '#f6ead8', '#1d1b20'], fonts: 'Heading: Fraunces, Body: Inter', moodboard: [] } },
    { id: 'a3', type: 'video', title: 'Behind the scene: roasting batch pertama', platform: 'Instagram Reels', status: 'idea', publishDate: d(5), assignee: 'Rina', updatedBy: 'Rina', updatedAt: hoursAgo(20) },
    { id: 'a4', type: 'video', title: 'Review jujur menu baru', platform: 'YouTube Shorts', status: 'editing', publishDate: d(1), assignee: 'Rina', updatedBy: 'Arif', updatedAt: hoursAgo(5) },
    { id: 'a5', type: 'poster', title: 'Jadwal live music akhir pekan', platform: 'Instagram Story', status: 'review', publishDate: d(-1), assignee: 'Dimas', updatedBy: 'Arif', updatedAt: hoursAgo(30) },
    { id: 'a6', type: 'video', title: 'Day in the life barista', platform: 'TikTok', status: 'scheduled', publishDate: d(3), assignee: 'Arif', updatedBy: 'Arif', updatedAt: hoursAgo(48) },
    { id: 'a7', type: 'poster', title: 'Lowongan barista part-time', platform: 'Instagram Feed', status: 'published', publishDate: d(-6), assignee: 'Rina', updatedBy: 'Rina', updatedAt: hoursAgo(100) },
    { id: 'a8', type: 'video', title: 'Tebak harga biji kopi', platform: 'TikTok', status: 'idea', publishDate: '', assignee: '', updatedBy: 'Rina', updatedAt: hoursAgo(120) },
    { id: 'a9', type: 'poster', title: 'Menu musim hujan', platform: 'Instagram Feed', status: 'idea', publishDate: '', assignee: 'Dimas', updatedBy: 'Dimas', updatedAt: hoursAgo(130) },
    { id: 'a10', type: 'video', title: 'Tutorial latte art untuk pemula', platform: 'Instagram Reels', status: 'published', publishDate: d(-3), assignee: 'Arif', updatedBy: 'Arif', updatedAt: hoursAgo(70) },
    { id: 'a11', type: 'poster', title: 'Promo payday akhir bulan', platform: 'Instagram Story', status: 'scheduled', publishDate: d(8), assignee: 'Rina', updatedBy: 'Rina', updatedAt: hoursAgo(60) }
  ];
  const load = () => { try { return JSON.parse(localStorage.getItem(LS)); } catch (_) { return null; } };
  let db = load() || { settings: { language: 'id', theme: 'light', userName: 'Rina', dataFolder: '/Google Drive/Tim Konten', ai: { provider: 'gemini', models: { anthropic: 'claude-sonnet-5-5', openai: 'gpt-5-mini', gemini: 'gemini-2.5-flash' }, keys: { anthropic: '', openai: '', gemini: 'demo' } } }, items: sample };
  const persist = () => { try { localStorage.setItem(LS, JSON.stringify(db)); } catch (_) {} };

  const demoAI = (prompt) => {
    if (prompt.includes('"hooks"')) return { hooks: ['Stop! Jangan seduh kopi sebelum lihat ini.', '90% orang salah di langkah pertama.', 'Barista ngaku: ini rahasia kopi enak.'] };
    if (prompt.includes('"scenes"')) return { hook: 'Kopi kamu pahit?', cta: 'Follow untuk part 2', scenes: [{ visual: 'Close-up cangkir', audio: 'Kopi kamu pahit?', duration: 3, notes: '' }, { visual: 'Tuang air', audio: 'Coba turunkan suhu air.', duration: 6, notes: 'Teks layar' }] };
    if (prompt.includes('"ideas"')) return { ideas: [{ title: 'Tes rasa: kopi 5 ribu vs 50 ribu', hook: 'Bisa nebak yang mahal?', angle: 'Hiburan + edukasi harga', type: 'video', platform: 'TikTok' }, { title: 'Infografis cara baca label biji kopi', hook: 'Arti "washed" dan "natural"', angle: 'Edukasi, mudah disimpan', type: 'poster', platform: 'Instagram Feed' }] };
    if (prompt.includes('palettes')) return { options: [{ colors: ['#3b2417', '#c8813a', '#f6ead8', '#7a8b5c'], fonts: 'Heading: Fraunces, Body: Inter', reason: 'Hangat, natural, cocok untuk kopi.' }] };
    if (prompt.includes('"headline"')) return { options: [{ headline: 'Senin Lebih Manis', subheadline: 'Beli 1 gratis 1', body: 'Khusus hari Senin, semua cabang.', cta: 'Datang sekarang' }] };
    return { options: [{ caption: 'Kopi enak itu nggak harus mahal ☕', hashtags: ['#kopi', '#kopisusu', '#ngopi'] }] };
  };

  window.api = {
    getSettings: () => ok(db.settings),
    setSettings: (s) => { db.settings = s; persist(); return ok(s); },
    chooseFolder: () => ok('/Google Drive/Tim Konten'),
    openFolder: () => ok(true),
    listItems: () => ok(JSON.parse(JSON.stringify(db.items))),
    saveItem: (item) => {
      item.updatedAt = new Date().toISOString(); item.updatedBy = db.settings.userName;
      const i = db.items.findIndex((x) => x.id === item.id);
      if (i >= 0) db.items[i] = item; else db.items.push(item);
      persist(); return ok({ ok: true, item });
    },
    deleteItem: (id) => { db.items = db.items.filter((x) => x.id !== id); persist(); return ok({ ok: true }); },
    addAssets: () => ok([]),
    assetUrl: () => ok(''),
    aiGenerate: ({ prompt }) => new Promise((r) => setTimeout(() => r({ ok: true, data: JSON.stringify(demoAI(prompt)) }), 600)),
    exportCsv: () => ok(false),
    exportPdf: () => ok(false),
    onItemsChanged: () => {}
  };
})();
