const { contextBridge, ipcRenderer } = require('electron');

const call = (ch) => (...args) => ipcRenderer.invoke(ch, ...args);

contextBridge.exposeInMainWorld('api', {
  getSettings: call('settings:get'),
  setSettings: call('settings:set'),
  chooseFolder: call('folder:choose'),
  openFolder: call('folder:open'),
  listItems: call('items:list'),
  saveItem: call('items:save'),
  deleteItem: call('items:delete'),
  addAssets: call('assets:add'),
  assetUrl: call('assets:url'),
  aiGenerate: call('ai:generate'),
  exportCsv: call('export:csv'),
  exportPdf: call('export:pdf'),
  onItemsChanged: (cb) => ipcRenderer.on('items:changed', () => cb())
});
